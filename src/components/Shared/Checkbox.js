import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
  <tr> 
    <td ><input type={type} name={name} checked={checked} onChange={onChange} /></td>
    <td><label>{name}</label></td>
  </tr>
 
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;