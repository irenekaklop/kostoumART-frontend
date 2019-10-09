import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import Box from '@material-ui/core/Box';
import { TextArea, GridRow, Container } from 'semantic-ui-react';
import {use_categories} from '../../utils/options';

class InsertUse extends Component{
    constructor(props){
        super(props);
        this.state = { 
            useData: '',
            use_catergory: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
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

    insert(){
        PostData('insertUse',this.state).then((result) => {
            let responseJson = result;
            if(responseJson.useData){
                sessionStorage.setItem('useData',JSON.stringify(responseJson));
                this.setState({redirectToReferrer: true});
            }
            else
                alert(result.error);
            });
    }

    render(){
        if (this.state.redirectToReferrer) {
            return (
                sessionStorage.setItem('useData',''),
                sessionStorage.clear(),
                <Redirect to={'/success'}/>)
        }
        else if (sessionStorage.getItem('useData')){
            sessionStorage.setItem('useData','');
            sessionStorage.clear();
        }

        //Select vars
        const {selectedCategoryOption}= this.state;

        return(
            <div className="main"> 
                <form className="form">
                    <Box  style={{ width: '50%' }}>
                        <label> Κατηγορία χρήσης
                            <Select className = "select-box"
                                value = {selectedCategoryOption}                           
                                maxMenuHeight={150}
                                closeMenuOnSelect={true}
                                onChange = {this.onSelect}
                                options = {use_categories}
                                ignoreAccents      
                            />
                            </label>
                        </Box>
                    <div style={{ width: '100%' }}>
                        <label> Όνομα Δραστηριότητας
                        <input className="small-input" type="text" name="name" placeholder="Όνομα κατηγορίας" onChange={this.onChange}/></label>
                    </div>
                    <div style={{ width: '100%' }}>
                        <label>Περιγραφή</label> 
                        <TextArea className="textarea" type="text" name="description" onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></TextArea>
                        </div>

                    <div style={{ width: '100%' }}>
                        <label>Ήθη/Έθιμα</label> 
                        <input className="small-input" placeholder="Ήθη/Έθιμα" type="text" name="customs" onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></input>
                    </div>
                    <button disabled = {!this.state.submit} type="submit" className="button-save" onClick={this.insert}>Save</button>
                </form>
            </div>

        );
    }
}

export default InsertUse;