import React, {Component} from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Select from 'react-select';
import {SaveButton, CancelButton} from "../Shared/Buttons.js";
import TextareaAutosize from 'react-textarea-autosize';
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';

function getCleanItem () {
    return {
        name: {
            value: '',
            valid: false,
        },
        description: {
            value: '',
            valid: false,
        },
        useCategory: {
            value: '',
            label: '',
            valid: false,
        },
        customs: {
            value: '',
            valid: true,
        },
    }
}

function getCleanState () {
    return {
        use: getCleanItem(),
        isFormValid: false,
        error_description: false,
        error_duplicate: false,
        error_missing_value: false,
    }
}

class UseForm extends Component{

    constructor(props){
        super(props);
        this.state = getCleanState();
        this.user_id = this.props.user;
        this.maxLegnth= 2080;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log("Props", this.props);
        console.log("Use Form:", this.state);
        if(this.props.editing){
            const useInfo = {
                name: {
                    value: this.props.use.name,
                    valid: true,
                },
                description: {
                    value: this.props.use.description,
                    valid: true,
                },
                useCategory: {
                    value: this.props.use.use_category,
                    label: this.props.use.use_category,
                    valid: true,
                },
                customs: {
                    value: this.props.use.customs,
                    valid: true,
                }
            }
            this.setState({use: useInfo})
        }
    }

    handleChange = (field) => (evt) => {
        console.log(evt)
        let updated = {...this.state.use};
        if(field === 'name'){
            //axios.get('http://88.197.53.80/kostoumart-api/checkDuplicate', {params: {item: "use", name: evt.target.value}})
            axios.get('http://localhost:8108/checkDuplicate', {params: {item: 'use', name: evt.target.value}})
            .then( item => {
                console.log("result from costume", item.data.response);
                if(item.data.response.length !== 0){
                    this.createNotification('error-duplicate');
                    updated[field].valid = false;
                    return;
                }
            })
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        else if(field === 'description'){
            if(evt.target.value.length > this.maxLegnth){
                if(!this.state.error_description){
                    this.setState({error_description: true})
                    this.createNotification("error-description")
                }
                return;
            }
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        else if(field === 'useCategory'){
            updated[field].label = evt.value;
            updated[field].value = evt.value;
            updated[field].valid = true;
        }
        else{
            updated[field].value = evt.target.value;
            updated[field].valid = true;
        }
        this.setState({
            use: updated
        })
        console.log(this.state.use)
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
        const data = this.state.use;
        console.log("updating...", data)
        //axios.put('http://88.197.53.80/kostoumart-api/uses/+'this.props.use.useID, { data: data, userId: this.user_id })
        axios.put('http://localhost:8108/uses/'+this.props.use.useID, { data: data, userId: this.user_id })
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        const data = this.state.use;
        //axios.post("http://88.197.53.80/kostoumart-api/uses",  { data: data, userId: this.user_id})
        axios.post('http://localhost:8108/uses', { data: data, userId: this.user_id})
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('insert')
            }
       })    
    }

    formValidation () {
        console.log("formValidation", this.state)
        let isFormValid = true;
        for (let formElement in this.state.use) {
            isFormValid = isFormValid && this.state.use[formElement].valid;
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
                <div id="ADD">
                    <NotificationContainer>{this.createNotification()}</NotificationContainer>
                    <div id="FormTitle">Χρήση</div><br/>
                    <form id="Form">
                        <div id="Name">
                            <div id="NameArea">
                                <div id="NameLabel">
                                    <span>ONOMA ΔΡΑΣΤΗΡΙΟΤΗΤΑΣ</span>
                                </div>
                                <input
                                id="TextArea"
                                value={this.state.use.name.value}
                                name="name"
                                onChange={this.handleChange('name')}
                                required={true}
                                />
                            </div>
                        </div>
                        <br/>
                        <div id="UseCategory">
                            <div id="UseCategoryArea">
                                <div id="UseNameLabel">
                                    <span>ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ</span>
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                placeholder={''}
                                name="useCategory"
                                value={this.state.use.useCategory}
                                onChange={this.handleChange('useCategory')}
                                required={true}
                                options={use_categories}
                                closeMenuOnSelect={true} 
                                />
                            </div>
                        </div>
                        <br/>
                        <div id='UseDescription'>
                            <div id="DescriptionArea">
                                <div id="LabelWithSubtitle">
                                    <div className="Title">
                                            <span>ΠΕΡΙΓΡΑΦΗ</span>
                                    </div>
                                    <div className="Subtitle">({this.maxLegnth-this.state.use.description.value.length} CHARACTERS REMAINING)</div>
                                </div>
                                <TextareaAutosize
                                id="DescriptionInput"
                                type='text'
                                name="description"
                                value={this.state.use.description.value}
                                onChange={this.handleChange('description')}
                                required={true}
                                />
                            </div>
                        </div>
                        <br/>
                        <div id="UseCustoms">
                            <div id="UseCustomsArea">
                                <div id="UseCustomsLabel">
                                <span>ΗΘΗ/ΕΘΙΜΑ</span>
                                </div>
                                <input
                                id="TextArea"
                                name="customs"
                                value={this.state.use.customs.value}
                                onChange={this.handleChange('customs')}
                                required={false}
                                />
                            </div>
                        </div>
                        <br/><br/><br/>
                        <div onClick={this.handleSubmit}><SaveButton id="ButtonSave" /></div>
                        <div onClick={this.props.handleClose}><CancelButton id="ButtonCancel" /></div>
                    </form>
                </div>    
            </React.Fragment>
        )
    }
}

export default UseForm;