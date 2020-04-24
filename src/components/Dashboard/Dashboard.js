import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from '../../utils/api-url.js'

import CostumeForm from '../Forms/CostumeForm.js';
import AccessoryForm from '../Forms/AccessoryForm.js';
import UseForm from '../Forms/UseForm.js';
import TpForm from '../Forms/TpForm.js';
import ConfirmationDialog from '../Dashboard/ConfirmationDialog.js';

import "../Dashboard/Dashboard.css"

import jwt_decode from 'jwt-decode';

import _ from 'lodash'

import Header from '../Shared/Header.js';
import Footer from '../Shared/Footer.js';
import {EditButton, DeleteButton, FilterButtons} from '../Shared/Buttons.js'
import { Tab, Tabs } from 'react-tabs';
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
            theatricalPlay: null,
            accessory: null,
            //Filters
            current_costumes: [],
            current_accessories: [],
            current_uses: [],
            current_tps: [],
            filterDrawerOpen: false,
            filters: '',
            //Confirmation Dialog answer
            index: null,
            dependency: false,
            user: {
                user_id: null,
                email: '',
                username: '',
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
        this.applyFilters = this.applyFilters.bind(this);
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
                username: decoded.username,
            } });
            this.get_uses();
            this.getTheatricalPlays();
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
    }

    handleTechniqueSelect = (evt) => {
        this.setState({ techniqueOption: evt.target.value});
    }

    handleSexSelect = (evt) => {
        this.setState({ sexOption: evt.target.value});
    }

    handleSort = (clickedColumn) => () => {
        const { column, use_data, current_costumes, current_accessories, tp_data, accessories, direction } = this.state
    
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
                        current_accessories: _.sortBy(current_accessories, [clickedColumn]),
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
                    current_accessories: current_accessories.reverse(),
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
            axios.instance.get('costumes', {params: {user: decoded.role}})
            .then(res => {
                if(res.statusText==='OK'){
                    const costume_data = res.data;
                    this.setState({ costume_data });
                    this.setState({
                        current_costumes: costume_data
                    })
                }
            }
            )
        }
        else{
            axios.instance.get("costumes", {params: {user: this.state.user.role}})
            .then(res => {
                if(res.statusText==='OK'){
                    const costume_data = res.data;
                    this.setState({ costume_data });
                    this.setState({
                        current_costumes: costume_data
                    })
                }
            }
            )
        }
       
    }

    /* Get uses from database*/ 
    get_uses = _ => {
        let self = this;
        axios.instance.get("uses")
        .then(res => {
            if(res.statusText==='OK'){
                const use_data = res.data;
                this.setState({ use_data });
            }
        }
        )
    }

    /*Get theatrical Plays from database*/
    getTheatricalPlays = _ => {
        axios.instance.get("theatricalPlays")
        .then(res => {
            if(res.statusText==='OK'){
                const tp_data = res.data;
                this.setState({ tp_data });
            }
        })
    }

    getAccessories = (decoded) => {
        if(decoded){
            axios.instance.get("accessories", {params: {user: decoded.role}})
            .then(res => {
                if(res.statusText==='OK'){
                    const accessories = res.data;
                    this.setState({ accessories });
                    this.setState({
                        current_accessories: accessories
                    })
                }
            }
            )
        }
        else{
            axios.instance.get("accessories", {params: {user: this.state.user.role}})
            .then(res => {
                if(res.statusText==='OK'){
                    const accessories = res.data;
                    this.setState({ accessories });
                    this.setState({
                        current_accessories: accessories
                    })
                }
            })
        }
       
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
        console.log("Handle Filters", filters)
        this.setState({
            filters: filters,
            filterDrawerOpen: false
        })
        this.applyFilters(filters);
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
            this.getTheatricalPlays();
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
            dependency: false,
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
        //Refresh Tables
        if(value===0){
            if(this.state.filters.length!==0){
                this.applyFilters();
            }
            else{
                this.getCostumes();
            }
        }
        else if(value===1){
            this.getAccessories();
        }
        else if(value===2){
            this.get_uses();
        }
        else if(value===3){
            this.getTheatricalPlays();
        }
        this.setState({
          current_tab: value
        });
      };


    handleAddCostume= () => {
        this.setState({
            isCostumeFormOpen: true,
        })
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
        axios.instance.get("costumes/"+index)
        .then(res => {
            const costume = res.data;
            this.setState({ costume: costume, editing: true, isCostumeFormOpen: true,});
        })
    }

    handleUseEditing (index) {
        axios.instance.get("uses/"+index)
        .then(res => {
            const use = res.data;
            this.setState({ use: use, editing: true, isUseFormOpen: true,});
        })
    }

    handleTPEditing (index) {
       axios.instance.get("theatricalPlays/"+index)
       .then(res => {
           const theatricalPlay = res.data;
           this.setState({ theatricalPlay: theatricalPlay, editing: true, isTPFormOpen: true,});
       })
    }

    handleAccessoryEditing(index){
        axios.instance.get("accessories/" + index)
        .then(res => {
            if(res.statusText==='OK'){
                const accessory = res.data;
                this.setState({ accessory: accessory, editing: true,
                    isAccessoryFormOpen: true,});
                }            
        })
    }

    handleCostumeDelete(index){
        axios.instance.delete("costumes/" + index)
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getCostumes();
                this.getAccessories();
                return ret;
            }
        })
    }

    handleTPDelete(index){
        axios.instance.delete("theatricalPlays/" + index)
            .then(res=> {
                if(res.statusText ==="OK"){
                    let ret=this.createNotification("delete-success");
                    this.getCostumes();
                    this.getTheatricalPlays();
                    return ret;
                }
            })
    }

    handleUseDelete(index){
        axios.instance.delete("uses/" + index )
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
        axios.instance.delete("accessories/" + index )
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getAccessories();
                return ret;
            }
        })
    }

    handleConfirmationForDelete(index){
        if(this.state.current_tab===0){
            axios.instance.get("dependencies/", {params: { index: index, column: 'costume' }} )
            .then(res=>{
                if (res.data.response[0].result===1) {
                    this.setState({dependency: true});
                }
                this.handleOpenConfirmationDialog(index);
            })
        }
        if(this.state.current_tab===1){
            this.handleOpenConfirmationDialog(index);
            this.setState({dependency: false});
        }
        //Check if this index is a foreign key in costumes' list before delete
        if(this.state.current_tab===2){
            axios.instance.get("dependencies/",{params: { index: index, column: 'use' }} )
            .then(res=>{
                if (res.data.response[0].result===1) {
                    this.setState({dependency: true});
                }
                this.handleOpenConfirmationDialog(index);
            })
        }
        else if(this.state.current_tab===3){
            axios.instance.get("dependencies/",{params: { index: index, column: 'theatrical_play' }} )
            .then(res=>{
                if (res.data.response[0].result===1) {
                    this.setState({dependency: true});
                }
                this.handleOpenConfirmationDialog(index);
            })
        }
        
    }

    renderTableCostumesData() {
        return this.state.current_costumes.map((costume, index) => {
            const { costume_id, use_name, costume_name, date, description, sex, material, technique, location, designer, tp_title, actors, images, parts, createdBy} = costume //desthucturing
            var img = null;
            for (var element in costume){
                if (!element || element===''){
                    element='/t';
                }}
            let imagesObj=JSON.parse(images);
            if (imagesObj) {
            imagesObj.map(image => {
                img = image['path'];  
            })}
            return (
                <tr className="TableRow" key={costume_id}>
                    <td>
                        {img ? 
                        <img id="Image" src={axios.baseURL+img}/> 
                        :
                        ''}
                    </td>
                <td>{costume_name}</td>
                <td style={{width: '250.996px'}}>
                    <p className="multi-line-truncate">
                        {description}
                    </p>
                </td>
                <td>{date}</td>
                <td>{use_name}</td>
                {sex==="Άνδρας" || sex==="Αγόρι" ? 
                <td id="TextWithIconCell">
                    <img src={require('../../styles/images/icons/Male.png')}/><br/>
                    {sex}
                </td>
                :
                <td id="TextWithIconCell">
                    <img src={require('../../styles/images/icons/Female.png')}/><br/>
                    {sex}
                </td>
                }
                {   (material==='Βαμβάκι') ?
                    <td id="TextWithIconCell">
                        <img src={require('../../styles/images/icons/cotton.png')}/><br/>
                        {material}
                    </td>
                    : (material==='Μετάξι') ?
                    <td id="TextWithIconCell">
                        <img src={require('../../styles/images/icons/kasmir.png')}/><br/>
                        {material}
                    </td>
                    : (material==='Μαλλί') ?
                    <td id="TextWithIconCell">
                        <img src={require('../../styles/images/icons/wool.png')}/><br/>
                        {material}
                    </td>
                    : (material==='Δέρμα') ?
                     <td id="TextWithIconCell">
                         <img src={require('../../styles/images/icons/leather.png')}/><br/>
                         {material}
                     </td>
                    :
                    <td>
                    <span>{material}</span>
                    </td>
                }
                <td>{technique}</td>
                <td>{location}</td>
                <td>{designer}</td>
                <td>{createdBy}</td>
                <td className="td_actions">
                    <div onClick={() => this.handleCostumeEditing(costume_id)}><EditButton/></div>
                    <br/>
                    <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                        <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                        </path>
                    </svg>
                    <div onClick={()=> this.handleConfirmationForDelete(costume_id)}><DeleteButton/></div>
                </td>
                </tr>
            )
        })
    }

    renderTableUsesData() {
        return this.state.use_data.map((use, index) => {
            const { useID, name, use_category,description, customs, createdBy } = use //desthucturing
            return (
                <tr key={useID}>
                    <td>
                        {name}
                   </td>
                    <td>
                        {use_category}
                    </td>
                    <td style={{width: '250.996px'}}>
                        <p className="multi-line-truncate">
                            {description}
                        </p>
                    </td>
                    <td>
                        {customs}
                    </td>
                    <td>{createdBy}</td>
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
            const { theatrical_play_id, title, date, actors, director, theater, createdBy } = tp //desthucturing
            return (
                <tr key={theatrical_play_id}>
                <td>{title}</td>
                <td>{director}</td>
                <td>{theater}</td>
                <td>{date}</td>
                <td>{createdBy}</td>
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
        return this.state.current_accessories.map((accessory, index) => {
            const {accessory_id, name, description, date, sex, material, technique, tp_title, images, location, designer, parts, actors, costume_name, use_name, CreatedBy} = accessory;
            var img = null;
            for (var element in accessory){
                if (!element || element===''){
                    element='/t';
                }}
            let imagesObj=JSON.parse(images);
            if (imagesObj) {
            imagesObj.map(image => {
                img = image['path'];  
            })}
            return (
                <tr key={accessory_id}>
                    <td>
                        {img ? 
                        <img id="Image" src={axios.baseURL+img}/> 
                        :
                        ''}
                    </td>
                    <td>{name}</td>
                    <td style={{width: '250.996px'}}>
                        <p className="multi-line-truncate">
                            {description}
                        </p>
                    </td>
                    <td>{use_name}</td>
                    <td>{tp_title}</td>
                    <td>{costume_name}</td>
                    <td>{date}</td>
                    <td>{technique}</td>
                    {sex==="Άνδρας" || sex==="Αγόρι" ? 
                    <td id="TextWithIconCell">
                        <img src={require('../../styles/images/icons/Male.png')}/><br/>
                        {sex}
                    </td>
                    :
                    <td id="TextWithIconCell">
                        <img src={require('../../styles/images/icons/Female.png')}/><br/>
                        {sex}
                    </td>
                    }
                    <td>{designer}</td>
                    <td>{location}</td>
                    <td>{actors}</td>
                    <td>{CreatedBy}</td>
                    <td className="td_actions">
                        <div onClick={() => this.handleAccessoryEditing(accessory_id)}><EditButton/></div>
                        <br/>
                        <svg class="ButtonsDivider" viewBox="0 0 65.961 1">
                            <path fill="transparent" stroke="rgba(88,89,91,1)" stroke-width="1px" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="10" shape-rendering="auto" id="ButtonsDivider" d="M 0 0 L 65.96097564697266 0">
                            </path>
                        </svg>
                        <div onClick={()=>{this.handleConfirmationForDelete(accessory_id);}}><DeleteButton/></div>
                    </td>
                </tr>
            )
        })
    }

    applyFilters = (filters) => {
        var qs = require('qs');
        axios.instance.get("costumes-filters/", 
        { params: { filters: filters, user: this.state.user.role }, 
        paramsSerializer: params => { return qs.stringify(params) } })
        .then(res => {
            console.log(res)
            if(res.statusText==='OK'){
                this.setState({current_costumes: res.data})
            }
        })
    }

    resetFilters = () => {
        this.setState({
            current_costumes: this.state.costume_data,
            current_accessories: this.state.accessories,
            current_tps: this.state.tp_data,
            current_uses: this.state.use_data
        })
    }

    render() {
        const { column, use_data, direction } = this.state

        if (this.state.redirectToReferrer) {
            return <Redirect to="/auth" />
        }

        return (
            <React.Fragment>
                <NotificationContainer/>
                <Header/>
                {/*logout action*/}
                <div className='logout-area'>
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
                {/*Filters and right sidebar*/}
                {/*<div className="sidebar" onClick={this.handleDrawerOpen}>
                    <FilterButtons/>
                </div>*/}
                <Sidebar
                rootClassName="FiltersSidebarRoot"
                sidebarClassName="FiltersSidebar"
                overlayClassName = "Overlay"
                sidebar={<SidebarContent
                    resetFilters = {this.resetFilters.bind(this)}
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
                {this.state.current_tab===0 && !this.state.isCostumeFormOpen &&
                    <div className="panel-container">
                        <table className="table">
                                <thead className="table-head">
                                <tr>
                                    <th
                                    style={{cursor: 'inherit', backgroundColor: 'inherit', width: '20%'}}
                                    sorted={null}>
                                        <span><sthong>EIKONA</sthong></span>
                                    </th>
                                    <th
                                    style={{width: '15%'}}
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}>
                                    <sthong>ΤΙΤΛΟΣ</sthong> 
                                    </th>
                                    <th
                                    style={{width: '30%'}}
                                    sorted={column === 'descr' ? direction : null}
                                    onClick={this.handleSort('descr')}><sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><sthong>ΕΠΟΧΗ</sthong></th>
                                    <th
                                    style={{width: '10%'}}
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><sthong>ΧΡΗΣΗ</sthong></th>
                                    <th
                                    style={{width: '10%'}}
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><sthong>ΦΥΛΟ</sthong></th>
                                    <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'material' ? direction : null}
                                    onClick={this.handleSort('material')}><sthong>ΥΛΙΚΟ<br/>ΚΑΤΑΣΚΕΥΗΣ</sthong></th>
                                    <th
                                    style={{width: '10%'}}
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><sthong>ΤΕΧΝΙΚΗ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><sthong>ΠΕΡΙΟΧΗ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><sthong>ΣΧΕΔΙΑΣΤΗΣ</sthong></th>
                                    <th style={{width: '5%'}}>
                                    <sthong>EDITOR</sthong>
                                    </th>
                                    <th
                                    id="th_actions"></th>
                                    </tr> 
                                </thead>
                                <tbody className="table-body">
                                    {this.renderTableCostumesData()} 
                                </tbody>
                            </table>
                        
                        <button className="button-insert" onClick={()=>this.handleAddCostume()}>                                
                            <img id="ButtonAddIcon" src={require('../../styles/images/ADD.png')}/>
                            <span id="ButtonAddText">προσθήκη</span>
                        </button>
                    </div>
                }

                <Footer/>
               
                {this.state.current_tab===0 && this.state.isCostumeFormOpen ? (
                    <div className="form-panel">
                        <CostumeForm
                        handleClose={this.handleCloseDialog.bind(this)}
                        user={this.state.user.user_id}
                        costumes={this.state.costume_data}
                        uses={this.state.use_data}
                        theatrical_plays={this.state.tp_data}
                        costume={this.state.costume}
                        editing={this.state.editing}></CostumeForm>
                    </div>
                   
                    )
                    :
                    <div></div>
                    
                }

                {this.state.current_tab===1 && this.state.isAccessoryFormOpen ?(    
                    <div className="form-panel">
                    <AccessoryForm
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    accessories={this.state.accessories}
                    editing={this.state.editing}
                    accessory={this.state.accessory}
                    uses={this.state.use_data}
                    costumes={this.state.costume_data}
                    theatrical_plays={this.state.tp_data}
                    />
                    </div>)
                    :
                    <div></div>
                }
                {this.state.current_tab===1 && !this.state.isAccessoryFormOpen&&
                   <div className="panel-container">
                        <table className="table">
                           <thead className="table-head">
                                <tr>
                                    <th
                                    style={{cursor: 'inherit', backgroundColor: 'inherit', width: '20%'}}
                                    sorted={null}>
                                        <span><sthong>EIKONA</sthong></span>
                                    </th>
                                    <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'name' ? direction : null}
                                    onClick={this.handleSort('name')}><sthong>ONOMA</sthong></th>
                                    <th
                                    style={{width: '25%'}}
                                    sorted={column === 'description' ? direction : null}
                                    onClick={this.handleSort('description')}><sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                    <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><sthong>ΧΡΗΣΗ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'tp_title' ? direction : null}
                                    onClick={this.handleSort('tp_title')}><sthong>ΘΕΑΤΡΙΚΕΣ <br/> ΠΑΡΑΣΤΑΣΕΙΣ</sthong></th>
                                    <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}><sthong>ΚΟΣΤΟΥΜΙ</sthong></th>
                                    <th 
                                    style={{width: '25%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><sthong>XΡΟΝΟΛΟΓΙΑ</sthong></th>
                                    <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><sthong>ΤΕΧΝΙΚΗ</sthong></th>
                                    <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><sthong>ΦΥΛΟ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><sthong>ΣΧΕΔΙΑΣΤΗΣ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><sthong>ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</sthong></th>
                                    <th
                                    style={{width: '30%'}}
                                    sorted={column === 'actors' ? direction : null}
                                    onClick={this.handleSort('actors')}><sthong>ΗΘΟΠΟΙΟΙ</sthong></th>
                                    <th style={{width: '5%'}}>
                                    <sthong>EDITOR</sthong>
                                    </th>
                                    <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">{this.renderTableAccessoriesData()} </tbody>
                        </table>
                                               
                        <button className="button-insert" onClick={() => this.handleAddAccessory()}>
                            <img id="ButtonAddIcon" src={require('../../styles/images/ADD.png')}/>
                            <span id="ButtonAddText">προσθήκη</span>
                        </button>
                        <Footer/>
                    </div>
                }
                {this.state.current_tab===2 && this.state.isUseFormOpen ? (
                    <div className="form-panel">
                    <UseForm 
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    costumes={this.state.costume_data}
                    uses={this.state.use_data}
                    theatrical_plays={this.state.tp_data}
                    editing={this.state.editing}
                    use={this.state.use}></UseForm>
                    </div>
                )
                :
                <div></div>}
                {this.state.current_tab===2 && !this.state.isUseFormOpen &&
                   <div className="panel-container">
                        <table className="table">
                               <thead className="table-head">
                                <tr>
                                <th
                                style={{width: '20%'}}
                                sorted={column === 'name' ? direction : null}
                                onClick={this.handleSort('name')}>
                                <sthong>ΟΝΟΜΑ</sthong> 
                                </th>
                                <th
                                style={{width: '20%'}}
                                sorted={column === 'use_category' ? direction : null}
                                onClick={this.handleSort('use_category')}>
                                <sthong>ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ</sthong></th>
                                <th
                                style={{width: '30%'}}                                                                         
                                sorted={column === 'description' ? direction : null}
                                onClick={this.handleSort('description')}>
                                <sthong>ΠΕΡΙΓΡΑΦΗ</sthong></th>
                                <th
                                style={{width: '10%'}}
                                sorted={column === 'customs' ? direction : null}
                                onClick={this.handleSort('customs')}>
                                <sthong>ΕΘΙΜΑ</sthong>
                                </th>
                                <th style={{width: '10%'}}>
                                    <sthong>EDITOR</sthong>
                                </th>
                                <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">{this.renderTableUsesData()}</tbody>
                            </table>
                        <button className="button-insert" onClick={() => this.handleAddUse()}>
                            <img id="ButtonAddIcon" src={require('../../styles/images/ADD.png')}/>
                            <span id="ButtonAddText">προσθήκη</span>
                        </button>
                        <Footer/>
                        </div>
                }
                {this.state.current_tab===3 && this.state.isTPFormOpen ? (
                    <div className="form-panel">
                    <TpForm
                    isOpen={this.state.isTPFormOpen}
                    handleClose={this.handleCloseDialog.bind(this)}
                    user={this.state.user.user_id}
                    theatrical_plays={this.state.tp_data}
                    editing={this.state.editing}
                    tp={this.state.theatricalPlay}
                    />
                    </div>
                )
                : <div></div>   }
                {this.state.current_tab===3 && !this.state.isTPFormOpen &&
                    <div className="panel-container">
                        <table className="table">
                            <thead className="table-head">
                                <tr>
                                    <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'title' ? direction : null}
                                    onClick={this.handleSort('title')}><sthong>ΟΝΟΜΑ ΠΑΡΑΣΤΑΣΗΣ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'director' ? direction : null}
                                    onClick={this.handleSort('director')}><sthong>ΣΚΗΝΟΘΕΤΗΣ</sthong></th>
                                    <th
                                    style={{width: '20%'}}
                                    sorted={column === 'theater' ? direction : null}
                                    onClick={this.handleSort('theater')}><sthong>ΘΕΑΤΡΟ</sthong></th>
                                    <th style={{width: '20%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><sthong>ΧΡΟΝΟΛΟΓΙΑ</sthong></th>
                                    <th style={{width: '10%'}}>
                                    <sthong>EDITOR</sthong>
                                    </th>
                                    <th id="th_actions"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">{this.renderTableTPsData()} </tbody>
                            </table>
                            <button className="button-insert" onClick={() => this.handleAddTP()}>
                                <img id="ButtonAddIcon" src={require('../../styles/images/ADD.png')}/>
                                <span id="ButtonAddText">προσθήκη</span>
                            </button>
                            <Footer/>
                        </div>
                }

                <ConfirmationDialog 
                isOpen={this.state.isConfirmationDialogOpen}
                index = {this.state.index}
                dependency = {this.state.dependency}
                handleClose={this.handleCloseConfirmationDialog.bind(this)}
                handleOk={this.handleOk.bind(this)}></ConfirmationDialog>

                
            </React.Fragment>
          );
    
    }
}

export default Dashboard;