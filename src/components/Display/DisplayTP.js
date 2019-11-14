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
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from "@material-ui/core/Modal";
import { TextField, Button } from "@material-ui/core";


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
            //Edit
            editing: null,
            show: false,
            tp_data: null,
            //Entries
            title: '',
            actors: '',
            theater:'',
            director: '',
            date: '',
        };
        this.onChange = this.onChange.bind(this);
        this.getTPs = this.getTPs.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount(){
        this.getTPs();
    }
    
    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); 
        console.log("On change", this.state);
    }

    onChangeTitle = ( evt ) => { this.setState({ title: evt.target.value }); 
        console.log("On change title", this.state);
    }


    startEditing = id => {
        this.setState({editing: id});
        this.getTp(id);
        this.showModal();
    }

    stopEditing = id => {
        this.setState({editing: null})
        console.log(this.state);
    }

    showModal = () => {
        this.setState({ show: true });
    };
    
    hideModal = () => {
        this.setState({ show: false });
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
        };
    }

    handleEdit() {
        
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

    getTp(id) {
        const data = this.state.data;
        for(var i = 0; i < data.length; i++){
            if(data[i].theatrical_play_id===id){
                this.state.title=data[i].title;
            }
        }
    }

    handleDelete(selectedTPName) {
        this.setState({selectedTPName}); 
    }

    deleteTP(){
        console.log("selectedTPName:", this.state.selectedTPName);
        if(this.state.selectedTPName){
            axios.delete("http://88.197.53.80/kostoumart-api/tps", {params: { name: this.state.selectedTPName }})
            //axios.delete("http://localhost:8108/tps", {params: { name: this.state.selectedTPName }})
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
                <TableCell>
                    <IconButton><DeleteIcon onClick={()=>{this.handleDelete(title);}}></DeleteIcon></IconButton>
                    <IconButton><EditIcon onClick={() => this.startEditing(theatrical_play_id)}/></IconButton>
                    </TableCell>
                </TableRow>
            )
        })
    }


    render() {   
        this.deleteTP();
        const {title, theater, director} = this.state;
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
                <div
                >
                <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.show}
                onClose={this.hideModal}>
                    <div className='paper'>
                    <h2>Επεξεργασία Εγγραφής</h2>
                    {console.log("title", title)}
                    <TextField required label="Όνομα Παράστασης" defaultValue={title} value={title} onChange={this.onChangeTitle}></TextField>
                    <br></br>
                    <br></br>
                    <Button variant="contained" color="primary" onClick={this.hideModal}>Save</Button>
                    </div>
                </Modal>
                </div>
          </div>
        );
      }

}

export default DisplayTPs;