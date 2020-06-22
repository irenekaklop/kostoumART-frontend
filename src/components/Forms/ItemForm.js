import React, {Component} from 'react';

import CostumeForm from './CostumeForm';
import AccessoryForm from './AccessoryForm';
import UseForm from './UseForm';
import TpForm from './TpForm';

class ItemForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //For Editing
            editing: false,
            costume: null,
            use: null,
            theatricalPlay: null,
            accessory: null,
        }
    }

    componentDidMount(){

    }

    render(){
        return(
          <div>
            {this.props.item===0 ?
                <div>
                    <CostumeForm
                    handleClose={this.props.handleClose}
                    createdBy={localStorage.getItem('user-name')}
                    costumes={this.props.costumes}
                    uses={this.props.uses}
                    theatrical_plays={this.props.theatricalPlays}
                    editing={this.props.editing}
                    costume={this.props.itemToEdit}
                    />
                </div>
                :
                <div></div>
            }
            {this.props.item===1 ?
                <AccessoryForm
                handleClose={this.props.handleClose}
                createdBy={localStorage.getItem('user-name')}
                costumes={this.props.costumes}
                accessories={this.props.accessories}
                uses={this.props.uses}
                theatrical_plays={this.props.theatricalPlays}
                editing={this.props.editing}
                accessory={this.props.itemToEdit}/>
                :
                <div></div>
            }
            {this.props.item===2 ?
                <UseForm
                handleClose={this.props.handleClose}
                createdBy={localStorage.getItem('user-name')}
                costumes={this.props.costumes}
                accessories={this.props.accessories}
                uses={this.props.uses}
                theatrical_plays={this.props.theatricalPlays}
                editing={this.props.editing}
                use={this.props.itemToEdit}/>
                :
                <div></div>
            }
            {this.props.item===3 ?
                <TpForm
                handleClose={this.props.handleClose}
                createdBy={localStorage.getItem('user-name')}
                costumes={this.props.costumes}
                accessories={this.props.accessories}
                uses={this.props.uses}
                theatrical_plays={this.props.theatricalPlays}
                editing={this.props.editing}
                tp={this.props.itemToEdit}/>
                :
                <div></div>
            }
          </div>
        )
    }

}

export default ItemForm;