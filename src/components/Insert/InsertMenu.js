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
                    content = "Κοστούμι"
                    active={activeItem === 'costume'}
                    onClick={this.handleItemClick}
                    href = "/insert/costume"
                >
                </Menu.Item>
                <Menu.Item
                    name='use'
                    content = "Χρήση"
                    active={activeItem === 'use'}
                    onClick={this.handleItemClick}
                    href = "/insert/use">
                </Menu.Item>
                <Menu.Item
                    name='tp'
                    content = "Θεατρική Παράσταση"
                    active={activeItem === 'tp'}
                    onClick={this.handleItemClick}
                    href = "/insert/theatrical_play">
                </Menu.Item>
                </Menu>
            </div>
            
        )
    }
}

export default Insert;