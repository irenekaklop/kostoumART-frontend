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


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
  

class  CostumeForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            descr: null,
            //Uses' data
            uses_data: null,
            u_value: null,
            //Theatrical Plays data
            tps_data: null,
            tp_value: null,
            //For backend insert
            actors: null,
            designer: null,
            parts: null,
            //Material data on insert
            m_value: null,
            //Technique data on insert
            t_value: null,
            //Sex data on insert
            s_value: null,
            //Select
            selectedSexOption: [],
            selectedUseOption: null,
            selectedMaterialOption: null,
            selectedTechniqueOption: null,
            selectedTPOption: null,
            //Geosuggest
            location: null,
            location_select: null,
            location_influence: null,
            location_influence_select: null,

            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,

            /////////////////////////
            cond1: false,
            cond2: false,
            cond3: false,
            ////////////////////////
            error_description: false,
            error_dublicate: false,
            error_missing_value: false,
            insert: false
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(){
        console.log(this.props);
        this.state.tps_data=this.props.theatrical_plays;
        this.state.uses_data=this.props.uses;
        console.log(this.state)
    }

    handleClose(){
        this.setState(() => {this.props.handleClose()});
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    /*For selection of use categories*/
    handleUseSelect = (evt) => {
        this.setState({ selectedUseOption: evt.target.value });
        console.log(`Option selected:`, this.state.selectedUseOption);
    }

     /*For selection of theatrical plays*/
     handleTPSelect = (evt) => {
        this.setState({selectedTPOption: evt.target.value});
        console.log(`Option selected:`, this.state.selectedTPOption);
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
    
    handleLocationInfluenceChange = location_influence_select => {
       this.setState({ location_influence_select });
       console.log("HandleLocationChange:", this.state);
    };
    
    handleLocationInfluenceSelect = (location_influence_select) => {
        this.setState({location_influence_select });
        console.log(`Option selected:`, location_influence_select);
    }
        
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log(this.state);
        }
    }
    
    handleLocationInfluence(){            
        if(this.state.location_influence_select){
            this.state.location_influence = this.state.location_influence_select.description;
            console.log(this.state);
        }
    }

    handleSubmit = () => {
        this.handleValidate();
    }

    handleValidate = () => {
        var cond1, cond2, cond3 = false;
        console.log("Validation", this.state);
        if(this.state.name && this.state.descr && this.state.location && this.state.selectedMaterialOption && this.state.selectedSexOption && this.state.selectedTechniqueOption && this.state.selectedUseOption){
            console.log("Description lenght", this.state.descr.length);
            if(this.decription_legnth() >= 300){
                console.log("too big or too small description", this.state.descr.length);
                // Snackbar error for too big description
                this.setState({ error_description: true }, () => {
                    setTimeout(() => {
                      this.setState({ error_description: false });
                    }, 3000);
                });
                return;
            }
            else{
                cond1=true;
            }
        
            if(this.costume_exists()){ //costume already exists
                this.setState({ error_dublicate: true }, () => {
                    setTimeout(() => {
                      this.setState({ error_dublicate: false });
                    }, 3000);
                  });
                return;
            }
            else{
                console.log(cond1, cond3);
                cond2=true;
            }
            cond3=true;
        }
        else if(!this.state.location || !this.state.name || !this.state.descr|| !this.state.selectedUseOption || !this.state.selectedTechniqueOption || !this.state.selectedMaterialOption){
            console.log("something is missing");
            this.setState({ error_missing_value: true }, () => {
                setTimeout(() => {
                  this.setState({ error_missing_value: false });
                }, 3000);
              });
              return;
        }

        if(cond1 && cond2 && cond3){
            this.handleInsert();
        }
    }

    handleInsert() {
        for(var key in this.state.selectedSexOption){
                this.state.s_value = this.state.selectedSexOption[key];
                console.log("insert", key, this.state);
                let data = this.state;
                //axios.post('http://88.197.53.80/kostoumart-api/costumes', data)
                axios.post('http://localhost:8108/costumes', data)
                .then(res => {
                    console.log("result", res);
                    if(res.statusText ==="OK"){
                        this.setState({ insert: true }, () => {
                            setTimeout(() => {
                              this.setState({ insert: false });
                            }, 3000);
                          });
                    }
                })    
       }
    }

    resetForm () {
        this.setState({
            name: null,
            descr: null,
            actors: null,
            designer: null,
            parts: null,
            selectedSexOption: [],
            selectedUseOption: null,
            selectedMaterialOption: null,
            selectedTechniqueOption: null,
            selectedTPOption: null,
            //Geosuggest
            location: null,
            location_select: null,
            location_influence: null,
            location_influence_select: null,
            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            /////////////////////////
            cond1: false,
            cond2: false,
            cond3: false,
            ////////////////////////
            error_description: false,
            error_dublicate: false,
            error_missing_value: false,
        })
    }

    /*Functions for description legnth and validation*/
    decription_legnth(){
        return this.state.descr.length;
    }

    costume_exists(){
        const c_list = this.props.costumes;
        //check if new name already exist
        for(var i=0; i < c_list.length; i++){
            if(c_list[i].name === this.state.name){
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
                <NotificationContainer>{ NotificationManager.success('Entry is successfully inserted to DB','Success!',2000) }</NotificationContainer>
            )
        }
    }

    render(){

        //For selection of Sex: 
        const {selectedSexOption} = this.state;
        //For selection of Use:
        const {selectedUseOption} = this.state;
        //For selection of Material
        const {selectedMaterialOption} = this.state;
        //For selection of Technique
        const {selectedTechniqueOption} = this.state;
        //For selection of Theatrical Plays
        const {selectedTPOption} = this.state;

        const {name, descr, designer, actors, parts} = this.state;

        const u_options = [];
        const p_options = [];

        /* Create Use Categories*/
        for (var key in use_categories){
            u_options.push( {label: use_categories[key].label, options: []});
        }

        for (var key in this.state.uses_data){
            u_options.forEach(element => {
                if(element.label === this.state.uses_data[key].use_category){
                    element.options.push({label: this.state.uses_data[key].name, value: this.state.uses_data[key].name});
                }
            });
        }
    
        /*For theatrical Plays*/
        for (var key in this.state.tps_data){
            p_options.push({label: this.state.tps_data[key].title, value:  this.state.tps_data[key].title}); 
        }

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
                                    <div className="FormSubtitle">Kουστούμι</div>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Όνομα"
                                            name="name"
                                            value={name}
                                            onChange={this.onChange}
                                            margin="none"
                                            required={true}
                                            inputProps={{style: { fontSize: 14 }}}
                                            />
                                    </FormControl>
                                    <br/>
                                    <FormControl className="FormControl">
                                        <TextField
                                            label="Περιγραφή"
                                            name="descr"
                                            value={descr}
                                            onChange={this.onChange}
                                            margin="none"
                                            multiline
                                            rowsMax="4"
                                            required={true}
                                            inputProps={{style: { fontSize: 14 }}}
                                            />
                                    </FormControl>
                                    <br/><br/><br/>
                                    <FormControl required>
                                        <Autocomplete
                                            id="grouped-demo"
                                            options={this.state.uses_data}
                                            groupBy={option=>option.use_category}
                                            getOptionLabel={option => option.name}
                                            onSelect={this.handleUseSelect.bind(this)}
                                            style={{ width: 300 }}
                                            renderInput={params => (
                                                <TextField {...params} label="Χρήση * " variant="outlined" fullWidth />
                                            )}
                                        />
                                    </FormControl>
                                    <br/>
                                    <FormControl required>
                                        <InputLabel id="demo-simple-select-required-label">Φύλο</InputLabel>
                                        <Select
                                        required={true}
                                        labelId="demo-mutiple-chip-label"
                                        id="demo-mutiple-chip"
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
                                    <FormControl required>
                                        <InputLabel id="demo-simple-select-label">Υλικό</InputLabel>
                                        <Select
                                        required={true}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
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
                                    <FormControl required>
                                    <InputLabel id="demo-simple-select-label">Τεχνική</InputLabel>
                                        <Select
                                        required={true}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
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
                                    <FormControl>
                                        <TextField
                                            label="Σχεδιαστής"
                                            name="designer"
                                            value={this.state.designer}
                                            onChange={this.onChange}
                                            inputProps={{style: { fontSize: 14 }}}
                                            />
                                    </FormControl>
                                    <br/>
                                    <FormControl required>
                                        <InputLabel>Περιοχή Αναφοράς</InputLabel>
                                        
                                        <Geosuggest
                                            className="geosuggest"
                                            required={true}
                                            ref={el=>this._geoSuggest=el}
                                            onChange={this.handleLocationChange}
                                            onSuggestSelect={this.handleLocationSelect}
                                        />
                                        {this.handleLocation()}
                                    </FormControl>
                                    <br/>
                                    <FormControl>
                                        <InputLabel>Χώρα/Περιοχή Επιρροής</InputLabel>
                                        
                                        <Geosuggest
                                            className="geosuggest"
                                            ref={el=>this._geoSuggest=el}
                                            onChange={this.handleLocationInfluenceChange}
                                            onSuggestSelect={this.handleLocationInfluenceSelect}
                                        />
                                        {this.handleLocationInfluence()}
                                    </FormControl>
                                    <br/>
                                    <FormControl>
                                    <InputLabel id="demo-simple-select-label">Θεατρικές Παραστάσεις</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedTPOption}
                                        onChange={this.handleTPSelect}
                                        inputProps={{style: { fontSize: 14 }}}
                                        >
                                            {this.state.tps_data ? (this.state.tps_data.map(tp => (
                                                <MenuItem key={tp.theatrical_play_id} value={tp.title}>
                                                    {tp.title}
                                                </MenuItem>
                                            ))) : <MenuItem>No options</MenuItem>}   
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <FormControl>
                                        <TextField
                                            label="Hθοποιόι"
                                            name="actors"
                                            value={actors}
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

export default CostumeForm;