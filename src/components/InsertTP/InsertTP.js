import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import { TextArea, GridRow, Container } from 'semantic-ui-react';
import {use_categories} from '../../utils/options';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Insert from '../Insert/Insert';

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
            <Insert activeItem='tp'></Insert>
                <form className="form">
                    <Container>
                        <label> <h4>Όνομα Παράστασης</h4>
                        <input className="small-input" type="text" name="name" onChange={this.onChange}/></label>
                        <label><h4>Θέατρο</h4>
                        <input className="small-input" type="text" name="theater" onChange={this.onChange}/></label>
                        <label><h4>Σκηνοθέτης</h4>
                        <input className="small-input" type="text" name="director" onChange={this.onChange}/></label>
                    <button disabled = {!this.state.submit} type="submit" className="button-save" onClick={this.insert}>Save</button>
                    </Container>
                </form>
            </div>

        );
    }
}

export default InsertTP;