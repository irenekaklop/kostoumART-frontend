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

class DisplayUses extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            usesData: '',
            direction: null,
            column: null,
            //Search
            selectedUseName: null,
        };
        this.onChange = this.onChange.bind(this);
        this.getUses = this.getUses.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.getUses();
    }
    
    onChange(e){
        this.setState({usesData:e.target.value});
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

    
    getUses = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/uses")
        axios.get("http://localhost:8108/uses")
        .then(res => {
            const data = res.data.response;
            this.setState({ data });
            console.log(this.state);
        }
        )
    }

    handleDelete(selectedUseName) {
        this.setState({selectedUseName}); 
    }

    deleteUse(){
        console.log(this.state.selectedUseName);
        if(this.state.selectedUseName){
            PostData('delete_use', this.state).then((result) => {
                let responseJson = result;
                console.log(result);
                if(responseJson.deleted === 1){
                    console.log("DELETED");
                    this.getUses();
                    var result=this.createNotification("delete-success");
                    return result;
                }
                else{
                    console.log("not DELETED");
                    var result=this.createNotification("error");
                    return result;
                }
            });
            this.state.selectedUseName=null;
        }
    }

    /*In case of multiple entries under the same name merge SEX values into one entry*/
    transformTable(){
          var output = [];
          
          this.state.data.forEach(function(item) {
            var existing = output.filter(function(v, i) {
              return v.name == item.name;
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
        return this.state.data.map((use, index) => {
            const { useID, name, use_category,description, customs } = use //destructuring
            return (
                <Table.Row key={useID}>
                <Table.Cell collapsing>{name}</Table.Cell>
                <Table.Cell collapsing>{use_category}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell collapsing>{customs}</Table.Cell>
                <Table.Cell collapsing><Button icon
                onClick={()=>{this.handleDelete(name);}}><Icon name="delete" color="red"/></Button></Table.Cell>
                </Table.Row>
            )
        })
    }


    render() {   
        const { column, direction} = this.state;
        this.deleteUse();
        return (
            <div className="container__table">
                <DisplayMenu activeItem = 'use'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Table celled >
                    <Table.Header fullWidth>
                        <Table.HeaderCell 
                        sorted={column === 'name' ? direction : null}
                        onClick={this.handleSort('name')}
                        >Όνομα Δραστηριότητας</Table.HeaderCell>
                        <Table.HeaderCell>Περιγραφή</Table.HeaderCell>
                        <Table.HeaderCell>Κατηγορία Χρήσης</Table.HeaderCell>
                        <Table.HeaderCell>Έθιμα</Table.HeaderCell>
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

export default DisplayUses;