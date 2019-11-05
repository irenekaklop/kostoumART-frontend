import React, { Component, PropTypes } from 'react';
import { Menu, Dropdown, Segment, MenuItem } from 'semantic-ui-react';


class DisplayMenu extends Component{

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
                    href ='/display-costumes'
                >
                </Menu.Item>
                <Menu.Item
                    name='use'
                    content = "Χρήση"
                    active={activeItem === 'use'}
                    onClick={this.handleItemClick}
                    href ='/display-uses'>
                </Menu.Item>
                <Menu.Item
                    name='tp'
                    content = "Θεατρική Παράσταση"
                    active={activeItem === 'tp'}
                    onClick={this.handleItemClick}
                    href ='/display-tps'>
                </Menu.Item>
                </Menu>
            </div>
            
        )
    }
}

export default DisplayMenu;