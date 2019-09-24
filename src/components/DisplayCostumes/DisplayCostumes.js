import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./DisplayCostumes.css"
import { InsertData } from '../../services/InsertData';

class DisplayCostumes extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            costumeData: '',
        };
        this.onChange = this.onChange.bind(this);
        this.getCostumes = this.getCostumes.bind(this);
    }

    onChange(e){
        this.setState({costumeData:e.target.value});
    }

    getCostumes(){
        InsertData('costumes', this.state).then((result) => {
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

    render() {
        
        console.log(this.state.data);
        return (
          <div>
              <h2>Costumes' Archive</h2>
            <ReactTable
              data={this.state.data}
              pageSize={20}
              pageSizeOptions={[20, 30]}
              columns={[
                {
                    Header: "Name",
                    accessor: "name",
                    minWidth: 250
                }
                ,
                {
                    Header: "Description",
                    accessor: "description",
                    minWidth: 400
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            />
            <br />
            {this.getCostumes()}
          </div>
        );
      }

}

export default DisplayCostumes;