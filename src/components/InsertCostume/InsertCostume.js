import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import "./InsertCostume.css";
import "../Geosuggest/Geosuggest.css";
import { TextArea, GridRow, Container } from 'semantic-ui-react';
import Geosuggest from 'react-geosuggest';
import {sexs, materials, techniques} from "../../utils/options";
import CreatableSelect from 'react-select/creatable';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

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
            //Uses' data
            u_data:[],
            usesData: '',
            //for Use suggestion on insert
            u_value: '', 
            newValue: '',
            //Theatrical Plays data
            TP_data:[],
            TPData: '',
            tp_value:'',
            newTPvalue: '',
            //For backend insert
            actors: '',
            designer: '',
            parts: '',
            //Material data on insert
            m_value: '',
            //Technique data on insert
            t_value: '',
            //Sex data on insert
            s_value: '',
            //Select
            selectedSexOption: null,
            selectedUseOption: null,
            selectedMaterialOption: null,
            selectedTechniqueOption: null,
            selectedTPOption: null,
            //Geosuggest
            location:'',
            location_select:'',
            location_infuence:'',
            location_infuence_select:'',

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

    /*Secure way to getData*/
    componentDidMount(){
        this.get_uses();
        this.get_theatrical_plays();
    }

    /*Geosuggest functions*/
    handleLocationChange = location_select => {
        this.setState({ location_select });
        console.log("HandleLocationChange:", this.state);
    };

    handleLocationSelect = (location_select) => {
        this.setState({ location_select });
        console.log(`Option selected:`, location_select);
    }

    handleLocationInfluenceChange = location_influence_select => {
        this.setState({ location_influence_select });
        console.log("HandleLocationChange:", this.state);
    };

    handleLocationInfluenceSelect = (location_infuence_select) => {
        this.setState({location_infuence_select });
        console.log(`Option selected:`, location_infuence_select);
    }
    
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log(this.state);
        }
    }

    handleLocationInfluence(){
        if(this.state.location_infuence_select){
            this.state.location_infuence = this.state.location_infuence_select.description;
            console.log(this.state);
        }

    }

    /*Functions for description legnth and validation*/
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

    /*For selection of use categories*/
    handleUseSelect = (selectedUseOption) => {
        this.setState({selectedUseOption});
        console.log(`Option selected:`, selectedUseOption);
    }

    /*For selection of theatrical plays*/
    handleTPSelect = (selectedTPOption) => {
        this.setState({selectedTPOption});
        console.log(`Option selected:`, selectedTPOption);
    }

    /*For mutli-selection of sex categories*/
    handleSexSelect = (selectedSexOption) => {
        this.setState({ selectedSexOption });
        console.log(`Option selected:`, selectedSexOption);
    }

    handleMaterialSelect = (selectedMaterialOption) => {
        this.setState({ selectedMaterialOption });
        
        console.log(`Option selected:`, selectedMaterialOption);
    }

    handleTechniqueSelect = (selectedTechniqueOption) => {
        this.setState({ selectedTechniqueOption });
        console.log(`Option selected:`, selectedTechniqueOption);
    }

    /*Change functions for text fields*/
    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); };

    /*Change functions for auto-suggest field*/
    onChangeValue = ( e, {newValue, method}) => {
        this.setState({
            value: newValue
        })
    };

    /*Functions for use suggestions -- NOT USED*/
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

    /* Get uses from database*/ 
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


    /*Get Theatrical Plays from database*/
    get_theatrical_plays(){
        PostData('get_theatrical_plays', this.state).then((result) => {
            let responseJson = result;
            if(responseJson.TPData){
                sessionStorage.setItem("TPData",JSON.stringify(responseJson));
                this.setState({TP_data: responseJson.TPData});
                console.log("Theatrical Plays",this.state);
            }
            else{
                alert(result.error);
            }
        });
    }
    
    /*Insert of costume*/

    insert() {
        if(this.state.name && this.state.description_status){
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

        //For selection of Sex: 
        const {selectedSexOption} = this.state;
        //For selection of Use:
        const {selectedUseOption} = this.state;
        //For selection of Material
        const {selectedMaterialOption} = this.state;
        //For selection of Technique
        const {selectedTechniqueOption} = this.state;
        //For selection of Theatrical Plays
        const {selectedTPOption} = this.state;

        const u_options = [];
        const p_options = [];

        for (var key in this.state.u_data){
            u_options.push( {label: this.state.u_data[key].name, value: this.state.u_data[key].name});
        }

        for (var key in this.state.TP_data){
            p_options.push({label: this.state.TP_data[key].title, value:  this.state.TP_data[key].title}); 
        }

        console.log(this.state);
        console.log(u_options, sexs);
       
        this.handleValidation();

        return ( 
                <div className="main"> 
                <form className="form">
                   <Container>
                   <div style={{ width: '100%' }}>
                        <label> Τίτλος
                        <input className="small-input" type="text" name="name" placeholder="Name" onChange={this.onChange}/></label>
                        </div>
                        <div style={{ width: '100%' }}>
                        <label>Περιγραφή</label> 
                        <TextArea className="textarea" type="text" name="descr" onChange={this.onChange} maxLength={this.state.description_MAXlegnth}></TextArea>
                        <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                        </div>
                   </Container>
                   <hr></hr>
                   <Box display="flex" flexDirection="row">
                       <Box  style={{ width: '50%' }}>
                        <label> Χρήση
                                <Select className = "select-box"
                                    value = {selectedUseOption}
                                    options = {u_options}
                                    maxMenuHeight={200}
                                    onChange = {this.handleUseSelect}
                                    closeMenuOnSelect={true}  
                                    isSearchable            
                                />
                            </label>
                       </Box>
                       <Box  style={{ width: '50%' }}>
                            <label> Φύλο
                                <Select className = "select-box"
                                    value = {selectedSexOption} 
                                    isMulti                                
                                    maxMenuHeight={150}
                                    closeMenuOnSelect={true}
                                    onChange = {this.handleSexSelect}
                                    options = {sexs}
                                    ignoreAccents      
                                />
                            </label>
                        </Box>
                   </Box>
                   <br></br>
                    <Box display="flex" flexDirection="row">
                        <Box  style={{ width: '50%' }}>
                        <label> Υλικό
                            <CreatableSelect  className="select-box"
                                isClearable
                                onChange={this.handleMaterialSelect}
                                value = {selectedMaterialOption}
                                options = {materials}
                                maxMenuHeight={200}
                                closeMenuOnSelect={true}  
                                isSearchable   
                                ignoreAccents                
                            />
                        </label>
                        </Box>
                        <Box  style={{ width: '50%' }}>
                        <label> Τεχνική
                            <CreatableSelect  className="select-box"
                                isClearable
                                onChange={this.handleTechniqueSelect}
                                value = {selectedTechniqueOption}
                                options = {techniques}
                                maxMenuHeight={200}
                                closeMenuOnSelect={true}  
                                isSearchable        
                                ignoreAccents                 
                            />
                        </label>
                        </Box>
                    </Box>
                    <br></br>
                    <label> Σχεδιαστής
                    <input className="small-input" type="text" name="designer" onChange={this.onChange}/> </label> 
                    <hr></hr>
                    <Box display="flex" flexDirection="row" >
                        <Box style={{ width: '50%' }}> 
                        <label> Περιοχή Αναφοράς
                        <Geosuggest
                            onChange={this.handleLocationChange}
                            onSuggestSelect={this.handleLocationSelect}
                        />
                        {this.handleLocation()}
                        </label>
                        </Box>
                       <Box style={{ width: '50%' }}>
                       <label> Χώρα/Περιοχή Επιρροής 
                            <Geosuggest
                                onChange={this.handleLocationInfluenceChange}
                                onSuggestSelect={this.handleLocationInfluenceSelect}
                            />
                            {this.handleLocation()}
                            {this.handleLocationInfluence()}
                        </label>
                       </Box>
                   </Box>
                   <hr></hr>
                    <label> Θεατρικές Παραστάσεις
                        <Select className = "select-box"
                            value = {selectedTPOption}
                            options = {p_options}
                            maxMenuHeight={200}
                            onChange = {this.handleTPSelect}
                            closeMenuOnSelect={true}  
                            isSearchable            
                        /> </label>
                        <br></br>
                    <label> Ηθοποιοί
                    <input className="small-input" type="text" name="actors" onChange={this.onChange}/> </label> 
                    <br></br>
                    <label> Ρόλος
                    <input className="small-input" type="text" name="parts" onChange={this.onChange}/> </label> 
                    <br></br>
                    <button disabled = {!this.state.submit} type="submit" className="button-save" onClick={this.insert}>Save</button>
                </form>
                </div>
                
        );
    }
}

export default InsertCostume;

