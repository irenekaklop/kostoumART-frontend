import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import { TextArea, GridRow, Container, Form, Input } from 'semantic-ui-react';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InsertMenu from '../InsertMenu/InsertMenu';
import "../InsertMenu/InsertMenu";

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

    insert(){
            PostData('insertTP',this.state).then((result) => {
            let responseJson = result;
            console.log(responseJson);
            if(responseJson.tpData){
                sessionStorage.setItem('tpData',JSON.stringify(responseJson));
                let ret = this.createNotification("insert-success");
                this.clearData();
                return ret;
            }
            else{
                alert(result.error);}
            }
            );  
    }

    validate(){
        if(this.state.name && this.state.theater){
            //Check if exists
            PostData('existTP', this.state).then((result) => {
                if(result.exists === 'true'){
                    if(this.state.tpData===''){ 
                        console.log("already exists");
                        let ret=this.createNotification("error1");
                        return ret;
                    }
                }
                else{
                    this.insert();
                }
            })
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
        const {name, theater, director} = this.state;

        if (sessionStorage.getItem('tpData')){
                sessionStorage.setItem('tpData','');
                sessionStorage.clear();
            }

        return(
            <div className="main"> 
            <InsertMenu activeItem='tp'></InsertMenu>
                <NotificationContainer></NotificationContainer>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field required>
                        <label>Όνομα Παράστασης</label>
                        <Input type="text" name="name" value={name} placeholder="Τίτλος παράστασης" onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                    <Form.Field required>
                    <label>Θέατρο</label>
                        <Input type="text" name="theater" value={theater} onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Σκηνοθέτης</label>
                        <Input type="text" name="director" value={director} onChange={this.onChange}/>
                    </Form.Field>
                    </Form.Group>
                    <Form.Button color='teal' content='Submit' />
                </Form>
            </div>

        );
    }
}

export default InsertTP;