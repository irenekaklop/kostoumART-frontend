import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import "./InsertCostume.css";
import { TextArea } from 'semantic-ui-react';

const sex_data = [{
    label: 'Γυναίκα',
    value: 'female_adult'
  },
  {
    label: 'Adras',
    value: 'male_adult'
    },
    {
      label: 'Koritsi',
      value: 'female_young'
    },
    {
      label: 'Agori',
      value: 'male_young'
    },
    {
      label: 'Brefos',
      value: 'Toodler'
}];

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
            //Sex data on insert
            s_value: '',
            //Uses' data
            u_data:[],
            usesData: '',
            //for Use suggestion on insert
            u_value: '', 
            newValue: '',
            //Select
            selectedSexOption: null,
            selectedUseOption: null,

            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false
        };
        this.insert = this.insert.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.get_uses = this.get_uses.bind(this);
    }

    decription_legnth(){
        return this.state.descr.length;
    }

    handleValidation(){
        if(this.decription_legnth() < 300){
            this.state.description_status = true;
        }

        if(this.state.name &&  this.state.description_status && this.state.selectedSexOption && this.state.selectedUseOption){
            this.state.submit = true;
        }
    }

    /*For mutli-selection of sex categories*/
    handleSelect = (selectedSexOption) => {
        this.setState({ selectedSexOption });
        console.log(`Option selected:`, selectedSexOption);
    }

    handleInputChange = (newValue) => {
        this.setState({newValue});
        console.log(`Option selected:`, newValue);

    };

    /*For selection of use categories*/
    handleUseSelect = (selectedUseOption) => {
        this.setState({selectedUseOption});
        console.log(`Option selected:`, selectedUseOption);
    }

    /*Change functions for text fields*/
    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    /*Change functions for auto-suggest field*/
    onChangeValue = ( e, {newValue, method}) => {
        this.setState({
            value: newValue
        })
    };

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
      
        return this.state.u_data.filter(usesData => regex.test(usesData.name));
    };

    /* Get uses' data */ 

    get_uses(){
        PostData('get_uses', this.state).then((result) => {
            let responseJson = result;
            if(responseJson.usesData){
                sessionStorage.setItem("usesData",JSON.stringify(responseJson));
                this.setState({u_data: responseJson.usesData});
                console.log(this.state);
            }
            else{
                alert(result.error);
            }
        });
    }

    /*Insert of costume*/

    insert() {
        if(this.state.name && this.state.description_status && this.state.selectedSexOption && this.state.selectedUseOption){
            this.state.u_value = this.state.selectedUseOption.value;
            for(var key in this.state.selectedSexOption){
                    this.state.s_value = this.state.selectedSexOption[key].value;
                    PostData('insertCostume',this.state).then((result) => {
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

        //For selection of Sex: 
        const {selectedSexOption} = this.state;
    
        //For selection of Use:
        const {selectedUseOption} = this.state;
        const u_options = [];
        for (var key in this.state.u_data){
            u_options.push( {label: this.state.u_data[key].name, value: this.state.u_data[key].name});
        }
        console.log(this.state);
        console.log(u_options, sex_data);
       
        this.handleValidation();

        return ( 
            <div className="row " id="Body">
                <h4>Insert Costume Data</h4>
                <form>
                    <label>
                        Name:
                        <input type="text" name="name" placeholder="Name" onChange={this.onChange}/>
                    </label>
                    <label>Description:</label>
                    <TextArea type="text" name="descr" onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></TextArea>
                    <span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining
                    <label>
                        Use:
                        <Select className = "select-box"
                            value = {selectedUseOption}
                            options = {u_options}
                            maxMenuHeight={200}
                            onChange = {this.handleUseSelect}
                            closeMenuOnSelect={true}
                            
                        />
                    </label>
                    <label>
                        Sex:
                        <Select className = "select-box"
                            value = {selectedSexOption} 
                            isMulti
                            maxMenuHeight={150}
                            closeMenuOnSelect={true}
                            onChange = {this.handleSelect}
                            options = {sex_data}
                        />
                    </label>
                    <button disabled = {!this.state.submit} type="submit" className="button-save" onClick={this.insert}>Save</button>
                </form>
            </div>
        );
    }
}

export default InsertCostume;

