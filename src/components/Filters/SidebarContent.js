import React, {Component} from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Checkbox from "../Shared/Checkbox.js"
import {ApplyButton, ResetButton} from '../Shared/Buttons/Buttons.js'
import './SidebarContent.css'

class SidebarContent extends Component {

    constructor(props){
        super(props);
        this.state = {
            techniques : [
                {
                  name: 'Ύφανση',
                  key: 'Ύφανση',
                  label: 'Ύφανση',
                  isChecked: false,
                },
                {
                  name: 'Ραφή',
                  key: 'Ραφή',
                  label: 'Ραφή',
                  isChecked: false,                },
                {
                  name: 'Κέντημα',
                  key: 'Κέντημα',
                  label: 'Κέντημα',
                  isChecked: false,
                },
                {
                  name: 'Βαφή',
                  key: 'Βαφή',
                  label: 'Βαφή',
                  isChecked: false,
                },
            ],
            sexs : [
                {
                    name: 'Κορίτσι',
                    key: 'Κορίτσι',
                    label: 'Κορίτσι',
                    isChecked: false,
                  },
                {
                    name: 'Γυναίκα',
                    key: 'Γυναίκα',
                    label: 'Γυναίκα',
                    isChecked: false,
                },
                {
                    name: 'Αγόρι',
                    key: 'Αγόρι',
                    label: 'Αγόρι',
                    isChecked: false,
                },
                {
                    name: 'Άνδρας',
                    key: 'Άνδρας',
                    label: 'Άνδρας',
                    isChecked: false,
                }
            ],
            use_category: [
                {
                    name: 'Επίσημο',
                    key: 'Επίσημο',
                    label: 'Επίσημο',
                    isChecked: false,
                  },
                {
                    name: 'Εργασίας',
                    key: 'Εργασίας',
                    label: 'Εργασίας',
                    isChecked: false,
                },
                {
                    name: 'Καθημερινό',
                    key: 'Καθημερινό',
                    label: 'Καθημερινό',
                    isChecked: false,
                }
            ],
            selectedItems : []
        }
        this.handleChangeTechnique = this.handleChangeTechnique.bind(this);
        this.handleChangeSex = this.handleChangeSex.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
    }

    handleChangeTechnique(e) {
        console.log(e.target.name)
        let key=e.target.name;
        this.setState(prevState => ({
            techniques: prevState.techniques.map( 
                el => el.key === key? { ...el, isChecked: !el.isChecked }: el )
            }));
        console.log(this.state)
    }

    handleChangeSex(e) {
        console.log(e.target.name)
        let key=e.target.name;
        this.setState(prevState => ({
            sexs: prevState.sexs.map( 
                el => el.key === key? { ...el, isChecked: !el.isChecked }: el )
            }));
        console.log(this.state)
    }

    handleChangeCategory(e) {
        console.log(e.target.name)
        let key=e.target.name;
        this.setState(prevState => ({
            use_category: prevState.use_category.map( 
                el => el.key === key? { ...el, isChecked: !el.isChecked }: el )
            }));
        console.log(this.state)
    }
    
    handleSubmit = () => {
        this.setState({selectedItems: []})
        let array=[];
        this.state.techniques.forEach(element => {
            if(element.isChecked){
                array.push(element);
            }
        })
        this.state.selectedItems.push({name: "technique", value: array})
        array=[];
        this.state.sexs.forEach(
            element => {
                if(element.isChecked){
                    array.push(element);
                }
            }
        )
        this.state.selectedItems.push({name: "sex", value: array})
        array=[];
        this.state.use_category.forEach(
            element => {
            if(element.isChecked){
                array.push(element)
            }
        });
        this.state.selectedItems.push({name: 'use_category', value: array})
        this.setState(()=>this.props.handleFilterSubmit(this.state.selectedItems))
    }

    handleReset = () => {
        this.setState({
            techniques : [
                {
                  name: 'Ύφανση',
                  key: 'Ύφανση',
                  label: 'Ύφανση',
                  isChecked: false,
                },
                {
                  name: 'Ραφή',
                  key: 'Ραφή',
                  label: 'Ραφή',
                  isChecked: false
                },
                {
                  name: 'Κέντημα',
                  key: 'Κέντημα',
                  label: 'Κέντημα',
                  isChecked: false,
                },
                {
                  name: 'Βάφη',
                  key: 'Βάφη',
                  label: 'Βάφη',
                  isChecked: false,
                },
            ],
            sexs : [
                {
                    name: 'Κορίτσι',
                    key: 'Κορίτσι',
                    label: 'Κορίτσι',
                    isChecked: false,
                  },
                {
                    name: 'Γυναίκα',
                    key: 'Γυναίκα',
                    label: 'Γυναίκα',
                    isChecked: false,
                },
                {
                    name: 'Αγόρι',
                    key: 'Αγόρι',
                    label: 'Αγόρι',
                    isChecked: false,
                },
                {
                    name: 'Άντρας',
                    key: 'Άντρας',
                    label: 'Άντρας',
                    isChecked: false,
                },
            ],
            use_category: [
                {
                    name: 'Επίσημο',
                    key: 'Επίσημο',
                    label: 'Επίσημο',
                    isChecked: false,
                  },
                {
                    name: 'Εργασίας',
                    key: 'Εργασίας',
                    label: 'Εργασίας',
                    isChecked: false,
                },
                {
                    name: 'Καθημερινό',
                    key: 'Καθημερινό',
                    label: 'Καθημερινό',
                    isChecked: false,
                }
            ],
            selectedItems : []
        })
        this.setState(()=>this.props.resetFilters())
    }

    render(){
        return(
            <div className='filters'>
                <button id="CloseButton">
                <IconButton onClick={()=>{this.props.handleDrawerClose(false)}}>
                    <img src={require('../../styles/images/MENU ARROW@2x.png')}/>
                </IconButton>
                </button>
                <div id="description"><span>Επιλέξτε τα στοιχεία, βάση των οποίων<br/>θα προβληθεί ο τελικός αριθμός<br/>των αποτελεσμάτων</span></div>
                <div id="Separator"/>

                <div style={{padding: '10%'}}>
                    <span id="Label">TEXNIKH</span><br/>
                    <div id="Options">
                    {
                    
                        this.state.techniques.map(item => (
                        <label key={item.key}>
                        <Checkbox name={item.name} checked={item.isChecked} onChange={this.handleChangeTechnique} />
                        <br/>
                        </label>
                        ))

                    }
                    </div>
                </div>
                <div style={{padding: '10%'}}>
                <span id="Label">ΦΥΛΟ</span><br/>
                <div id="Options">
                {
                    this.state.sexs.map(item => (
                    <label key={item.key}>
                    <Checkbox name={item.name} checked={item.isChecked} onChange={this.handleChangeSex} />
                    <br/>
                    </label>
                    ))
                }
                </div>
                </div>
                <div style={{padding: '10%'}}>
                <span id="Label">KATHΓΟΡΙΑ ΧΡΗΣΗΣ</span><br/>
                <div id="Options">
                {
                    this.state.use_category.map(item => (
                    <label key={item.key}>
                    <Checkbox name={item.name} checked={item.isChecked} onChange={this.handleChangeCategory} />
                    <br/>
                    </label>
                    ))
                }
                </div>
                </div>
                <div id="Separator"/>
                <div id="SeparatorButtons"/>
                <button id="ButtonApply" onClick={this.handleSubmit}>
                    <ApplyButton/>
                </button >
                <button id="ButtonReset" onClick={this.handleReset}>
                    <ResetButton/>
                </button>
            </div>
        )
    }
}

export default SidebarContent;