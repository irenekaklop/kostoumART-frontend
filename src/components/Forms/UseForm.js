import React, {Component} from 'react';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Select from 'react-select';
import {SaveButton, CancelButton} from "../Shared/Buttons.js";
import TextareaAutosize from 'react-textarea-autosize';
import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';

class UseForm extends Component{

    constructor(props){
        super(props);
        this.state = { 
            user:{
                id: this.props.user
            },
            u_data: null,
            use: null,
            id: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            exists: '',
            description_MAXlegnth: 300,
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
            ////////////////////////
           
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        console.log("Props", this.props);
        console.log("Use Form:", this.state);
        if(this.props.editing){
            this.setState({
                use: this.props.use,
                name: this.props.use.name,
                description: this.props.use.description,
                customs: this.props.use.customs,
                selectedCategoryOption: {value: this.props.use.use_category, label: this.props.use.use_category},
                id: this.props.use.useID
            })
        }
    }

    onSelect = ( selectedCategoryOption ) => { 
        this.setState({ selectedCategoryOption }); 
        console.log(this.state)
    };

    onChange = ( evt ) => { 
        this.setState({ [evt.target.name]: evt.target.value }); 
        console.log(this.state)
    };

    decription_legnth(){
        if(this.state.description){
            return this.state.description.length;
        }
        else{
            return 0;
        }
    }

    handleCategorySelect = (selectedCategoryOption) => {
        this.setState({ selectedCategoryOption });
        console.log("Option selected:", this.state.selectedCategoryOption)
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
        const data = { id: this.state.id, name: this.state.name, category: this.state.selectedCategoryOption.value, description: this.state.description, customs: this.state.customs }
        console.log("updating...", data)
        //axios.post('http://88.197.53.80/kostoumart-api/edit_use', data)
        axios.post('http://localhost:8108/edit_use', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('update')
            }
       })    
    }

    handleInsert(){
        const data = { name: this.state.name, category: this.state.selectedCategoryOption.value, description: this.state.description, customs: this.state.customs }
        //axios.post("http://88.197.53.80/kostoumart-api/uses", data)
        axios.post('http://localhost:8108/uses', data)
        .then(res => {
            if(res.statusText ==="OK"){
                this.createNotification('insert')
            }
       })    
    }

    formValidation(){
        console.log("formValidation", this.state)
        if(!this.validateInputLength()){
            return false;
        }
        if(this.handleDuplicate()){
            return false;
        }
        if(!this.state.name || !this.state.description || !this.state.selectedCategoryOption){
            console.log("something is missing");
            this.createNotification('error-missing-value');
              return false;
        }
        console.log("something is missing");
        return true;
    }

    validateInputLength(){
        if(this.state.description && this.state.description.length>300){
            console.log("too big or too small description");
            // Snackbar error for too big description
            this.createNotification('error-description')
            return false;
        }
        else return true;
    }
    
    //true: Has duplicate, false: Doesn't have
    handleDuplicate(){
        const uses_list = this.props.uses;
        //check this name and use category already exist
        for(var i=0; i < uses_list.length; i++){
            if(uses_list[i].name === this.state.name && uses_list[i].use_category=== this.state.selectedCategoryOption){
                if(this.props.editing){
                    if(this.state.name===this.props.use.name){
                        return false;
                    }
                }
                console.log("already exists this name")
                this.createNotification('error-duplicate')
                return true;
            }
        }
        return false;
    }

    resetForm() {
        this.setState({
            use: '',
            id: '',
            name: '',
            description: '',
            customs: '',
            other_use: '',
            exists: '',
            description_status: false,
            submit: false,
            redirectToReferrer: false,
            //Select var
            selectedCategoryOption: '',
            ////////////////////////
            error_description: false,
            error_duplicate: false,
            error_missing_value: false,
            insert: false,
        })
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
        const {selectedCategoryOption}= this.state;
        const {name, description, customs} =this.state;
        return(
            <React.Fragment>
                <div id="ADD">
                    <NotificationContainer>{this.createNotification()}</NotificationContainer>
                    <div id="FormTitle">Χρήση</div><br/>
                    <form id="Form" onSubmit={this.submit}>
                        <div id="Name">
                            <div id="NameArea">
                                <div id="NameLabel">
                                    <span>ONOMA ΔΡΑΣΤΗΡΙΟΤΗΤΑΣ</span>
                                </div>
                                <input
                                id="TextArea"
                                value={name}
                                name="name"
                                onChange={this.onChange}
                                required={true}
                                />
                            </div>
                        </div>
                        <br/>
                        <div id="UseCategory">
                            <div id="UseCategoryArea">
                                <div id="UseNameLabel">
                                    <span>ΚΑΤΗΓΟΡΙΑ ΧΡΗΣΗΣ</span>
                                </div>
                                <Select
                                id="SelectContainer"
                                className="react-select"
                                placeholder={''}
                                name="selectedCategoryOption"
                                value={selectedCategoryOption}
                                onChange={this.handleCategorySelect}
                                required={true}
                                options={use_categories}
                                closeMenuOnSelect={true} 
                                />
                            </div>
                        </div>
                        <br/>
                        <div id='UseDescription'>
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
                                name="description"
                                value={description}
                                onChange={this.onChange}
                                required={true}
                                />
                            </div>
                        </div>
                        <br/>
                        <div id="UseCustoms">
                            <div id="UseCustomsArea">
                                <div id="UseCustomsLabel">
                                <span>ΗΘΗ/ΕΘΙΜΑ</span>
                                </div>
                                <input
                                id="TextArea"
                                name="customs"
                                value={customs}
                                onChange={this.onChange}
                                required={false}
                                />
                            </div>
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

export default UseForm;