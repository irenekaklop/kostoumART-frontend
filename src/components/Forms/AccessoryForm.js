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
import ListSubheader from '@material-ui/core/ListSubheader';

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
import { thisExpression } from '@babel/types';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };
  

class  AccessoryForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            accessory: null,
            name: '',
            description: '',
            usesData: '',
            costumesData: '',
            //For backend insert
            actors: '',
            designer: '',
            parts: '',
            //Select
            selectedSexOption: [],
            selectedUseOption: '',
            selectedUseCategoryOption: '',
            selectedMaterialOption: '',
            selectedTechniqueOption: '',
            selectedCostumeOption: '',
            selectedDateOption: '',
            //Geosuggest
            location: '',
            location_select: '',
            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            /////////////////////////
            cond1: false,
            cond2: true,
            cond3: false,
            ////////////////////////
            enableSelectUse: true,
            ///////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
            isNotificationOpen: false,
            //////////////////////////////
            years: '',
        }
        this.onChange = this.onChange.bind(this);
        const year = (new Date(1700)).getFullYear();
        this.state.years = Array.from(new Array(100),(val, index) => (index + year));
    }

    componentDidUpdate(prevProps, prevState){
        console.log("props", this.props);
        if(prevState.insert){
            this.resetForm();
        }
        if(this.props.editing && !prevProps.editing){
            let sex;
            if(this.props.accessory.sex.includes(",")){
                sex = this.props.accessory.sex.split(",");
            }
            else{
                sex = [this.props.accessory.sex];
            }
            this.setState({
                accessory: this.props.accessory,
                costume_id: this.props.accessory.costume_id,
                name: this.props.accessory.costume_name,
                descr: this.props.accessory.description,
                actors: this.props.accessory.actors,
                designer: this.props.accessory.designer,
                parts: this.props.accessory.parts,
                selectedDateOption: this.props.accessory.date,
                selectedSexOption: sex,
                selectedUseOption: this.props.accessory.use_name,
                selectedMaterialOption: this.props.accessory.material,
                selectedTechniqueOption: this.props.accessory.technique,
                selectedCostumeOption: this.props.accessory.costume_name,
                location: this.props.accessory.location,
            })
            if(this.props.uses){
                for(var i=0; i<this.props.uses.length; i++){
                    if(this.props.uses[i].useID===this.props.accessory.useID){
                        this.setState({
                            selectedUseCategoryOption: this.props.uses[i].use_category
                        })
                    }
                }
            }
           
        }
        if(this.props.user && !prevProps.user){
            this.setState({user_id: this.props.user})
        }
        console.log('state', this.state);
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    onChangeCategory = (evt) => {
        this.setState({selectedUseCategoryOption: evt.target.value,
        enableSelectUse: false})
    }

    /*For selection of date*/
    handleDateSelect = (evt) => {
        this.setState({ selectedDateOption: evt.target.value});
        console.log(`Option selected:`, evt.target);
    }

    /*For selection of use categories*/
    handleUseSelect = (evt) => {
        this.setState({ selectedUseOption: evt.target.value});
        console.log(`Option selected:`, evt.target);
    }

     /*For selection of theatrical plays*/
     handleCostumeSelect = (evt) => {
        this.setState({selectedCostumeOption: evt.target.value});
        console.log(`Option selected:`, this.state.selectedCostumeOption);
    }

    /*For mutli-selection of sex categories*/
    handleSexSelect = (evt) => {
        this.setState({ selectedSexOption: evt.target.value });
        console.log(`Option selected:`, this.state.selectedSexOption);
    }

    handleMaterialSelect = (evt) => {
        this.setState({ selectedMaterialOption: evt.target.value });
        console.log(`Option selected:`, this.state.selectedMaterialOption);
    }

    handleTechniqueSelect = (evt) => {
        this.setState({ selectedTechniqueOption: evt.target.value });
        console.log(`Option selected:`, this.state.selectedTechniqueOption);
    }

    /*Geosuggest functions*/
    handleLocationChange = location_select => {
        this.setState({ location_select });
        console.log("HandleLocationChange:", this.state);
    };
    
    handleLocationSelect = (location_select) => {
        this.setState({ location_select });
        console.log(`Option selected:`, location_select);
    }
        
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log(this.state);
        }
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
    
    formValidation () {
        console.log("formValidation", this.state)
        if(!this.validateInputLength()){
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        if(!this.state.location || !this.state.name || !this.state.description|| !this.state.selectedUseOption || !this.state.selectedTechniqueOption || !this.state.selectedMaterialOption){
            console.log("something is missing");
            this.createNotification("error-missing-value")
            return false;
        }
        console.log("everything is ok")
        return true;
    }

    handleUpdate = () => {
        let data = this.state;
        //axios.post('http://88.197.53.80/kostoumart-api/edit_costume', data)
        axios.post('http://localhost:8108/edit_costume', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("update")
            }
       })    
    }

    handleInsert = () => {
        console.log("inserting", this.state);
        let data = this.state;
        //axios.post('http://88.197.53.80/kostoumart-api/costumes', data)
        axios.post('http://localhost:8108/costumes', data)
        .then(res => {
        console.log("result", res);
            if(res.statusText ==="OK"){
                this.createNotification("insert")
            }
        })
    }

    resetForm () {
        this.setState({
            name: '',
            description: '',
            actors: '',
            designer: '',
            parts: '',
            //Select
            selectedSexOption: [],
            selectedUseOption: '',
            selectedUseCategoryOption: '',
            selectedMaterialOption: '',
            selectedTechniqueOption: '',
            selectedCostumeOption: '',
            selectedDateOption: '',
            //Geosuggest
            location: '',
            location_select: '',
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            /////////////////////////
            cond1: false,
            cond2: false,
            cond3: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        })
    }

    /*Functions for description legnth and validation*/
    decription_legnth(){
        return this.state.description.length;
    }

    handleDuplicate() {
        const c_list = this.props.costumes;
        //check if new name already exist
        for(var i=0; i < c_list.length; i++){
            if(this.state.name){
            if(c_list[i].costume_name === this.state.name){
                if(this.props.editing){
                    if(this.props.accessory.costume_name === this.state.name){
                        return false;
                    }
                }
                this.createNotification('error-duplicate');
                return true;
            }
        }}
        return false;
        
    }

    validateInputLength(){
        if(this.state.description && this.state.description.length>300){
            console.log("too big or too small description");
            // Snackbar error for too big description
            this.createNotification("error-description")
            return false;
        }
        else return true;
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
        //For selection of Date
        const {selectedDateOption} = this.state;
        //For selection of Sex: 
        const {selectedSexOption} = this.state;
        //For selection of Use:
        const {selectedUseOption, selectedUseCategoryOption} = this.state;
        //For selection of Material
        const {selectedMaterialOption} = this.state;
        //For selection of Technique
        const {selectedTechniqueOption} = this.state;
        //For selection of Costumes
        const {selectedCostumeOption} = this.state;

        const {name, description, designer, actors, parts} = this.state;

        const u_options = [];
        const p_options = [];

        /* Create Use Categories*/
        for (var key in use_categories){
            u_options.push( {label: use_categories[key].label, options: []});
        }

        if(this.props.uses){ 
            for (var key in this.props.uses){
            u_options.forEach(element => {
                if(element.label === this.props.uses[key].use_category){
                    element.options.push({label: this.props.uses[key].name, value: this.props.uses[key].name});
                }
            });
        }}

        console.log(u_options);

        return(
            <div>
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.handleClose(false)}
                    aria-labelledby="input-dialog"
                    aria-describedby="input-dialog"
                    maxWidth={'lg'}
                    fullWidth={true}
                    >
                        <DialogContent>
                            <CloseIcon
                            style={{ float: 'right', cursor: 'pointer' }}
                            onClick={() => this.handleClose(false)}/>
                            
                            <form onSubmit={this.submit}>
                                <div className="FormContent">
                                    <div className="FormTitle">Συνοδευτικό</div>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Όνομα"
                                            name="name"
                                            value={name}
                                            onChange={this.onChange}
                                            required={true}
                                            />
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
                                            />
                                            <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                                    </FormControl>
                                    <br/>
                                    <FormControl required className="FormControl">
                                        <InputLabel>Κατηγορία χρήσης</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        required={true}
                                        onChange={this.onChangeCategory}
                                        value={selectedUseCategoryOption}
                                        >
                                            {u_options.map( category => (
                                                <MenuItem key={category.label} value={category.label}>
                                                    {category.label}
                                                </MenuItem>
                                            ))} 
                                        </Select>
                                    </FormControl>

                                    <FormControl required className="FormControl">
                                        <InputLabel>Όνομα Χρήσης</InputLabel>
                                            <Select
                                            disabled={this.state.enableSelectUse}
                                            className="SelectContainer"
                                            required={true}
                                            onChange={this.handleUseSelect}
                                            value={selectedUseOption}
                                            >
                                                {u_options.map( category => (
                                                    category.label === selectedUseCategoryOption ?
                                                    (category.options.map(use => (
                                                            <MenuItem key={use.label} value={use.label}>
                                                                {use.label}
                                                            </MenuItem>
                                                        ))):
                                                   (console.log("None"))
                                                ))} 
                                            </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <InputLabel>Εποχή</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        value={selectedDateOption}
                                        onChange={this.handleDateSelect}>
                                            {
                                                this.state.years.map((year, index) => (
                                                    <MenuItem key={`year${index}`} value={year}>
                                                        {year}
                                                    </MenuItem>
                                                ))
                                            }

                                        </Select>
                                    </FormControl> 
                                    <br/>
                                    <FormControl required className="FormControl">
                                        <InputLabel>Φύλο</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        required={true}
                                        multiple
                                        value={selectedSexOption}
                                        onChange={this.handleSexSelect}
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
                                        {sexs.map(sex => (
                                            <MenuItem key={sex.value} value={sex.label}>
                                            {sex.label}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl required className="FormControl">
                                        <InputLabel>Υλικό</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        required={true}
                                        value={selectedMaterialOption}
                                        onChange={this.handleMaterialSelect}
                                        >
                                            {materials.map(material => (
                                                <MenuItem key={material.value} value={material.label}>
                                                    {material.label}
                                                </MenuItem>
                                            ))}   
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl required className="FormControl">
                                    <InputLabel>Τεχνική</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        required={true}
                                        value={selectedTechniqueOption}
                                        onChange={this.handleTechniqueSelect}
                                        >
                                            {techniques.map(technique => (
                                                <MenuItem key={technique.value} value={technique.label}>
                                                    {technique.label}
                                                </MenuItem>
                                            ))}   
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Σχεδιαστής"
                                            name="designer"
                                            value={this.state.designer}
                                            onChange={this.onChange}
                                            inputProps={{style: { fontSize: 14 }}}
                                            />
                                    </FormControl>
                                    <br/>
                                    <FormControl required className="FormControl">
                                        <InputLabel>Περιοχή Αναφοράς</InputLabel>
                                        
                                        <Geosuggest
                                            className="geosuggest"
                                            placeholder="Αναζήτηση"
                                            initialValue={this.state.location}
                                            required={true}
                                            ref={el=>this._geoSuggest=el}
                                            onSuggestSelect={this.handleLocationSelect}
                                        />
                                        {this.handleLocation()}
                                    </FormControl>
                                    <br/>
                                    <FormControl className="FormControl">
                                    <InputLabel>Κοστούμι</InputLabel>
                                        <Select
                                        className="SelectContainer"
                                        value={selectedCostumeOption}
                                        onChange={this.handleCostumeSelect}
                                        inputProps={{style: { fontSize: 14 }}}
                                        >
                                            {this.props.costumes ? (this.props.costumes.map(costume => (
                                                <MenuItem key={costume.costume_id} value={costume.costume_name}>
                                                    {costume.costume_name}
                                                </MenuItem>
                                            ))) : <MenuItem>No options</MenuItem>}   
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Hθοποιόι"
                                            name="actors"
                                            value={actors}
                                            onChange={this.onChange}
                                            inputProps={{style: { fontSize: 14 }}}/>
                                    </FormControl> 
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Ρόλοι"
                                            name="parts"
                                            value={parts}
                                            onChange={this.onChange}
                                            inputProps={{style: { fontSize: 14 }}}/>
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

export default AccessoryForm;