import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import CloseIcon from '@material-ui/icons/Close';

import './ImageDropzone.css';
import axios from '../../../utils/api-url.js'

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'

class ImageDropzone extends Component {

    constructor() {
        super();
        this.state={
            files: [],
            removedFiles: [],
            mediaReceived: false
        }
    }

    componentDidUpdate(PrevProps) {
        console.log("Props", this.props.input, this.state);
        if(!this.state.mediaReceived){
            let num = Date.now() + Math.random() + 1;
            this.props.input.map(file => {
                Object.assign(file, {
                    id: 'image-'+num++,
                    preview: axios.baseURL + file['path'],
                    isUploaded: true
                })
            })
            this.setState({
                files: this.state.files.concat(this.props.input),
                mediaReceived: true
            })
        }
    }

    onDropHandler = (droppedFiles) => {
        let num = Date.now() + Math.random() + 1;
        droppedFiles.forEach(file => {
            const reader = new FileReader();      
            reader.readAsDataURL(file);
            reader.onload = () => {
                Object.assign(file, {
                    id: 'image-' + num++,
                    preview: URL.createObjectURL(file),
                    base64: reader.result,
                    isUploaded: false
                });
      
                this.setState({
                    files: this.state.files.concat(file)
                },
                () => {
                    this.props.handleMediaUpload(this.state.files);
                })
            };
            reader.onabort = () => console.log('File reading was aborted');
            reader.onerror = () => console.log('File reading has failed');
          });
    }

    onRemove = (index) => {
        let updatedFiles = [...this.state.files]
        let removedFile = updatedFiles.splice(index, 1)[0];
        console.log(updatedFiles, removedFile)
        if(removedFile.isUploaded){
            this.setState({
                files: updatedFiles,
                removedFiles: this.state.removedFiles.concat(removedFile)
            }, 
            ()=>{
                this.props.handleMediaUpload(this.state.files, this.state.removedFiles)
            })
        }
        else{
            this.setState({
                files: updatedFiles,
            }, 
            ()=>{
                this.props.handleMediaUpload(this.state.files, this.state.removedFiles)
            })
        }
        
    }
    
    render(){
        const {files} = this.state;
        return(
            <section className="DropzoneSection">
                <div className="Dropzone">
                <Dropzone
                    maxSize={10000000}
                    multiple={true}
                    onDrop={this.onDropHandler.bind(this)}
                    accept={acceptedFileTypes}
                    disabled={this.props.disabled}
                >
                    {({getRootProps, getInputProps}) => {
                    return (
                        <div {...getRootProps()}
                        className="Droptext" 
                        style={{ cursor: this.props.disabled ? 'not-allowed' : 'pointer' }}
                        >
                        <input {...getInputProps()} />
                        <p style={{ marginTop: 25, fontSize: '24px' }}> + </p>
                        <p style={{ marginTop: 0 }}>ADD</p>
                        </div>
                    )
                    }}
                </Dropzone>
                </div>
                {
                    files.map((file, index) =>
                    <React.Fragment className="thumbsContainer">
                        <div className="thumb">
                                <div className="img-container">
                                    <img
                                    className='img'
                                    alt={file.name}
                                    src={file.preview}
                                    />
                                                                
                                    <div className="overlay">
                                        <CloseIcon
                                        style={{ cursor: 'pointer' }}
                                        onClick={()=>this.onRemove(index)}/>
                                    </div>
                                </div>
                            </div>
                    </React.Fragment>
                    )
                }
            </section>
        )
    }
}

export default  ImageDropzone;