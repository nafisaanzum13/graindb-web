import React, { Component } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import GraphShowPanel from "./GraphShowPanel";

class QueryResultContainer extends Component {
  constructor(props) {
    super(props);
    this.state ={
      activeTab : 0,
      nodes:[],
      links:[]
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect = (key) =>{
    this.setState({
      activeTab : key
    });
  }
  render() {
    let graphDiv =null;
    if(this.state.activeTab ==1) graphDiv=<GraphShowPanel nodes={this.state.nodes} links={this.state.links} />
    return (
      <>
        <p className="logo-color">QUERY: {this.props.query}</p>
        <Tabs
              defaultActiveKey={this.state.activeTab} 
              onSelect={this.handleSelect}
              className="sm-1"
            >
              <Tab eventKey={0}  title={<i class='fa fa-table'></i>}>
                <div className="query-result" >
                <Table className="table-sm" responsive="sm" striped bordered hover >
                  <thead>
                    <tr>
                      {this.props.columns.map(column => (
                        <th> {column} </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                
                    {this.props.data[0]? this.props.data[0].map((_, i) => (
                      <tr>
                        {this.props.data.map((_, j) => (
                          
                          <td >{this.props.data[j][i]}</td>
                          ))
                        }
                      </tr>
                    )) : null} 
                    
                  </tbody>
                </Table>
                </div>
                </Tab>

              <Tab eventKey={1}  title="Graph">
              Graph output here 
               {graphDiv}
                
              </Tab>
              
        </Tabs>
      </>
    );
  }
}

export default QueryResultContainer;
