import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './ImageDropzone.css';

const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'

class ImageDropzone extends Component {

    constructor() {
        super();
        this.state={
            files: []
        }
    }

    onDropHandler = (droppedFiles) => {
        let num = Date.now() + Math.random() + 1;
        droppedFiles.forEach(file => {
            const reader = new FileReader();      
            reader.readAsDataURL(file);
            reader.onload = () => {
                Object.assign(file, {
                    id: 'file-' + num++,
                    preview: URL.createObjectURL(file),
                    base64: reader.result
                });
      
                this.setState({
                    files: this.state.files.concat(droppedFiles)
                })
            };
            reader.onabort = () => console.log('File reading was aborted');
            reader.onerror = () => console.log('File reading has failed');
          });
    }

    render(){
        console.log(this.state)
        return(
            <section className="DropzoneSection">
                <div className="Dropzone">
                <Dropzone
                    multiple={false}
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
                    this.state.files.map(file =>
                        <React.Fragment className="thumbsContainer" key={file.id}>
                            <div className="thumb">
                               <div className="thumbInner">
                                    <img
                                        alt={file.name}
                                        src={file.preview}
                                    />
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