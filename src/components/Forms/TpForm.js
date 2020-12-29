import React, {Component} from 'react';
import Select from 'react-select';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import "./Forms.css";

import { IconButton, Button } from '@material-ui/core';

import axios from '../../utils/api-url.js'

function getCleanItem () {
    return {
        name: {
            value: '',
            valid: false,
        },
        theater: {
            value: '',
            valid: false,
        },
        director: {
            value: '',
            valid: false,
        },
        actors: {
            value: '',
            valid: true,
        },
        years: {
            value: null,
            valid: false
        }
    }
}

function getCleanState () {
    return {
        theatricalPlay: getCleanItem(),
        isFormValid: false,
        error_description: false,
        error_duplicate: false,
        error_missing_value: false,
    }
}

class TpForm extends Component{
    constructor(props){
        super(props);
        this.state = getCleanState();
        this.createdBy = this.props.createdBy;
        this.maxLegnth= 2080;
        this.years = [];
        var startYear=1900;
        for(var i=0; i < 120; i++){
            this.years.push({value: (startYear+i).toString(), label:  startYear+i});
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        if(this.props.editing){
            let d_arr=[];
            if(this.props.tp.years.includes(",")){
                d_arr = this.props.tp.years.split(",");
            }
            else{
                d_arr = [this.props.tp.years];
            }
            let arrYears=[];
            for(var i=0; i < d_arr.length; i++){
                arrYears.push({value: d_arr[i], label: d_arr[i]})
            }
            const tpInfo = {
                name: {
                    value: this.props.tp.title,
                    valid: true,
                },
                theater: {
                    value: this.props.tp.theater,
                    valid: true
                },
                director: {
                    value: this.props.tp.director,
                    valid: true
                },
                actors: {
                    value: this.props.tp.actors,
                    valid: true,
                },
                years: {
                    value: arrYears,
                    valid: true
                }
            }
            this.setState({theatricalPlay: tpInfo})
        }
    }

    handleChange = (field) => (evt) => {
        let updated = {...this.state.theatricalPlay};
        if(field === 'name'){
            axios.instance.get('checkDuplicate', {params: {item: 'theatrical_play', name: evt.target.value}})
            .then(name => {
                if(name.data.response.length !== 0){
                    this.createNotification('error-duplicate');
                    updated[field].valid = false;
                    return;
                }
            })
            updated[field].value = evt.target.value;
            updated[field].valid =  evt.target.value ? true : false ;
        }
        else if(field === 'description'){
            if(evt.target.value.length > this.maxLegnth ){
                if(!this.state.error_description){
                    this.setState({error_description: true})
                    this.createNotification("error-description")
                }
                return;
            }
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        else if (field === 'years'){
            updated[field].value = evt;
            updated[field].valid = (!evt || evt.length===0 ) ? false : true ;
        }
        else{
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        this.setState({
            theatricalPlay: updated
        })
    }
   
    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    handleSubmit = () => {
        if(this.formValidation()){
            if(this.props.editing){
                this.handleUpdate();
            }
            else{
                this.handleInsert();
            }
        }
    }

    handleUpdate(){
        let data = this.state.theatricalPlay;
        axios.instance.put('theatricalPlays/'+this.props.tp.theatrical_play_id, { data: data, createdBy: this.createdBy })
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
                this.props.handleClose(true);
            }
       })    
    }

    handleInsert(){
        let data = this.state.theatricalPlay;
        axios.instance.post('theatricalPlays', { data: data, createdBy: this.createdBy })
        .then(res => {
            if(res.statusText == 'OK'){
                this.createNotification('insert');
                this.props.handleClose(true);
            }
          })
    }

    formValidation () {
        let isFormValid = true;
        for (let formElement in this.state.theatricalPlay) {
            isFormValid = isFormValid && this.state.theatricalPlay[formElement].valid;
        }
        if(!isFormValid){
            this.createNotification('error-missing-value')
        }
        this.setState({isFormValid})
        return isFormValid;
    }

    resetForm() {
        this.state = getCleanState();
    }

    createNotification(type){
        if(type === "error-description"){
            setTimeout(
                function() {
                    this.setState({error_description: false})
                }
                .bind(this),
                2000
            );
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Text should be under 2080 characters",'Too big description!', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-duplicate"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error('Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-missing-value"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "insert"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή καταχωρήθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
        else if (type === "update"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή ανανεώθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
    }


    render(){
        return(
            <React.Fragment>
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                <div id="FormTitle">Θεατρική παράσταση</div>
                <form className="FormPanel">
                    <div className='column main' style={{paddingRight: '50px'}}>
                    <span className="Label">ONOMA ΠΑΡΑΣΤΑΣΗΣ *</span>
                    <input
                    id="input-area"
                    type='text'                        
                    name="name" 
                    value={this.state.theatricalPlay.name.value} 
                    onChange={this.handleChange('name')}
                    required={true}
                    />
                    <br/>
                    <span className="Label">ΣΚΗΝΟΘΕΤΗΣ *</span>
                    <input
                    id="input-area"
                    type='text'
                    name="director"
                    value={this.state.theatricalPlay.director.value} 
                    onChange={this.handleChange('director')}
                    required={true}
                    /><br/>
                    <span className="Label">ΘΕΑΤΡΟ *</span>
                    <input
                    id="input-area"
                    type='text'
                    name="theater"
                    value={this.state.theatricalPlay.theater.value} 
                    onChange={this.handleChange('theater')}
                    required={false}
                    /><br/>
                    <span className="Label">XΡΟΝΟΛΟΓΙΑ *</span>
                    <Select
                    placeholder={''}
                    isMulti
                    name="years"
                    options={this.years}
                    value={this.state.theatricalPlay.years.value}
                    onChange={this.handleChange('years')}
                    closeMenuOnSelect={true} 
                    />
                </div>
                </form>
                 <IconButton onClick={this.props.handleClose}><img id='image-button' src={require('../../styles/images/buttons/CANCEL.svg')}/></IconButton>
                <IconButton onClick={this.handleSubmit}><img id='image-button' src={require('../../styles/images/buttons/SAVE.svg')}/></IconButton>
            </React.Fragment>
        )
    }
}

export default TpForm;