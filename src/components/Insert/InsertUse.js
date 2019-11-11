import React, {Component} from 'react';
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import { TextArea, GridRow, Container, Form, Input, FormSelect } from 'semantic-ui-react';
import {use_categories} from '../../utils/options';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InsertMenu from './InsertMenu';
import axios from 'axios';

class InsertUse extends Component{
    constructor(props){
        super(props);
        this.state = { 
            u_data: '',
            use_category: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            exists:'',
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
            /////////////////////////
            cond1: false,
            cond2: false
        };
        this.insert = this.insert.bind(this);
    }

    /*Secure way to getData*/
    componentDidMount(){
        this.get_uses();
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

    onSelect = ( selectedCategoryOption ) => { 
        this.setState({ selectedCategoryOption }); 
        console.log(this.state)
    };

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    decription_legnth(){
        return this.state.description.length;
    }

    /* Get uses from database*/ 
    get_uses = _ => {
        axios.get("http://88.197.53.80/kostoumart-api/uses")
        //axios.get("http://localhost:8108/uses")
        .then(res => {
            const u_data = res.data.response;
            this.setState({ u_data });
            console.log(this.state);
        }
        )
    }

    use_exists(){
        const uses_list = this.state.u_data;
        //check this name and use category already exist
        for(var i=0; i < uses_list.length; i++){
            if(uses_list[i].use_category=== this.state.use_category && uses_list[i].name === this.state.name){
                return true;
            }
        }
        return false;
    }

    validate(){ 
        var ret = null;
        //if everything is submitted
        if(this.decription_legnth() < 300 && this.decription_legnth() > 0){
            this.state.cond1 = true;
        }
        else if(this.decription_legnth() > 300){
            console.log("too big description or nothing");
            ret=this.createNotification("error2");
            this.state.cond1 = false;
            return ret;
        }

        if(this.state.name && this.state.selectedCategoryOption){
            //Check if entry already exists
            this.state.use_category=this.state.selectedCategoryOption.value;
            if(this.use_exists()){
                ret=this.createNotification("error1");
                this.state.cond2 = false;
                return ret;
            }
            else{
                this.insert();
            }
        }

        if(!this.state.description || !this.state.name || !this.state.selectedCategoryOption){
            console.log("something is missing");
            var result=this.createNotification("error-missing-value");
            return result;
        }
        
        return ret;
    }

    insert(){
        this.state.use_category=this.state.selectedCategoryOption.value;
        const data = { name: this.state.name, category: this.state.use_category, description: this.state.description, customs: this.state.description }
        axios.post("http://88.197.53.80/kostoumart-api/uses", data)
        //axios.post('http://localhost:8108/uses', data)
        .then(res => {
            if(res.statusText ==="OK"){
                let ret=this.createNotification("insert-success");
                this.clearEntries();
                return ret;
            }
          })    

    }

    handleSubmit = () => {
        this.validate();
    }

    clearEntries(){
        this.setState({ useData: '',
        use_category: '',
        name: '',
        description: '',
        customs: '',
        other_use: '',
        exists:'',
        description_MAXlegnth: 300,
        description_status: false,
        submit: false,
        redirectToReferrer: false,
        //Select var
        selectedCategoryOption: '', cond1: false, cond2: false});
    }

    render(){
        //Select vars
        const {selectedCategoryOption}= this.state;
        const {name, description, customs} =this.state;
        return(
            <div className="main"> 
            <InsertMenu activeItem='use'></InsertMenu>
                <NotificationContainer></NotificationContainer>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Field required>
                                <label> Όνομα Δραστηριότητας </label> 
                                <Input type="text" name="name" value={name} onChange={this.onChange}/>
                            </Form.Field>
                            <Form.Field required>
                            <label> Κατηγορία χρήσης</label>
                            <Select
                                    value = {selectedCategoryOption}                           
                                    maxMenuHeight={150}
                                    closeMenuOnSelect={true}
                                    onChange = {this.onSelect}
                                    options = {use_categories}
                                />
                            </Form.Field>
                        </Form.Group>
                       
                        <Form.Field required>
                        <label>Περιγραφή</label> 
                            <TextArea className="textarea" type="text" name="description" value={description} onChange={this.onChange} ></TextArea>
                            <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                        </Form.Field>
                        <Form.Field>
                            <label>Ήθη/Έθιμα</label> 
                            <input className="small-input" type="text" name="customs" value={customs} onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></input>
                        </Form.Field>
                        <Form.Button color='teal' content='Submit' />
                </Form>
            </div>

        );
    }
}

export default InsertUse;