import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Welcome.css';
import {Router, Route, browserHistory, IndexRoute} from 'react-router-dom';

class Welcome extends Component{
    
    render(){
        return(
           <MenuContainer/>
        );
    }
}

///////////////////
// MenuContainer //
///////////////////
class MenuContainer extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      activeItem: '',
      activeItemPosition: 0,
      activeItemColor: '',
      menuItems: [
        { text: 'Insert', link: '/insert'},
        { text: 'Display', link: '/display' },
      ],
    }
    
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick(activeItem) {
    
    return e => {
      e.preventDefault()
      
      this.setState({
        activeItem,
        activeItemPosition: document.getElementById(activeItem).offsetTop,
        activeItemColor: window.getComputedStyle(document.getElementById(activeItem)).getPropertyValue('background-color'),
      })
      
    }
  }
  
  render() {
    const menuItems = this.state.menuItems.map(item => <MenuItem as={Link} to='/notFound' item={ item } handleClick={ this.handleClick }></MenuItem>)
    return (
      <div className='menu-container'>
        <span className='menu-item--active' style={{ top: this.state.activeItemPosition, backgroundColor: this.state.activeItemColor }}/>
        { menuItems }
      </div>
    )
  }
}

///////////////////
// MenuItem      //
///////////////////
function MenuItem(props) {
  return (
    <div 
      className='menu-item'
      id={ props.item.text }
      onClick={ props.handleClick(props.item.text) }
    >
      <Link to={props.item.link} className="link">{ props.item.text.toUpperCase() }</Link>
    </div>
  )
}

export default Welcome;