import React, {Component} from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Select from 'react-select';
import {SaveButton, CancelButton} from "../Shared/Buttons/Buttons.js";
import TextareaAutosize from 'react-textarea-autosize';
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";
import { IconButton, Button } from '@material-ui/core';
import TextEditor from '../Shared/TextEditor/TextEditor.js';
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
        useCategory: {
            value: '',
            label: '',
            valid: false,
        },
        customs: {
            value: '',
            valid: true,
        },
    }
}

function getCleanState () {
    return {
        use: getCleanItem(),
        isFormValid: false,
        isTextEditorOpen: false,
        error_description: false,
        error_duplicate: false,
        error_missing_value: false,
    }
}

class UseForm extends Component{

    constructor(props){
        super(props);
        this.state = getCleanState();
        this.createdBy = this.props.createdBy;
        this.maxLegnth= 2080;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        if(this.props.editing){
            const useInfo = {
                name: {
                    value: this.props.use.name,
                    valid: true,
                },
                description: {
                    value: this.props.use.description,
                    valid: true,
                },
                descriptionHtml: {
                    value: this.props.use.descriptionHtml,
                    valid: true,
                },
                useCategory: {
                    value: this.props.use.use_category,
                    label: this.props.use.use_category,
                    valid: true,
                },
                customs: {
                    value: this.props.use.customs,
                    valid: true,
                }
            }
            this.setState({use: useInfo})
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
            let updated = {...this.state.use};
            
            updated['descriptionHtml'].value =  this.transformHtml(newValue)
            updated['descriptionHtml'].valid = newValue !== '<p><br></p>';
      
            updated['description'].value = this.transformText(newValue);
            updated['description'].valid = newValue !== '<p><br></p>';
      
            this.setState({
              use: updated,
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

    handleChange = (field) => (evt) => {
        let updated = {...this.state.use};
        if(field === 'name'){
            axios.instance.get('checkDuplicate', {params: {item: 'use', name: evt.target.value}})
            .then( item => {
                if(item.data.response.length !== 0){
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
            updated['descriptionHtml'].value = '<p>' + evt.target.value + '</p>';
            updated['descriptionHtml'].valid = evt.target.value ? true : false ;
        }
        else if(field === 'useCategory'){
            updated[field].label = evt.value;
            updated[field].value = evt.value;
            updated[field].valid = true;
        }
        else{
            updated[field].value = evt.target.value;
            updated[field].valid = true;
        }
        this.setState({
            use: updated
        })
    }

    handleClose(){
        this.resetForm();
        this.setState(() => {this.props.handleClose()});
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

    handleUpdate(){
        const data = this.state.use;
        axios.instance.put('uses/'+this.props.use.useID, { data: data })
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
                this.props.handleClose(true);
            }
       })    
    }

    handleInsert(){
        const data = this.state.use;
        axios.instance.post('uses', { data: data, createdBy: this.createdBy})
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('insert')
                this.props.handleClose(true);
            }
       })    
    }

    formValidation () {
        let isFormValid = true;
        for (let formElement in this.state.use) {
            isFormValid = isFormValid && this.state.use[formElement].valid;
        }
        if(!isFormValid){
            this.createNotification('error-missing-value')
        }
        this.setState({isFormValid})
        return isFormValid;
    }

    resetForm() {
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
        return(
            <React.Fragment>
                <NotificationContainer>{this.createNotification()}</NotificationContainer>
                    <div id="FormTitle">Χρήση</div>
                    <form className="FormPanel">
                        <div className="column main" 
                        style={{paddingRight: '50px'}}>
                        <span className="Label">ONOMA ΔΡΑΣΤΗΡΙΟΤΗΤΑΣ *</span>
                        <input
                        id="input-area"
                        value={this.state.use.name.value}
                        name="name"
                        onChange={this.handleChange('name')}
                        required={true}
                        />
                        <span className="Label">ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ *</span>
                        <Select
                        placeholder={''}
                        name="useCategory"
                        value={this.state.use.useCategory}
                        onChange={this.handleChange('useCategory')}
                        required={true}
                        options={use_categories}
                        closeMenuOnSelect={true} 
                        />
                        <span className="Label">ΠΕΡΙΓΡΑΦΗ *</span>
                        <div className="Subtitle">({this.maxLegnth-this.state.use.description.value.length} CHARACTERS REMAINING)</div>
                        <Button onClick={()=>{this.handleOpenEditor()}}><img src={require('../../styles/images/View.png')}/></Button>
                        <TextareaAutosize
                        id="DescriptionInput"
                        type='text'
                        name="description"
                        value={this.state.use.description.value}
                        onChange={this.handleChange('description')}
                        required={true}
                        />
                        <span className="Label">ΗΘΗ/ΕΘΙΜΑ</span>
                        <input
                        id="input-area"
                        name="customs"
                        value={this.state.use.customs.value}
                        onChange={this.handleChange('customs')}
                        required={false}
                        />
                    </div>
                </form>
                <IconButton onClick={this.props.handleClose}><img id='image-button' src={require('../../styles/images/buttons/CANCEL.svg')}/></IconButton>
                <IconButton onClick={this.handleSubmit}><img id='image-button' src={require('../../styles/images/buttons/SAVE.svg')}/></IconButton>
                <TextEditor
                isOpen={this.state.isTextEditorOpen}
                handleClose={this.onCloseEditor.bind(this)}
                data={this.state.use['descriptionHtml'].value}
                />
            </React.Fragment>
        )
    }
}

export default UseForm;