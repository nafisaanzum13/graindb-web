import React, { Component } from "react";

import GraphPanel2 from "./GraphPanel2";
class DrawingPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {

      nodes:
        [
        ],
      links: 
        [
        ]
  
    }
      
    
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

        <GraphPanel2 nodes={this.state.nodes} links={this.state.links} addEdge={this.addEdge}/>
        </div>
      </>
    );
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  getNodeObject = (table, id) => {
    return {
      id: id,
      name: table.name,
      table: table
    }
  }

  addEdge = (source, target) => {
    console.log("Souce", source);
    console.log("target", target);
    let id = this.state.links.length;
    let newLink ={ id: id, source: source, target: target, left : false, right : true };
    this.setState(prevState => ({
      links: [...prevState.links, newLink]
    }));
    let action = {
      type : 2,
      link : newLink,
      description : newLink.source.name +"-"+ newLink.target.name +" edge type created."
    }
    this.props.onChangeGraph(action, {nodes: this.state.nodes, links: this.state.links})
  }

  onDrop = (ev) => {
    let id = ev.dataTransfer.getData("tableId");
    console.log("dropped Table ID", id);
    let newNode = this.getNodeObject(this.props.tables[id], this.state.nodes.length);
    console.log("dropped node", newNode);
    this.graph.nodes.push(newNode);
    this.setState(prevState => ({
      nodes: [...prevState.nodes, newNode]
    }));
    let action = {
      id:0,
      type : 1,
      node : newNode,
      description : newNode.name+" node type created."
    }
    this.props.onChangeGraph(action, {nodes: this.state.nodes, links: this.state.links})
  }
}

export default DrawingPanel;
