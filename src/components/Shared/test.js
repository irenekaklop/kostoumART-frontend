import React from 'react'
import { render } from 'react-dom'
import Checkbox from '../Shared/Checkbox.js'

class test extends React.Component {
  state = { checked: false }

  handleCheckboxChange = event => {
    this.setState({ checked: event.target.checked })
  }

  render() {
    return (
      <div>
        <label>
          <Checkbox
            checked={this.state.checked}
            onChange={this.handleCheckboxChange}
            name="Name"
          />
          
        </label>
      </div>
    )
  }
}

export default test;
