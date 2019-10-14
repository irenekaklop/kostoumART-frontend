import React, { Component, PropTypes } from 'react';
import "../../styles/tabs.css";
import "./Insert.css";
import { Menu, Dropdown, Segment, MenuItem } from 'semantic-ui-react';


class Insert extends Component{

    constructor(props){
        super(props);
        this.state = { activeItem: props.activeItem }
    }
    
    
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render(){
        const { activeItem } = this.state

        return (
            <div>
                <Menu pointing secondary>
                <Menu.Item
                    name='costume'
                    active={activeItem === 'costume'}
                    onClick={this.handleItemClick}
                    href='/insertCostume'
                >
                </Menu.Item>
               
                <Menu.Item
                    name='use'
                    active={activeItem === 'use'}
                    onClick={this.handleItemClick}
                    href='/insertUse'>
                   
                </Menu.Item>

                <Menu.Item
                    name='tp'
                    content = "theatrical play"
                    active={activeItem === 'tp'}
                    onClick={this.handleItemClick}
                    href='/insertTP'>
                   
                </Menu.Item>
                </Menu>
            </div>
            
        )
    }
}

export default Insert;