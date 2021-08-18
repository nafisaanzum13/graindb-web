import React, { Component } from "react";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import MappingPanel from "./MappingPanel";
import ls from 'local-storage';
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      tables: [],
      graph: {
        nodes:[],
        links:[]
      }
    };
  }

  componentDidMount() {
    let tableList = populateTable();
    this.setState ({
      isLoaded: true,
      tables: tableList
    });

    ls.set("tableList",this.state.tables);
  }

  onChangeGraph = (graph) => {
    this.setState({graph:graph})
  }

  state = { count: 0 };
  render() {
    return (
      <div className="row">
        <div className="col-md-3 left-panel " >
          <LeftPanel tables={this.state.tables} graph={this.state.graph}/>
        </div>
        <div className="col-md-9 middle-panel " style={{borderRight: 2+" px solid black"}}>
        <MappingPanel tables={this.state.tables} graph={this.state.graph} onChangeGraph={this.onChangeGraph}/>
        </div>
        {/* <div className="col-md-2 right-panel">
          <RightPanel {...this.props}  />
        </div> */}
      </div>
    );
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  formatCode() {
    const { count } = this.state;
    return count === 0 ? "Zero" : count;
  }
}

function populateTable() {
  const tables = [];
  tables.push({id: 0, name: "Customer", columns: ['cid', 'name', 'address']});
  tables.push({id: 1, name: "Product", columns: ['pid', 'description', 'price']});
  tables.push({id: 2, name: "SingleOrderItems", columns: ['sid','pid', 'quantity']});
  tables.push({id: 3, name: "Order", columns: ['oid', 'soid', "address"]});
  tables.push({id: 4, name: "Merchant", columns: ['oid', 'sid', "address"]});
  tables.push({id: 5, name: "Warehouse", columns: ['cid', 'name', 'address']});
  tables.push({id: 6, name: "Locations", columns: ['pid', 'description', 'price']});
  tables.push({id: 7, name: "Cities", columns: ['sid','pid', 'quantity']});
  tables.push({id: 8, name: "OrderDetails", columns: ['oid', 'soid', "address"]});
  return tables;
}

export default Dashboard;
