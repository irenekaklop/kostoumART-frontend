import React, {Component} from 'react';
import Select from 'react-select';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import "./Forms.css";
import {SaveButton, CancelButton} from "../Shared/Buttons.js";
import axios from 'axios';

class TpForm extends Component{

    constructor(props){
        super(props);
        this.state = { 
            tp_data: null,
            theatrical_play_id: '',
            name: '',
            theater: '',
            date: [],
            actors: '',
            director: '',
            years: [],
            user_id: this.props.user,
            submit: false,
            redirectToReferrer: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        var startYear=1800;
        for(var i=0; i < 100; i++){
            this.state.years.push({value: (startYear+i).toString(), label:  startYear+i});
        }
        if(this.props.editing){
            let d_arr=[];
            if(this.props.tp.date){
            if(this.props.tp.date.includes(",")){
                d_arr = this.props.tp.date.split(",");

            }
            else if(this.props.tp.date.length===0){
                d_arr = []
            }
            else{
                d_arr = [this.props.tp.date];
            }}
            let arrDates=[];
            for(var i=0; i < d_arr.length; i++){
                arrDates.push({value: d_arr[i], label: d_arr[i]})
            }
            this.setState({
                tp: this.props.tp,
                name: this.props.tp.title,
                theater: this.props.tp.theater,
                actors: this.props.tp.actors,
                director: this.props.tp.director,
                date: arrDates,
                theatrical_play_id: this.props.tp.theatrical_play_id,
                tp_data: this.props.theatrical_plays
                })
        }
        console.log("TP state", this.state)
        console.log("TP props", this.props)
    }

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    handleDateSelect = (date) => {
        console.log(date)
        this.setState({date})
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    handleSubmit = () => {
        if(this.formValidate()){
            if(this.props.editing){
                this.handleUpdate();
            }
            else{
                this.handleInsert();
            }
        }
    }

    handleUpdate(){
        let dates='';
        for(var i=0; i < this.state.date.length; i++){
            dates = dates+this.state.date[i].value;
            if(i != this.state.date.length-1){
                dates=dates+','
            }
        }
        let data ={theatrical_play_id: this.state.theatrical_play_id, title: this.state.name, date: dates, actors: this.state.actors, director: this.state.director, theater: this.state.theater, userId: this.state.user_id};
        //axios.post('http://88.197.53.80/kostoumart-api//edit_tp', data)
        axios.post('http://localhost:8108/edit_tp', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        let dates='';
        for(var i=0; i < this.state.date.length; i++){
            dates = dates+this.state.date[i].value;
            if(i != this.state.date.length-1){
                dates=dates+','
            }
        }
        console.log("dates", dates);
        let data ={title: this.state.name, date: dates, actors: this.state.actors, director: this.state.director, theater: this.state.theater, userId: this.state.user_id};
        //axios.post("http://88.197.53.80/kostoumart-api/tps", data)
        axios.post('http://localhost:8108/tps', data)
        .then(res => {
            if(res.statusText == 'OK'){
                this.createNotification('insert')
            }
          })
    }

    formValidate(){
        if(!this.state.name || !this.state.theater || !this.state.director){
            console.log("something is missing");
            this.createNotification('error-missing-value')
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        return true;
    }

    handleDuplicate (){
        const tp_list = this.props.theatrical_plays;
        //check this name and use category already exist
        for(var i=0; i < tp_list.length; i++){
            console.log(tp_list[i].title, this.state.name )
            if(tp_list[i].title === this.state.name){
                if(this.props.editing){
                    if(this.props.tp.title === this.state.name){
                        return false;
                    }
                }
                console.log("already exists this name")
                this.createNotification('error-duplicate')
                return true;
            }
        }
        return false;
    }
       
    resetForm() {
        this.setState( { 
            theatrical_play_id: '',
            name: '',
            theater: '',
            date: [],
            actors: '',
            director: '',
            user_id:'',
            submit: false,
            redirectToReferrer: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        });
    }

    createNotification(type){
        if(type === "error-description"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Text should be under 300 characters",'Too big description!', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-duplicate"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error('Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-missing-value"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "insert"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή καταχωρήθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
        else if (type === "update"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή ανανεώθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
    }


    render(){
        const {name, theater, director, date} = this.state;
        console.log(this.state)
        
        return(
            <React.Fragment>
                <div id="ADD">
                    <div id="FormTitle">Θεατρική παράσταση</div><br/>
                    <NotificationContainer>{this.createNotification()}</NotificationContainer>
                    <form id="Form" onSubmit={this.handleSubmit}>
                        <div id='Name'>
                            <div id='NameArea'>
                                <div id="NameLabel">
                                    <span>ONOMA ΠΑΡΑΣΤΑΣΗΣ *</span>
                                </div>
                                <input
                                id="TextArea"
                                type='text'
                                name="name" 
                                value={name} 
                                onChange={this.onChange}
                                required={true}
                                />
                            </div>    
                        </div>
                        <br/>
                        <div id='Director'>
                            <div id='DirectorArea'>
                                <div id='DirectorLabel'>
                                <span>ΣΚΗΝΟΘΕΤΗΣ *</span>
                                </div>
                            <input
                            id="TextArea"
                            type='text'
                            name="director"
                            value={director} 
                            onChange={this.onChange}
                            required={true}
                            />
                            </div>
                        </div>
                        <br/>
                        <div id='Theater'>
                            <div id='TheaterArea'>
                                <div id='TheaterLabel'>
                                    <span>ΘΕΑΤΡΟ</span>
                                </div>  
                                <input
                                id="TextArea"
                                type='text'
                                name="theater"
                                value={theater} 
                                onChange={this.onChange}
                                required={false}
                                />
                            </div>
                        </div>
                        <br/>
                        <div id='TPDate'>
                            <div id='TPDateArea'>
                                <div id='TPDateLabel'>
                                <span>XΡΟΝΟΛΟΓΙΑ</span>
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                placeholder={''}
                                isMulti
                                name="date"
                                options={this.state.years}
                                value={date}
                                onChange={this.handleDateSelect}
                                closeMenuOnSelect={true} 
                                />
                            </div>
                        </div>
                        <br/><br/><br/>   
                        <div onClick={this.handleSubmit}><SaveButton id="ButtonSave" /></div>
                        <div onClick={this.props.handleClose}><CancelButton id="ButtonCancel" /></div>
                    </form>
                </div>            
            </React.Fragment>
        )
    }
}

export default TpForm;