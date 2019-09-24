import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import {InsertData} from '../../services/InsertData';
import {Redirect} from 'react-router-dom';

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}
  
function renderSuggestion(suggestion) {
    return (
      <span>{suggestion.name}</span>
    );
}

class InsertCostume extends Component {
    constructor(props){
        super(props);
        this.state = {
        name: '',
        descr: '',
        //date: '',
        //sex: '',
        //Uses' data
        u_arrdata:[],
        u_data: '',
        //for Use suggestion
        u_value: '',
        u_suggestion: [],
        redirectToReferrer: false
        };
        this.insert = this.insert.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    /*Functions for use suggestions*/

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value)
        });
    };
    
    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
    };

    getSuggestions(value) {
        const escapedValue = escapeRegexCharacters(value.trim());
        
        if (escapedValue === '') {
          return [];
        }
      
        const regex = new RegExp('^' + escapedValue, 'i');
      
        return this.state.data.filter(costumeData => regex.test(costumeData.name));
    };

    /* Get uses' data */ 

    get_uses(){
        InsertData('get_uses', this.state).then((result) => {
            let responseJson = result;
            if(responseJson.usesData){
                sessionStorage.setItem("u_data",JSON.stringify(responseJson));
                this.setState({u_arrdata: responseJson.usesData});
                console.log(this.state);
            }
            else{
                alert(result.error);
            }
        });
    }

    /*Insert of costume*/

    insert() {
        if(this.state.name && this.state.descr){
            InsertData('insertCostume',this.state).then((result) => {
            let responseJson = result;
            if(responseJson.costumeData){
                sessionStorage.setItem('costumeData',JSON.stringify(responseJson));
                this.setState({redirectToReferrer: true});
            }
            else
                alert(result.error);
            });
        }
    }

    render() {
        if (this.state.redirectToReferrer) {
            return (
                sessionStorage.setItem('costumeData',''),
                sessionStorage.clear(),
                <Redirect to={'/success'}/>)
        }
        else if (sessionStorage.getItem('costumeData')){
            sessionStorage.setItem('costumeData','');
            sessionStorage.clear();
        }
        this.get_uses();
        return (
            <div className="row " id="sBody">
            <div className="medium-5 columns left">
            <h4>Insert Costume Data</h4>
            <input type="text" name="name" placeholder="Name" onChange={this.onChange}/>
            <input type="text" name="descr" placeholder="Description" onChange={this.onChange}/>
            <input type="submit" className="button" value="Save" onClick={this.insert}/>
            </div>
            </div>
        );
    }
}
export default InsertCostume;