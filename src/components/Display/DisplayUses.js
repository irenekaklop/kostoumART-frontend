import React, { Component } from "react";
import _ from 'lodash';
import DisplayMenu from '../DisplayMenu/DisplayMenu';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";
import "./DisplayTable.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { timingSafeEqual } from "crypto";

class DisplayUses extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            use: "",
            usesData: '',
            direction: null,
            column: null,
            //Search
            selectedUseName: null,
            //Edit
            editing: null, //the ID of entry that is going to update
            name: null,
            description: null,
            use_category: null,
            customs: null,

        };
        this.onChange = this.onChange.bind(this);
        this.getUses = this.getUses.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.getUses();
    }
    
    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    startEditing = id => {
        this.setState({editing: id});
       /* let useID = id;
        let link = "http://localhost:8108/uses/"+useID;
        axios.get(link)
        .then(  res => {
            const use = res.data.response;
            this.state.name = use[0].name;
            this.state.description = use[0].description;
            console.log("get", this.state);
        }
        )*/
    }

    stopEditing = id => {
        this.setState({editing: null})
        console.log(this.state);
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

    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
    
        this.setState({
          data: data.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    
    getUses = _ => {
        axios.get("http://88.197.53.80/kostoumart-api/uses")
        //axios.get("http://localhost:8108/uses")
        .then(res => {
            const data = res.data.response;
            this.setState({ data });
            console.log(this.state);
        }
        )
    }

    handleDelete(selectedUseName) {
        this.setState({selectedUseName}); 
    }

    deleteUse(){
        console.log(this.state.selectedUseName);
        if(this.state.selectedUseName){
            axios.delete("http://88.197.53.80/kostoumart-api/uses", {params: { name: this.state.selectedUseName }})
            //axios.delete("http://localhost:8108/uses", {params: { name: this.state.selectedUseName }})
            .then(res=> {
                if(res.statusText ==="OK"){
                    let ret=this.createNotification("delete-success");
                    this.getUses();
                    this.state.selectedUseName = "";
                    return ret;
                }
            })
        }
    }

    renderTableData() {
        return this.state.data.map((use, index) => {
            const { useID, name, use_category,description, customs } = use //destructuring
            return (
                <TableRow key={useID}>
                    <TableCell></TableCell>
                    <TableCell>
                    {this.state.editing && this.state.editing === useID ? (
                            <TextField onChange={e=>this.onChange}></TextField>) : (
                            name
                        )}
                        </TableCell>
                    <TableCell>{this.state.editing && this.state.editing === useID ? (
                            <TextField value = {use_category} name = {this.state.use_category} onChange={e=>this.onChange}></TextField>) : (
                            use_category
                        )}</TableCell>
                    <TableCell>{this.state.editing && this.state.editing === useID ? (
                            <TextField value = {description} name = {this.state.description} onChange={e=>this.onChange}></TextField>) : (
                            description
                        )}</TableCell>
                    <TableCell>{this.state.editing && this.state.editing === useID ? (
                            <TextField value = {customs} name = {this.state.customs} onChange={e=>this.onChange}></TextField>) : (
                            customs
                        )}</TableCell>
                    <TableCell>
                        <IconButton><DeleteIcon onClick={()=>{this.handleDelete(name);}}></DeleteIcon></IconButton>
                        {this.state.editing && this.state.editing === useID? (
                            <IconButton><CheckIcon onClick={() => this.stopEditing()}/></IconButton>
                            ) : (
                            <IconButton><EditIcon onClick={() => this.startEditing(useID)}/></IconButton>
                        )}
                       </TableCell>
                </TableRow>
            )
        })
    }


    render() {   
        const { column, direction} = this.state;
        this.deleteUse();
        return (
            <div className="container__table">
                <DisplayMenu activeItem = 'use'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Typography component="div">
                    <Paper className="root">
                        <Table className="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"><Checkbox/></TableCell>
                                    <TableCell><strong>Όνομα Δραστηριότητας</strong></TableCell>
                                    <TableCell><strong>Περιγραφή</strong></TableCell>
                                    <TableCell><strong>Κατηγορία Χρήσης</strong></TableCell>
                                    <TableCell><strong>Έθιμα</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{this.renderTableData()}</TableBody>
                        </Table>
                    </Paper>
                </Typography>
          </div>
        );
      }

}

export default DisplayUses;