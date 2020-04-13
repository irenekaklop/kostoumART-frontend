import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {Dialog, DialogTitle, DialogContent} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import '../Dialogs.css';

class TextEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };
    }

    modules = {
        toolbar: [
        ['bold', 'italic', 'underline'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['clean']
        ]
    };

    componentDidUpdate(prevProps) {
        console.log(prevProps, this.props)
        if (this.props.isOpen !== prevProps.isOpen) {
            this.setState({data: this.props.data})
        }
    }

    handleChange = (newData) => {
        this.setState({
            data: newData
        });
    };

    render() {
        return (
        <Dialog
            open={this.props.isOpen}
            onClose={() => this.props.handleClose(false)}
            maxWidth={'xl'}
            fullWidth={true}>
            <DialogTitle>Επεξεργασία περιγραφής</DialogTitle>
            <DialogContent dividers>

                <ReactQuill
                    theme="snow"
                    className="DescEditorQuill"
                    modules={this.modules}
                    value={this.state.data}
                    onChange={this.handleChange}
                /> 
                <br/>
                <br/>
                <div id="button-area">
                    <button id="CheckButton">
                        <CheckIcon 
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={() => {this.props.handleClose(true, this.state.data)}}/>
                    </button>
                </div>
                <br/>
            </DialogContent>
        </Dialog>
        );
    }

}

export default TextEditor;
