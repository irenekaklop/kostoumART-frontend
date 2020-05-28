import React, {Component} from 'react';
import { connect } from 'react-redux';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import axios from '../../utils/api-url.js'

import ConfirmationDialog from '../Dashboard/ConfirmationDialog.js';

import "../Dashboard/Dashboard.css"

import { isAuthenticated, hasJWTToken } from "../../store/actions/auth";

import _ from 'lodash'

import {EditButton, DeleteButton} from '../Shared/Buttons/Buttons';


import '../Shared/utils.js'
import { Table, TableRow, TableCell, TableHead,TableBody, Tab, Divider, IconButton, TableSortLabel } from '@material-ui/core';

import {eras} from '../../utils/options.js';

function descendingComparator(a, b, orderBy) {
    if(orderBy==='date'){
        var eraA = eras.find(element => { return(element.label === a[orderBy])})
        var eraB = eras.find(element => { return(element.label === b[orderBy])})
        if (eraB.startYear < eraA.startYear) {
            return -1;
        }
        if (eraB.startYear > eraA.startYear) {
            return 1;
        }
        return 0;
    }
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}
  
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

class Dashboard extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //For Insert Form
            isCostumeFormOpen: false,
            isUseFormOpen: false,
            isTPFormOpen: false,
            isConfirmationDialogOpen: false,
            isAccessoryFormOpen: false,
            //For Editing
            editing: false,
            itemToEdit: null,
            //Confirmation Dialog answer
            index: null,
            dependency: false,
            user_type: '',
            //Sorting
            orderBy: '',
            order: 'asc',
            column: null,
            direction: null,
            costumeHeaders: [
                { id: 'costume_name', label: 'Όνομα' },
                { id: 'description', label: 'Περιγραφή' },
                { id: 'use_name', label: 'Χρήση' },
                { id: 'sex', label: 'Φύλο' },
                { id: 'date', label: 'Χρονολογία' },
                { id: 'technique', label: 'Τεχνική' },
                { id: 'createdBy', label: 'Editor' },
            ],
            accessoryHeaders: [
                { id: 'name', label: 'Όνομα' },
                { id: 'description', label: 'Περιγραφή' },
                { id: 'use_name', label: 'Χρήση' },
                { id: 'sex', label: 'Φύλο' },
                { id: 'date', label: 'Χρονολογία' },
                { id: 'technique', label: 'Τεχνική' },
                { id: 'CreatedBy', label: 'Editor' },
            ],
            useHeaders: [
                { id: 'name', label: 'Όνομα' },
                { id: 'use_category', label: 'Κατηγορία Χρήσης' },
                { id: 'description', label: 'Περιγραφή' },
                { id: 'createdBy', label: 'Editor' },
            ],
            theatricalPlayHeaders: [
                { id: 'title', label: 'Όνομα Παράστασης' },
                { id: 'director', label: 'Σκηνοθέτης' },
                { id: 'theater', label: 'Θέατρο' },
                { id: 'years', label: 'Χρονολογία' },
                { id: 'createdBy', label: 'Editor' },
            ],
        }
    }

    componentDidMount(){
        this.setState({user_type: Number(Number(localStorage.getItem('user-type')))})
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    handleRequestSort = (event, orderBy) => {
        let order = 'asc';
        if (this.state.orderBy === orderBy && this.state.order === 'asc') {
          order = 'desc';
        }
        this.setState({ order, orderBy });
      };
    
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
        if(this.props.item===0){
            this.handleCostumeDelete(index);
        }
        else if(this.props.item===1){
            this.handleAccessoryDelete(index);
        }
        else if(this.props.item===2){
            this.handleUseDelete(index);
        }
        else if(this.props.item===3){
            this.handleTPDelete(index);
        }
    }

    handleCostumeEditing(index){
        axios.instance.get("costumes/"+index)
        .then(res => {
            const itemToEdit = res.data;
            this.props.handleEditing(itemToEdit);
        })
        
    }

    handleUseEditing (index) {
        axios.instance.get("uses/"+index)
        .then(res => {
            const itemToEdit = res.data;
            this.props.handleEditing(itemToEdit);
        })
    }

    handleTPEditing (index) {
       axios.instance.get("theatricalPlays/"+index)
       .then(res => {
            const itemToEdit = res.data;
            this.props.handleEditing(itemToEdit);
       })
    }

    handleAccessoryEditing(index){
        axios.instance.get("accessories/" + index)
        .then(res => {
            if(res.statusText==='OK'){
                const itemToEdit = res.data;
                this.props.handleEditing(itemToEdit);
            }            
        })
    }

    handleCostumeDelete(index){
        axios.instance.delete("costumes/" + index)
        .then(res=> {
            if(res.statusText ==="OK"){
                this.props.refreshDataMethod();
                let ret=this.createNotification("delete-success");
                return ret;
            }
        })
    }

    handleTPDelete(index){
        axios.instance.delete("theatricalPlays/" + index)
            .then(res=> {
                if(res.statusText ==="OK"){
                    this.props.refreshDataMethod();
                    let ret=this.createNotification("delete-success");
                    return ret;
                }
            })
    }

    handleUseDelete(index){
        axios.instance.delete("uses/" + index )
        .then(res=> {
            if(res.statusText ==="OK"){
                this.props.refreshDataMethod();
                let ret=this.createNotification("delete-success");
                return ret;
            }
        })
    }

    handleAccessoryDelete(index){
        axios.instance.delete("accessories/" + index )
        .then(res=> {
            if(res.statusText ==="OK"){
                this.props.refreshDataMethod();
                let ret=this.createNotification("delete-success");
                return ret;
            }
        })
    }

    handleConfirmationForDelete(index){
        if(this.props.item===0){
            axios.instance.get("dependencies/", {params: { index: index, column: 'costume' }} )
            .then(res=>{
                if (res.data.response[0].result===1) {
                    this.setState({dependency: true});
                }
                this.handleOpenConfirmationDialog(index);
            })
        }
        if(this.props.item===1){
            this.handleOpenConfirmationDialog(index);
            this.setState({dependency: false});
        }
        //Check if this index is a foreign key in costumes' list before delete
        if(this.props.item===2){
            axios.instance.get("dependencies/",{params: { index: index, column: 'use' }} )
            .then(res=>{
                if (res.data.response[0].result===1) {
                    this.setState({dependency: true});
                }
                this.handleOpenConfirmationDialog(index);
            })
        }
        else if(this.props.item===3){
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
        return (
            stableSort(this.props.costumes, getComparator(this.state.order, this.state.orderBy))
            .map((costume) => {
                const { costume_id, use_name, costume_name, date, description, sex, material, technique, location, designer, tp_title, actors, images, parts, createdBy} = costume //desthucturing
                var img = null;
                for (var element in costume){
                    if (!element || element===''){
                        element='/t';
                    }}
                if(images){
                    let imagesObj=JSON.parse(images);
                    if (imagesObj) {
                    imagesObj.map(image => {
                        img = image['path'];  
                    })}
                }
                return (
                    <TableRow key={costume_id}>
                        <TableCell style={{width:'15%'}}>
                            {img ? 
                            <img id="Image" src={axios.baseURL+img}/> 
                            :
                            ''}
                        </TableCell>
                        <TableCell>{costume_name}</TableCell>
                        <TableCell style={{width:'30%'}}>
                            <p className="multi-line-truncate">
                            {description}
                            </p>
                        </TableCell>
                        <TableCell>{use_name}</TableCell>
                        <TableCell align="center">
                            {sex==="Άνδρας" || sex==="Αγόρι" ? 
                                <img src={require('../../styles/images/icons/Male.png')}/>
                                
                            :
                                <img src={require('../../styles/images/icons/Female.png')}/>
                                
                            }
                            <br/>
                            {sex}
                        </TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{technique}</TableCell>
                        <TableCell>{createdBy}</TableCell>
                        <TableCell align="center" style={{width:'65.961px'}}>
                            <IconButton onClick = {() => this.handleCostumeEditing(costume_id)}>
                                <img src={require('../../styles/images/buttons/EDIT.png')}/>
                            </IconButton>
                            <Divider/>
                            <IconButton onClick={()=> this.handleConfirmationForDelete(costume_id)}>
                                <img src={require('../../styles/images/buttons/DELETE.png')}/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
        })
        )
    }

    renderTableUsesData() {
        return (
            stableSort(this.props.uses, getComparator(this.state.order, this.state.orderBy))
            .map((use, index) => {
            const { useID, name, use_category,description, customs, createdBy } = use //desthucturing
            return (
                <TableRow key={useID}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{use_category}</TableCell>
                    <TableCell style={{width:'550.996px'}} >
                        <p className="multi-line-truncate">
                            {description}
                        </p>
                    </TableCell>
                    <TableCell>{createdBy}</TableCell>
                    <TableCell style={{width:'65.961px'}}>
                        <IconButton onClick={() => {this.handleUseEditing(useID);}}>
                            <img src={require('../../styles/images/buttons/EDIT.png')}/>
                        </IconButton>
                        <Divider/>
                        <IconButton onClick={()=>{this.handleConfirmationForDelete(useID)}}>
                            <img src={require('../../styles/images/buttons/DELETE.png')}/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        }))
    }

    renderTableTPsData() {
        return (
            stableSort(this.props.theatricalPlays, getComparator(this.state.order, this.state.orderBy))
            .map((tp, index) => {
            const { theatrical_play_id, title, years, actors, director, theater, createdBy } = tp //desthucturing
            return (
                <TableRow key={theatrical_play_id}>
                <TableCell>{title}</TableCell>
                <TableCell>{director}</TableCell>
                <TableCell>{theater}</TableCell>
                <TableCell>{years}</TableCell>
                <TableCell>{createdBy}</TableCell>
                <TableCell style={{width:'65.961px'}}>
                    <IconButton onClick={() => this.handleTPEditing(theatrical_play_id)}>
                        <img src={require('../../styles/images/buttons/EDIT.png')}/>
                    </IconButton>
                    <Divider/>
                    <IconButton  onClick={() => this.handleConfirmationForDelete(theatrical_play_id)}>
                        <img src={require('../../styles/images/buttons/DELETE.png')}/>
                    </IconButton>
                </TableCell>
                </TableRow>
            )
        }))
    }

    renderTableAccessoriesData() {
        return (
            stableSort(this.props.accessories, getComparator(this.state.order, this.state.orderBy))
            .map((accessory, index) => {
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
                <TableRow key={accessory_id}>
                    <TableCell style={{width:'15%'}}>
                        {img ? 
                        <img id="Image" src={axios.baseURL+img}/> 
                        :
                        ''}
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell style={{width:'30%'}}>
                        <p className="multi-line-truncate">
                        {description}
                        </p>
                    </TableCell>
                    <TableCell>{use_name}</TableCell>
                    <TableCell align="center">
                        {sex==="Άνδρας" || sex==="Αγόρι" ? 
                            <img src={require('../../styles/images/icons/Male.png')}/>
                            
                        :
                            <img src={require('../../styles/images/icons/Female.png')}/>
                            
                        }
                        <br/>
                        {sex}
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{technique}</TableCell>
                    <TableCell>{CreatedBy}</TableCell>
                    <TableCell align="center" style={{width:'65.961px'}}>
                        <IconButton onClick = {() => this.handleAccessoryEditing(accessory_id)}>
                            <img src={require('../../styles/images/buttons/EDIT.png')}/>
                        </IconButton>
                        <Divider/>
                        <IconButton onClick={()=> this.handleConfirmationForDelete(accessory_id)}>
                            <img src={require('../../styles/images/buttons/DELETE.png')}/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        }))
    }

    render() {
        const { column, direction } = this.state;
        return (
            <React.Fragment>
                {this.props.item === 0 &&
                    <div className='table'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>{'Εικόνα'}</TableCell>
                                {this.state.costumeHeaders.map(header => (
                                    <TableCell 
                                    key={header.key}
                                    sortDirection={this.state.orderBy === header.id ? this.state.order : false}>
                                        <TableSortLabel
                                        active={this.state.orderBy === header.id}
                                        direction={this.state.order}
                                        onClick={event => this.handleRequestSort(event, header.id)}>
                                            {header.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ), this
                                )}
                                <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.renderTableCostumesData()
                                }
                            </TableBody>
                        </Table>
                    </div>   
                  
                   
                   
                }

                {this.props.item === 1 &&
                    <div className='table'>
                    <Table>
                        <TableHead>
                           <TableRow>
                           <TableCell>{'Εικόνα'}</TableCell>
                           {this.state.accessoryHeaders.map(header => (
                               <TableCell 
                               key={header.key}
                               sortDirection={this.state.orderBy === header.id ? this.state.order : false}>
                                   <TableSortLabel
                                    active={this.state.orderBy === header.id}
                                    direction={this.state.order}
                                    onClick={event => this.handleRequestSort(event, header.id)}>
                                        {header.label}
                                    </TableSortLabel>
                               </TableCell>
                           ))}
                           <TableCell></TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {this.renderTableAccessoriesData()}
                        </TableBody>
                    </Table>
                    </div>   
                }

                {this.props.item===2 &&
                    <div className='table'>
                    <Table>
                        <TableHead>
                            <TableRow>
                            {this.state.useHeaders.map(header => (
                                <TableCell key={header.key}
                                sortDirection={this.state.orderBy === header.id ? this.state.order : false}>
                                    <TableSortLabel
                                    active={this.state.orderBy === header.id}
                                    direction={this.state.order}
                                    onClick={event => this.handleRequestSort(event, header.id)}>
                                        {header.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderTableUsesData()}
                        </TableBody>
                    </Table>
                   </div>
                }
                {this.props.item===3 &&
                    <div className='table'>
                    <Table>
                        <TableHead>
                            <TableRow>
                            {this.state.theatricalPlayHeaders.map(header => (
                                <TableCell key={header.key}
                                sortDirection={this.state.orderBy === header.id ? this.state.order : false}>
                                    <TableSortLabel
                                    active={this.state.orderBy === header.id}
                                    direction={this.state.order}
                                    onClick={event => this.handleRequestSort(event, header.id)}>
                                         {header.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderTableTPsData()}
                        </TableBody>
                    </Table>
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

const mapStateToProps = () => {
    return {
      isAuthenticated: isAuthenticated()
    };
};
  
const mapDispatchToProps = dispatch => {
    return {
      hasJWTToken: () => dispatch(hasJWTToken())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);