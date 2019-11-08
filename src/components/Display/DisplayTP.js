import React, { Component } from "react";
import "react-table/react-table.css";
import '../DisplayMenu/DisplayElement.css'
import { PostData } from '../../services/PostData';
import { Table, Search, Icon, Button } from "semantic-ui-react";
import _ from 'lodash';
import DisplayMenu from '../DisplayMenu/DisplayMenu';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from 'axios';

class DisplayTPs extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            TPsData: '',
            direction: null,
            column: null,
            //Search
            selectedTPName: null,
        };
        this.onChange = this.onChange.bind(this);
        this.getTPs = this.getTPs.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.getTPs();
    }
    
    onChange(e){
        this.setState({TPsData:e.target.value});
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

    
    getTPs = _ => {
        //axios.get("http://88.197.53.80/kostoumart-api/tps")
        axios.get("http://localhost:8108/tps")
        .then(res => {
            const data = res.data.response;
            this.setState({ data });
            console.log(this.state);
        }
        )
    }
 
    handleDelete(selectedTPName) {
        this.setState({selectedTPName}); 
    }

    deleteTP(){
        console.log(this.state.selectedTPName);
        if(this.state.selectedTPName){
            PostData('delete_tp', this.state).then((result) => {
                let responseJson = result;
                console.log(result);
                if(responseJson.deleted === 1){
                    console.log("DELETED");
                    this.getTPs();
                    var result=this.createNotification("delete-success");
                    return result;
                }
                else{
                    console.log("not DELETED");
                    var result=this.createNotification("error");
                    return result;
                }
            });
            this.state.selectedTPName=null;
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
        return this.state.data.map((tp, index) => {
            const { theatrical_play_id, title, date, actors, director, theater } = tp //destructuring
            return (
                <Table.Row key={theatrical_play_id}>
                <Table.Cell collapsing>{title}</Table.Cell>
                <Table.Cell collapsing>{date}</Table.Cell>
                <Table.Cell collapsing>{actors}</Table.Cell>
                <Table.Cell collapsing>{director}</Table.Cell>
                <Table.Cell collapsing>{theater}</Table.Cell>
                <Table.Cell collapsing><Button icon
                onClick={()=>{this.handleDelete(title);}}><Icon name="delete" color="red"/></Button></Table.Cell>
                </Table.Row>
            )
        })
    }


    render() {   
        const { column, direction} = this.state;
        this.deleteTP();
        return (
            <div className="container__table">
                <DisplayMenu activeItem = 'tp'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Table celled >
                    <Table.Header fullWidth>
                            <Table.HeaderCell 
                            sorted={column === 'title' ? direction : null}
                            onClick={this.handleSort('title')}
                            >Όνομα Παράστασης</Table.HeaderCell>
                            <Table.HeaderCell>Χρονολογία</Table.HeaderCell>
                            <Table.HeaderCell>Ηθοποιοί</Table.HeaderCell>
                            <Table.HeaderCell>Σκηνοθέτης</Table.HeaderCell>
                            <Table.HeaderCell>Θέατρο</Table.HeaderCell>
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

export default DisplayTPs;