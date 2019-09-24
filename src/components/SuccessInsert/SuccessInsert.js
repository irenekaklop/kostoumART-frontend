import React, {Component} from 'react';

class SuccessInsert extends Component {
    render() {
        return (
            <div className="row small-up-2 medium-up-3 large-up-4" id="Body">
                <div className="medium-12 columns">
                    <h3>Data were inserted successfully!</h3>
                    <a href="/displayCostumes">Display Costumes</a>
                </div>
            </div>
        )
    }
}

export default SuccessInsert;