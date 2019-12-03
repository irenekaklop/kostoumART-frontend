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
            error_dublicate: false,
            error_missing_value: false,
            insert: false
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.editing && !prevProps.editing){
            this.setState({
                tp: this.props.tp,
                name: this.props.tp.title,
                theater: this.props.tp.theater,
                date: this.props.tp.date,
                actors: this.props.tp.actors,
                director: this.props.tp.director,
                theatrical_play_id: this.props.tp.theatrical_play_id,
                })
        }
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
        if(this.handleValidate()){
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
        axios.post('http://localhost:8108/edit_tp', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.setState({ insert: true }, () => {
                    setTimeout(() => {
                      this.setState({ insert: false });
                    }, 3000);
                  });
            }
       })    
    }

    handleInsert(){
        let data ={title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater};
        //axios.post("http://88.197.53.80/kostoumart-api/tps", data)
        axios.post('http://localhost:8108/tps', data)
        .then(res => {
            this.setState({ insert: true }, () => {
                setTimeout(() => {
                  this.setState({ insert: false });
                }, 3000);
              });
          })
    }

    handleValidate(){
        if(this.state.name && this.state.theater){
            //Check if exists
            if(this.tp_exists()){
                this.setState({ error_dublicate: true }, () => {
                    setTimeout(() => {
                      this.setState({ error_dublicate: false });
                    }, 3000);
                  });
                return;
            }
            else{
                return true;
            }
        }
        else if(!this.state.name || !this.state.theater){
            console.log("something is missing");
            this.setState({ error_missing_value: true }, () => {
                setTimeout(() => {
                  this.setState({ error_missing_value: false });
                }, 3000);
              });   
              return;
        }
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
            error_dublicate: false,
            error_missing_value: false,
            insert: false
        });
    }

    tp_exists(){
        const tp_list = this.props.theatrical_plays;
        //check this name and use category already exist
        for(var i=0; i < tp_list.length; i++){
            if(tp_list[i].title === this.state.name){
                if(this.props.editing){
                    if(this.props.tp.title === this.state.name){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                return true;
            }
        }
        return false;
    }

    createNotification(type){
        if(this.state.error_description){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.warning("Text should be under 300 characters",'Too big description!', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (this.state.error_dublicate){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error('Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                </div>
            )
        }
        else if (this.state.error_missing_value){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (this.state.insert){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή καταχωρήθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
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
                                <div className="FormSubtitle">Kουστούμι</div>
                                <br/>
                                <FormControl className="FormControl">
                                <TextField required 
                                label="Όνομα Παράστασης" 
                                name="name" 
                                value={name} 
                                onChange={this.onChange}></TextField>
                            </FormControl>
                            <br/>
                            <FormControl required>
                                <TextField 
                                required label="Ημερομηνία" name="date" 
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