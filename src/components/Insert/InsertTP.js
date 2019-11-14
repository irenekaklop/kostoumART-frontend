import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import { TextArea, GridRow, Container, Form, Input } from 'semantic-ui-react';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InsertMenu from './InsertMenu';
import "./InsertMenu";
import axios from "axios";
import { TextField, Button, Paper } from '@material-ui/core';

class InsertTP extends Component{
    constructor(props){
        super(props);
        this.state = { 
            tpData: '',
            name: '',
            theater: '',
            date: '',
            actors: '',
            director: '',
            submit: false,
            redirectToReferrer: false,
            //Select
            selectedCategoryOption: '',
            /////////////////////////
            cond1: false,
            cond2: false
        };
        this.insert = this.insert.bind(this);
    }

    componentDidMount(){
        this.getTPs();
    }
    
    createNotification(type){
        switch (type) {
            case "error1":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Διάλεξε άλλη κατηγορία χρήσης ή διαφορετικό όνομα','Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                    </div>
                )
            case "error2":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.warning('Too big description!', "Text should be under 300 characters") }</NotificationContainer>
                    </div>
                )
            case "insert-success":
                return(
                    <NotificationContainer>{ NotificationManager.success('Success!') }</NotificationContainer>
                )
            case "error-missing-value":
                return(
                    <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                      )
        };
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    getTPs = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/tps")
        axios.get("http://localhost:8108/tps")
        .then(res => {
            const tpData = res.data.response;
            this.setState({ tpData });
            console.log(this.state);
        }
        )
    }

    tp_exists(){
        const tp_list = this.state.tpData;
        //check this name and use category already exist
        for(var i=0; i < tp_list.length; i++){
            if(tp_list[i].title === this.state.name){
                return true;
            }
        }
        return false;
    }
    
    insert(){
        let data ={title: this.state.name, date: this.state.date, actors: this.state.actors, director: this.state.director, theater: this.state.theater};
        axios.post("http://88.197.53.80/kostoumart-api/tps", data)
        //axios.post('http://localhost:8108/tps', data)
        .then(res => {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("insert-success");
                this.clearData();
                return ret;
            }
          })    

    }

    validate(){
        if(this.state.name && this.state.theater){
            //Check if exists
            if(this.tp_exists()){
                let ret=this.createNotification("error1");
                return ret;
            }
            else{
                this.insert();
            }
        }
        else if(!this.state.name || !this.state.theater){
            let result=this.createNotification("error-missing-value");
            return result;
        }
    }

    clearData(){
        this.setState( { 
            tpData: '',
            name: '',
            theater: '',
            date: '',
            actors: '',
            director: '',
            submit: false,
            redirectToReferrer: false,
            //Select
            selectedCategoryOption: '',
            /////////////////////////
            cond1: false,
            cond2: false
        });
    }

    handleSubmit = () => {
        this.validate();
    }

    render(){
        //To clear values after
        const {name, theater, director, date} = this.state;

        if (sessionStorage.getItem('tpData')){
                sessionStorage.setItem('tpData','');
                sessionStorage.clear();
            }

        return(
            <div className="main-area"> 
            <InsertMenu activeItem='tp'></InsertMenu>
            <NotificationContainer></NotificationContainer>
            <Paper className="form">
                <form onSubmit={this.handleSubmit}>
                   <TextField  required label="Όνομα Παράστασης" name="name" value={name} onChange={this.onChange}></TextField>
                    <br/>
                    <TextField  required label="Ημερομηνία" name="date" value={date} onChange={this.onChange}></TextField>
                    <br/>
                    <TextField  required label="Σκηνοθέτης" name="director" value={director} onChange={this.onChange}></TextField>
                    <br/>
                    <TextField  required label="Θέατρο" name="theater" value={theater} onChange={this.onChange}></TextField>
                    <br/> <br/><br/><br/>
                    <div className="button-submit">
                        <Button  variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                    </div>
                </form>
                
            </Paper>
                
               
            </div>

        );
    }
}

export default InsertTP;