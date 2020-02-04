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


import CloseIcon from '@material-ui/icons/Close';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css";


import {sexs, materials, techniques, use_categories,years} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';
import { ninvoke } from 'q';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};


class TpForm extends Component{

    constructor(props){
        super(props);
        this.state = { 
            tp_data: null,
            theatrical_play_id: '',
            name: '',
            theater: '',
            date: [],
            actors: '',
            director: '',
            years: '',
            user_id: '',
            submit: false,
            redirectToReferrer: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        };
        const year = (new Date('1800')).getFullYear();
        this.state.years = Array.from(new Array(300),(val, index) => (index + year).toString());
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.insert){
            this.resetForm();
        }
        if(this.props.editing && !prevProps.editing){
            let d_arr;
            if(this.props.tp.date.includes(",")){
                d_arr = this.props.tp.date.split(",");
            }
            else if (this.props.tp.date===''){
                d_arr = []
            }
            else{
                d_arr = [this.props.tp.date]
            }
            this.setState({
                tp: this.props.tp,
                name: this.props.tp.title,
                theater: this.props.tp.theater,
                actors: this.props.tp.actors,
                director: this.props.tp.director,
                date: d_arr,
                theatrical_play_id: this.props.tp.theatrical_play_id,
                tp_data: this.props.theatrical_plays
                })
        }
        if(this.props.user && !prevState.user_id){
            this.setState({user_id: this.props.user});
            
        }
        console.log("TP state", this.state)
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    handleDateSelect = (evt) => {
        this.setState({ date: evt.target.value });
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
        let data = { theatrical_play_id: this.state.theatrical_play_id, title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater, userId: this.state.user_id};
        console.log(this.state);
        if(this.state.date.length===0){
            data.date='';
        }
        //axios.post('http://88.197.53.80/kostoumart-api//edit_tp', data)
        axios.post('http://localhost:8108/edit_tp', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        let data ={title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater, userId: this.state.user_id};
        if(this.state.date.length===0){
            data.date='';
        }
        //axios.post("http://88.197.53.80/kostoumart-api/tps", data)
        axios.post('http://localhost:8108/tps', data)
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
            date: [],
            actors: '',
            director: '',
            user_id:'',
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
        console.log(this.state)
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
                                <FormControl className="FormControl">
                                    <InputLabel>Ημερομηνία</InputLabel>
                                    <Select
                                        multiple
                                        label="select"
                                        value={date}
                                        onChange={this.handleDateSelect}
                                        input={<Input id="select-multiple-chip" />}
                                        renderValue={selected => (
                                            <div>
                                            {selected.map(label => (
                                                <Chip key={label} label={label}/>
                                            ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {
                                            this.state.years.map((year, index) => (
                                                <MenuItem key={`year${index}`} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                    </Select>
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