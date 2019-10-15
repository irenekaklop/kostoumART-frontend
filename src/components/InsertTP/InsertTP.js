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
            }
            else{
                alert(result.error);}
            }
            );  
    }

    enableSubmit(){
        if(this.state.name && this.state.theater){
            this.state.submit = true;
        }
    }

    render(){
       if (sessionStorage.getItem('tpData')){
            sessionStorage.setItem('tpData','');
            sessionStorage.clear();
        }
        return(
            <div className="main"> 
            {this.enableSubmit()}
            <InsertMenu activeItem='tp'></InsertMenu>
                <Form>
                    <Form.Field required>
                        <label>Όνομα Παράστασης</label>
                        <Input type="text" name="name" placeholder="Τίτλος παράστασης" onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                    <Form.Field required>
                    <label>Θέατρο</label>
                        <Input type="text" name="theater" onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Σκηνοθέτης</label>
                        <Input type="text" name="director" onChange={this.onChange}/>
                    </Form.Field>
                    </Form.Group>
                    <button type="submit" className="button-save" onClick={this.insert}>Save</button>
                    
                </Form>
            </div>

        );
    }
}

export default InsertTP;