import React, { Component } from "react";
import Autosuggest from 'react-autosuggest';
import "./Autocomplete.css"
import { PostData } from '../../services/PostData';

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


export default class Autocomplete extends Component{

    constructor(props){
        super(props);
        this.state = {
            data:[],
            costumeData: '',
            value: '',
            suggestions: []
        };
        this.get_costumes = this.get_costumes.bind(this);
    }

    onChange = ( event, {newValue, method}) => {
        this.setState({
            value: newValue
        })
    };

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

    get_costumes(){
        PostData('costumes', this.state).then((result) => {
            let responseJson = result;
            if(responseJson.costumeData){
                sessionStorage.setItem("costumeData",JSON.stringify(responseJson));
                this.setState({data: responseJson.costumeData});
                console.log(this.state);
            }
            else{
                alert(result.error);
            }
        });
    }

    render(){
        this.get_costumes();
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Type something",
            value,
            onChange: this.onChange
        };
        console.log(this.state);
        return(
            <Autosuggest 
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps} />
        );
    }
}