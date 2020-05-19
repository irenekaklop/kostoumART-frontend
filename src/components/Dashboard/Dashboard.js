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
            column: null,
            direction: null,
        }
    }

    componentDidMount(){
        this.setState({user_type: Number(Number(localStorage.getItem('user-type')))})
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    handleSort = (clickedColumn) => () => {
        const { column, direction } = this.state;
        const { uses, costumes, accessories, theatricalPlays } = this.props
    
        if (column !== clickedColumn) {
            switch(this.props.item){
                case 0:
                    this.setState({
                        column: clickedColumn,
                        costumes: _.sortBy(costumes, [clickedColumn]),
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
                        uses: _.sortBy(uses, [clickedColumn]),
                        direction: 'ascending',
                      })
                case 3:
                    this.setState({
                        column: clickedColumn,
                        theatricalPlays: _.sortBy(theatricalPlays, [clickedColumn]),
                        direction: 'ascending',
                      })
                      
                }
            return;
        }
        
        switch(this.props.item){
            case 0:
                this.setState({
                    costumes: costumes.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                })
            case 1:
                this.setState({
                    accessories: accessories.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                  })
            case 2:
                this.setState({
                    uses: uses.reverse(),
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                })
            case 3:
                this.setState({
                    theatricalPlays: theatricalPlays.reverse(),
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
        return this.props.costumes.map((costume, index) => {
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
        return this.props.uses.map((use, index) => {
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
        return this.props.theatricalPlays.map((tp, index) => {
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
        return this.props.accessories.map((accessory, index) => {
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

    render() {
        const { column, direction } = this.state;
        return (
            <React.Fragment>
                {this.props.item === 0 &&
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th
                                    style={{cursor: 'inherit', backgroundColor: 'inherit', width: '20%'}}
                                    sorted={null}>
                                    <span><strong>EIKONA</strong></span>
                                </th>
                                <th
                                    style={{width: '15%'}}
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}>
                                   <strong>ΤΙΤΛΟΣ</strong> 
                                </th>
                                <th
                                    style={{width: '30%'}}
                                    sorted={column === 'descr' ? direction : null}
                                    onClick={this.handleSort('descr')}><strong>ΠΕΡΙΓΡΑΦΗ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><strong>ΕΠΟΧΗ</strong></th>
                                <th
                                    style={{width: '10%'}}
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><strong>ΧΡΗΣΗ</strong></th>
                                <th
                                    style={{width: '10%'}}
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><strong>ΦΥΛΟ</strong></th>
                                <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'material' ? direction : null}
                                    onClick={this.handleSort('material')}><strong>ΥΛΙΚΟ<br/>ΚΑΤΑΣΚΕΥΗΣ</strong></th>
                                <th
                                    style={{width: '10%'}}
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><strong>ΤΕΧΝΙΚΗ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><strong>ΠΕΡΙΟΧΗ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><strong>ΣΧΕΔΙΑΣΤΗΣ</strong></th>
                                <th style={{width: '5%'}}>
                                    <strong>EDITOR</strong>
                                </th>
                                <th
                                    id="th_actions"></th>
                            </tr> 
                        </thead>
                        <tbody className="table-body">
                            {this.renderTableCostumesData()} 
                        </tbody>
                    </table>
                   
                }

                {this.props.item === 1 &&
                   <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th
                                    style={{cursor: 'inherit', backgroundColor: 'inherit', width: '20%'}}
                                    sorted={null}>
                                        <span><strong>EIKONA</strong></span>
                                </th>
                                <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'name' ? direction : null}
                                    onClick={this.handleSort('name')}><strong>ONOMA</strong></th>
                                <th
                                    style={{width: '25%'}}
                                    sorted={column === 'description' ? direction : null}
                                    onClick={this.handleSort('description')}><strong>ΠΕΡΙΓΡΑΦΗ</strong></th>
                                <th 
                                    style={{width: '10%'}}
                                    sorted={column === 'use_name' ? direction : null}
                                    onClick={this.handleSort('use_name')}><strong>ΧΡΗΣΗ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'tp_title' ? direction : null}
                                    onClick={this.handleSort('tp_title')}><strong>ΘΕΑΤΡΙΚΕΣ <br/> ΠΑΡΑΣΤΑΣΕΙΣ</strong></th>
                                <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'costume_name' ? direction : null}
                                    onClick={this.handleSort('costume_name')}><strong>ΚΟΣΤΟΥΜΙ</strong></th>
                                <th 
                                    style={{width: '25%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><strong>XΡΟΝΟΛΟΓΙΑ</strong></th>
                                <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'technique' ? direction : null}
                                    onClick={this.handleSort('technique')}><strong>ΤΕΧΝΙΚΗ</strong></th>
                                <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'sex' ? direction : null}
                                    onClick={this.handleSort('sex')}><strong>ΦΥΛΟ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'designer' ? direction : null}
                                    onClick={this.handleSort('designer')}><strong>ΣΧΕΔΙΑΣΤΗΣ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'location' ? direction : null}
                                    onClick={this.handleSort('location')}><strong>ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</strong></th>
                                <th
                                    style={{width: '30%'}}
                                    sorted={column === 'actors' ? direction : null}
                                    onClick={this.handleSort('actors')}><strong>ΗΘΟΠΟΙΟΙ</strong></th>
                                <th style={{width: '5%'}}>
                                <strong>EDITOR</strong>
                                </th>
                                <th id="th_actions"></th>
                            </tr>
                        </thead>
                        <tbody className="table-body">{this.renderTableAccessoriesData()} </tbody>
                    </table>
                }

                {this.props.item===2 &&
                   <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th
                                style={{width: '20%'}}
                                sorted={column === 'name' ? direction : null}
                                onClick={this.handleSort('name')}>
                                <strong>ΟΝΟΜΑ</strong> 
                                </th>
                                <th
                                style={{width: '20%'}}
                                sorted={column === 'use_category' ? direction : null}
                                onClick={this.handleSort('use_category')}>
                                <strong>ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ</strong></th>
                                <th
                                style={{width: '30%'}}                                                                         
                                sorted={column === 'description' ? direction : null}
                                onClick={this.handleSort('description')}>
                                <strong>ΠΕΡΙΓΡΑΦΗ</strong></th>
                                <th
                                style={{width: '10%'}}
                                sorted={column === 'customs' ? direction : null}
                                onClick={this.handleSort('customs')}>
                                <strong>ΕΘΙΜΑ</strong>
                                </th>
                                <th style={{width: '10%'}}>
                                    <strong>EDITOR</strong>
                                </th>
                                <th id="th_actions"></th>
                            </tr>
                        </thead>
                        <tbody className="table-body">{this.renderTableUsesData()}</tbody>
                    </table>
                }
                {this.props.item===3 &&
                    <table className="table">
                        <thead className="table-head">
                            <tr>
                                <th 
                                    style={{width: '20%'}}
                                    sorted={column === 'title' ? direction : null}
                                    onClick={this.handleSort('title')}><strong>ΟΝΟΜΑ ΠΑΡΑΣΤΑΣΗΣ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'director' ? direction : null}
                                    onClick={this.handleSort('director')}><strong>ΣΚΗΝΟΘΕΤΗΣ</strong></th>
                                <th
                                    style={{width: '20%'}}
                                    sorted={column === 'theater' ? direction : null}
                                    onClick={this.handleSort('theater')}><strong>ΘΕΑΤΡΟ</strong></th>
                                <th style={{width: '20%'}}
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}><strong>ΧΡΟΝΟΛΟΓΙΑ</strong></th>
                                <th style={{width: '10%'}}>
                                <strong>EDITOR</strong>
                                </th>
                                <th id="th_actions"></th>
                            </tr>
                        </thead>
                        <tbody className="table-body">{this.renderTableTPsData()} </tbody>
                    </table>    
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