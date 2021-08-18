import React, { Component } from "react";

import NodeDetailsContainer from "./NodeDetailsContainer";

import EdgeDetailsContainer from "./EdgeDetailsContainer";
class MappedGraphPanel extends Component {
  state = {};
  render() {
      console.log(this.props)
      const nodeList = this.props.nodes.map((node) => <NodeDetailsContainer node={node} />);
      const edgeList = this.props.links.map((edge) => <EdgeDetailsContainer edge={edge} />);
    return (
      <>
      <div style={{paddingLeft: 1+'em'}}>
        <span className = "logo-color">Nodes</span><br/>
        {this.props.nodes.length==0? "No Nodes defined!": ""}
        <div className="row">
          <div className="col-md-12">
            {nodeList}
          </div>
        </div>
        <span className = "logo-color">Edges</span><br/>
        {this.props.links.length==0? "No Edges defined!": ""}
        <div className="row">
          <div className="col-md-12">
          {edgeList}
          </div>
        </div>

      </div>
      
      
      
      </>
    );
  }
}

export default MappedGraphPanel;
