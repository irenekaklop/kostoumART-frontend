import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import "../Geosuggest/Geosuggest.css";
import { TextArea, GridRow, Container } from 'semantic-ui-react';
import Geosuggest from 'react-geosuggest';
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import CreatableSelect from 'react-select/creatable';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Insert from '../Insert/Insert';
import '../Insert/Insert.css';

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
            costumeData: '',
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
            location_influence:'',
            location_influence_select:'',

            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,

            /////////////////////////
            cond1: false,
            cond2: false
        };
        this.insert = this.insert.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.get_uses = this.get_uses.bind(this);
        this.enableSubmit = this.enableSubmit.bind(this);
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

    handleLocationInfluenceSelect = (location_influence_select) => {
        this.setState({location_influence_select });
        console.log(`Option selected:`, location_influence_select);
    }
    
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log(this.state);
        }
    }

    handleLocationInfluence(){
        if(this.state.location_influence_select){
            this.state.location_influence = this.state.location_influence_select.description;
            console.log(this.state);
        }

    }

    /*Functions for description legnth and validation*/
    decription_legnth(){
        return this.state.descr.length;
    }

    createNotification(type){
        switch (type) {
            case "error1":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                    </div>
                )
            case "error2":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.warning("Text should be under 300 characters",'Too big description!', 2000) }</NotificationContainer>
                    </div>
                )
            case "insert-success":
                return(
                    <NotificationContainer>{ NotificationManager.success('Entry is successfully inserted to DB','Success!',2000) }</NotificationContainer>
                )
            
        };
    }

    enableSubmit(){
        if(this.state.name){ //If name is given, check if it already exist
            PostData('costumeExists', this.state).then((result) => {
                let responseJson = result;
                console.log("result", responseJson);
                if(result.exists==='true'){
                    var result = null;
                    if(this.state.costumeData===""){ //To prevent notification after insert()
                        console.log("already exists");
                        result=this.createNotification("error1");
                        console.log(result);
                        this.state.cond1 = false;
                        return result;
                    }
                }
                else{
                    console.log("doesnt exists");
                    this.state.cond1=true;
                }
            })     
        }
        else{
            console.log("no name");
        }
        
        //if everything is submitted
        if(this.decription_legnth() < 300 && this.decription_legnth() > 0){
            console.log("ok legnth");
            this.state.cond2=true;
        }
        else if(this.decription_legnth() >= 300){
            this.state.submit = false;
            console.log("too big or too small description");
            this.state.cond2=false;
            var result=this.createNotification("error2");
            console.log(result);
            return result;
        }
        else{
            this.state.submit = false;
            this.state.cond2=false;
            return result;
        }

        if(this.state.name && this.state.descr && this.state.location && this.state.selectedMaterialOption
            && this.state.selectedSexOption && this.state.selectedTechniqueOption && this.state.selectedUseOption
            && this.state.location_influence && this.state.designer){
                if(this.state.cond1 && this.state.cond2){
                    this.state.submit = true;
                }
            }
        else{
            console.log("something is missing");   
        }

        return null;
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
        var result;
        this.state.u_value = this.state.selectedUseOption.value;
        this.state.t_value = this.state.selectedTechniqueOption.value;
        this.state.m_value = this.state.selectedMaterialOption.value;
        this.state.tp_value = "";
        for(var key in this.state.selectedSexOption){
                this.state.s_value = this.state.selectedSexOption[key].value;
                console.log("insert",this.state);
                PostData('insertCostume',this.state).then((result) => {
                let responseJson = result;
                if(responseJson.costumeData){
                    sessionStorage.setItem('costumeData',JSON.stringify(responseJson));
                    //this.setState({redirectToReferrer: true});
                    result=this.createNotification("insert-success");
                    console.log(result);
                    return result;
                }
                else
                    alert(result.error);
                });
       }    
    }

    render() {
       if (sessionStorage.getItem('costumeData')){
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

        /* Create Use Categories*/
        for (var key in use_categories){
            u_options.push( {label: use_categories[key].label, options: []});
        }

        for (var key in this.state.u_data){
            u_options.forEach(element => {
                if(element.label === this.state.u_data[key].use_category){
                    element.options.push({label: this.state.u_data[key].name, value: this.state.u_data[key].name});
                }
            });
        }
    
        /*For theatrical Plays*/
        for (var key in this.state.TP_data){
            p_options.push({label: this.state.TP_data[key].title, value:  this.state.TP_data[key].title}); 
        }

        console.log(this.state);
        console.log(u_options, sexs);
       
        return ( 
            
                <div className="main"> 
                <Insert activeItem ='costume'></Insert>
                <form className="form">
                
                <NotificationContainer>{this.enableSubmit()}</NotificationContainer>

                   <Container>
                        <label> <h4>Τίτλος</h4>
                        <input className="small-input" type="text" name="name" onChange={this.onChange}/></label>
                        
                        <label><h4>Περιγραφή</h4></label> 
                        <TextArea className="textarea" type="text" name="descr" onChange={this.onChange} /*maxLength={this.state.description_MAXlegnth}*/></TextArea>
                        <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                        
                    </Container>
                    <hr></hr>
                    <Container className='container'>
                        <label> <h4>Χρήση</h4>
                            <Select className = "select-Container" 
                                value = {selectedUseOption}
                                options = {u_options}
                                maxMenuHeight={200}
                                onChange = {this.handleUseSelect}
                                closeMenuOnSelect={true}  
                                isSearchable            
                            />
                            <a href='/insertUse'> Προσθήκη νέας χρήσης</a>
                        </label>
                        <label> <h4>Φύλο</h4>
                            <Select className = "select-Container"
                                value = {selectedSexOption} 
                                isMulti                                
                                maxMenuHeight={150}
                                closeMenuOnSelect={true}
                                onChange = {this.handleSexSelect}
                                options = {sexs}
                                ignoreAccents      
                            />
                        </label>
                        <label> <h4>Υλικό</h4>
                        <CreatableSelect  className="select-Container"
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
                        <label> <h4>Τεχνική</h4>
                            <CreatableSelect  className="select-Container"
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
                        <label> <h4>Σχεδιαστής</h4>
                        <input className="small-input" type="text" name="designer" onChange={this.onChange}/> </label> 
                       </Container>
                    
                    <hr></hr>

                    <Container display="flex" flexDirection="row" >
                        
                        <label> <h4>Περιοχή Αναφοράς</h4>
                        <Geosuggest
                            onChange={this.handleLocationChange}
                            onSuggestSelect={this.handleLocationSelect}
                        />
                        {this.handleLocation()}
                        </label>
                       
                     
                       <label> <h4>Χώρα/Περιοχή Επιρροής </h4>
                            <Geosuggest
                                onChange={this.handleLocationInfluenceChange}
                                onSuggestSelect={this.handleLocationInfluenceSelect}
                            />
                            {this.handleLocation()}
                            {this.handleLocationInfluence()}
                        </label>
                       
                   </Container>
                   <hr></hr>
                   <Container>
                   <label> <h4>Θεατρικές Παραστάσεις</h4>
                        <Select className = "select-Container"
                            value = {selectedTPOption}
                            options = {p_options}
                            maxMenuHeight={200}
                            onChange = {this.handleTPSelect}
                            closeMenuOnSelect={true}  
                            isSearchable            
                        /> </label>
                    <label> <h4>Ηθοποιοί</h4>
                    <input className="small-input" type="text" name="actors" onChange={this.onChange}/> </label> 
                    <label> <h4>Ρόλος</h4>
                    <input className="small-input" type="text" name="parts" onChange={this.onChange}/> </label> 
                    <br></br>
                    <button disabled = {!this.state.submit} type="submit" className="button-save" onClick={this.insert}>Save</button>
                   </Container>
                   
                </form>
                </div>
                
        );
    }
}

export default InsertCostume;

