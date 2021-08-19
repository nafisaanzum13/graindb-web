import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";

class QueryResultContainer extends Component {
  state = {};
  render() {
    
    return (
      <>
        <Tabs
              defaultActiveKey="table"
              transition={false}
              className="sm-1"
            >
              <Tab eventKey="table" title={<i class='fa fa-table'></i>}>
                Table output here
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
