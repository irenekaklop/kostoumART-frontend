import React, {Component} from 'react';

import { Paper, TextField, Button, Snackbar, SnackbarContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';

import { Autocomplete } from '@material-ui/lab';

import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css";


import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';
import { ninvoke } from 'q';

class TpForm extends Component{

    constructor(props){
        super(props);
        this.state = { 
            tp_data: null,
            theatrical_play_id: '',
            name: '',
            theater: '',
            date: '',
            actors: '',
            director: '',
            submit: false,
            redirectToReferrer: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.insert){
            this.resetForm();
            this.handleClose(false);
            
        }
        if(this.props.editing && !prevProps.editing){
            this.setState({
                tp: this.props.tp,
                name: this.props.tp.title,
                theater: this.props.tp.theater,
                date: this.props.tp.date,
                actors: this.props.tp.actors,
                director: this.props.tp.director,
                theatrical_play_id: this.props.tp.theatrical_play_id,
                tp_data: this.props.theatrical_plays
                })
        }
        console.log("Props", this.props)
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    handleCategorySelect = (evt) => {
        this.setState({ selectedCategoryOption: evt.target.value });
        console.log("Option selected:", this.state.selectedCategoryOption)
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    handleSubmit = () => {
        if(this.formValidate()){
            if(this.props.editing){
                this.handleUpdate();
            }
            else{
                this.handleInsert();
            }
        }
    }

    handleUpdate(){
        const data = { theatrical_play_id: this.state.theatrical_play_id, title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater};
        axios.post('http://88.197.53.80/kostoumart-api//edit_tp', data)
        //axios.post('http://localhost:8108/edit_tp', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        let data ={title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater};
        axios.post("http://88.197.53.80/kostoumart-api/tps", data)
        //axios.post('http://localhost:8108/tps', data)
        .then(res => {
            if(res.statusText == 'OK'){
                this.createNotification('insert')
            }
          })
    }

    formValidate(){
        if(!this.state.name || !this.state.theater || !this.state.director){
            console.log("something is missing");
            this.createNotification('error-missing-value')
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        return true;
    }

    handleDuplicate (){
        const tp_list = this.props.theatrical_plays;
        //check this name and use category already exist
        for(var i=0; i < tp_list.length; i++){
            console.log(tp_list[i].title, this.state.name )
            if(tp_list[i].title === this.state.name){
                if(this.props.editing){
                    if(this.props.tp.title === this.state.name){
                        return false;
                    }
                }
                console.log("already exists this name")
                this.createNotification('error-duplicate')
                return true;
            }
        }
        return false;
    }
       
    resetForm() {
        this.setState( { 
            theatrical_play_id: '',
            name: '',
            theater: '',
            date: '',
            actors: '',
            director: '',
            submit: false,
            redirectToReferrer: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        });
    }

    createNotification(type){
        if(type === "error-description"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Text should be under 300 characters",'Too big description!', 2000) }</NotificationContainer>
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
        const {name, theater, director, date} = this.state;

        return(
            <div>
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                <Dialog
                open={this.props.isOpen}
                onClose={() => this.handleClose(false)}                
                aria-labelledby="input-dialog"
                aria-describedby="input-dialog"
                maxWidth={'lg'}
                fullWidth={true}>
                    <DialogContent>
                        <CloseIcon
                        style={{ float: 'right', cursor: 'pointer' }}
                        onClick={() => this.handleClose(false)}/>
                        <form onSubmit={this.handleSubmit}>
                            <div className="FormContent">
                                <div className="FormTitle">Θεατρική παράσταση</div>
                                <br/>
                                <FormControl className="FormControl">
                                <TextField required 
                                label="Όνομα Παράστασης" 
                                name="name" 
                                value={name} 
                                onChange={this.onChange}></TextField>
                                </FormControl>
                                <br/>
                                <FormControl>
                                    <TextField 
                                    label="Ημερομηνία" name="date" 
                                    value={date} 
                                    onChange={this.onChange}></TextField>
                                </FormControl>
                                <br/>
                            <FormControl className="FormControl">
                                <TextField  required label="Σκηνοθέτης" name="director" value={director} onChange={this.onChange}></TextField>
                            </FormControl>
                                <br/>
                            <FormControl className="FormControl">
                                <TextField  required label="Θέατρο" name="theater" value={theater} onChange={this.onChange}></TextField>
                            </FormControl>
                            <br/><br/><br/>
                                <div className="button-submit">
                                    <Button  variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
            </Dialog>
            </div>
        )
    }
}

export default TpForm;