import React, {Component} from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css"
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import {SaveButton, CancelButton} from "../Shared/Buttons.js";

import axios from 'axios';

class  CostumeForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user_id: this.props.user,
            costume: null,
            name: '',
            descr: '',
            //For backend insert
            actors: '',
            designer: '',
            parts: '',
            //Select
            selectedSexOption: [],
            selectedUseOption: '',
            selectedUseCategoryOption: '',
            selectedMaterialOption: '',
            selectedTechniqueOption: '',
            selectedTPOption: '',
            selectedDateOption: '',
            //Geosuggest
            location: '',
            location_select: '',

            //For validation reasons
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,

            /////////////////////////
            cond1: false,
            cond2: true,
            cond3: false,
            ////////////////////////
            enableSelectUse: true,
            ///////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
            isNotificationOpen: false,
            //////////////////////////////
            years: [],
        }
        this.onChange = this.onChange.bind(this);
        this.handleUseSelect = this.handleUseSelect.bind(this);
    }

    componentDidMount(){
        console.log("props costume form", this.props);
        var startYear=1800;
        for(var i=0; i < 100; i++){
            this.state.years.push({value: (startYear+i).toString(), label:  startYear+i});
        }

        if(this.props.editing){
            let sex;
            let arrSexs = [];
            if(this.props.costume[0].sex.includes(",")){
                sex = this.props.costume[0].sex.split(",");
            }
            else{
                sex = [this.props.costume[0].sex];
            }
            for(var i=0; i < sex.length; i++){
                arrSexs.push({value: sex[i], label: sex[i]})
            }
            this.setState({
                costume: this.props.costume[0],
                costume_id: this.props.costume[0].costume_id,
                name: this.props.costume[0].costume_name,
                descr: this.props.costume[0].description,
                actors: this.props.costume[0].actors,
                designer: this.props.costume[0].designer,
                parts: this.props.costume[0].parts,
                selectedDateOption:{value: this.props.costume[0].date, label: this.props.costume[0].date},
                selectedSexOption: arrSexs,
                selectedMaterialOption: {value: this.props.costume[0].material, label: this.props.costume[0].material},
                selectedTechniqueOption: {value: this.props.costume[0].technique, label:  this.props.costume[0].technique},
                selectedTPOption: {value: this.props.costume[0].tp_title, label:  this.props.costume[0].tp_title},
                location: this.props.costume[0].location,
            })
            if(this.props.uses){
                for(var i=0; i<this.props.uses.length; i++){
                    if(this.props.uses[i].useID===this.props.costume[0].useID){
                        this.setState({
                            selectedUseCategoryOption: {value: this.props.uses[i].use_category, label: this.props.uses[i].use_category},
                            selectedUseOption: {value: this.props.uses[i].name, label: this.props.uses[i].name}
                        })
                    }
                }
            }
        }
        console.log('costume form state', this.state);
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    onChange = ( evt ) => { this.setState({ [evt.target.name]: evt.target.value }); 
    console.log("state", this.state)};

    handleUseCategorySelect = (selectedUseCategoryOption) => {
        this.setState({selectedUseCategoryOption});
        this.setState({enableSelectUse: false});
    }

    /*For selection of date*/
    handleDateSelect = (selectedDateOption) => {
        this.setState({ selectedDateOption});
        console.log(`Option selected:`, this.state.selectedDateOption);
    }

    /*For selection of use categories*/
    handleUseSelect = (selectedUseOption) => {
        this.setState({ selectedUseOption});
        console.log(`Option selected:`, this.state.selectedUseOption);
    }

     /*For selection of theatrical plays*/
     handleTPSelect = (selectedTPOption) => {
        this.setState({selectedTPOption});
        console.log(`Option selected:`, this.state.selectedTPOption);
    }

    /*For mutli-selection of sex categories*/
    handleSexSelect = (selectedSexOption) => {
        this.setState({ selectedSexOption });
        console.log(`Option selected:`, this.state.selectedSexOption);
    }

    handleMaterialSelect = (selectedMaterialOption) => {
        this.setState({ selectedMaterialOption });
        console.log(`Option selected:`, this.state.selectedMaterialOption);
    }

    handleTechniqueSelect = (selectedTechniqueOption) => {
        this.setState({ selectedTechniqueOption });
        console.log(`Option selected:`, this.state.selectedTechniqueOption);
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
        
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log(this.state);
        }
    }

    handleSubmit = () => {
        if(this.formValidation()){
            if(this.props.editing){
                this.handleUpdate();
            }
            else{
                this.handleInsert();
            }
        }
    }
    
    formValidation () {
        console.log("formValidation", this.state)
        if(!this.validateInputLength()){
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        if(!this.state.location || !this.state.name || !this.state.descr|| !this.state.selectedUseOption || !this.state.selectedTechniqueOption || !this.state.selectedMaterialOption){
            console.log("something is missing");
            this.createNotification("error-missing-value")
            return false;
        }
        console.log("everything is ok")
        return true;
    }

    handleUpdate = () => {
        let data = this.state;
        console.log("updating costume....", data);
        //axios.post('http://88.197.53.80/kostoumart-api/edit_costume', data)
        axios.post('http://localhost:8108/edit_costume', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("update")
            }
       })    
    }

    handleInsert = () => {
        console.log("inserting", this.state);
        let data = this.state;
        //axios.post('http://88.197.53.80/kostoumart-api/costumes', data)
        axios.post('http://localhost:8108/costumes', data)
        .then(res => {
        console.log("result", res);
            if(res.statusText ==="OK"){
                this.createNotification("insert")
            }
        })
    }

    resetForm () {
        this.setState({
            costume: null,
            name: '',
            descr: '',
            //For backend insert
            actors: '',
            designer: '',
            parts: '',
            //Select
            selectedSexOption: [],
            selectedUseOption: '',
            selectedUseCategoryOption: '',
            selectedMaterialOption: '',
            selectedTechniqueOption: '',
            selectedTPOption: '',
            selectedDateOption: '',
            //Geosuggest
            location: '',
            location_select: '',

            description_status: false,
            submit: false,
            redirectToReferrer: false,

            /////////////////////////
            cond1: false,
            cond2: false,
            cond3: false,
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false
        })
    }

    /*Functions for description legnth and validation*/
    decription_legnth(){
        return this.state.descr.length;
    }

    handleDuplicate() {
        const c_list = this.props.costumes;
        //check if new name already exist
        for(var i=0; i < c_list.length; i++){
            if(this.state.name){
            if(c_list[i].costume_name === this.state.name){
                if(this.props.editing){
                    if(this.props.costume[0].costume_name === this.state.name){
                        return false;
                    }
                }
                this.createNotification('error-duplicate');
                return true;
            }
        }}
        return false;
        
    }

    validateInputLength(){
        if(this.state.descr && this.state.descr.length>300){
            console.log("too big or too small description");
            // Snackbar error for too big description
            this.createNotification("error-description")
            return false;
        }
        else return true;
    }

    createNotification(type){
        if(type === "error-description"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Text should be under 300 characters",'Too big description!', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-duplicate"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error('Η εγγραφή υπάρχει ήδη.') }</NotificationContainer>
                </div>
            )
        }
        else if (type === "error-missing-value"){
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία",'Σφάλμα', 2000) }</NotificationContainer>
                </div>
            )
        }
        else if (type === "insert"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή καταχωρήθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
        else if (type === "update"){
            return(
                <NotificationContainer>{ NotificationManager.success('Η εγγραφή ανανεώθηκε επιτυχώς','Success!',2000) }</NotificationContainer>
            )
        }
    }

    render(){
        //For selection of Date
        const {selectedDateOption} = this.state;
        //For selection of Sex: 
        const {selectedSexOption} = this.state;
        //For selection of Use:
        const {selectedUseOption, selectedUseCategoryOption} = this.state;
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

        if(this.props.uses){ 
            for (var key in this.props.uses){
            u_options.forEach(element => {
                if(element.label === this.props.uses[key].use_category){
                    element.options.push({label: this.props.uses[key].name, value: this.props.uses[key].name});
                }
            });
        }}
    
        /*For theatrical Plays*/
        for (var key in this.props.theatrical_plays){
            p_options.push({label: this.props.theatrical_plays[key].title, value:  this.props.theatrical_plays[key].title}); 
        }

        console.log(u_options, p_options);

        return(
            <React.Fragment>
                <div id="ADD">
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                <div id="FormTitle">Kουστούμι</div>
                    <form id="Form" onSubmit={this.submit}><br/>
                            <div id='CostumeName'>
                                <div id='CostumeNameArea'>   
                                    <div id="CostumeNameLabel">
                                        <span>ΟΝΟΜΑ</span> 
                                    </div>
                                    <input
                                        id="TextArea"
                                        type='text'
                                        name="name" 
                                        value={name} 
                                        onChange={this.onChange}
                                        required={true}
                                        />    
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeDescription'>
                                <div id="DescriptionArea">
                                    <div id="LabelWithSubtitle">
                                    <div className="Title">
                                            <span>ΠΕΡΙΓΡΑΦΗ</span>
                                    </div>
                                    <div className="Subtitle">({this.state.description_MAXlegnth-this.decription_legnth()} CHARACTERS REMAINING)</div>
                                </div>
                                <TextareaAutosize
                                id="DescriptionInput"
                                type='text'
                                name="descr"
                                value={descr}
                                onChange={this.onChange}
                                required={true}
                                />
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeUseCategory'>
                                <div id='CostumeUseCategoryArea'>
                                    <div id="CostumeNameLabel">
                                        <span>ΟΝΟΜΑ ΧΡΗΣΗΣ</span>
                                    </div>
                                    <Select
                                        id="SelectContainer"
                                        className="react-select"
                                        name="selectedUseOption"
                                        required={true}
                                        onChange={this.handleUseSelect}
                                        value={selectedUseOption}
                                        options={u_options}
                                        closeMenuOnSelect={true}
                                        placeholder={''} />        
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeUseName'>
                                <div id='CostumeUseNameArea'>
                                    <div id="CostumeNameLabel">
                                        <span>YΛΙΚΟ ΚΑΤΑΣΚΕΥΗΣ</span>
                                    </div>
                                    
                                    <Select
                                        id="SelectContainer"
                                        className="react-select"
                                        required={true}
                                        name="selectedMaterialOption"
                                        value={selectedMaterialOption}
                                        onChange={this.handleMaterialSelect}
                                        options={materials}
                                        placeholder={''}
                                    />
                               </div>
                            </div>
                            <br/>
                            <div id='CostumeDate'>
                                <div id="CostumeDateArea">
                                    <div id='CostumeDateLabel'>
                                        <span>ΧΡΟΝΟΛΟΓΙΑ</span>
                                    </div>
                                </div>
                                <Select
                                    id="SelectContainer"
                                    className="react-select"
                                    name="selectedDateOption"
                                    value={selectedDateOption}
                                    onChange={this.handleDateSelect}
                                    options={this.state.years}
                                    placeholder={''}/>
                            </div>
                            <br/>
                            <div id='CostumeSex'>
                                <div id='CostumeSexArea'>
                                    <div id='CostumeSexLabel'>
                                        <span>ΦΥΛΟ</span>
                                    </div>
                                </div>
                                <Select
                                    id="SelectContainer"
                                    className="react-select"
                                    required={true}
                                    isMulti
                                    value={selectedSexOption}
                                    onChange={this.handleSexSelect}
                                    options={sexs}
                                    placeholder={''}/>
                            </div>
                            <br/>
                            <div id='CostumeTechnique'>
                                <div id='CostumeTechniqueArea'>
                                    <div id='CostumeTechniqueLabel'>
                                        <span>TEXNIKH</span>
                                    </div>
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                required={true}
                                name="selectedTechniqueOption"
                                value={selectedTechniqueOption}
                                onChange={this.handleTechniqueSelect}
                                options={techniques}
                                placeholder={''}
                                />       
                            </div>
                            <br/>
                            <div id='TP'>
                                <div id='TPArea'>
                                    <div id='TPLabel'>
                                    <span>ΘΕΑΤΡΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ</span>
                                    </div>    
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                value={selectedTPOption}
                                onChange={this.handleTPSelect}
                                name='selectedTPOption'
                                options={p_options}
                                placeholder={''}/>         
                            </div>
                            <div id='Designer'>
                                <div id='DesignerArea'>
                                    <div id='DesignerLabel'>
                                        <span>ΣΧΕΔΙΑΣΤΗΣ</span>
                                    </div>
                                </div>
                                <input
                                id="TextArea"
                                type='text'
                                name="designer"
                                value={this.state.designer}
                                onChange={this.onChange}
                                />
                            </div>
                           
                            <br/>
                            <div id='Geosuggest'>
                                <div id='GeosuggestArea'>
                                    <div id='GeosuggestLabel'>
                                        <span>ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</span>
                                    </div>
                                </div>
                                <Geosuggest
                                    className="geosuggest"
                                    placeholder="Αναζήτηση"
                                    initialValue={this.state.location}
                                    required={true}
                                    ref={el=>this._geoSuggest=el}
                                    onSuggestSelect={this.handleLocationSelect}
                                    />
                                    {this.handleLocation()}
                            </div>
                            <br/>
                            <div id='Actors'>
                                <div id='ActorsArea'>
                                    <div id='ActorsLabel'>
                                        <span>ΗΘΟΠΟΙΟΣ</span>
                                    </div>
                                </div>
                                <input
                                id="TextArea"
                                type='text'
                                name="actors"
                                value={actors}
                                onChange={this.onChange}/>
                            </div>        
                            <br/><br/><br/>
                            
                            <div onClick={this.handleSubmit}><SaveButton id="ButtonSave" /></div>
                            <div onClick={this.props.handleClose}><CancelButton id="ButtonCancel" /></div>
                        
                        </form>
                </div>
                
           </React.Fragment>
           
        )  
    }
}

export default CostumeForm;