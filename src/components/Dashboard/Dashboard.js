import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import { Paper, Button, TextField, Drawer, Divider, MenuItem, InputLabel, Select} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FilterListIcon from '@material-ui/icons/FilterList';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from 'axios';
import CostumeForm from '../Forms/CostumeForm.js';
import AccessoryForm from '../Forms/AccessoryForm.js';
import UseForm from '../Forms/UseForm.js';
import TpForm from '../Forms/TpForm.js';
import ConfirmationDialog from '../Dashboard/ConfirmationDialog.js';

import "../../styles/Dashboard.css"

import jwt_decode from 'jwt-decode';
import { use_categories, techniques, sexs, materials } from '../../utils/options.js';

import _ from 'lodash'

import Header from '../Shared/Header.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Dashboard extends Component{

    constructor(props) {
        super(props);
        this.events = [
            "load",
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress"
        ];
        this.state = {
            current_tab: 0,
            //Costumes
            costume_data: [],
            //Uses
            use_data: [],
            //TPs
            tp_data:[],
            //Accessories
            accessories: [],
            //For Insert Form
            isCostumeDialogOpen: false,
            isUseDialogOpen: false,
            isTPDialogOpen: false,
            isConfirmationDialogOpen: false,
            isAccessoryDialogOpen: false,
            //For Editing
            editing: false,
            costume: null,
            use: null,
            tp: null,
            accessory: null,
            //Filters
            current_costumes: [],
            filterDrawerOpen: false,
            useCategoryOption: '',
            techniqueOption: '',
            sexOption: '',
            //Confirmation Dialog answer
            index: null,
            user: {
                user_id: null,
                email: '',
                role: null,
            },
            redirectToReferrer: false,     
            //Sorting
            column: null,
            direction: null,
            use_data: [],

        }

        this.logOut = this.logOut.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        //Set Timeout in case of inactivity 
        for (var i in this.events) {
            window.addEventListener(this.events[i], this.resetTimeout);
          }
      
        this.setTimeout();
    }

    componentDidMount(){
        const token = localStorage.usertoken
        if(token){
            const decoded = jwt_decode(token);
            this.setState({ user: {
                user_id: decoded.user_id,
                email: decoded.email,
                role: decoded.role,
            } });
            console.log("decoded", decoded);
            this.get_uses();
            this.get_theatrical_plays();
            this.getCostumes(decoded);
            this.getAccessories();
        }
        else{
            this.setState({redirectToReferrer: true})
        }
    }

    //Functions for auto-logout
    clearTimeout() {
        if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    }
    
    //Set a Timeout after one hour
    setTimeout() {
        this.logoutTimeout = setTimeout(this.logOut, 36 * 100000);
    }
    
    resetTimeout() {
        this.clearTimeout();
        this.setTimeout();
    }
    
    logOut(e) {
        localStorage.removeItem('usertoken')
        this.clearTimeout();
    
        for (var i in this.events) {
          window.removeEventListener(this.events[i], this.resetTimeout);
        }
        this.props.history.push({pathname: `/auth`, state: { detail: 'logout' }})
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    handleCategoryUseSelect = (evt) => {
        this.setState({ useCategoryOption: evt.target.value});
        console.log(`Option selected:`, evt.target);
    }

    handleTechniqueSelect = (evt) => {
        this.setState({ techniqueOption: evt.target.value});
        console.log(`Option selected:`, evt.target);
    }

    handleSexSelect = (evt) => {
        this.setState({ sexOption: evt.target.value});
        console.log(`Option selected:`, evt.target);
    }

    handleSort = (clickedColumn) => () => {
        const { column, use_data, current_costumes, tp_data, accessories, direction } = this.state
    
        if (column !== clickedColumn) {
            switch(this.state.current_tab){
                case 0:
                    this.setState({
                        column: clickedColumn,
                        current_costumes: _.sortBy(current_costumes, [clickedColumn]),
                        direction: 'ascending',
                      })
                case 1:
                    this.setState({
                        column: clickedColumn,
                        accessories: _.sortBy(accessories, [clickedColumn]),
                        direction: 'ascending',
                      })
                case 2:
                    this.setState({
                        column: clickedColumn,
                        use_data: _.sortBy(use_data, [clickedColumn]),
                        direction: 'ascending',
                      })
                case 3:
                    this.setState({
                        column: clickedColumn,
                        tp_data: _.sortBy(tp_data, [clickedColumn]),
                        direction: 'ascending',
                      })
                      
                }
            return;
        }
        
        switch(this.state.current_tab){
            case 0:
                this.setState({
                    current_costumes: current_costumes.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                })
            case 1:
                this.setState({
                    accessories: accessories.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                  })
            case 2:
                this.setState({
                    use_data: use_data.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                })
            case 3:
                this.setState({
                    tp_data: tp_data.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                })

        }
    }

    createNotification(type){
        switch (type) {
            case "error":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Η εγγραφή δεν διαγράφηκε!') }</NotificationContainer>
                    </div>
                )
            case "delete-success":
                return(
                    <NotificationContainer>{ NotificationManager.success('Η εγγραφή διαγράφηκε','Success!',2000) }</NotificationContainer>
                )
            case 'logout':
                return(
                <NotificationContainer>{NotificationManager.warning("Αποσύνδεση")}</NotificationContainer>
                )
        };
    }

    /*Get costumes from db*/
    getCostumes = (decoded) => {
        if(decoded){
            //axios.get('http://88.197.53.80/kostoumart-api/costumes/',{params: {user: decoded.role}})
            axios.get("http://localhost:8108/costumes",{params: {user: decoded.role}})
            .then(res => {
                const costume_data = res.data.response;
                this.setState({ costume_data });
                this.setState({
                    current_costumes: costume_data
                })
            }
            )
        }
        else{
            //axios.get('http://88.197.53.80/kostoumart-api/costumes/',{params: {user: decoded.role}})
            axios.get("http://localhost:8108/costumes",{params: {user: this.state.user.role}})
            .then(res => {
                const costume_data = res.data.response;
                this.setState({ costume_data });
                this.setState({
                    current_costumes: costume_data
                })
            }
            )
        }
       
    }

    /* Get uses from database*/ 
    get_uses = _ => {
        let self = this;
        //axios.get("http://88.197.53.80/kostoumart-api/uses/")
        axios.get("http://localhost:8108/uses")
        .then(res => {
            const use_data = res.data.response;
            this.setState({ use_data });
            console.log(this.state);
        }
        )
    }

    /*Get Theatrical Plays from database*/
    get_theatrical_plays = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/tps/")
        axios.get("http://localhost:8108/tps")
        .then(res => {
            const tp_data = res.data.response;
            this.setState({ tp_data });
            console.log(this.state);
        }
        )
    }

    getAccessories = () => {
         //axios.get("http://88.197.53.80/kostoumart-api/accessories")
         axios.get("http://localhost:8108/accessories")
         .then(res => {
             const accessories = res.data.response;
             this.setState({ accessories });
             console.log(this.state);
         }
         )
    }

    get_costume(index){
        //axios.get('http://88.197.53.80/kostoumart-api/costumes/')
        axios.get("http://localhost:8108/costumes/"+index)
        .then(res => {
            const costume = res.data.response;
            this.setState({ costume });
        }
        )
    }

    handleDrawerOpen = () => {
        this.setState({
            filterDrawerOpen: true
        })
    };
    
    handleDrawerClose = () => {
        this.setState({
            filterDrawerOpen: false
        })
    };
    
    
    handleCloseDialog = () => {
        if(this.state.editing){
            this.setState({ editing: false });
        }
        if(this.state.isCostumeDialogOpen){
            this.getCostumes();
            this.setState({isCostumeDialogOpen: false});}
        else if(this.state.isUseDialogOpen){
            this.get_uses();
            this.setState({isUseDialogOpen: false});
        }
        else if(this.state.isTPDialogOpen){
            this.get_theatrical_plays();
            this.setState({isTPDialogOpen: false});
        }
        else if(this.state.isAccessoryDialogOpen){
            this.getAccessories();
            this.setState({isAccessoryDialogOpen: false})
        }
    }

    handleCloseConfirmationDialog = () => {
        this.setState({
            isConfirmationDialogOpen:false,
        });
    }
    
    handleOpenConfirmationDialog = (index) => {
        this.setState({
            isConfirmationDialogOpen: true,
            index: index,
        });
    }

    handleOk = (index) => {
        this.setState({
            isConfirmationDialogOpen:false,
        });
        if(this.state.current_tab===0){
            this.handleCostumeDelete(index);
        }
        else if(this.state.current_tab===2){
            this.handleUseDelete(index);
        }
        else if(this.state.current_tab===3){
            this.handleTPDelete(index);
        }
    }

    handleTabChange = (value) => {
        //Refresh Tables
        if(value===0){
            this.getCostumes();
        }
        else if(value===1){
            this.getAccessories();
        }
        else if(value===2){
            this.get_uses();
        }
        else if(value===3){
            this.get_theatrical_plays();
        }
        this.setState({
          current_tab: value
        });
      };


    handleAddCostume= () => {
        this.setState({
          isCostumeDialogOpen: true,
        });
    };

    handleAddUse = () => {
        this.setState({
            isUseDialogOpen: true,
        })
    }

    handleAddTP = () => {
        this.setState({
            isTPDialogOpen: true,
        })
    }

    handleAddAccessory = () => {
        this.setState({
            isAccessoryDialogOpen: true,
        })
    }

    handleCostumeEditing(index){
        for(var i=0; i < this.state.costume_data.length; i++){
            if(this.state.costume_data[i].costume_id === index){
                //axios.get('http://88.197.53.80/kostoumart-api/costumes/'+index)
                axios.get("http://localhost:8108/costumes/"+index)
                .then(res => {
                    const costume = res.data.response;
                    this.setState({ costume: costume, editing: true,
                        isCostumeDialogOpen: true,});
                }
                )
            }
        }
    }

    handleUseEditing (index) {
        this.setState({
            editing: true,
            isUseDialogOpen: true,
        });
        for(var i=0; i<this.state.use_data.length; i++){
            if(this.state.use_data[i].useID === index){
                this.state.use = this.state.use_data[i];
            }
        }
    }

    handleTPEditing (index) {
        this.setState({
            editing: true,
            isTPDialogOpen: true,
        });
        for(var i=0; i<this.state.tp_data.length; i++){
            if(this.state.tp_data[i].theatrical_play_id === index){
                this.state.tp = this.state.tp_data[i];
            }
        }
    }

    handleAccessoryEditing(index){
        for(var i=0; i < this.state.accessories.length; i++){
            if(this.state.accessories[i].accessory_id === index){
                //axios.get('http://88.197.53.80/kostoumart-api/accessories/'+index)
                axios.get("http://localhost:8108/accessories/"+index)
                .then(res => {
                    const accessory = res.data.response;
                    this.setState({ accessory: accessory, editing: true,
                        isAccessoryDialogOpen: true,});
                }
                )
            }
        }
    }

    handleCostumeDelete(index){
        //axios.delete("http://88.197.53.80/kostoumart-api/costumes/", {params: { name: index }})
        axios.delete("http://localhost:8108/costumes/", {params: { name: index }})
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getCostumes();
                return ret;
            }
        })
    }

    handleTPDelete(index){
        //axios.delete("http://88.197.53.80/kostoumart-api/tps/", {params: { id: index }})
        axios.delete("http://localhost:8108/tps/", {params: { id: index }})
            .then(res=> {
                if(res.statusText ==="OK"){
                    let ret=this.createNotification("delete-success");
                    this.getCostumes();
                    this.get_theatrical_plays();
                    return ret;
                }
            })
    }

    handleUseDelete(index){
        //axios.delete("http://88.197.53.80/kostoumart-api/uses/",{params: { id: index }})
        axios.delete("http://localhost:8108/uses/",{params: { id: index }} )
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getCostumes();
                this.get_uses();
                return ret;
            }
        })
    }

    handleAccessoryDelete(index){
        //axios.delete("http://88.197.53.80/kostoumart-api/accessory/",{params: { id: index }})
        axios.delete("http://localhost:8108/accessory/",{params: { id: index }} )
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getAccessories();
                return ret;
            }
        })
    }

    handleConfirmationForDelete(index){
        console.log("Index", index);
        //Check if this index is a foreign key in costumes' list before delete
        if(this.state.current_tab===2){
            for(var i=0; i<this.state.costume_data.length; i++){
                if(this.state.costume_data[i].useID){
                    if(this.state.costume_data[i].useID===index){
                    this.handleOpenConfirmationDialog(index);
                    return;
                    }
                }
            }
            this.handleUseDelete(index);
        }
        else if(this.state.current_tab===3){
            for(var i=0; i<this.state.costume_data.length; i++){
                if(this.state.costume_data[i].theatrical_play_id){
                    if(this.state.costume_data[i].theatrical_play_id===index){
                    this.handleOpenConfirmationDialog(index);
                    return;
                    }
                }
            }
            this.handleTPDelete(index);
        }
        
    }

    renderTableCostumesData() {
        return this.state.current_costumes.map((costume, index) => {
            const { costume_id, use_name, costume_name, date, description, sex, material, technique, location, designer, tp_title, actors, parts } = costume //destructuring
            return (
                <TableRow key={costume_id}>
                    <TableCell>
                        <svg id="Rectangle_10">
                            <rect fill="rgba(0,0,0,0)" stroke="rgba(119,119,119,1)" stroke-width="0.7658530473709106px" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" shape-rendering="auto" id="Rectangle_10" rx="0" ry="0" x="0" y="0" width="175.926" height="161.279">
                            </rect>
                        </svg>
                    </TableCell>
                <TableCell >{costume_name}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>{use_name}</TableCell>
                <TableCell>{material}</TableCell>
                <TableCell>{technique}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{designer}</TableCell>
                <TableCell>{tp_title}</TableCell>
                <TableCell>{parts}</TableCell>
                <TableCell>{actors}</TableCell>
                <TableCell>
                    <IconButton><DeleteIcon onClick={()=>{this.handleCostumeDelete(costume_name);}}></DeleteIcon> </IconButton>
                    <IconButton><EditIcon onClick={() => this.handleCostumeEditing(costume_id)}/></IconButton></TableCell>
                </TableRow>
            )
        })
    }

    renderTableUsesData() {
        return this.state.use_data.map((use, index) => {
            const { useID, name, use_category,description, customs } = use //destructuring
            return (
                <TableRow key={useID}>
                    <TableCell>
                        {name}
                   </TableCell>
                    <TableCell>
                        {use_category}
                    </TableCell>
                    <TableCell>
                        {description}
                    </TableCell>
                    <TableCell>
                        {customs}
                    </TableCell>
                    <TableCell>
                        <IconButton><DeleteIcon onClick={()=>{this.handleConfirmationForDelete(useID);}}></DeleteIcon></IconButton>
                    <IconButton><EditIcon onClick={() => {this.handleUseEditing(useID);}}/></IconButton>
                    </TableCell>
                </TableRow>
            )
        })
    }

    renderTableTPsData() {
        return this.state.tp_data.map((tp, index) => {
            const { theatrical_play_id, title, date, actors, director, theater } = tp //destructuring
            return (
                <TableRow key={theatrical_play_id}>
                <TableCell>{title}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell >{actors}</TableCell>
                <TableCell>{director}</TableCell>
                <TableCell>{theater}</TableCell>
                <TableCell>
                    <IconButton><DeleteIcon onClick={()=>{this.handleConfirmationForDelete(theatrical_play_id);}}></DeleteIcon></IconButton>
                    <IconButton><EditIcon onClick={() => this.handleTPEditing(theatrical_play_id)}/></IconButton>
                </TableCell>
                </TableRow>
            )
        })
    }

    renderTableAccessoriesData() {
        return this.state.accessories.map((accessory, index) => {
            const {accessory_id, name, description, date, sex, material, technique, location, designer, parts, actors, costume_name, use_name, user} = accessory;
            return (
                <TableRow key={accessory_id}>
                <TableCell>{name}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{costume_name}</TableCell>
                <TableCell >{date}</TableCell>
                <TableCell>{use_name}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>{material}</TableCell>
                <TableCell>{technique}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{designer}</TableCell>
                <TableCell>{parts}</TableCell>
                <TableCell>{actors}</TableCell>
                <TableCell>
                    <IconButton><DeleteIcon onClick={()=>{this.handleConfirmationForDelete(accessory_id);}}></DeleteIcon></IconButton>
                    <IconButton><EditIcon onClick={() => this.handleTPEditing(accessory_id)}/></IconButton>
                </TableCell>
                </TableRow>
            )
        })
    }

    applyCostumeFilters = () => {
        if(!this.state.current_costumes){
            this.setState({
                current_costumes: this.state.costume_data
            })
        }
        var currentCostumeArray;
        if(this.state.techniqueOption){
            currentCostumeArray = this.state.costume_data.filter((costume)=>{
                return costume.technique === this.state.techniqueOption;
            })
        }
        if(this.state.sexOption){
            currentCostumeArray = this.state.costume_data.filter((costume)=>{
                return costume.sex.includes(this.state.sexOption);
                
            })
        }
        console.log(currentCostumeArray);
        if(currentCostumeArray){
            this.setState({
                current_costumes: currentCostumeArray
            })
        }
    }

    resetCostumeFilters = () => {
        this.setState({
            current_costumes: this.state.costume_data,
            useCategoryOption: '',
            techniqueOption: '',
            sexOption: '',
        })
    }

    render() {
        console.log("State", this.state)

        const { column, use_data, direction } = this.state

        if (this.state.redirectToReferrer) {
            return <Redirect to="/auth" />
        }

        const {filterDrawerOpen, useCategoryOption, techniqueOption, sexOption} = this.state;
        const {columnToSort, sortDirection} = this.state;

        return (
            <React.Fragment>
                <NotificationContainer/>
                <Header 
                    name={this.state.appName}
                    email={this.state.user.email}
                    logOut={this.logOut.bind(this)}>
                </Header>
               
                <div>
                    <IconButton onClick={this.handleDrawerOpen}></IconButton>
                        <Drawer
                            variant="persistent"
                            anchor="left"
                            open={filterDrawerOpen}
                        >
                            <div>
                                <IconButton onClick={this.handleDrawerClose}>
                                    {this.state.filterDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </div>
                            <Divider/>
                            <p>Filters</p>
                            <Divider/>
                            <br/>
                            <InputLabel>Τεχνική</InputLabel>
                                <Select
                                    className="SelectContainer"
                                    required={true}
                                    onChange={this.handleTechniqueSelect}
                                    value={techniqueOption}
                                    >
                                        {techniques.map( technique => (
                                            <MenuItem key={technique.label} value={technique.label}>
                                                {technique.label}
                                            </MenuItem>
                                        ))} 
                                </Select>
                            <br/>
                            <Divider/>
                            <br/>
                            <InputLabel>Φύλο</InputLabel>
                                <Select
                                    className="SelectContainer"
                                    required={true}
                                    onChange={this.handleSexSelect}
                                    value={sexOption}
                                    >
                                        {sexs.map( sex => (
                                            <MenuItem key={sex.label} value={sex.label}>
                                                {sex.label}
                                            </MenuItem>
                                        ))} 
                                </Select>
                            <br/><br/>
                            <Divider/>
                            <Button onClick={this.applyCostumeFilters}>Eφαρμογή</Button>                            
                            <Button onClick={this.resetCostumeFilters}>Επαναφορα</Button>
                        </Drawer>
                    <svg class="Ellipse_1">
                        <ellipse fill="rgba(255,222,23,1)" id="Ellipse_1" rx="29.06102180480957" ry="29.06102180480957" cx="29.06102180480957" cy="29.06102180480957">
		                </ellipse>
	                </svg>
                    <svg class="Ellipse_2">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_2" rx="2.6867401599884033" ry="2.6867401599884033" cx="2.6867401599884033" cy="2.6867401599884033">
                        </ellipse>
                    </svg>
                    <svg class="Ellipse_3">
                        <ellipse fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Ellipse_3" rx="2.6867401599884033" ry="2.6867401599884033" cx="2.6867401599884033" cy="2.6867401599884033">
                        </ellipse>
                    </svg>
                    <svg class="Path_3" viewBox="2136.044 -1141.338 10.654 5.373">
                        <path fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_3" d="M 2144.010986328125 -1135.964965820312 C 2145.4951171875 -1135.964965820312 2146.697998046875 -1137.16796875 2146.697998046875 -1138.651000976562 C 2146.697998046875 -1140.135009765625 2145.4951171875 -1141.338012695312 2144.010986328125 -1141.338012695312 L 2138.73095703125 -1141.338012695312 C 2137.2470703125 -1141.338012695312 2136.0439453125 -1140.135009765625 2136.0439453125 -1138.651000976562 C 2136.0439453125 -1137.16796875 2137.2470703125 -1135.964965820312 2138.73095703125 -1135.964965820312 L 2144.010986328125 -1135.964965820312 Z">
                        </path>
                    </svg>
                    <svg class="Path_4" viewBox="2117.19 -1157.051 10.654 5.374">
                        <path fill="rgba(0,0,0,0)" stroke="rgba(88,89,91,1)" stroke-width="0.5398867130279541px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Path_4" d="M 2119.876953125 -1151.677001953125 C 2118.39306640625 -1151.677001953125 2117.18994140625 -1152.880004882812 2117.18994140625 -1154.364013671875 C 2117.18994140625 -1155.848022460938 2118.39306640625 -1157.051025390625 2119.876953125 -1157.051025390625 L 2125.156982421875 -1157.051025390625 C 2126.64111328125 -1157.051025390625 2127.843994140625 -1155.848022460938 2127.843994140625 -1154.364013671875 C 2127.843994140625 -1152.880004882812 2126.64111328125 -1151.677001953125 2125.156982421875 -1151.677001953125 L 2119.876953125 -1151.677001953125 Z">
                        </path>
                    </svg>
                    <svg class="Rectangle_8">
                        <rect fill="rgba(255,222,23,1)" id="Rectangle_8" rx="0" ry="0" x="0" y="0" width="21.327" height="411.419">
                        </rect>
                    </svg>
                    <div id="FILTERS">
                        <span>FILTERS</span>
                    </div>
                    <div id="Tailoring_Times">
                        <span>Tailoring Times</span>
                    </div>
                    <div id="costumART">
                        <span>costumART</span>
                    </div>
                </div>
                
                <Tabs 
                selectedIndex={this.state.current_tab}
                onSelect={this.handleTabChange}
                >
                    <Tab>
                    {this.state.current_tab===0?
                     
                     <div>
                         <svg class="Rectangle_5">
                             <rect fill="rgba(242,242,242,1)" id="Rectangle_5" rx="0" ry="0" x="0" y="0" width="208.184" height="82.721">
                             </rect>
                         </svg>
                         <div id="_________-selected">
                             <span>Κουστούμι</span>
                         </div>
                         <svg class="Rectangle_7">
                             <rect fill="rgba(255,222,23,1)" id="Rectangle_7" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535"></rect>
                         </svg>
                         </div>          
                        :
                        <div id="_________">
                            <span>Κουστούμι</span>
                        </div>         
                    }
                    </Tab>
                    
                        <Tab>
                            {this.state.current_tab===1?
                                <div id="_____-selected">
                                    <span>Συνοδευτικό</span>
                                </div>
                                :
                                <div id="_____">
                                    <span>Συνοδευτικό</span>
                                </div>
                            }
                            
                        </Tab>
                        <Tab className="__________________-selected">
                            {this.state.current_tab===2?
                                <div id="__________________-selected">
                                    <span>Χρήση</span>
                                </div>
                                :
                                <div id="__________________">
                                    <span>Χρήση</span>
                                </div>
                            }
                            
                        </Tab>
                        {/*<Tab>
                            {this.state.current_tab===2?
                                <div id="__________________-selected">
                                    <span>Θεατρική παράσταση</span>
                                </div>
                                :
                                <div id="__________________">
                                    <span>Θεατρική παράσταση</span>
                                </div>
                            }
                            
                        </Tab>*/}
                   
                </Tabs>
                
                <div>
                {this.state.current_tab===0 &&
                    <div id="Table">
                        <Table>
                            <TableHead >
                                <TableRow className="_______bt">
                                    <TableCell 
                                    
                                    sorted={null}>
                                        <span><strong>EIKONA</strong></span>
                                    </TableCell>
                                    <TableCell
                                    
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}>
                                    <strong>Τίτλος</strong> 
                                    </TableCell>
                                    <TableCell
                                    sorted={column === 'descr' ? direction : null}
                                    onClick={this.handleSort('descr')}><strong>Περιγραφή</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><strong>Εποχή</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><strong>Φύλο</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><strong>Χρήση</strong></TableCell>
                                    <TableCell sorted={column === 'material' ? direction : null}
                                    onClick={this.handleSort('material')}><strong>Υλικό κατασκευής</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><strong>Τεχνική Κατασκευής</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><strong>Περιοχή Αναφοράς</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><strong>Σχεδιαστής</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'tp_title' ? direction : null}
                                    onClick={this.handleSort('tp_title')}><strong>Θεατρικές Παραστάσεις</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'parts' ? direction : null}
                                    onClick={this.handleSort('parts')}><strong>Ρόλος</strong></TableCell>
                                    <TableCell
                                    sorted={column === 'actors' ? direction : null}
                                    onClick={this.handleSort('actors')}><strong>Ηθοποιοί</strong></TableCell>
                                    <TableCell></TableCell>
                                    </TableRow> 
                                </TableHead>
                                <TableBody>
                                    {this.renderTableCostumesData()} 
                                </TableBody>
                            </Table>
                            <IconButton><AddIcon onClick={() => this.handleAddCostume()}></AddIcon></IconButton>
                            <CostumeForm 
                                isOpen={this.state.isCostumeDialogOpen}
                                handleClose={this.handleCloseDialog.bind(this)}
                                user={this.state.user.user_id}
                                costumes={this.state.costume_data}
                                uses={this.state.use_data}
                                theatrical_plays={this.state.tp_data}
                                costume={this.state.costume}
                                editing={this.state.editing}></CostumeForm>
                        </div>
                    }
                {this.state.current_tab===1 &&
                    <div  id="_______bt">
                        <Table>
                            <TableHead>    
                                <TableRow>
                                        <TableCell><strong>Όνομα</strong></TableCell>
                                        <TableCell><strong>Περιγραφή</strong></TableCell>
                                        <TableCell><strong>Κοστούμι</strong></TableCell>
                                        <TableCell><strong>Εποχή</strong></TableCell>
                                        <TableCell><strong>Χρήση</strong></TableCell>
                                        <TableCell><strong>Φύλο</strong></TableCell>
                                        <TableCell><strong>Ύλικο</strong></TableCell>
                                        <TableCell><strong>Τεχνική</strong></TableCell>
                                        <TableCell><strong>Περιοχή Αναφοράς</strong></TableCell>
                                        <TableCell><strong>Σχεδιαστής</strong></TableCell>
                                        <TableCell><strong>Ρόλοι</strong></TableCell>
                                        <TableCell><strong>Ηθοποιοί</strong></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{this.renderTableAccessoriesData()} </TableBody>
                        </Table>
                        <IconButton><AddIcon onClick={() => this.handleAddAccessory()}></AddIcon></IconButton>
                            <AccessoryForm
                                isOpen={this.state.isAccessoryDialogOpen}
                                handleClose={this.handleCloseDialog.bind(this)}
                                user={this.state.user.user_id}
                                accessories={this.state.accessories}
                                editing={this.state.editing}
                                accessory={this.state.accessory}
                                uses={this.state.use_data}
                                costumes={this.state.costume_data}
                        />
                    </div>
                    }
                {this.state.current_tab===2 &&
                        <div id="_______bt">
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell
                                sorted={column === 'name' ? direction : null}
                                onClick={this.handleSort('name')}>
                                <strong>Όνομα</strong> 
                                </TableCell>
                                <TableCell
                                sorted={column === 'use_category' ? direction : null}
                                onClick={this.handleSort('use_category')}>
                                <strong>Κατηγορία Χρήσης</strong></TableCell>
                                <TableCell
                                sorted={column === 'description' ? direction : null}
                                onClick={this.handleSort('description')}>
                                <strong>Περιγραφή</strong></TableCell>
                                <TableCell
                                sorted={column === 'customs' ? direction : null}
                                onClick={this.handleSort('customs')}>
                                <strong>Έθιμα</strong>
                                </TableCell>
                                <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{this.renderTableUsesData()}</TableBody>
                        </Table>
                        <IconButton><AddIcon onClick={() => this.handleAddUse()}></AddIcon></IconButton>
                        <UseForm 
                                isOpen={this.state.isUseDialogOpen}
                                handleClose={this.handleCloseDialog.bind(this)}
                                user={this.state.user.user_id}
                                costumes={this.state.costume_data}
                                uses={this.state.use_data}
                                theatrical_plays={this.state.tp_data}
                                editing={this.state.editing}
                                use={this.state.use}></UseForm>
                        </div>
                    }
                {this.state.current_tab===3 &&
                        <div id="_______bt">
                            <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sorted={column === 'title' ? direction : null}
                                    onClick={this.handleSort('title')}><strong>Όνομα Παράστασης</strong></TableCell>
                                    <TableCell><strong>Χρονολογία</strong></TableCell>
                                    <TableCell><strong>Ηθοποιοί</strong></TableCell>
                                    <TableCell><strong>Σκηνοθέτης</strong></TableCell>
                                    <TableCell><strong>Θέατρο</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{this.renderTableTPsData()} </TableBody>
                            </Table>
                            <IconButton><AddIcon onClick={() => this.handleAddTP()}></AddIcon></IconButton>
                            <TpForm
                                isOpen={this.state.isTPDialogOpen}
                                handleClose={this.handleCloseDialog.bind(this)}
                                user={this.state.user.user_id}
                                theatrical_plays={this.state.tp_data}
                                editing={this.state.editing}
                                tp={this.state.tp}
                                />
                        </div>
                }

                    
                    <ConfirmationDialog 
                    isOpen={this.state.isConfirmationDialogOpen}
                    index = {this.state.index}
                    handleClose={this.handleCloseConfirmationDialog.bind(this)}
                    handleOk={this.handleOk.bind(this)}></ConfirmationDialog>
            

               
                </div>
              
            </React.Fragment>
          );
    
    }
}

export default Dashboard;