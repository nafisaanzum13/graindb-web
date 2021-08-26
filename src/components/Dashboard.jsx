import React, { Component } from "react";

import LeftPanel from "./LeftPanel";
import MappingPanel from "./MappingPanel";
import GrqlMain from "./query-duckdb/GrqlMain";
import axios from "axios";


import { Tabs, Tab } from "react-bootstrap";
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
  baseURL = "http://localhost:8080/http://localhost:1294/"
  
  componentDidMount() {
    
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', '*');

    headers.append('GET', 'POST', 'OPTIONS');
    let queryURL = this.baseURL + "query?q=PRAGMA show_tables"

    fetch(queryURL, {})
      .then(res  => res.json())
      .then(
        (result) => {
          console.log("result", result.data[0]);
          let tables = this.getTableObjects(result.data[0]);
          this.setState ({
            isLoaded: true,
            tables: tables
          });
        },
        (error) => {
          console.log("error", error);
          this.setState({
            isLoaded: false,
            error
          });
        }
      )
      if (localStorage.getItem('graph')) {
        console.log("localStorage.getItem('graph')",localStorage.getItem('graph'));
        this.setState({
          graph: JSON.parse(localStorage.getItem('graph'))
        })
      }
      
  }

  getTableInfo = (index, tableName) => {
    let queryURL = this.baseURL + "query?q=PRAGMA table_info('"+tableName+"');"
    fetch(queryURL)
    .then(res  => res.json())
    .then(
      (result) => {
        console.log("result", result.data);
        let tableList = this.state.tables;
        tableList[index]['columns'] = result.data[1];
        tableList[index]['dataTypes'] = result.data[2];
        this.setState ({
          isLoaded: true,
          tables: tableList
        });
        console.log("result", this.state.tables);
      },
      (error) => {
        console.log("error", error);
      }
    )

  }

  onChangeGraph = (newNode, newLink) => {
    if(newNode != null) this.state.graph.nodes.push(newNode);
    if(newLink != null) this.state.graph.links.push(newLink);
    localStorage.setItem('graph', JSON.stringify(this.state.graph)) ;
    this.setState(prevState => ({
      graph: this.state.graph
    }));
  }

  state = { count: 0 };
  render() {
    return (
      <div className="row">
        <div className="col-md-3 left-panel " >
          <LeftPanel tables={this.state.tables} graph={this.state.graph}/>
        </div>
        <div className="col-md-9 middle-panel " style={{borderRight: 2+" px solid black"}}>
        <Tabs
              defaultActiveKey="home"
              transition={false}
              id="noanim-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Schema Designer">
                <MappingPanel tables={this.state.tables} graph={this.state.graph} onChangeGraph={this.onChangeGraph}/>
              </Tab>
              <Tab eventKey="grql" title="GrainDB Query Interface">
                <GrqlMain tables={this.state.tables} graph={this.state.graph}  />
              </Tab>
              
            </Tabs>
       
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

  getTableObjects(tableNameArray) {
    const tables  = []
    let index = 0;
    tableNameArray.forEach(tableName => {
      
      tables.push({id: index, name: tableName, columns: [], pk:[], dataTypes:[]});
      this.getTableInfo(index, tableName);
      index++;
    }); 
    return tables;
  }
  
}

export default Dashboard;
