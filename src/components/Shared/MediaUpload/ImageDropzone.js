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
    
    handleOnDrop = (files) => {
        
        let num = Math.floor(Math.random() * 1000000000) + 1;
        files.forEach(file => {
            const reader = new FileReader();      
            reader.readAsDataURL(file);
            reader.onload = () => {
              Object.assign(file, {
                id: 'file-' + num++,
                preview: URL.createObjectURL(file),
                base64: reader.result
              });
            }
        });

        this.setState({files})

        console.log(this.state)
    }
    
    render(){
        const thumbs = this.state.files.map( file => (
            <div key={file.name}>
              <div >
                <img
                  src={file.preview}
                />
              </div>
            </div>
          ));
        return(
            <section className="DropzoneSection">
                <div className="Dropzone">
                <Dropzone
                    multiple={false}
                    onDrop={this.handleOnDrop.bind(this)}
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
                <aside className="FileList">
                    {this.state.files[0] ? <img src={this.state.files[0].preview}></img> : <div></div>}
                </aside>
            </section>
        )
    }
}

export default  ImageDropzone;