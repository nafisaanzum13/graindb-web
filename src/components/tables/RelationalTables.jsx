import React, { Component } from "react";

import TableContainer from "./TableContainer";
class RelationalTables extends Component {
  constructor(props) {
    super(props);
    this.state =  {};
    console.log(this.state);
    this.state.searchText = "";
    this.editSearchTerm = this.editSearchTerm.bind(this);
    this.dynamicSearchFilter = this.dynamicSearchFilter.bind(this);
    
  }

  editSearchTerm(e) {
      this.setState({searchText : e.target.value});
  }

  dynamicSearchFilter(tableList) {

      return tableList.filter(table => 
        table.name.toLowerCase().includes(this.state.searchText.toLowerCase())
        )
  }

  
  
render() {
    let filteredTables = this.dynamicSearchFilter(this.props.tables);
    const tableList = filteredTables.map((singleTable) => <TableContainer table={singleTable} />);
    return (
      <>
        <div className="row" style={{paddingLeft:0.7+"em", paddingRight:0.7+"em", paddingTop:0.3+"em", paddingBottom:0.2+"em"}} >
            <div className = "col-md-12">
                <input type='text' className="form-control form-control-sm" value = {this.state.searchText} onChange = {this.editSearchTerm} 
                placeholder = "Search Table" />
            </div>
        </div>
        {tableList}   
      </>
    );
  }
}



export default RelationalTables;

