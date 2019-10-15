import React, { Component } from "react";
import "react-table/react-table.css";
import "./DisplayCostumes.css"
import { PostData } from '../../services/PostData';
import { Table, Search, Icon, Button } from "semantic-ui-react";
import _ from 'lodash';

class DisplayCostumes extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            costumeData: '',
            direction: null,
            column: null,
            //Search
            selectedCostumeId: null,

        };
        this.onChange = this.onChange.bind(this);
        this.getCostumes = this.getCostumes.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.getCostumes();
    }

    onChange(e){
        this.setState({costumeData:e.target.value});
    }

    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            data: _.sortBy(data, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
    
        this.setState({
          data: data.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    getCostumes(){
        PostData('costumes', this.state).then((result) => {
            let responseJson = result;
            if(responseJson.costumeData){
                sessionStorage.setItem("costumeData",JSON.stringify(responseJson));
                this.setState({data: responseJson.costumeData});
                console.log(this.state);
            }
            else{
                alert(result.error);
            }
        });
    }

    handleDelete(selectedCostumeId) {
        this.setState({selectedCostumeId}); 
    }

    deleteCostume(){
        if(this.state.selectedCostumeId){
            PostData('deleteCostume', this.state).then((result) => {
                let responseJson = result;
                console.log(result);
                if(responseJson.deleted === 1){
                    console.log("DELETED");
                    this.getCostumes();
                }
                else{
                    console.log("not DELETED");
                }
            });
            this.state.selectedCostumeId=null;
        }
    }

    renderTableData() {
        return this.state.data.map((costume, index) => {
            const { costume_id, name, description, sex, costume_use, material, technique, location, location_influence, designer, theatrical_play, actors, roles } = costume //destructuring
            return (
                <Table.Row key={costume_id}>
                <Table.Cell collapsing>{name}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell collapsing>{sex}</Table.Cell>
                <Table.Cell collapsing>{costume_use}</Table.Cell>
                <Table.Cell collapsing>{material}</Table.Cell>
                <Table.Cell collapsing>{technique}</Table.Cell>
                <Table.Cell collapsing>{location}</Table.Cell>
                <Table.Cell collapsing>{location_influence}</Table.Cell>
                <Table.Cell collapsing>{designer}</Table.Cell>
                <Table.Cell>{theatrical_play}</Table.Cell>
                <Table.Cell>{actors}</Table.Cell>
                <Table.Cell>{roles}</Table.Cell>
                <Table.Cell><Button icon
                onClick={()=>{this.handleDelete(costume_id);}}><Icon name="delete"/></Button></Table.Cell>
                </Table.Row>
            )
        })
    }


    render() {   
        const { column, direction} = this.state
        this.deleteCostume();
        return (
            <div className="container__table">
              <Table celled >
                  <Table.Header fullWidth>
                        <Table.HeaderCell 
                        sorted={column === 'name' ? direction : null}
                        onClick={this.handleSort('name')}
                        >Τίτλος</Table.HeaderCell>
                        <Table.HeaderCell>Περιγραφή</Table.HeaderCell>
                        <Table.HeaderCell>Φύλο</Table.HeaderCell>
                        <Table.HeaderCell>Χρήση</Table.HeaderCell>
                        <Table.HeaderCell>Υλικό κατασκευής</Table.HeaderCell>
                        <Table.HeaderCell>Τεχνική Κατασκευής</Table.HeaderCell>
                        <Table.HeaderCell>Περιοχή Αναφοράς</Table.HeaderCell>
                        <Table.HeaderCell>Χώρα Επιρροής</Table.HeaderCell>
                        <Table.HeaderCell>Σχεδιαστής</Table.HeaderCell>
                        <Table.HeaderCell>Θεατρικές Παραστάσεις</Table.HeaderCell>
                        <Table.HeaderCell>Ρόλος </Table.HeaderCell>
                        <Table.HeaderCell>Ηθοποιός </Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                  </Table.Header>
                  <Table.Body>
                      {this.renderTableData()}
                  </Table.Body>
              </Table>
           
          </div>
        );
      }

}

export default DisplayCostumes;