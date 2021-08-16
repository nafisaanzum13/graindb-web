import React, { Component } from "react";
class DrawingPanel extends Component {
  constructor(props) {
    super(props);
    
  }

  graph = {
    nodes : [],
    edges :  []
  };

  render() {
    return (
      <>
        <div className="mapping-drop-panel dropppable "
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e)=>this.onDrop(e)}>
          <span className="pull-right logo-color"> Drawing panel</span>

        </div>
      </>
    );
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev) => {
    let id = ev.dataTransfer.getData("tableId");
    console.log("dropped Table ID", id);
    let newNode = this.props.tables[id];
    console.log("dropped Table", newNode);
    this.graph.nodes.push(newNode);
    let action = {
      id:0,
      type : 1,
      node : newNode,
      description : newNode.name+" node type created."
    }
    this.props.onChangeGraph(action, this.graph)
  }
}

export default DrawingPanel;
