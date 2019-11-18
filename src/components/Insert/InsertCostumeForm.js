import React, {Component} from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { Paper, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css";
import Select from 'react-select';

import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';


class  InsertCostumeForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            descr: '',
            //Uses' data
            uses_data: null,
            u_value: '',
            //Theatrical Plays data
            tps_data: null,
            tp_value:'',
            //For backend insert
            actors: '',
            designer: '',
            parts: '',
            //Material data on insert
            m_value: '',
            //Technique data on insert
            t_value: '',
            //Sex data on insert
            s_value: '',
            //Select
            selectedSexOption: null,
            selectedUseOption: null,
            selectedMaterialOption: null,
            selectedTechniqueOption: null,
            selectedTPOption: null,
            //Geosuggest
            location:'',
            location_select:'',
            location_influence:'',
            location_influence_select:'',

            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,

            /////////////////////////
            cond1: false,
            cond2: false,
            cond3: false,
        }
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
    handleUseSelect = (selectedUseOption) => {
        this.setState({selectedUseOption});
        console.log(`Option selected:`, selectedUseOption);
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
                                    value={this.state.name}
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
                                    value={this.state.descr}
                                    onChange={this.onChange}
                                    margin="none"
                                    multiline
                                    rowsMax="4"
                                    required={true}
                                    inputProps={{style: { fontSize: 14 }}}
                                    />
                            </FormControl>
                            <br/><br/><br/>
                            <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                value={selectedUseOption}
                                options={this.props.uses}
                                onChange = {this.handleUseSelect}
                                getOptionLabel={option => option.name}
                                style={{ width: 300 }}
                                renderInput={params => (
                                    <TextField {...params} label="Χρήση" variant="outlined" fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </form>
                </DialogContent>
          </Dialog>
        )
       
    }
    
}

export default InsertCostumeForm;