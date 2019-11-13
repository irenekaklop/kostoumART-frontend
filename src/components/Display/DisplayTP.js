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
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class DisplayTPs extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            TPsData: '',
            direction: null,
            column: null,
            //Search
            selectedTPName: null,
        };
        this.onChange = this.onChange.bind(this);
        this.getTPs = this.getTPs.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.getTPs();
    }
    
    onChange(e){
        this.setState({TPsData:e.target.value});
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

    getTPs = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/tps")
        axios.get("http://localhost:8108/tps")
        .then(res => {
            const data = res.data.response;
            this.setState({ data });
            console.log(this.state);
        }
        )
    }
 
    handleDelete(selectedTPName) {
        this.setState({selectedTPName}); 
    }

    deleteTP(){
        console.log(this.state.selectedTPName);
        if(this.state.selectedTPName){
            //axios.delete("http://88.197.53.80/kostoumart-api/tps", {params: { name: this.state.selectedTPName }})
            axios.delete("http://localhost:8108/tps", {params: { name: this.state.selectedTPName }})
            .then(res=> {
                if(res.statusText ==="OK"){
                    let ret=this.createNotification("delete-success");
                    this.getTPs();
                    this.state.selectedTPName = "";
                    return ret;
                }
            })
        }
    }

    renderTableData() {
        return this.state.data.map((tp, index) => {
            const { theatrical_play_id, title, date, actors, director, theater } = tp //destructuring
            return (
                <TableRow key={theatrical_play_id}>
                <TableCell></TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell >{actors}</TableCell>
                <TableCell>{director}</TableCell>
                <TableCell>{theater}</TableCell>
                <TableCell><IconButton><DeleteIcon onClick={()=>{this.handleDelete(title);}}></DeleteIcon> </IconButton></TableCell>
                </TableRow>
            )
        })
    }


    render() {   
        this.deleteTP();
        return (
            <div>
                <DisplayMenu activeItem = 'tp'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Typography component="div">
                    <Paper className="root">
                        <Table className="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"><Checkbox/></TableCell>
                                    <TableCell><strong>Όνομα Παράστασης</strong></TableCell>
                                    <TableCell><strong>Χρονολογία</strong></TableCell>
                                    <TableCell><strong>Ηθοποιοί</strong></TableCell>
                                    <TableCell><strong>Σκηνοθέτης</strong></TableCell>
                                    <TableCell><strong>Θέατρο</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{this.renderTableData()} </TableBody>
                        </Table>
                    </Paper>
                </Typography>           
          </div>
        );
      }

}

export default DisplayTPs;