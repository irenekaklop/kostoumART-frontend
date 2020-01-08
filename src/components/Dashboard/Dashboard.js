import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from 'axios';
import CostumeForm from '../Forms/CostumeForm.js';
import UseForm from '../Forms/UseForm.js';
import TpForm from '../Forms/TpForm.js';
import ConfirmationDialog from '../Dashboard/ConfirmationDialog.js';

import "../../styles/Dashboard.css"

import jwt_decode from 'jwt-decode';
import { use_categories, techniques, sexs } from '../../utils/options.js';

const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.costume_name,
  });
  

class Dashboard extends Component{

    constructor(props) {
        super(props);
        this.state = {
            current_tab: 0,
            //Costumes
            costume_data: [],
            //Uses
            use_data: [],
            //TPs
            tp_data:[],
            //For Insert Form
            isCostumeDialogOpen: false,
            isUseDialogOpen: false,
            isTPDialogOpen: false,
            isConfirmationDialogOpen: false,
            //For Editing
            editing: false,
            costume: null,
            use: null,
            tp: null,
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
            redirectToReferrer: false      
        }
    }

    /*Secure way to getData*/
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
        }
        else{
            this.setState({redirectToReferrer: true})
        }
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

    logOut(e) {
        localStorage.removeItem('usertoken')
        this.props.history.push(`/auth`)
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
        };
    }

    /*Get costumes from db*/
    getCostumes = (decoded) => {
        //axios.get('http://88.197.53.80/kostoumart-api/costumes/')
        if(decoded){
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
            this.handleUseDelete(index);
        }
        else if(this.state.current_tab===2){
            this.handleTPDelete(index);
        }
    }

    handleTabChange = (event, value) => {
        //Refresh Tables
        if(value===0){
            this.getCostumes();
        }
        else if(value===1){
            this.get_uses();
        }
        else if(value===2){
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

    handleCostumeDelete(index){
        axios.delete("http://88.197.53.80/kostoumart-api/costumes/", {params: { name: index }})
        //axios.delete("http://localhost:8108/costumes/", {params: { name: index }})
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getCostumes();
                return ret;
            }
        })
    }

    handleTPDelete(index){
        axios.delete("http://88.197.53.80/kostoumart-api/tps/", {params: { id: index }})
        //axios.delete("http://localhost:8108/tps/", {params: { id: index }})
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
        axios.delete("http://88.197.53.80/kostoumart-api/uses/",{params: { id: index }})
        //axios.delete("http://localhost:8108/uses/",{params: { id: index }} )
        .then(res=> {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("delete-success");
                this.getCostumes();
                this.get_uses();
                return ret;
            }
        })
    }

    handleConfirmationForDelete(index){
        console.log("Index", index);
        //Check if this index is a foreign key in costumes' list before delete
        if(this.state.current_tab===1){
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
        else if(this.state.current_tab===2){
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
            const { costume_id, use_name, costume_name, description, sex, material, technique, location, location_influence, designer, tp_title, actors, parts } = costume //destructuring
            return (
                <TableRow key={costume_id}>
                <TableCell>{costume_name}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>{use_name}</TableCell>
                <TableCell>{material}</TableCell>
                <TableCell>{technique}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{location_influence}</TableCell>
                <TableCell>{designer}</TableCell>
                <TableCell>{tp_title}</TableCell>
                <TableCell>{actors}</TableCell>
                <TableCell>{parts}</TableCell>
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
        if (this.state.redirectToReferrer) {
            return <Redirect to="/auth" />
        }
        const {filterDrawerOpen, useCategoryOption, techniqueOption, sexOption} = this.state;
        return (
            <React.Fragment>
                <div className="LogoutContainer">
                    <p className="LogoutButton"
                    onClick={() => this.logOut()}              
                    >
                    Αποσύνδεση
                    </p>
                </div>
                <NotificationContainer></NotificationContainer>
                <div className="root">
                    <Tabs value={this.state.current_tab}
                        onChange={this.handleTabChange}>
                    <Tab label="ΚΟΣΤΟΥΜΙ"/>
                    <Tab label="ΧΡΗΣΗ"/>
                    <Tab label="ΘΕΑΤΡΙΚΗ ΠΑΡΑΣΤΑΣΗ"/>
                    </Tabs>
                   
                    
                    {this.state.current_tab===0 &&
                        <div>
                            <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start">
                                <FilterListIcon></FilterListIcon>
                            </IconButton>
                            <Drawer
                            variant="persistent"
                            anchor="left"
                            open={filterDrawerOpen}
                            className="Drawer"
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
                            <Paper>
                            <Table className="table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell><strong>Τίτλος</strong></TableCell>
                                    <TableCell><strong>Περιγραφή</strong></TableCell>
                                    <TableCell><strong>Φύλο</strong></TableCell>
                                    <TableCell><strong>Χρήση</strong></TableCell>
                                    <TableCell><strong>Υλικό κατασκευής</strong></TableCell>
                                    <TableCell><strong>Τεχνική Κατασκευής</strong></TableCell>
                                    <TableCell><strong>Περιοχή Αναφοράς</strong></TableCell>
                                    <TableCell><strong>Χώρα Επιρροής</strong></TableCell>
                                    <TableCell><strong>Σχεδιαστής</strong></TableCell>
                                    <TableCell><strong>Θεατρικές Παραστάσεις</strong></TableCell>
                                    <TableCell><strong>Ρόλος</strong></TableCell>
                                    <TableCell><strong>Ηθοποιός</strong></TableCell>
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
                            </Paper>
                        </div>
                    }
                    {this.state.current_tab===1 &&
                        <Paper>
                            <Table className="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Όνομα Δραστηριότητας</strong></TableCell>
                                    <TableCell><strong>Κατηγορία Χρήσης</strong></TableCell>
                                    <TableCell><strong>Περιγραφή</strong></TableCell>
                                    <TableCell><strong>Έθιμα</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{this.renderTableUsesData()}</TableBody>
                        </Table>
                        <IconButton><AddIcon onClick={() => this.handleAddUse()}></AddIcon></IconButton>
                        <UseForm 
                                isOpen={this.state.isUseDialogOpen}
                                handleClose={this.handleCloseDialog.bind(this)}
                                costumes={this.state.costume_data}
                                uses={this.state.use_data}
                                theatrical_plays={this.state.tp_data}
                                editing={this.state.editing}
                                use={this.state.use}></UseForm>
                        </Paper>
                    }
                    {this.state.current_tab===2 &&
                        <Paper>
                            <Table className="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Όνομα Παράστασης</strong></TableCell>
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
                                theatrical_plays={this.state.tp_data}
                                editing={this.state.editing}
                                tp={this.state.tp}
                                />
                        </Paper>
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