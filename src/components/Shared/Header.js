import React from 'react';
import '../../components/Dashboard/Dashboard.css';
import Vector_Smart_Object from '../../styles/images/Vector_Smart_Object.png'

class Header extends React.Component {
  render() {
  return (
      <div>
          <img src={Vector_Smart_Object}/>
      </div>
    
  );
}
}

export default Header;