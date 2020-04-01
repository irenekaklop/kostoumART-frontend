import React, {Component} from 'react';

import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core';

import CKEditor from 'ckeditor4-react';
import './Dialogs.css'

class TextEditorDialog extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: 'content',
        }
        this.handleChange = this.handleChange.bind( this );
        this.onEditorChange = this.onEditorChange.bind( this );
    }

    onEditorChange( evt ) {
        this.setState( {
            data: evt.editor.getData()
        } );
    }

    handleChange( changeEvent ) {
        this.setState( {
            data: changeEvent.target.value
        } );
    }

    onChange = ( evt ) => { 
        console.log(this.state.data)
        this.setState({ data: evt.editor.getData() }); 
    };


    render(){
        return(
            <div className="Dialog">
                 <Dialog
                    maxWidth={'xl'}
                    open={this.props.isOpen}
                    onClose={() => {this.props.handleClose(this.state.content)}}>
                    <DialogTitle>Επεξεργασία κειμένου</DialogTitle>
                        <DialogContent dividers>
                          <CKEditor 
                                data={this.state.data}
                                onChange={this.onChange}
                                config={ {
                                    toolbar: [ [ 'Bold', 'Italic', '-', 'Link', '-', 'NumberedList', 'BulletedList', 'Undo', 'Redo'] ],
                                    resize_dir: 'both',
                                    width: '1200px',
                                    height: '502px'
                                }}
                            />
                        </DialogContent>
                    </Dialog>
            </div>
        );
    }
}

export default TextEditorDialog;