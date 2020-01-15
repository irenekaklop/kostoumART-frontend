import React, {Component} from 'react';

import {
    Paper,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableRowColumn,
    Tab
} from "@material-ui/core/";

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import axios from 'axios';
import orderBy from "lodash/orderBy";
import _ from 'lodash'

const invertDirection = {
    asc: "desc",
    desc: "asc"
  };
  
const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Katigoria' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Perigrafi' },
  { id: 'customs', numeric: false, disablePadding: false, label: 'Ethima' },
];

class SortTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            column: null,
            direction: null,
            use_data: [],
        }
    }

    componentDidMount(){
        console.log("get_uses")
        this.get_uses();
    }

    handleSort = (clickedColumn) => () => {
        const { column, use_data, direction } = this.state
    
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            use_data: _.sortBy(use_data, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
    
        this.setState({
          use_data: use_data.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
        console.log(use_data)
    }
    
    get_uses = () => {
        //axios.get("http://88.197.53.80/kostoumart-api/uses/")
        axios.get("http://localhost:8108/uses")
        .then(res => {
            const use_data = res.data.response;
            console.log("response", use_data)
            if(use_data){
                this.setState({
                    use_data: use_data,
                })
            }
        })
    }

    renderTableUsesData() {
        return this.state.use_data.map((use, index) => {
            const { useID, name, use_category,description, customs } = use //destructuring
            return (
                <TableRow key={useID}>
                    <TableCell>
                        {name}
                   </TableCell>
                    <TableCell>
                        {use_category}
                    </TableCell>
                    <TableCell>
                        {description}
                    </TableCell>
                    <TableCell>
                        {customs}
                    </TableCell>
                </TableRow>
            )
        })
    }
    
    render(){
        const { column, use_data, direction } = this.state

    return (
        <div>
        <Paper>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell
                    sorted={column === 'name' ? direction : null}
                    onClick={this.handleSort('name')}>
                    <strong>Όνομα</strong> 
                    </TableCell>
                    <TableCell
                    sorted={column === 'use_category' ? direction : null}
                    onClick={this.handleSort('use_category')}>
                    <strong>Κατηγορία Χρήσης</strong></TableCell>
                    <TableCell
                    sorted={column === 'description' ? direction : null}
                    onClick={this.handleSort('description')}>
                    <strong>Περιγραφή</strong></TableCell>
                    <TableCell
                    sorted={column === 'customs' ? direction : null}
                    onClick={this.handleSort('customs')}>
                    <strong>Έθιμα</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{this.renderTableUsesData()} </TableBody>
            </Table> 
        </Paper>
        </div>
    );}
}


export default SortTable;