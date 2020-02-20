import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
  <Styled>
    <input type={type} name={name} checked={checked} onChange={onChange} />
    <label>{name}</label>
  </Styled>
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;

const Styled = styled.div`
  display: inline-block;
  > input {
    opacity: 0;
    cursor: pointer;    
    margin-right: -17px;
    z-index: 10;
    position: relative;
  }
 
  > input + label {
    position: relative;
    padding-left: 35.9px; 
    cursor: pointer;    
    &:before {
      content: '';
      position: absolute;
      left:0; top: 1px;
      width: 17px; height: 17px;
      border: 1px solid #aaa;
      background: #f8f8f8;
      border-radius: 10px; 
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3) 
    }
    &:after {
      content: '✔';
      position: absolute;
      top:-2px; left: 2px;
      font-size: 20px;
      color: rgba(88,89,91,1);
      transition: all .2s; /* on prévoit une animation */
    }
  }
  > input:not(:checked) + label {
      &:after {
        opacity: 0;
        transform: scale(0); 
      }
  }
  > input:checked + label {
    &:after {
      opacity: 1; 
      transform: scale(1); 
    }
  }
  > input:checked:focus + label, input:not(:checked):focus + label {
    &:before {
      border: 1px dotted rgba(255,222,23,1);;
    }
  }
`;