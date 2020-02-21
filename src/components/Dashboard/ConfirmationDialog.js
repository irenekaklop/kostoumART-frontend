import React, {Component} from 'react';

import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core';

class ConfirmationDialog extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                 <Dialog
                    open={this.props.isOpen}
                    onClose={() => {this.props.handleClose(false)}}>
                    <DialogTitle id="confirmation-dialog-title">Διαγραφή</DialogTitle>
                        <DialogContent dividers>
                            {this.props.dependency ? 
                                 <p>Άλλες εγγραφές χρησιμοποιούν αυτή την εγγραφή. Είστε σίγουροι ότι θέλετε να συνεχίσετε με την διαγραφή;</p>
                            :
                                <p>Είστε σίγουροι ότι επιθυμείτε να διαγράψετε αυτή την εγγραφή;</p>
                            }
                        </DialogContent>
                        
                        <DialogActions>
                        <Button autoFocus onClick={() => {this.props.handleClose()}} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={() => {this.props.handleOk(this.props.index)}} color="primary">
                        Ok
                        </Button>
                    </DialogActions>
                    </Dialog>
            </div>
        );
    }
}

export default ConfirmationDialog;