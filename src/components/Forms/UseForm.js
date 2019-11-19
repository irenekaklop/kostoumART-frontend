import React, {Component} from 'react';

import { Paper, TextField, Button, Snackbar, SnackbarContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';

import { Autocomplete } from '@material-ui/lab';

import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Geosuggest from 'react-geosuggest';
import "../Geosuggest/Geosuggest.css";


import {sexs, materials, techniques, use_categories} from "../../utils/options";
import "./Forms.css";

import axios from 'axios';

class UseForm extends Component{
    render(){
        return(
            <Dialog
                    open={this.props.isOpen}
                    onClose={() => this.handleClose(false)}
                    aria-labelledby="input-dialog"
                    aria-describedby="input-dialog"
                    maxWidth={'lg'}
                    fullWidth={true}>

            </Dialog>
        )
    }
}

export default UseForm;