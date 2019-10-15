import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import { TextArea, GridRow, Container, Form, Input, FormSelect } from 'semantic-ui-react';
import {use_categories} from '../../utils/options';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InsertMenu from '../InsertMenu/InsertMenu';

class InsertUse extends Component{
    constructor(props){
        super(props);
        this.state = { 
            useData: '',
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

    enableSubmit(){ 
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
        else{
            this.state.cond1 = false;
        }

        if(this.state.name && this.state.selectedCategoryOption){
            //Check if entry already exists
            this.state.use_category=this.state.selectedCategoryOption.value;
            PostData('existsUse',this.state).then((result) => {
                if(result.exists ==='true'){
                    if(this.state.useData===''){ 
                        console.log("already exists");
                        if(this.state.useData === ""){ //To prevent notification after insert()
                            ret=this.createNotification("error1");
                            this.state.cond2 = false;
                            return ret;
                        }
                    }
                }
                else{
                    this.state.cond2 = true;
                }
            })     
            
        }
        
        if(this.state.cond1 && this.state.cond2){
            this.state.submit = true;
        }
        
        return ret;
    }

    insert(){
        this.state.use_category=this.state.selectedCategoryOption.value;
        PostData('insertUse',this.state).then((result) => {
            let responseJson = result;
            if(responseJson.useData){
                sessionStorage.setItem('useData',JSON.stringify(responseJson));
                //this.setState({redirectToReferrer: true});
                //<ReactNotification name="notifications"/>
                let ret=this.createNotification("insert-success");
                console.log(ret);
                return ret;
            }
            else{
                alert(result.error);}
                console.log(responseJson);
            });
            
    }

    handleSubmit = () => {
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
        this.insert();
    }

    render(){
        //Select vars
        const {selectedCategoryOption}= this.state;
        const {name, description, customs} =this.state;
        return(
            <div className="main"> 
            <InsertMenu activeItem='use'></InsertMenu>
                <NotificationContainer>{this.enableSubmit()}</NotificationContainer>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label> Όνομα Δραστηριότητας </label> 
                                <Input type="text" name="name" value={name} onChange={this.onChange}/>
                            </Form.Field>
                            <Form.Field>
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
                       
                        <Form.Field>
                        <label>Περιγραφή</label> 
                            <TextArea className="textarea" type="text" name="description" value={description} onChange={this.onChange} ></TextArea>
                            <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                        </Form.Field>
                        <Form.Field>
                            <label>Ήθη/Έθιμα</label> 
                            <input className="small-input" type="text" name="customs" value={customs} onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></input>
                        </Form.Field>
                        <Form.Button disabled={!this.state.submit} color='teal' content='Submit' />
                </Form>
            </div>

        );
    }
}

export default InsertUse;