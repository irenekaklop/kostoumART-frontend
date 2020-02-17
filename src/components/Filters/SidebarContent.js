import React, {Component} from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Checkbox from "../Shared/Checkbox.js"

import './SidebarContent.css'

class SidebarContent extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedTechnique: null,
            techniques : [
                {
                  name: 'Ύφανση',
                  key: 'Ύφανση',
                  label: 'Ύφανση',
                },
                {
                  name: 'Ραφή',
                  key: 'Ραφή',
                  label: 'Ραφή',
                },
                {
                  name: 'Κέντημα',
                  key: 'Κέντημα',
                  label: 'Κέντημα',
                },
                {
                  name: 'Βάφη',
                  key: 'Βάφη',
                  label: 'Βάφη',
                },
            ],
            checkedItems: new Map(),
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
        console.log(this.state)
    }
    
    handleSubmit() {
        this.setState(()=>this.props.handleDrawerClose())
    }

    render(){
        return(
            <div>
                <button id="CloseButton">
                <IconButton onClick={()=>{this.props.handleDrawerClose(false)}}>
                    {this.props.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </button>
                <br/>
                <div className="description"><span>Επιλέξτε τα στοιχεία, βάση των οποίων<br/>θα προβληθεί ο τελικός αριθμός<br/>των αποτελεσμάτων</span></div>
                <div className="Separator"/>

                <span id="TechniqueLabel">TEXNIKH</span>
                
                
                <form id= "TechniqueOptions">
                {
                    this.state.techniques.map(item => (
                    <label key={item.key}>
                    <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
                    <br/>
                    </label>
                    ))
                } 
                <IconButton onClick={()=>this.props.handleFilterSubmit(this.state.checkedItems)}>
                    Save
                </IconButton>
                </form>
            </div>
        )
    }
}

export default SidebarContent;