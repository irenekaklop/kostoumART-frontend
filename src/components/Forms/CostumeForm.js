import React, {Component} from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css"
import {Button} from '@material-ui/core';
import {sexs, materials, techniques, use_categories, eras} from "../../utils/options";
import "./Forms.css";

import TextEditor from '../Shared/TextEditor/TextEditor.js';
import {SaveButton, CancelButton} from "../Shared/Buttons/Buttons.js";

import ImageDropzone from '../Shared/MediaUpload/ImageDropzone.js';

import axios from '../../utils/api-url.js'
import { IconButton } from '@material-ui/core';

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
        descriptionHtml: {
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
        images: {
            value: [],
            valid: true,
        },
        removedImages: {
            value: [],
            valid: true
        }
    };
}

function getCleanState() {
    return {
        costume: getCleanItem(),
        isFormValid: false,
        isTextEditorOpen: false,
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
        this.createdBy = this.props.createdBy;
        this.maxLegnth= 2080;
        this.years= eras;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        if(this.props.editing){
            let sex;
            let arrSexs = [];
            if(this.props.costume.sex.includes(",")){
                sex = this.props.costume.sex.split(",");
            }
            else{
                sex = [this.props.costume.sex];
            }
            for(var i=0; i < sex.length; i++){
                arrSexs.push({value: sex[i], label: sex[i]})
            }
            let materials;
            let arrMaterials = [];
            if(this.props.costume.material.includes(",")){
                materials = this.props.costume.material.split(",");
            }
            else{
                materials = [this.props.costume.material];
            }
            for(var i=0; i < materials.length; i++){
                arrMaterials.push({value: materials[i], label: materials[i]})
            }
            const costumeInfo = {
                name: {
                    value: this.props.costume.costume_name,
                    valid: true,
                },
                description: {
                    value: this.props.costume.description,
                    valid: true,
                },
                descriptionHtml: {
                    value: this.props.costume.descriptionHtml,
                    valid: true,
                },
                actors: {
                    value: this.props.costume.actors,
                    valid: true,
                },
                designer: {
                    value: this.props.costume.designer,
                    valid: true,
                },
                parts: {
                    value: this.props.costume.parts,
                    valid: true,
                },
                selectedSexOption: {
                    value: arrSexs,
                    valid: true,
                },
                selectedUseOption: {
                    value: this.props.costume.use_name,
                    label: this.props.costume.use_name,
                    category: this.props.costume.use_category,
                    valid: this.props.costume.useID ? true : false,
                },
                selectedMaterialOption: {
                    value: arrMaterials,
                    valid: true,
                },
                selectedTechniqueOption: {
                    value: this.props.costume.technique,
                    label: this.props.costume.technique,
                    valid: true,
                },
                selectedTPOption: {
                    value: this.props.costume.tp_title,
                    label: this.props.costume.tp_title,
                    valid: true,
                },
                selectedDateOption: {
                    value: this.props.costume.date,
                    label: this.props.costume.date,
                    valid: true,
                },
                //Geosuggest
                location: {
                    value: this.props.costume.location,
                    valid: true,
                },
                images: {
                    value: this.props.costume.images ? JSON.parse(this.props.costume.images) : [],
                    valid: true,
                },
                removedImages: {
                    value: [],
                    valid: true
                }
            }
            this.setState({costume: costumeInfo})
        }
    }

    transformText(description) {
        description = description.replace(/<\/li>/g, '\n').replace(/<\/p>/g, '\n').replace(/<.*?>/g, '').replace(/&nbsp;/g, ' ');
        return description.substring(0, description.length - 1).replace(/\n\n/g, '\n');
      }
    
    transformHtml(description) {
        return description.replace(/style=".*?"/g, '').replace(/&nbsp;/g, ' ');
    }

    onCloseEditor = (isEdited, newValue) => {
        if(isEdited){
            let updated = {...this.state.costume};
            
            updated['descriptionHtml'].value =  this.transformHtml(newValue)
            updated['descriptionHtml'].valid = newValue !== '<p><br></p>';
      
            updated['description'].value = this.transformText(newValue);
            updated['description'].valid = newValue !== '<p><br></p>';
      
            this.setState({
              coustume: updated,
              isTextEditorOpen: false,
            })
        }
        else{
            this.setState({
                isTextEditorOpen: false,
            })
        }
    }

    handleOpenEditor = () => {
        this.setState({
            isTextEditorOpen: true,
        })
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
    }

    handleChange = (field) => (evt) => {
        let updated = {...this.state.costume};
        if(field === 'name'){
            axios.instance.get('checkDuplicate', {params: {item: 'costume', name: evt.target.value}})
            .then(name => {
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
            updated['descriptionHtml'].value = '<p>' +  evt.target.value + '</p>';
            updated['descriptionHtml'].valid = evt.target.value ? true : false ;
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
        else if (field === 'selectedTPOption'){
            if(evt){
                updated[field].label = evt.value;
                updated[field].value = evt.value;
                updated[field].valid = true; 
            }
            else{
                updated[field].label = '';
                updated[field].value = '';
                updated[field].valid = true;
            }
        }
        else if (field === 'selectedMaterialOption' || field === 'selectedSexOption'){
            updated[field].label = evt;
            updated[field].value = evt;
            updated[field].valid = (!evt || evt.length===0 ) ? false : true ;
        }
        else if (field === 'location'){
            updated[field].value = evt.description;
            updated[field].valid = evt ? true : false ;
        }
        else{
            updated[field].value = evt.target.value;
        }
        this.setState({
            costume: updated
        })
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
        axios.instance.put('costumes/' + this.props.costume.costume_id, { data: data, createdBy: this.createdBy })
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("update");
                this.props.handleClose(true);
            }
       })    
    }

    handleInsert = () => {
        let data = this.state.costume;
        axios.instance.post('costume', { data: data, createdBy: this.createdBy } )
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("insert");
                this.props.handleClose(true);
            }
        })
    }

    handleMediaUpload = (files, removedFiles) => {
        let updated = {...this.state.costume}  
        updated['images'].value = files;
        
        if(removedFiles){
            //Remove file from backend
            updated['removedImages'].value = removedFiles; 
        }

        this.setState({
            costume: updated
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

        return(
            <React.Fragment>
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                <div id="FormTitle">Kουστούμι</div>
                <form className="FormPanel">
                    <div className="column main" 
                    style={{paddingRight: '50px'}}>
                        <span className="Label">ΟΝΟΜΑ *</span> 
                        <br/>
                        <input
                            id="input-area"
                            type='text'
                            value={this.state.costume.name.value} 
                            onChange={this.handleChange('name')}
                        />
                        <br/>
                        <span className="Label">ΠΕΡΙΓΡΑΦΗ *</span>
                        <div className="Subtitle">({this.maxLegnth-this.state.costume.description.value.length} CHARACTERS REMAINING)</div>
                        <Button onClick={()=>{this.handleOpenEditor()}}><img src={require('../../styles/images/View.png')}/></Button>
                        <br/>
                        <TextareaAutosize
                        id="DescriptionInput"
                        type='text'
                        name="description"
                        value={this.state.costume.description.value}
                        onChange={this.handleChange('description')}
                        required={true}/>
                        <br/>
                        <span className="Label">ΣΧΕΔΙΑΣΤΗΣ</span>
                        <input
                            id='input-area'
                            type='text'
                            name="designer"
                            value={this.state.costume.designer.value}
                            onChange={this.handleChange('designer')}
                        />
                        <span className="Label">ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</span>
                        <Geosuggest
                            className="geosuggest"
                            placeholder="Αναζήτηση"
                            initialValue={this.state.costume.location.value}
                            required={false}
                            ref={el=>this._geoSuggest=el}
                            onSuggestSelect={this.handleChange('location')}/>
                        <span className="Label">ΗΘΟΠΟΙΟΣ</span>
                        <input
                            id="input-area"
                            type='text'
                            name="actors"
                            value={this.state.costume.actors.value}
                            onChange={this.handleChange('actors')}/>
                    </div>
                    
                    <div className='column main' style={{paddingRight: '50px'}}>
                        <span className="Label">ΟΝΟΜΑ ΧΡΗΣΗΣ *</span>
                        <Select
                        name="selectedUseOption"
                        required={true}
                        value={this.state.costume.selectedUseOption}
                        onChange={this.handleChange('selectedUseOption')}
                        options={u_options}
                        closeMenuOnSelect={true}
                        placeholder={''} />     
                        <span className="Label">YΛΙΚΟ ΚΑΤΑΣΚΕΥΗΣ *</span>   
                        <Select
                        required={true}
                        isMulti
                        value={this.state.costume.selectedMaterialOption.value}
                        onChange={this.handleChange('selectedMaterialOption')}
                        options={materials}
                        placeholder={''}
                        />
                        <span className="Label">ΤΕΧΝΙΚΗ *</span>
                        <Select
                        name="selectedTechniqueOption"
                        value={this.state.costume.selectedTechniqueOption}
                        onChange={this.handleChange('selectedTechniqueOption')}
                        options={techniques}
                        placeholder={''}/>
                        <span className="Label">ΧΡΟΝΟΛΟΓΙΑ *</span>
                        <Select
                        name="selectedDateOption"
                        value={this.state.costume.selectedDateOption}
                        onChange={this.handleChange('selectedDateOption')}
                        options={eras}
                        placeholder={''}/>
                        <span className="Label">ΦΥΛΟ *</span>
                        <Select
                        isMulti
                        name="selectedSexOption"
                        value={this.state.costume.selectedSexOption.value}
                        onChange={this.handleChange('selectedSexOption')}
                        options={sexs}
                        placeholder={''}/>
                        <span className="Label">ΘΕΑΤΡΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ</span>
                        <Select
                        name="selectedTPOption"
                        value={this.state.costume.selectedTPOption}
                        onChange={this.handleChange('selectedTPOption')}
                        options={p_options}
                        placeholder={''}/>
                        <span className='Label'>EIKONEΣ * </span>
                        <ImageDropzone 
                        disabled={false}
                        handleMediaUpload={this.handleMediaUpload.bind(this)}
                        input={this.state.costume.images.value}
                        />
                    </div>
                </form>

                <IconButton onClick={()=>this.props.handleClose(false)}><img id='image-button' src={require('../../styles/images/buttons/CANCEL.svg')}/></IconButton>
                <IconButton onClick={this.handleSubmit}><img id='image-button' src={require('../../styles/images/buttons/SAVE.svg')}/></IconButton>

                <TextEditor
                isOpen={this.state.isTextEditorOpen}
                handleClose={this.onCloseEditor.bind(this)}
                data={this.state.costume['descriptionHtml'].value}
                />
           </React.Fragment>
           
        )  
    }
}

export default CostumeForm;