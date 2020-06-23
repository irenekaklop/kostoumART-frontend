import React, { Component } from 'react';

import Header from "../Shared/Header/Header";
import Footer from '../Shared/Footer.js';
import SidebarContent from "../Filters/SidebarContent";
import Dashboard from "../Dashboard/Dashboard";

import axios from '../../utils/api-url.js'

import { Tab, Tabs, TabPanel } from 'react-tabs';
import Sidebar from 'react-sidebar';

import {FilterButtons} from '../Shared/Buttons/Buttons';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import '../Homepage/Homepage.css';
import ItemForm from '../Forms/ItemForm';

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_tab: 0,
            costumes: [],
            filteredCostumes: [],
            uses: [],
            theatricalPlays: [],
            accessories: [],
            filteredAccessories: [],
            filterDrawerOpen: false,
            filters: [],   
            isFormOpen: false,
            editing: false,
            itemToEdit: null,
        }
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
    }
    
    componentDidMount() {
        this.getCostumes();
        this.getAccessories();
        this.getTheatricalPlays();
        this.getUses();
    }

    getCostumes () {
        this.setState({isLoading: true})
        axios.instance.get('costumes', {params: {userType: Number(localStorage.getItem('user-type'))}})
            .then(res => {
                if(res.statusText==='OK'){
                    const costumes = res.data;
                    this.setState({ costumes });
                    this.setState({filteredCostumes: costumes})
                }
            }
            )
       
    }

    getUses () {
        let self = this;
        axios.instance.get("uses")
        .then(res => {
            if(res.statusText==='OK'){
                const uses = res.data;
                this.setState({ uses });
            }
        }
        )
    }

    getTheatricalPlays () {
        axios.instance.get("theatricalPlays")
        .then(res => {
            if(res.statusText==='OK'){
                const theatricalPlays = res.data;
                this.setState({ theatricalPlays });
            }
        })
    }

    getAccessories () {
        axios.instance.get("accessories", {params: {userType: Number(localStorage.getItem('user-type'))}})
            .then(res => {
                if(res.statusText==='OK'){
                    const accessories = res.data;
                    this.setState({ accessories });
                    this.setState({
                        filteredAccessories: accessories
                    })
                }
            }
            )
    }


    refreshData = () => {
        this.getCostumes();
        this.getAccessories();
        this.getUses();
        this.getTheatricalPlays();
    }

    handleEditing = (itemToEdit) => {
        this.setState({editing: true, itemToEdit: itemToEdit, isFormOpen: true})
    }

    handleTabChange = (value) => {
        //Refresh Tables
        if(value===0){
            if(this.state.filters.length!==0){
                this.applyFilters(this.state.filters);
            }
            else{
                this.getCostumes();
            }
        }
        else if(value===1){
            this.getAccessories();
        }
        else if(value===2){
            this.getUses();
        }
        else if(value===3){
            this.getTheatricalPlays();
        }
        this.setState({
          current_tab: value
        });
    };

    handleFilterSubmit ( filters ) {
        this.setState({
            filters: filters,
            filterDrawerOpen: false,
            filteredCostumes: this.state.costumes
        })
        this.applyFilters(filters);
    }

    applyFilters (filters) {
        console.log(filters)
        //Apply filters only front-end
        let updatedCostumeList = [...this.state.costumes]
        let updatedAccessoriesList = [...this.state.accessories]
        let reset = true;
        let filteredAccessories = [];
        let filteredCostumes = [];
        filters.forEach(filter => {
            filter.value.forEach(element => {
                if(element.isChecked){
                    reset = false;
                    var filteredCostumeItems = updatedCostumeList.filter((costume) => {
                        return costume[filter.name] === element.key
                    })
                    var filteredAccessoriesItems = updatedAccessoriesList.filter((accessory) => {
                        return accessory[filter.name] === element.key
                    })
                    filteredAccessories = filteredAccessories.concat(filteredAccessoriesItems)
                    filteredCostumes = filteredCostumes.concat(filteredCostumeItems)
                }
            });
            
        });

        if (reset) {
            this.resetFilters();
            return;
        }

        this.setState({
            filteredAccessories: filteredAccessories.unique(),
            filteredCostumes: filteredCostumes.unique(),
        })
    }

    resetFilters = () => {
        this.getCostumes();
        this.getAccessories();
    }

    handleDrawerOpen = () => {
        this.setState({
            filterDrawerOpen: true
        })
    };
    
    handleDrawerClose = () => {
        this.setState({
            filterDrawerOpen: false
        })
    };

    handleClickAddButton = (item) => {
        this.setState({
            isFormOpen: true
        })
    }

    handleCloseDialog = () => {
        console.log('close')
        this.setState({
            isFormOpen: false,
            editing: false,
            itemToEdit: null
        })
        this.refreshData();
    }

    createNotification(type){
        if (type === "insert"){
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
                <div className="sidebar" onClick={this.handleDrawerOpen}>
                    <FilterButtons/>
                </div>
                <Sidebar
                rootClassName="FiltersSidebarRoot"
                sidebarClassName="FiltersSidebar"
                overlayClassName = "Overlay"
                sidebar={<SidebarContent
                    resetFilters = {this.resetFilters.bind(this)}
                    handleFilterSubmit = {this.handleFilterSubmit.bind(this)}
                    handleDrawerClose = {this.handleDrawerClose.bind(this)}
                    open={this.state.filterDrawerOpen}/>}
                open={this.state.filterDrawerOpen}
                onSetOpen={this.handleDrawerOpen}
                />
                <svg class="rectangle-yellow">
                    <rect fill="rgba(255,222,23,1)" id="rectangle-yellow" rx="0" ry="0" x="0" y="0" width="21.327" height="411.419">
                    </rect>
                </svg>
                <div id="Tailoring_Times">
                    <span>Tailoring Times</span>
                </div>
                <div id="costumART-Dashboard">
                    <span>costumART</span>
                </div>
                
                
                <div id="header-container">
                    <Header/>
                    <div id="tabs-container">
                        <Tabs
                        id="tabs-list"
                        disabledClassName='tabs-list-disabled'
                        selectedIndex={this.state.current_tab}
                        onSelect={this.handleTabChange}>
                            <Tab disabled={this.state.isFormOpen}>
                                {this.state.current_tab===0?
                                    <div id="tab-selected">
                                    <span>Κοστούμι</span>
                                    <br></br>
                                    <svg class="UnderlineTabTitle">
                                        <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                        </rect>
                                    </svg>
                                    </div>
                                :
                                    <span>Κοστούμι</span>
                                }
                            </Tab>
                            <Tab disabled={this.state.isFormOpen}>
                                {this.state.current_tab===1?
                                    <div id="tab-selected">
                                    <span>Συνοδευτικό</span>
                                    <br></br>
                                    <svg class="UnderlineTabTitle">
                                        <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                        </rect>
                                    </svg>
                                    </div>
                                :
                                    <div>
                                    <span>Συνοδευτικό</span>
                                    </div>
                                }
                            </Tab>
                            <Tab disabled={this.state.isFormOpen}>
                                {this.state.current_tab===2?
                                    <div id="tab-selected">
                                    <span>Χρήση</span>
                                    <br></br>
                                    <svg class="UnderlineTabTitle">
                                        <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                        </rect>
                                    </svg>
                                    </div>
                                :
                                    <div>
                                    <span>Χρήση</span>
                                    </div>
                                }
                            
                            </Tab>
                            <Tab disabled={this.state.isFormOpen}>
                                {this.state.current_tab===3?
                                    <div id="tab-selected">
                                        <span>Θεατρική παράσταση</span>
                                        <br></br>
                                        <svg class="UnderlineTabTitle">
                                            <rect fill="rgba(255,222,23,1)" id="UnderlineTabTitle" rx="0" ry="0" x="0" y="0" width="87.443" height="5.535">
                                            </rect>
                                        </svg>
                                    </div>
                                        :
                                    <div>
                                        <span>Θεατρική παράσταση</span>
                                    </div>
                                }    
                            </Tab>           
                        </Tabs>        
                    </div>
                </div>

                { this.state.isFormOpen ?
                    <ItemForm
                    item={this.state.current_tab}
                    editing={this.state.editing}
                    itemToEdit={this.state.itemToEdit}
                    handleClose={this.handleCloseDialog.bind(this)}
                    costumes={this.state.filteredCostumes}
                    uses={this.state.uses}
                    accessories={this.state.filteredAccessories}
                    theatricalPlays={this.state.theatricalPlays}
                    />
                :
                    <div className='dashboard'>
                        <Dashboard
                        item={this.state.current_tab}
                        costumes={this.state.filteredCostumes}
                        uses={this.state.uses}
                        accessories={this.state.filteredAccessories}
                        theatricalPlays={this.state.theatricalPlays}
                        handleEditing={this.handleEditing.bind(this)}
                        refreshDataMethod={this.refreshData.bind(this)}/>

                        <button className="button-insert" onClick={()=>this.handleClickAddButton()}>                                
                            <img id="ButtonAddIcon" src={require('../../styles/images/ADD.png')}/>
                            <span id="ButtonAddText">προσθήκη</span>
                        </button>
                    </div>

                }         
                
                <Footer/>
        
            </React.Fragment>
        )
    }
}

export default Homepage;