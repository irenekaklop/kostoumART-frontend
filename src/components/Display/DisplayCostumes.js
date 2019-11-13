import React, { Component } from "react";
import _ from 'lodash';
import DisplayMenu from '../DisplayMenu/DisplayMenu';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";
import "./DisplayTable.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";

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
            //axios.delete("http://88.197.53.80/kostoumart-api/costumes", {params: { name: this.state.selectedCostumeName }})
            axios.delete("http://localhost:8108/costumes", {params: { name: this.state.selectedCostumeName }})
            .then(res=> {
                if(res.statusText ==="OK"){
                    let ret=this.createNotification("delete-success");
                    this.getCostumes();
                    this.state.selectedCostumeName = "";
                    return ret;
                }
            })
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
                <TableRow key={costume_id}>
                <TableCell></TableCell>
                <TableCell>{costume_name}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>{use_name}</TableCell>
                <TableCell>{material}</TableCell>
                <TableCell>{technique}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{location_influence}</TableCell>
                <TableCell>{designer}</TableCell>
                <TableCell>{tp_title}</TableCell>
                <TableCell>{actors}</TableCell>
                <TableCell>{roles}</TableCell>
                <TableCell><IconButton><DeleteIcon onClick={()=>{this.handleDelete(costume_name);}}></DeleteIcon> </IconButton></TableCell>
                </TableRow>
            )
        })
    }


    render() {   
        const { column, direction} = this.state;
        console.log(this.state.data);
        this.deleteCostume();
        return (
            <div>
                <DisplayMenu activeItem = 'costume'></DisplayMenu>
                <NotificationContainer></NotificationContainer>
                <Typography component="div">
                <Paper className="root">
                <Table className="table">
                    <TableHead>
                        <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                            /></TableCell>
                        <TableCell><strong>Τίτλος</strong></TableCell>
                        <TableCell><strong>Περιγραφή</strong></TableCell>
                        <TableCell><strong>Φύλο</strong></TableCell>
                        <TableCell><strong>Χρήση</strong></TableCell>
                        <TableCell><strong>Υλικό κατασκευής</strong></TableCell>
                        <TableCell><strong>Τεχνική Κατασκευής</strong></TableCell>
                        <TableCell><strong>Περιοχή Αναφοράς</strong></TableCell>
                        <TableCell><strong>Χώρα Επιρροής</strong></TableCell>
                        <TableCell><strong>Σχεδιαστής</strong></TableCell>
                        <TableCell><strong>Θεατρικές Παραστάσεις</strong></TableCell>
                        <TableCell><strong>Ρόλος</strong></TableCell>
                        <TableCell><strong>Ηθοποιός</strong></TableCell>
                        <TableCell></TableCell>
                        </TableRow> 
                    </TableHead>
                    <TableBody>
                        {this.renderTableData()} 
                    </TableBody>
                </Table>
                </Paper>
                </Typography>
               
          </div>
        );
      }

}

export default DisplayCostumes;