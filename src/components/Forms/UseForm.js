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

class UseForm extends Component{

    constructor(props){
        super(props);
        this.state = { 
            u_data: null,
            use: null,
            id: '',
            use_category: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            exists: '',
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
            ////////////////////////
           
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        console.log("Props", this.props);
        console.log("Use Form:", this.state);
        if(prevState.insert){
            this.resetForm();
            this.handleClose(false);
        }
        if(this.props.editing && !prevProps.editing){
            this.setState({
                use: this.props.use,
                name: this.props.use.name,
                description: this.props.use.description,
                customs: this.props.use.customs,
                use_category: this.props.use.use_category,
                selectedCategoryOption: this.props.use.use_category,
                id: this.props.use.useID
            })
        }
    }

    onSelect = ( selectedCategoryOption ) => { 
        this.setState({ selectedCategoryOption }); 
        console.log(this.state)
    };

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    decription_legnth(){
        if(this.state.description){
            return this.state.description.length;
        }
        else{
            return 0;
        }
    }

    handleCategorySelect = (evt) => {
        this.setState({ selectedCategoryOption: evt.target.value });
        console.log("Option selected:", this.state.selectedCategoryOption)
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
        console.log("update", this.state)
        const data = { id: this.state.id, name: this.state.name, category: this.state.selectedCategoryOption, description: this.state.description, customs: this.state.customs }
        axios.post('http://88.197.53.80/kostoumart-api/edit_use', data)
        //axios.post('http://localhost:8108/edit_use', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        const data = { name: this.state.name, category: this.state.selectedCategoryOption, description: this.state.description, customs: this.state.customs }
        axios.post("http://88.197.53.80/kostoumart-api/uses", data)
        //axios.post('http://localhost:8108/uses', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('insert')
            }
       })    
    }

    formValidation(){
        console.log("formValidation", this.state)
        if(!this.validateInputLength()){
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        if(!this.state.name || !this.state.description || !this.state.selectedCategoryOption){
            console.log("something is missing");
            this.createNotification('error-missing-value');
              return false;
        }
        console.log("something is missing");
        return true;
    }

    validateInputLength(){
        if(this.state.description && this.state.description.length>300){
            console.log("too big or too small description");
            // Snackbar error for too big description
            this.createNotification('error-description')
            return false;
        }
        else return true;
    }
    
    //true: Has duplicate, false: Doesn't have
    handleDuplicate(){
        const uses_list = this.props.uses;
        //check this name and use category already exist
        for(var i=0; i < uses_list.length; i++){
            if(uses_list[i].name === this.state.name && uses_list[i].use_category === this.state.selectedCategoryOption){
                if(this.props.editing){
                    if(this.state.name===this.props.use.name){
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
        this.setState({
            use: '',
            id: '',
            use_category: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            exists: '',
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
        })
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
        const {selectedCategoryOption}= this.state;
        const {name, description, customs} =this.state;
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
                                    <div className="FormTitle">Χρήση</div>
                                    <br/>
                                <FormControl className="FormControl">
                                    <TextField
                                            label="Όνομα Δραστηριότητας"
                                            value={name}
                                            name="name"
                                            onChange={this.onChange}
                                            margin="none"
                                            required={true}
                                            inputProps={{style: { fontSize: 14 }}}
                                    />
                                </FormControl>
                                <br/>
                                <FormControl required>
                                    <InputLabel id="demo-simple-select-required-label">Κατηγορία Χρήσης</InputLabel>
                                    <Select
                                    className="SelectContainer"
                                    required={true}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedCategoryOption}
                                    onChange={this.handleCategorySelect}
                                    >
                                        {use_categories.map(use => (
                                            <MenuItem key={use.value} value={use.label}>
                                                {use.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <br/>
                                <FormControl className="FormControl">
                                    <TextField
                                        label="Περιγραφή"
                                        name="description"
                                        value={description}
                                        onChange={this.onChange}
                                        margin="none"
                                        multiline
                                        rowsMax="4"
                                        required={true}
                                        inputProps={{style: { fontSize: 14 }}}
                                        ></TextField>
                                        <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                                </FormControl>
                                <br/>
                                <FormControl className="FormControl">
                                        <TextField
                                        label="Ήθη/Έθιμα"
                                        name="customs"
                                        value={customs}
                                        onChange={this.onChange}
                                        />
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

export default UseForm;