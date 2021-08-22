import React, { Component } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";

class QueryResultContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <>
        <p className="logo-color">QUERY: {this.props.query}</p>
        <Tabs
              defaultActiveKey="table"
              transition={false}
              className="sm-1"
            >
              <Tab eventKey="table" title={<i class='fa fa-table'></i>}>
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

              <Tab eventKey="graph" title="Graph">
                Graph output here
              </Tab>
              
        </Tabs>
      </>
    );
  }
}

export default QueryResultContainer;
