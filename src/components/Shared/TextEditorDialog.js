import React, {Component} from 'react';

import {Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider} from '@material-ui/core';

import './Dialogs.css'

import TextareaAutosize from 'react-textarea-autosize';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

class TextEditorDialog extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: '',
        }
        this.maxLength = 2080;
        this.handleChange = this.handleChange.bind( this );
    }

    componentDidUpdate(prevProps, prevState){
        console.log(this.props)
        if(prevProps!==this.props){
            this.setState({data: this.props.data})
        }
    }
    
    handleChange = ( evt ) => { 
        let updated = {...this.state.data}
        let newData = evt.target.value
        // Check for description requirments first
        console.log(evt)
        this.setState({ data: newData }); 
        
    };

    onClose = (e) => {
        this.props.handleCloseEditor(this.state.data);
    }

    render(){
        return(
            <div id="Dialog">
                 <Dialog
                    maxWidth={'xl'}
                    open={this.props.isOpen}
                    onClose={this.onClose}>
                        <DialogTitle>Επεξεργασία περιγραφής</DialogTitle>
                        <DialogContent dividers>
                        <TextareaAutosize
                                id="Editor"
                                type='text'
                                name="description"
                                value={this.state.data}
                                onChange={this.handleChange}
                                required={true}
                                />
                        <br/>
                        <br/>
                        <br/>
                        <div id="button-area">
                        <button id="CheckButton">
                        <CheckIcon 
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={this.onClose}/>
                        </button>
                        </div>
                        <br/>
                        </DialogContent>
                    </Dialog>
            </div>
        );
    }
}

export default TextEditorDialog;