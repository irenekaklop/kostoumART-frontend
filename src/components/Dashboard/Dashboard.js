import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import { Paper, Button, TextField, Drawer, Divider, MenuItem, InputLabel, Select} from '@material-ui/core';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from 'axios';
import CostumeForm from '../Forms/CostumeForm.js';
import AccessoryForm from '../Forms/AccessoryForm.js';
import UseForm from '../Forms/UseForm.js';
import TpForm from '../Forms/TpForm.js';
import ConfirmationDialog from '../Dashboard/ConfirmationDialog.js';

import "../Dashboard/Dashboard.css"

import jwt_decode from 'jwt-decode';
import { use_categories, techniques, sexs, materials } from '../../utils/options.js';

import _ from 'lodash'

import Header from '../Shared/Header.js';
import Footer from '../Shared/Footer.js';
import {EditButton, DeleteButton, FilterButtons} from '../Shared/Buttons.js'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Sidebar from 'react-sidebar';
import SidebarContent from '../Filters/SidebarContent.js'

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
            isCostumeFormOpen: false,
            isUseFormOpen: false,
            isTPFormOpen: false,
            isConfirmationDialogOpen: false,
            isAccessoryFormOpen: false,
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
            filters: '',
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
        this.handleCostumeEditing = this.handleCostumeEditing.bind(this)
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
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
            this.getAccessories(decoded);
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
            axios.get("http://localhost:8108/costumes", {params: {user: decoded.role}})
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
            //axios.get('http://88.197.53.80/kostoumart-api/costumes/',{params: {user: this.state.user.role}})
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

    /*Get theatrical Plays from database*/
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

    getAccessories = (decoded) => {
        if(decoded){
            //axios.get("http://88.197.53.80/kostoumart-api/accessories", {params: {user: decoded.role}})
            axios.get("http://localhost:8108/accessories", {params: {user: decoded.role}})
            .then(res => {
                const accessories = res.data.response;
                this.setState({ accessories });
                console.log(this.state);
            }
            )
        }
        else{
            //axios.get("http://88.197.53.80/kostoumart-api/accessories", {params: {user: this.state.user.role}})
            axios.get("http://localhost:8108/accessories", {params: {user: this.state.user.role}})
            .then(res => {
            const accessories = res.data.response;
            this.setState({ accessories });
            console.log(this.state);
            })
        }
       
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
    
    handleFilterSubmit = (filters) => {
        console.log("Handle Filters", filters[0])
        this.setState({
            filterDrawerOpen: false
        })
    }
    
    handleCloseDialog = () => {
        if(this.state.editing){
            this.setState({ editing: false });
        }
        if(this.state.isCostumeFormOpen){
            this.getCostumes();
            this.setState({isCostumeFormOpen: false});}
        else if(this.state.isUseFormOpen){
            this.get_uses();
            this.setState({isUseFormOpen: false});
        }
        else if(this.state.isTPFormOpen){
            this.get_theatrical_plays();
            this.setState({isTPFormOpen: false});
        }
        else if(this.state.isAccessoryFormOpen){
            this.getAccessories();
            this.setState({isAccessoryFormOpen: false})
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
        else if(this.state.current_tab===1){
            this.handleAccessoryDelete(index);
        }
        else if(this.state.current_tab===2){
            this.handleUseDelete(index);
        }
        else if(this.state.current_tab===3){
            this.handleTPDelete(index);
        }
    }

    handleTabChange = (value) => {
        //If screen is on a Form close it.
        if(this.state.isCostumeFormOpen || this.state.isUseFormOpen || this.state.isTPFormOpen || this.state.isAccessoryFormOpen){
            this.handleCloseDialog();
        }
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
            isCostumeFormOpen: true,
        })
        console.log("HandleAddcostume")
    };

    handleAddUse = () => {
        this.setState({
            isUseFormOpen: true,
        })
    }

    handleAddTP = () => {
        this.setState({
            isTPFormOpen: true,
        })
    }

    handleAddAccessory = () => {
        this.setState({
            isAccessoryFormOpen: true,
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
                        isCostumeFormOpen: true,});
                }
                )
            }
        }
    }

    handleUseEditing (index) {
        this.setState({
            editing: true,
            isUseFormOpen: true,
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
            isTPFormOpen: true,
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
                        isAccessoryFormOpen: true,});
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
            const { costume_id, use_name, costume_name, date, description, sex, material, technique, location, designer, tp_title, actors, parts } = costume //desthucturing
            for (var element in costume){
                if (!element || element===''){
                    element='/t';
                }}
            
            return (
                <tr className="TableRow" key={costume_id}>
                    <td>
	                   <img id="Image" src={require("../../styles/images/Rectangle_20.png")}/>  
                    </td>
                <td >{costume_name}</td>
                <td>{description}</td>
                <td>{date}</td>
                <td>{sex}</td>
                <td>{use_name}</td>
                <td>{material}</td>
                <td>{technique}</td>
                <td>{location}</td>
                <td>{designer}</td>
                <td>{tp_title}</td>
                <td>{parts}</td>
                <td>{actors}</td>
                <td className="td_actions">
                    <div onClick={() => this.handleCostumeEditing(costume_id)}><EditButton/></div>
                    <br/>
                    <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                        </path>
                    </svg>
                    <div onClick={()=> this.handleCostumeDelete(costume_name)}><DeleteButton/></div>
                </td>
                </tr>
            )
        })
    }

    renderTableUsesData() {
        return this.state.use_data.map((use, index) => {
            const { useID, name, use_category,description, customs } = use //desthucturing
            return (
                <tr key={useID}>
                    <td>
                        {name}
                   </td>
                    <td>
                        {use_category}
                    </td>
                    <td>
                        {description}
                    </td>
                    <td>
                        {customs}
                    </td>
                    <td className="td_actions">
                        <div onClick={() => {this.handleUseEditing(useID);}}><EditButton/></div>
                        <br/>
                        <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                            <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                            </path>
                        </svg>
                        <div onClick={()=>{this.handleConfirmationForDelete(useID);}}><DeleteButton/></div>
                    </td>
                </tr>
            )
        })
    }

    renderTableTPsData() {
        return this.state.tp_data.map((tp, index) => {
            const { theatrical_play_id, title, date, actors, director, theater } = tp //desthucturing
            return (
                <tr key={theatrical_play_id}>
                <td>{title}</td>
                <td>{date}</td>
                <td >{actors}</td>
                <td>{director}</td>
                <td>{theater}</td>
                <td className="td_actions">
                    <div onClick={() => this.handleTPEditing(theatrical_play_id)}><EditButton/></div>
                    <br/>
                    <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                        </path>
                    </svg>
                    <div onClick={()=>{this.handleConfirmationForDelete(theatrical_play_id);}}><DeleteButton/></div>
                </td>
                </tr>
            )
        })
    }

    renderTableAccessoriesData() {
        return this.state.accessories.map((accessory, index) => {
            const {accessory_id, name, description, date, sex, material, technique, location, designer, parts, actors, costume_name, use_name, user} = accessory;
            return (
                <tr key={accessory_id}>
                <td>{name}</td>
                <td>{description}</td>
                <td>{use_name}</td>
                <td>{costume_name}</td>
                <td>{date}</td>
                <td>{technique}</td>
                <td>{sex}</td>
                <td>{designer}</td>
                <td>{location}</td>
                <td>{actors}</td>
                <td className="td_actions">
                    <div onClick={() => this.handleAccessoryEditing(accessory_id)}><EditButton/></div>
                    <br/>
                    <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                        </path>
                    </svg>
                    <div onClick={()=>{this.handleAccessoryDelete(accessory_id);}}><DeleteButton/></div>
                </td>
                </tr>
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
                <svg class="Rectangle_1">
                    <rect fill="rgba(242,242,242,1)" id="Rectangle_1" rx="0" ry="0" x="0" y="0" width="1843.697" height="1041.044">
                    </rect>
                </svg>
                <img id="Background" src={require('../../styles/images/Background.png')} srcset="Background.png 1x, Background@2x.png 2x"></img>
                <NotificationContainer/>
                <Header 
                    name={this.state.appName}
                    email={this.state.user.email}
                    logOut={this.logOut.bind(this)}>
                </Header>
                {/*Filters and right sidebar*/}
                <div onClick={this.handleDrawerOpen}>
                    <FilterButtons/>
                </div>
                <Sidebar
                rootClassName="FiltersSidebarRoot"
                sidebarClassName="FiltersSidebar"
                overlayClassName = "Overlay"
                sidebar={<SidebarContent
                    handleFilterSubmit = {this.handleFilterSubmit.bind(this)}
                    handleDrawerClose = {this.handleDrawerClose.bind(this)}
                    open={this.state.filterDrawerOpen}/>}
                open={this.state.filterDrawerOpen}
                onSetOpen={this.handleDrawerOpen}
                
                />
                <svg class="Rectangle_8">
                    <rect fill="rgba(255,222,23,1)" id="Rectangle_8" rx="0" ry="0" x="0" y="0" width="21.327" height="411.419">
                    </rect>
                </svg>
                <div id="Tailoring_Times">
                    <span>Tailoring Times</span>
                </div>
                <div id="costumART-Dashboard">
                    <span>costumART</span>
                </div>
                

                {/*Tabs*/}
                <Tabs 
                className="react-tabs__tab-list"
                selectedIndex={this.state.current_tab}
                onSelect={this.handleTabChange}
                >
                    <Tab>
                        {this.state.current_tab===0?
                            <div className="react-tabs__tab--selected">
                            <span>  Κοστούμι</span>
                            <br></br>
                            <svg class="UnderlineTabTitle">
                                <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                </rect>
                            </svg>
                            </div>
                        :
                            <div className="react-tabs__tab">
                            <span>Κοστούμι</span>
                            </div>
                        }
                        
                        
                    </Tab>
                    <Tab>
                        {this.state.current_tab===1?
                            <div className="react-tabs__tab--selected">
                            <span>Συνοδευτικό</span>
                            <br></br>
                            <svg class="UnderlineTabTitle">
                                <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                </rect>
                            </svg>
                            </div>
                        :
                            <div className="react-tabs__tab">
                            <span>Συνοδευτικό</span>
                            </div>
                        }
                    </Tab>
                    <Tab>
                        {this.state.current_tab===2?
                            <div className="react-tabs__tab--selected">
                            <span>Χρήση</span>
                            <br></br>
                            <svg class="UnderlineTabTitle">
                                <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                </rect>
                            </svg>
                            </div>
                        :
                            <div className="react-tabs__tab">
                            <span>Χρήση</span>
                            </div>
                        }
                    
                    </Tab>
                    <Tab>
                        {this.state.current_tab===3?
                            <div className="react-tabs__tab--selected">
                                <span>Θεατρική παράσταση</span>
                                <br></br>
                                <svg class="UnderlineTabTitle">
                                    <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                    </rect>
                                </svg>
                            </div>
                                :
                            <div className="react-tabs__tab">
                                <span>Θεατρική παράσταση</span>
                            </div>
                        }    
                    </Tab>                   
                </Tabs>

                {/*Tab panels*/}
                <div>
                {this.state.current_tab===0 && !this.state.isCostumeFormOpen &&
                    <div>
                        <table className="Table">
                            <thead className="TableHead">
                                <tr>
                                    <th
                                    id="ColumnImageCostume"
                                    sorted={null}>
                                        <span><sthong>EIKONA</sthong></span>
                                    </th>
                                    <th
                                    id="ColumnNameCostume"
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}>
                                    <sthong>ΤΙΤΛΟΣ</sthong> 
                                    </th>
                                    <th
                                    id="ColumnDescrCostume"
                                    sorted={column === 'descr' ? direction : null}
                                    onClick={this.handleSort('descr')}><sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                    <th
                                    id="ColumnDateCostume"
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><sthong>ΕΠΟΧΗ</sthong></th>
                                    <th
                                    id="ColumnSexCostume"
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><sthong>ΦΥΛΟ</sthong></th>
                                    <th
                                    id="ColumnUseCostume"
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><sthong>ΧΡΗΣΗ</sthong></th>
                                    <th 
                                    id="ColumnMaterial"
                                    sorted={column === 'material' ? direction : null}
                                    onClick={this.handleSort('material')}><sthong>ΥΛΙΚΟ<br/>ΚΑΤΑΣΚΕΥΗΣ</sthong></th>
                                    <th
                                    id="ColumnTechnique"
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><sthong>ΤΕΧΝΙΚΗ</sthong></th>
                                    <th
                                    id="ColumnLocation"
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><sthong>ΠΕΡΙΟΧΗ</sthong></th>
                                    <th
                                    id="ColumnDesigner"
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><sthong>ΣΧΕΔΙΑΣΤΗΣ</sthong></th>
                                    <th
                                    id="ColumnTPCostume"
                                    sorted={column === 'tp_title' ? direction : null}
                                    onClick={this.handleSort('tp_title')}><sthong>ΘΕΑΤΡΙΚΕΣ <br/> ΠΑΡΑΣΤΑΣΕΙΣ</sthong></th>
                                    <th
                                    id="ColumnPartsCostume"
                                    sorted={column === 'parts' ? direction : null}
                                    onClick={this.handleSort('parts')}><sthong>ΡΟΛΟΣ</sthong></th>
                                    <th
                                    id="ColumnActors"
                                    sorted={column === 'actors' ? direction : null}
                                    onClick={this.handleSort('actors')}><sthong>ΗΘΟΠΟΙΟΙ</sthong></th>
                                    <th
                                    id="th_actions"></th>
                                    </tr> 
                                </thead>
                                <tbody className="TableBody">
                                    {this.renderTableCostumesData()} 
                                </tbody>
                            </table>
                            <svg class="PanelCurve" viewBox="2982.425 -216.026 162.096 25.428">
                                <path fill="rgba(255,255,255,1)" id="PanelCurve" d="M 3144.52099609375 -190.5980072021484 C 3144.52099609375 -204.6419982910156 3133.136962890625 -216.0260009765625 3119.093017578125 -216.0260009765625 L 3007.85400390625 -216.0260009765625 C 2993.81005859375 -216.0260009765625 2982.425048828125 -204.6419982910156 2982.425048828125 -190.5980072021484">
                                </path>
                            </svg>
                            <button className="ButtonAdd" onClick={()=>this.handleAddCostume()}>
                                <svg id="ButtonAddIcon">
                                    <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.7254922986030579px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" d="M 19.69155883789062 0 L 0 0">
                                    </path>
                                </svg>
                                <span id="ButtonAddText">προσθήκη</span>
                            </button>
                        </div>
                }
               
                {this.state.isCostumeFormOpen ?(
                    console.log("Form should be called"),
                    <CostumeForm
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    costumes={this.state.costume_data}
                    uses={this.state.use_data}
                    theatrical_plays={this.state.tp_data}
                    costume={this.state.costume}
                    editing={this.state.editing}></CostumeForm>)
                    :
                    <div></div>
                }

                {this.state.isAccessoryFormOpen ?(    
                    <AccessoryForm
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    accessories={this.state.accessories}
                    editing={this.state.editing}
                    accessory={this.state.accessory}
                    uses={this.state.use_data}
                    costumes={this.state.costume_data}
                    theatrical_plays={this.state.tp_data}
                    />)
                    :
                    <div></div>
                }
                {this.state.current_tab===1 && !this.state.isAccessoryFormOpen&&
                    <div>
                        <table className="Table">
                            <thead className="TableHead">    
                                <tr>
                                    <th><sthong>ONOMA</sthong></th>
                                    <th><sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                    <th><sthong>ΧΡΗΣΗ</sthong></th>
                                    <th><sthong>ΚΟΣΤΟΥΜΙ</sthong></th>
                                    <th><sthong>XΡΟΝΟΛΟΓΙΑ</sthong></th>
                                    <th><sthong>ΤΕΧΝΙΚΗ</sthong></th>
                                    <th><sthong>ΦΥΛΟ</sthong></th>
                                    <th><sthong>ΣΧΕΔΙΑΣΤΗΣ</sthong></th>
                                    <th><sthong>ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</sthong></th>
                                    <th><sthong>ΗΘΟΠΟΙΟΙ</sthong></th>
                                    <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="TableBody">{this.renderTableAccessoriesData()} </tbody>
                        </table>
                                               
                        <svg class="PanelCurve" viewBox="2982.425 -216.026 162.096 25.428">
                            <path fill="rgba(255,255,255,1)" id="PanelCurve" d="M 3144.52099609375 -190.5980072021484 C 3144.52099609375 -204.6419982910156 3133.136962890625 -216.0260009765625 3119.093017578125 -216.0260009765625 L 3007.85400390625 -216.0260009765625 C 2993.81005859375 -216.0260009765625 2982.425048828125 -204.6419982910156 2982.425048828125 -190.5980072021484">
                            </path>
                        </svg>
                        <button className="ButtonAdd" onClick={() => this.handleAddAccessory()}>
                                <svg id="ButtonAddIcon">
                                    <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.7254922986030579px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" d="M 19.69155883789062 0 L 0 0">
                                    </path>
                                </svg>
                                <span id="ButtonAddText">προσθήκη</span>
                            </button>
                    </div>
                }
                {this.state.isUseFormOpen ? (
                    <UseForm 
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    costumes={this.state.costume_data}
                    uses={this.state.use_data}
                    theatrical_plays={this.state.tp_data}
                    editing={this.state.editing}
                    use={this.state.use}></UseForm>
                )
                :
                <div></div>}
                {this.state.current_tab===2 && !this.state.isUseFormOpen &&
                        <div>
                            <table className="Table">
                            <thead className="TableHead">
                                <tr>
                                <th
                                sorted={column === 'name' ? direction : null}
                                onClick={this.handleSort('name')}>
                                <sthong>ΟΝΟΜΑ</sthong> 
                                </th>
                                <th
                                sorted={column === 'use_category' ? direction : null}
                                onClick={this.handleSort('use_category')}>
                                <sthong>ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ</sthong></th>
                                <th
                                sorted={column === 'description' ? direction : null}
                                onClick={this.handleSort('description')}>
                                <sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                <th
                                sorted={column === 'customs' ? direction : null}
                                onClick={this.handleSort('customs')}>
                                <sthong>ΕΘΙΜΑ</sthong>
                                </th>
                                <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="TableBody">{this.renderTableUsesData()}</tbody>
                        </table>
                        <svg class="PanelCurve" viewBox="2982.425 -216.026 162.096 25.428">
                                <path fill="rgba(255,255,255,1)" id="PanelCurve" d="M 3144.52099609375 -190.5980072021484 C 3144.52099609375 -204.6419982910156 3133.136962890625 -216.0260009765625 3119.093017578125 -216.0260009765625 L 3007.85400390625 -216.0260009765625 C 2993.81005859375 -216.0260009765625 2982.425048828125 -204.6419982910156 2982.425048828125 -190.5980072021484">
                                </path>
                        </svg>
                        <button className="ButtonAdd" onClick={() => this.handleAddUse()}>
                                <svg id="ButtonAddIcon">
                                    <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.7254922986030579px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" d="M 19.69155883789062 0 L 0 0">
                                    </path>
                                </svg>
                                <span id="ButtonAddText">προσθήκη</span>
                        </button>
                        
                        </div>
                }
                {this.state.isTPFormOpen ? (
                    <TpForm
                    isOpen={this.state.isTPFormOpen}
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    theatrical_plays={this.state.tp_data}
                    editing={this.state.editing}
                    tp={this.state.tp}
                    />
                )
                : <div></div>   }
                {this.state.current_tab===3 && !this.state.isTPFormOpen &&
                        <div>
                            <table className="Table">
                            <thead className="TableHead">
                                <tr>
                                    <th sorted={column === 'title' ? direction : null}
                                    onClick={this.handleSort('title')}><sthong>ΟΝΟΜΑ ΠΑΡΑΣΤΑΣΗΣ</sthong></th>
                                    <th sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><sthong>ΧΡΟΝΟΛΟΓΙΑ</sthong></th>
                                    <th sorted={column === 'actors' ? direction : null}
                                    onClick={this.handleSort('actors')}><sthong>ΗΘΟΠΟΙΟΙ</sthong></th>
                                    <th sorted={column === 'director' ? direction : null}
                                    onClick={this.handleSort('director')}><sthong>ΣΚΗΝΟΘΕΤΗΣ</sthong></th>
                                    <th
                                    sorted={column === 'theater' ? direction : null}
                                    onClick={this.handleSort('theater')}><sthong>ΘΕΑΤΡΟ</sthong></th>
                                    <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="TableBody">{this.renderTableTPsData()} </tbody>
                            </table>
                            <svg class="PanelCurve" viewBox="2982.425 -216.026 162.096 25.428">
                                <path fill="rgba(255,255,255,1)" id="PanelCurve" d="M 3144.52099609375 -190.5980072021484 C 3144.52099609375 -204.6419982910156 3133.136962890625 -216.0260009765625 3119.093017578125 -216.0260009765625 L 3007.85400390625 -216.0260009765625 C 2993.81005859375 -216.0260009765625 2982.425048828125 -204.6419982910156 2982.425048828125 -190.5980072021484">
                                </path>
                            </svg>
                            <button className="ButtonAdd" onClick={() => this.handleAddTP()}>
                                <svg id="ButtonAddIcon">
                                    <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="0.7254922986030579px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" d="M 19.69155883789062 0 L 0 0">
                                    </path>
                                </svg>
                                <span id="ButtonAddText">προσθήκη</span>
                            </button>
                        </div>
                }

                    
                <ConfirmationDialog 
                isOpen={this.state.isConfirmationDialogOpen}
                index = {this.state.index}
                handleClose={this.handleCloseConfirmationDialog.bind(this)}
                handleOk={this.handleOk.bind(this)}></ConfirmationDialog>
                           
                </div>

                {/*logout action*/}
                <div>
                    <svg class="Rectangle_9">
                        <rect fill="rgba(56,56,56,1)" id="Rectangle_9" rx="0" ry="0" x="0" y="0" width="378.633" height="112.152">
                        </rect>
                    </svg>
                        
                    <button id="LOGOUT_BUTTON" onClick={() => this.logOut()}>Logout</button>
            
                    <div id="USERNAME">
                        <span>USERNAME</span>
                    </div>
                    <div id="administrator_email">
                        <span>{this.state.user.email}</span>
                    </div>
                    <svg class="Line_5" viewBox="0 0 1 66.176">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="Line_5" d="M 0 0 L 0 66.17550659179688">
                        </path>
                    </svg>
                </div>
                
                <Footer/>
            </React.Fragment>
          );
    
    }
}

export default Dashboard;