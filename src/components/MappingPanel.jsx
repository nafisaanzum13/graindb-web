import React, { Component } from "react";
import DrawingPanel from "./mapping/DrawingPanel";

import Actions from "./actions/Actions";

class MappingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { actions: []};
      }

    onChangeGraph = (action, node, link) =>{
      let actionId = this.state.actions.length + 1;
      action['id'] = actionId;
      this.setState(prevState => ({
        actions: [action, ...prevState.actions]
      }));
      this.props.onChangeGraph(node, link);
    }
  render() {
    return (
      <>
       <h5 className="logo-color"> Map your relational tables into nodes and edges</h5>
       <div className="">
          <small> Nodes (<span className="circle"/>): Drag and drop tables into the drawing panel to define nodes.</small><br/>
          <small>Edges (<span className="circle "/> <span className="arrow-right"/> <span class="circle"/>):
       Draw edges between the nodes on the drawing panel to define edges.</small>
       </div>
       {/* <hr className="zero-margin"></hr> */}
       
       <div className="row top-padding-half">
          <div className="col-md-8">
              <DrawingPanel tables = {this.props.tables} onChangeGraph={this.onChangeGraph}/>
          </div>
          <div className="col-md-4 zero-padding">
            <Actions actions={this.state.actions} />
          </div>
       </div>
      </>
    );
  }
}

export default MappingPanel;
