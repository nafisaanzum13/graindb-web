import React, { Component } from "react";
class MappingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
  render() {
    return (
      <>
       <h4 className="logo-color top-padding-half"> Map your relational tables into nodes and edges</h4>
       <div className="row">
          <div className="col-md-8 mapping-drop-panel">

          </div>
       </div>
      </>
    );
  }
}

export default MappingPanel;
