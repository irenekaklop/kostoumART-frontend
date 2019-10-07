import React from 'react';
import Geosuggest from 'react-geosuggest';
 
class GeoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '', a: "" };
  }
 
  handleChange = address => {
    this.setState({ address });
    console.log(this.state);
  };
 
  handleSelect = (address) => {
    this.setState({ address });
    console.log(`Option selected:`, address);
}

handleAddress(){
    this.state.a = this.state.address.description;
    console.log(this.state);
}
 
  render() {
   
    return (
        <div>
        <Geosuggest
        onChange={this.handleChange}
        onSuggestSelect={this.handleSelect}></Geosuggest>
      
      
            {this.handleAddress()}
      </div> 
    );
  }
}

export default GeoSuggest;