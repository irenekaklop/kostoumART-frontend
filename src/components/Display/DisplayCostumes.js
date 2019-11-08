import React, { Component } from "react";
import "react-table/react-table.css";
import '../DisplayMenu/DisplayElement.css'
import { PostData } from '../../services/PostData';
import { Table, Search, Icon, Button } from "semantic-ui-react";
import _ from 'lodash';
import DisplayMenu from '../DisplayMenu/DisplayMenu';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";

class DisplayCostumes extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            costumeData: '',
            direction: null,
            column: null,
            //Search
            selectedCostumeName: null,
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

    createNotification(type){
        switch (type) {
            case "error":
                return(
                    <div>
                        <NotificationContainer>{ NotificationManager.error('Η εγγραφή δεν διαγράφηκε!') }</NotificationContainer>
                    </div>
                )
            case "delete-success":
                return(
                    <NotificationContainer>{ NotificationManager.success('Η εγγραφή διαγράφηκε','Success!',2000) }</NotificationContainer>
                )
            
        };
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

    getCostumes = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/costumes")
        axios.get("http://localhost:8108/costumes")
        .then(res => {
            const data = res.data.response;
            this.setState({ data });
            console.log(this.state);
        }
        )
    }

    handleDelete(selectedCostumeName) {
        this.setState({selectedCostumeName}); 
    }

    deleteCostume(){
        if(this.state.selectedCostumeName){
           /* PostData('deleteCostume', this.state).then((result) => {
                let responseJson = result;
                console.log(result);
                if(responseJson.deleted === 1){
                    console.log("DELETED");
                    var result=this.createNotification("delete-success");
                    this.getCostumes();
                    return result;
                }
                else{
                    console.log("not DELETED");
                    var result=this.createNotification("error");
                    return result;
                }
            });
            this.state.selectedCostumeName=null;*/
        }
    }

    transformTable(){
          var output = [];
          
          this.state.data.forEach(function(item) {
            var existing = output.filter(function(v, i) {
              return v.costume_name == item.costume_name;
            });
            if (existing.length) {
              var existingIndex = output.indexOf(existing[0]);
              output[existingIndex].sex = output[existingIndex].sex.concat(item.sex);
            } else {
              if (typeof item.sex == 'string')
                item.sex = [item.sex];
              output.push(item);
            }
          });
          
          output.forEach(
              function(item){
                  if(item.sex.length){
                    item.sex = item.sex.join(", ");
                  }
                  
              }
          )
          this.setState({data: output});
          console.log(this.state);
    }

    renderTableData() {
        return this.state.data.map((costume, index) => {
            const { costume_id, use_name, costume_name, description, sex, material, technique, location, location_influence, designer, tp_title, actors, roles } = costume //destructuring
            return (
                <Table.Row key={costume_id}>
                <Table.Cell collapsing>{costume_name}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell collapsing>{sex}</Table.Cell>
                <Table.Cell collapsing>{use_name}</Table.Cell>
                <Table.Cell collapsing>{material}</Table.Cell>
                <Table.Cell collapsing>{technique}</Table.Cell>
                <Table.Cell collapsing>{location}</Table.Cell>
                <Table.Cell collapsing>{location_influence}</Table.Cell>
                <Table.Cell collapsing>{designer}</Table.Cell>
                <Table.Cell>{tp_title}</Table.Cell>
                <Table.Cell>{actors}</Table.Cell>
                <Table.Cell>{roles}</Table.Cell>
                <Table.Cell collapsing><Button icon
                onClick={()=>{this.handleDelete(costume_name);}}><Icon name="delete" color="red"/></Button></Table.Cell>
                </Table.Row>
            )
        })
    }


    render() {   
        const { column, direction} = this.state;
        this.deleteCostume();
        console.log(this.state.data);
        return (
            <div className="container__table">
                <DisplayMenu activeItem = 'costume'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Table celled >
                    <Table.Header fullWidth>
                            <Table.HeaderCell 
                            sorted={column === 'costume_name' ? direction : null}
                            onClick={this.handleSort('costume_name')}
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