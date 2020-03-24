import React, {Component} from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css"
import {sexs, materials, techniques, use_categories, eras} from "../../utils/options";
import "./Forms.css";

import {SaveButton, CancelButton} from "../Shared/Buttons.js";

import axios from 'axios';

function getCleanItem () {
    return {
        name: {
            value: '',
            valid: false,
        },
        description: {
            value: '',
            valid: false,
        },
        actors: {
            value: '',
            valid: true,
        },
        designer: {
            value: '',
            valid: true,
        },
        parts: {
            value: '',
            valid: true,
        },
        selectedSexOption: {
            value: [],
            valid: false,
        },
        selectedUseOption: {
            value: '',
            label: '',
            category: '',
            valid: false,
        },
        selectedMaterialOption: {
            value: '',
            valid: false,
        },
        selectedTechniqueOption: {
            value: '',
            label: '',
            valid: false,
        },
        selectedTPOption: {
            value: '',
            label: '',
            valid: true,
        },
        selectedDateOption: {
            value: '',
            label: '',
            valid: false,
        },
        //Geosuggest
        location: {
            value: '',
            valid: true,
        },
        location_select: {
            value: '',
            valid: true,
        },
    };
}

function getCleanState() {
    return {
        costume: getCleanItem(),
        isFormValid: false,
        enableSelectUse: true,
        error_description: false,
        error_duplicate: false,
        error_missing_value: false,
    };
}

class CostumeForm extends Component{
    constructor(props) {
        super(props);
        this.state = getCleanState();
        this.user_id = this.props.user;
        this.maxLegnth= 2080;
        this.years= eras;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log("props costume form", this.props);
        console.log('costume form state', this.state);
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
            let materials;
            let arrMaterials = [];
            if(this.props.costume[0].material.includes(",")){
                materials = this.props.costume[0].material.split(",");
            }
            else{
                materials = [this.props.costume[0].material];
            }
            for(var i=0; i < materials.length; i++){
                arrMaterials.push({value: materials[i], label: materials[i]})
            }
            const costumeInfo = {
                name: {
                    value: this.props.costume[0].costume_name,
                    valid: true,
                },
                description: {
                    value: this.props.costume[0].description,
                    valid: true,
                },
                actors: {
                    value: this.props.costume[0].actors,
                    valid: true,
                },
                designer: {
                    value: this.props.costume[0].designer,
                    valid: true,
                },
                parts: {
                    value: this.props.costume[0].parts,
                    valid: true,
                },
                selectedSexOption: {
                    value: arrSexs,
                    valid: true,
                },
                selectedUseOption: {
                    value: this.props.costume[0].use_name,
                    label: this.props.costume[0].use_name,
                    category: this.props.costume[0].use_category,
                    valid: true,
                },
                selectedMaterialOption: {
                    value: arrMaterials,
                    valid: true,
                },
                selectedTechniqueOption: {
                    value: this.props.costume[0].technique,
                    label: this.props.costume[0].technique,
                    valid: true,
                },
                selectedTPOption: {
                    value: this.props.costume[0].tp_title,
                    label: this.props.costume[0].tp_title,
                    valid: true,
                },
                selectedDateOption: {
                    value: this.props.costume[0].date,
                    label: this.props.costume[0].date,
                    valid: true,
                },
                //Geosuggest
                location: {
                    value: this.props.costume[0].location,
                    valid: true,
                },
                location_select: {
                    value: this.props.costume[0].location,
                    valid: true,
                },
            }
            this.setState({costume: costumeInfo})
        }
        console.log('costume form state', this.state);
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    handleChange = (field) => (evt) => {
        let updated = {...this.state.costume};
        if(field === 'name'){
            //axios.get('http://88.197.53.80/kostoumart-api/checkDuplicate', {params: {item: 'costume', name: evt.target.value}})
            axios.get('http://localhost:8108/checkDuplicate', {params: {item: 'costume', name: evt.target.value}})
            .then(name => {
                console.log("result from costume", name.data.response);
                if(name.data.response.length !== 0){
                    this.createNotification('error-duplicate');
                    updated[field].valid = false;
                    return;
                }
            })
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        else if(field === 'description'){
            if(evt.target.value.length > this.maxLegnth){
                if(!this.state.error_description){
                    this.setState({error_description: true})
                    this.createNotification("error-description")
                }
                return;
            }
            updated[field].value = evt.target.value;
            updated[field].valid = evt.target.value ? true : false ;
        }
        else if(field === 'selectedUseOption'){
            this.setState({
                enableSelectUse: false,
            })
            updated[field].label = evt.value;
            updated[field].value = evt.value;
            updated[field].category = evt.category;
            updated[field].valid = true;
        }
        else if (field === 'selectedDateOption' || field === 'selectedTPOption' || field === 'selectedTechniqueOption'){
            updated[field].label = evt.value;
            updated[field].value = evt.value;
            updated[field].valid = true;
        }
        else if (field === 'selectedMaterialOption' || field === 'selectedSexOption'){
            updated[field].label = evt;
            updated[field].value = evt;
            updated[field].valid = (!evt || evt.length===0 ) ? false : true ;
        }
        else if (field === 'location_select'){
            updated[field].value = evt;
            updated[field].valid = evt ? true : false ;
        }
        else{
            updated[field].value = evt.target.value;
        }
        this.setState({
            costume: updated
        })
        console.log(this.state.costume)
    }
        
    handleLocation(){
        if(this.state.location_select){
            this.state.location = this.state.location_select.description;
            console.log("HandleLocation:", this.state);
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
        let isFormValid = true;
        for (let formElement in this.state.costume) {
            isFormValid = isFormValid && this.state.costume[formElement].valid;
        }
        if(!isFormValid){
            this.createNotification('error-missing-value')
        }
        this.setState({isFormValid})
        return isFormValid;
    }

    handleUpdate = () => {
        let data = this.state.costume;
        console.log("updating costume....", data);
        //axios.post('http://88.197.53.80/kostoumart-api/edit_costume', { data: data, user: this.user_id, _id: this.props.costume[0].costume_id })
        axios.post('http://localhost:8108/edit_costume', { data: data, user: this.user_id, _id: this.props.costume[0].costume_id})
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("update")
            }
       })    
    }

    handleInsert = () => {
        console.log("inserting", this.state.costume);
        let data = this.state.costume;
        console.log(data)
        //axios.post('http://88.197.53.80/kostoumart-api/costumes', { data: data, user: this.user_id })
        axios.post('http://localhost:8108/costumes', { data: data, user: this.user_id } )
        .then(res => {
        console.log("result", res);
            if(res.statusText ==="OK"){
                this.createNotification("insert")
            }
        })
    }

    resetForm () {
        this.state = getCleanState();
    }

    createNotification(type){
        if(type === "error-description"){
            setTimeout(
                function() {
                    this.setState({error_description: false})
                }
                .bind(this),
                2000
            );
            return(
                <div>
                    <NotificationContainer>{ NotificationManager.error("Text should be under 2080 characters",'Too big description!', 2000) }</NotificationContainer>
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
                    element.options.push({label: this.props.uses[key].name, value: this.props.uses[key].name, category: element.label});
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
                    <form id="Form"><br/>
                            <div id='CostumeName'>
                                <div id='CostumeNameArea'>   
                                    <div id="CostumeNameLabel">
                                        <span>ΟΝΟΜΑ *</span> 
                                    </div>
                                    <input
                                        id="TextArea"
                                        type='text'
                                        value={this.state.costume.name.value} 
                                        onChange={this.handleChange('name')}
                                        />    
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeDescription'>
                                <div id="DescriptionArea">
                                    <div id="LabelWithSubtitle">
                                    <div className="Title">
                                            <span>ΠΕΡΙΓΡΑΦΗ *</span>
                                    </div>
                                    <div className="Subtitle">({this.maxLegnth-this.state.costume.description.value.length} CHARACTERS REMAINING)</div>
                                </div>
                                <TextareaAutosize
                                id="DescriptionInput"
                                type='text'
                                name="description"
                                value={this.state.costume.description.value}
                                onChange={this.handleChange('description')}
                                required={true}
                                />
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeUseCategory'>
                                <div id='CostumeUseCategoryArea'>
                                    <div id="CostumeNameLabel">
                                        <span>ΟΝΟΜΑ ΧΡΗΣΗΣ *</span>
                                    </div>
                                    <Select
                                        id="SelectContainer"
                                        className="react-select"
                                        name="selectedUseOption"
                                        required={true}
                                        value={this.state.costume.selectedUseOption}
                                        onChange={this.handleChange('selectedUseOption')}
                                        options={u_options}
                                        closeMenuOnSelect={true}
                                        placeholder={''} />        
                                </div>
                            </div>
                            <br/>
                            <div id='CostumeUseName'>
                                <div id='CostumeUseNameArea'>
                                    <div id="CostumeNameLabel">
                                        <span>YΛΙΚΟ ΚΑΤΑΣΚΕΥΗΣ *</span>
                                    </div>
                                    <Select
                                        id="SelectContainer"
                                        className="react-select"
                                        required={true}
                                        isMulti
                                        value={this.state.costume.selectedMaterialOption.value}
                                        onChange={this.handleChange('selectedMaterialOption')}
                                        options={materials}
                                        placeholder={''}
                                    />
                            </div>
                            </div>
                            <br/>
                            <div id='CostumeDate'>
                                <div id="CostumeDateArea">
                                    <div id='CostumeDateLabel'>
                                        <span>ΧΡΟΝΟΛΟΓΙΑ *</span>
                                    </div>
                                </div>
                                <Select
                                    id="SelectContainer"
                                    className="react-select"
                                    name="selectedDateOption"
                                    value={this.state.costume.selectedDateOption}
                                    onChange={this.handleChange('selectedDateOption')}
                                    options={eras}
                                    placeholder={''}/>
                            </div>
                            <br/>
                            <div id='CostumeSex'>
                                <div id='CostumeSexArea'>
                                    <div id='CostumeSexLabel'>
                                        <span>ΦΥΛΟ *</span>
                                    </div>
                                </div>
                                <Select
                                    id="SelectContainer"
                                    className="react-select"
                                    required={true}
                                    isMulti
                                    value={this.state.costume.selectedSexOption.value}
                                    onChange={this.handleChange('selectedSexOption')}
                                    options={sexs}
                                    placeholder={''}/>
                            </div>
                            <br/>
                            <div id='CostumeTechnique'>
                                <div id='CostumeTechniqueArea'>
                                    <div id='CostumeTechniqueLabel'>
                                        <span>TEXNIKH *</span>
                                    </div>
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                required={true}
                                name="selectedTechniqueOption"
                                value={this.state.costume.selectedTechniqueOption}
                                onChange={this.handleChange('selectedTechniqueOption')}
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
                                value={this.state.costume.selectedTPOption}
                                onChange={this.handleChange('selectedTPOption')}
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
                                value={this.state.costume.designer.value}
                                onChange={this.handleChange('designer')}
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
                                initialValue={this.state.costume.location.value}
                                required={true}
                                ref={el=>this._geoSuggest=el}
                                onSuggestSelect={this.handleChange('location_select')}
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
                                value={this.state.costume.actors.value}
                                onChange={this.handleChange('actors')}/>
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