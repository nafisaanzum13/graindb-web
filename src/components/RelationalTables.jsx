import React, { Component } from "react";
class RelationalTables extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.tables = [];
    this.state.tables = populateTable();
    console.log(this.tables );
    this.state.searchText = "";
    this.editSearchTerm = this.editSearchTerm.bind(this);
    this.dynamicSearchFilter = this.dynamicSearchFilter.bind(this);
  }

  editSearchTerm(e) {
      this.setState({searchText : e.target.value});
  }

  dynamicSearchFilter() {
      return this.state.tables.filter(table => 
        table.name.toLowerCase().includes(this.state.searchText.toLowerCase())
        )
  }

  
  
render() {
    let filteredTables = this.dynamicSearchFilter();
    const tableList = filteredTables.map((singleTable) =>
    <div className="row">
         <div className="col-md-11 offset-md-1 zero-padding">
            <div className="list-items row">
                <div className="col-md-9 selectable-table-div" draggable="true">
                {singleTable.name}<i class="fa fa-hand-rock-o"></i>
                </div>
                <div className="col-md-1 text-right"><i class="fa fa-bars"></i></div>
            </div>
            
            <hr className="zero-margin"/>
        </div>

    </div>
   
    );
    return (
      <>
      <div style={{margin:0.3+"em"}}>
        <input type='text' className="form-control form-control-sm" value = {this.state.searchText} onChange = {this.editSearchTerm} 
        placeholder = "Search Table" />
      </div>
      <div>
        {tableList} 
      </div>
          
      </>
    );
  }
}



export default RelationalTables;

function populateTable() {
    const tables = [];
    tables.push({id: 0, name: "Customer", columns: ['cid', 'name', 'address']});
    tables.push({id: 1, name: "Product", columns: ['pid', 'description', 'price']});
    tables.push({id: 2, name: "SingleOrderItems", columns: ['sid','pid', 'quantity']});
    tables.push({id: 3, name: "Order", columns: ['oid', 'soid', "address"]});
    tables.push({id: 3, name: "Supplier", columns: ['oid', 'sid', "address"]});
    tables.push({id: 0, name: "Customer", columns: ['cid', 'name', 'address']});
    tables.push({id: 1, name: "Product", columns: ['pid', 'description', 'price']});
    tables.push({id: 2, name: "SingleOrderItems", columns: ['sid','pid', 'quantity']});
    tables.push({id: 3, name: "Order", columns: ['oid', 'soid', "address"]});
    tables.push({id: 3, name: "Supplier", columns: ['oid', 'sid', "address"]});
    tables.push({id: 0, name: "Customer", columns: ['cid', 'name', 'address']});
    tables.push({id: 1, name: "Product", columns: ['pid', 'description', 'price']});
    tables.push({id: 2, name: "SingleOrderItems", columns: ['sid','pid', 'quantity']});
    tables.push({id: 3, name: "Order", columns: ['oid', 'soid', "address"]});
    tables.push({id: 3, name: "Supplier", columns: ['oid', 'sid', "address"]});
    return tables;
}