import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom'; 
import Select from 'react-select';
import "../Geosuggest/Geosuggest.css";
import { TextArea, GridRow, Container, Form, Input, FormSelect } from 'semantic-ui-react';
import Geosuggest from 'react-geosuggest';
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import CreatableSelect from 'react-select/creatable';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InsertMenu from './InsertMenu';
import './Insert.css';
import axios from 'axios';

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
            cond2: false,
            cond3: false,
        };
        this.insert = this.insert.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.get_uses = this.get_uses.bind(this);
        this.validate = this.validate.bind(this);
    }

    /*Secure way to getData*/
    componentDidMount(){
        this.get_uses();
        this.get_theatrical_plays();
        this.getCostumes();
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
            case "error-missing-value":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                    </div>
                )
            case "insert-success":
                return(
                    <NotificationContainer>{ NotificationManager.success('Entry is successfully inserted to DB','Success!',2000) }</NotificationContainer>
                )
            
        };
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

    /*Get costumes from db*/
    
    getCostumes = _ => {
        //axios.get('http://88.197.53.80/kostoumart-api/costumes")
        axios.get("http://localhost:8108/costumes")
        .then(res => {
            const costumeData = res.data.response;
            this.setState({ costumeData });
            console.log(this.state);
        }
        )
    }

    /* Get uses from database*/ 
    get_uses = _ => {
        let self = this;
        //axios.get("http://88.197.53.80/kostoumart-api/uses")
        axios.get("http://localhost:8108/uses")
        .then(res => {
            const u_data = res.data.response;
            this.setState({ u_data });
            console.log(this.state);
        }
        )
    }

    /*Get Theatrical Plays from database*/
    get_theatrical_plays = _ => {
        //axios.get("ttp://88.197.53.80/kostoumart-api/tps")
        axios.get("http://localhost:8108/tps")
        .then(res => {
            const TP_data = res.data.response;
            this.setState({ TP_data });
            console.log(this.state);
        }
        )
    }
 

    clearData(){
        this.setState({costumeData: '',
        name: '',
        descr: '',
        //for Use suggestion on insert
        u_value: '', 
        newValue: '',
        //Theatrical Plays data
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
        cond2: false,
        cond3: false});
        this._geoSuggest.clear();
   
    }

    costume_exists(){
        const c_list = this.state.costumeData;
        //check if new name already exist
        for(var i=0; i < c_list.length; i++){
            if(c_list[i].name === this.state.name){
                return true;
            }
        }
        return false;
    }

    handleSubmit = () => {
        this.validate();
    }

    
    validate(){
        var cond1, cond2, cond3 = false;
        console.log(this.state);
        //if everything is submitted
        if(this.decription_legnth() < 300 && this.decription_legnth() > 0){
            cond1=true;
        }
        else if(this.decription_legnth() >= 300){
            console.log("too big or too small description");
            var result=this.createNotification("error2");
            console.log(result);
            return result;
        }

        if(this.state.name){ //If name is given, check if it already exist
            if(this.costume_exists()){ //costume already exists
                let result=this.createNotification("error1");
                return result;
            }
            else{
                console.log(cond1, cond3);
                cond2=true;
            }
        }
        
        if(this.state.location && this.state.selectedMaterialOption && this.state.selectedSexOption && this.state.selectedTechniqueOption && this.state.selectedUseOption){
            cond3 = true;
        }
        else if(!this.state.location || !this.state.name || !this.state.descr|| !this.state.selectedUseOption || !this.state.selectedTechniqueOption || !this.state.selectedMaterialOption){
            console.log("something is missing");
            var result=this.createNotification("error-missing-value");
            return result;
        }

        if(cond1 && cond2 && cond3){
            this.insert();
            console.log("insert");
        }
    }

    insert() {
        this.state.u_value = this.state.selectedUseOption.value;
        this.state.t_value = this.state.selectedTechniqueOption.value;
        this.state.m_value = this.state.selectedMaterialOption.value;
        if(this.state.selectedTPOption){
            this.state.tp_value = this.state.selectedTPOption.value;
        }
        for(var key in this.state.selectedSexOption){
                this.state.s_value = this.state.selectedSexOption[key].value;
                console.log("insert",key, this.state);
                let data = this.state;
                axios.post('http://88.197.53.80/kostoumart-api/costumes', data)
                //axios.post('http://localhost:8108/costumes', data)
                .then(res => {
                    if(res.statusText ==="OK"){
                        let ret=this.createNotification("insert-success");
                        this.clearData();
                        return ret;
                    }
                })    
       }
    }

    render() {
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

        const {name, descr, designer, actors, parts} = this.state;

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
                <InsertMenu activeItem ='costume'></InsertMenu>
                <NotificationContainer></NotificationContainer>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field required>
                        <label>Τίτλος</label>
                        <Input type="text" name="name" value={name} onChange={this.onChange}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Περιγραφή</label> 
                        <TextArea className="textarea" type="text" name="descr"  value={descr} onChange={this.onChange} /*maxLength={this.state.description_MAXlegnth}*/></TextArea>
                        <div className="remaining-chars"><span id="chars">{this.state.description_MAXlegnth-this.decription_legnth()}</span> characters remaining</div>
                    </Form.Field>                    
                    <hr></hr>
                    <Form.Group widths="equal">
                        <Form.Field required>
                            <label>Χρήση</label>
                            <Select
                                value = {selectedUseOption}
                                options = {u_options}
                                maxMenuHeight={200}
                                onChange = {this.handleUseSelect}
                                closeMenuOnSelect={true}  
                                isSearchable/>
                            <a href='/insert-use'> Προσθήκη νέας χρήσης</a>
                        </Form.Field>
                        <Form.Field required>
                        <label>Φύλο</label>
                            <Select 
                                value = {selectedSexOption} 
                                isMulti                                
                                maxMenuHeight={150}
                                closeMenuOnSelect={true}
                                onChange = {this.handleSexSelect}
                                options = {sexs}
                                ignoreAccents      
                        />
                        </Form.Field>
                        <Form.Field required>
                        <label>Υλικό</label>
                        <CreatableSelect
                            isClearable
                            onChange={this.handleMaterialSelect}
                            value = {selectedMaterialOption}
                            options = {materials}
                            maxMenuHeight={200}
                            closeMenuOnSelect={true}  
                            isSearchable                                   
                            ignoreAccents                
                        />
                        </Form.Field>
                        <Form.Field required>
                        <label>Τεχνική</label>
                            <CreatableSelect
                                isClearable
                                onChange={this.handleTechniqueSelect}
                                value = {selectedTechniqueOption}
                                options = {techniques}
                                maxMenuHeight={200}
                                closeMenuOnSelect={true}  
                                isSearchable        
                                ignoreAccents                 
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                    <label>Σχεδιαστής</label> 
                        <Input type="text" name="designer" value={designer} onChange={this.onChange}/>
                    </Form.Field>
                    <hr></hr>
                    <Form.Group widths="equal">
                        <Form.Field required>
                            <label>Περιοχή Αναφοράς</label>
                            <Geosuggest
                                ref={el=>this._geoSuggest=el}
                                onChange={this.handleLocationChange}
                                onSuggestSelect={this.handleLocationSelect}
                            />
                            {this.handleLocation()}
                        </Form.Field>
                        <Form.Field>
                        <label>Χώρα/Περιοχή Επιρροής</label>
                            <Geosuggest
                                onChange={this.handleLocationInfluenceChange}
                                onSuggestSelect={this.handleLocationInfluenceSelect}
                            />
                            {this.handleLocation()}
                            {this.handleLocationInfluence()}
                        </Form.Field>
                    </Form.Group>
                    <hr></hr>
                    <Form.Field>
                        <label>Θεατρικές Παραστάσεις</label>
                        <Select className='select-container-link'
                            value = {selectedTPOption}
                            options = {p_options}
                            maxMenuHeight={200}
                            onChange = {this.handleTPSelect}
                            closeMenuOnSelect={true}  
                            isSearchable            
                        /> 
                        <a href='/insert-tp'> Προσθήκη νέας παράστασης</a>
                        </Form.Field>
                    <Form.Group widths="equal">
                        <Form.Field>
                        <label>Ηθοποιοί</label>
                        <Input type="text" name="actors" value={actors} onChange={this.onChange}/>  
                        </Form.Field>
                        <Form.Field>
                        <label>Ρόλος</label>
                        <Input type="text" name="parts" value={parts} onChange={this.onChange}/>
                        </Form.Field>
                    </Form.Group>
                    <br></br>
                    <Form.Button color='teal' content='Submit'/>
                </Form>
                </div>
                
        );
    }
}

export default InsertCostume;

