import React, {Component} from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css";
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import {sexs, techniques, use_categories, eras} from "../../utils/options";
import "./Forms.css";
import TextEditor from '../Shared/TextEditor/TextEditor.js';
import { IconButton, Button } from '@material-ui/core';

import ImageDropzone from '../Shared/MediaUpload/ImageDropzone.js';

import axios from '../../utils/api-url.js'

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
        selectedCostumeOption: {
            value: '',
            label: '',
            valid: true,
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
        images: {
            value: [],
            valid: true,
        },
        removedImages: {
            value: [],
            valid: true
        }
    }
}

function getCleanState () {
    return {
        accessory: getCleanItem(),
        isFormValid: false,
        isTextEditorOpen: false,
        error_description: false,
        error_duplicate: false,
        error_missing_value: false,
    }
}

class  AccessoryForm extends Component{
    constructor(props) {
        super(props);
        this.state = getCleanState();
        this.createdBy = this.props.createdBy;
        this.maxLegnth= 2080;
        this.years= eras;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log("props accessory form", this.props, this.createdBy);
        if(this.props.editing){
            let sex;
            let arrSexs = [];
            if(this.props.accessory.sex.includes(",")){
                sex = this.props.accessory.sex.split(",");
            }
            else{
                sex = [this.props.accessory.sex];
            }
            for(var i=0; i < sex.length; i++){
                arrSexs.push({value: sex[i], label: sex[i]})
            }
            const accessoryInfo = {
                name: {
                    value: this.props.accessory.name,
                    valid: true,
                },
                description: {
                    value: this.props.accessory.description,
                    valid: true,
                },
                descriptionHtml: {
                    value: this.props.accessory.descriptionHtml,
                    valid: true,
                },
                actors: {
                    value: this.props.accessory.actors,
                    valid: true,
                },
                designer: {
                    value: this.props.accessory.designer,
                    valid: true,
                },
                selectedSexOption: {
                    value: arrSexs,
                    valid: true,
                },
                selectedUseOption: {
                    value: this.props.accessory.use_name,
                    label: this.props.accessory.use_name,
                    category: this.props.accessory.use_category,
                    valid: this.props.accessory.useId ? true : false,
                },
                selectedTechniqueOption: {
                    value: this.props.accessory.technique,
                    label: this.props.accessory.technique,
                    valid: true,
                },
                selectedTPOption: {
                    value: this.props.accessory.tp_title,
                    label: this.props.accessory.tp_title,
                    valid: true,
                },
                selectedDateOption: {
                    value: this.props.accessory.date,
                    label: this.props.accessory.date,
                    valid: true,
                },
                selectedCostumeOption: {
                    value: this.props.accessory.costume_name,
                    label: this.props.accessory.costume_name,
                    valid: true
                },
                //Geosuggest
                location: {
                    value: this.props.accessory.location,
                    valid: true,
                },
                location_select: {
                    value: this.props.accessory.location,
                    valid: true,
                },
                images: {
                    value: this.props.accessory.images ? JSON.parse(this.props.accessory.images) : [],
                    valid: true,
                },
                removedImages: {
                    value: [],
                    valid: true
                }
            }
            this.setState({accessory: accessoryInfo})
        }
        console.log('costume form state', this.state);
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
            let updated = {...this.state.accessory};
            
            updated['descriptionHtml'].value =  this.transformHtml(newValue)
            updated['descriptionHtml'].valid = newValue !== '<p><br></p>';
      
            updated['description'].value = this.transformText(newValue);
            updated['description'].valid = newValue !== '<p><br></p>';
      
            this.setState({
              accessory: updated,
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
        console.log(evt)
        let updated = {...this.state.accessory};
        if(field === 'name'){
            axios.instance.get('checkDuplicate', {params: {item: 'accessory', name: evt.target.value}})
            .then( item => {
                console.log("result from costume", item.data.response);
                if(item.data.response.length !== 0){
                    this.createNotification('error-duplicate');
                    updated[field].valid = false;
                    return;
                }
            })
            updated[field].value = evt.target.value;
            updated[field].valid = evt ? true : false ;
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
            updated[field].valid = evt ? true : false ;
            updated['descriptionHtml'].value = '<p>' + evt.target.value + '</p>';
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
        else if (field === 'selectedDateOption' || field === 'selectedCostumeOption' || field === 'selectedTPOption' || field === 'selectedTechniqueOption'){
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
            accessory: updated
        })
        console.log(this.state.accessory)
    }

    handleMediaUpload = (files, removedFiles) => {
        let updated = {...this.state.accessory}  
        updated['images'].value = files;
        
        if(removedFiles){
            //Remove file from backend
            updated['removedImages'].value = removedFiles; 
        }

        this.setState({
            accessory: updated
        })
    }

    /*Geosuggest functions*/
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
        for (let formElement in this.state.accessory) {
            isFormValid = isFormValid && this.state.accessory[formElement].valid;
        }
        if(!isFormValid){
            this.createNotification('error-missing-value')
        }
        this.setState({isFormValid})
        return isFormValid;
    }

    handleUpdate = () => {
        let data = this.state.accessory;
        axios.instance.put('accessories/'+this.props.accessory.accessory_id,  { data: data })
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification("update")
                this.props.handleClose(true);
            }
       })    
    }

    handleInsert = () => {
        console.log("inserting", this.state);
        let data = this.state.accessory;
        axios.instance.post('accessory', { data: data, createdBy: this.createdBy })
        .then(res => {
        console.log("result", res);
            if(res.statusText ==="OK"){
                this.createNotification("insert")
                this.props.handleClose(true);
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
        const c_options = [];

        /* Create Use Categories*/
        for (var key in use_categories){
            u_options.push( {label: use_categories[key].label, options: []});
        }

        /*Prepare options of select*/
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
        
        /*For costumes*/
        for (var key in this.props.costumes){
            c_options.push({label: this.props.costumes[key].costume_name, value:  this.props.costumes[key].costume_name}); 
        }

        console.log(u_options, p_options, c_options);

        return(
            <React.Fragment>
                <div id="ADD">
                    <NotificationContainer>{this.createNotification()}</NotificationContainer>
                    <div id="FormTitle">Συνοδευτικό</div>
                    <form className='FormPanel'>
                        <div className="column main" 
                        style={{paddingRight: '50px'}}>
                            <span className="Label">ONOMA *</span>
                            <input
                                id="input-area"
                                type='text'
                                value={this.state.accessory.name.value}
                                onChange={this.handleChange('name')}
                                required={true}/>
                            <br/>
                            <span className="Label">ΠΕΡΙΓΡΑΦΗ *</span>
                            <div className="Subtitle">({this.maxLegnth-this.state.accessory.description.value.length} CHARACTERS REMAINING)</div>
                            <Button onClick={()=>{this.handleOpenEditor()}}><img src={require('../../styles/images/View.png')}/></Button>
                            <TextareaAutosize
                            id="DescriptionInput"
                            type='text'
                            name="description"
                            value={this.state.accessory.description.value}
                            onChange={this.handleChange('description')}
                            required={true}
                            />
                            <br/>
                            <span className="Label">ΣΧΕΔΙΑΣΤΗΣ</span>
                            <input
                            id="input-area"
                            type='text'
                            name="designer"
                            value={this.state.accessory.designer.value}
                            onChange={this.handleChange('designer')}
                            />
                            <span className="Label">ΠΕΡΙΟΧΗ ΑΝΑΦΟΡΑΣ</span>
                            <Geosuggest
                            className="geosuggest"
                            placeholder="Αναζήτηση"
                            initialValue={this.state.accessory.location.value}
                            required={false}
                            ref={el=>this._geoSuggest=el}
                            onSuggestSelect={this.handleChange('location')}/>
                            <span className="Label">ΗΘΟΠΟΙΟΣ</span>
                            <input
                            id="input-area"
                            type='text'
                            name="actors"
                            value={this.state.accessory.actors.value}
                            onChange={this.handleChange('actors')}/>
                        </div>

                        <div className='column main' style={{paddingRight: '50px'}}>
                            <span className='Label'>ΟΝΟΜΑ ΧΡΗΣΗΣ *</span>
                                <Select
                                name="selectedUseOption"
                                required={true}
                                onChange={this.handleChange('selectedUseOption')}
                                value={this.state.accessory.selectedUseOption}
                                options={u_options}
                                placeholder={''} />
                            <span className='Label'>ΧΡΟΝΟΛΟΓΙΑ *</span>
                            <Select
                            name="selectedDateOption"
                            value={this.state.accessory.selectedDateOption}
                            onChange={this.handleChange('selectedDateOption')}
                            options={this.years}
                            placeholder={''}/>
                            <span className='Label'>ΦΥΛΟ *</span>
                            <Select
                            required={true}
                            isMulti
                            value={this.state.accessory.selectedSexOption.value}
                            onChange={this.handleChange('selectedSexOption')}
                            options={sexs}
                            placeholder={''}/>
                            <span className='Label'>TEXNIKH *</span>
                            <Select
                            required={true}
                            name="selectedTechniqueOption"
                            value={this.state.accessory.selectedTechniqueOption}
                            onChange={this.handleChange('selectedTechniqueOption')}                                
                            options={techniques}
                            placeholder={''}
                            />       
                            <span className='Label'>ΘΕΑΤΡΙΚΕΣ ΠΑΡΑΣΤΑΣΕΙΣ</span>
                            <Select
                            value={this.state.accessory.selectedTPOption}
                            onChange={this.handleChange('selectedTPOption')}
                            name='selectedTPOption'
                            options={p_options}
                            placeholder={''}/>         
                            <span className='Label'>KOΣΤΟΥΜΙ</span>
                            <Select
                            value={this.state.accessory.selectedCostumeOption}
                            onChange={this.handleChange('selectedCostumeOption')}
                            name='selectedCostumeOption'
                            options={c_options}
                            placeholder={''}/>
                            <span className='Label'>EIKONEΣ * </span>
                            <ImageDropzone 
                                disabled={false}
                                handleMediaUpload={this.handleMediaUpload.bind(this)}
                                input={this.state.accessory.images.value}
                                />  
                        </div>
                    </form>
                    
                    <IconButton onClick={this.props.handleClose}><img id='image-button' src={require('../../styles/images/buttons/CANCEL.svg')}/></IconButton>
                    <IconButton onClick={this.handleSubmit}><img id='image-button' src={require('../../styles/images/buttons/SAVE.svg')}/></IconButton>
                    
                    <TextEditor
                    isOpen={this.state.isTextEditorOpen}
                    data={this.state.accessory['descriptionHtml'].value}
                    handleClose={this.onCloseEditor.bind(this)}/>
                </div>           
              
            </React.Fragment>             
        )  
    }
}

export default AccessoryForm;