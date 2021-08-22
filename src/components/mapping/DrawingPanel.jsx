import React, { Component } from "react";

import GraphPanel2 from "./GraphPanel2";
import NodeAddModal from "./NodeAddModal";

class DrawingPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNodeModal: false,
      droppedTable: {
        name:""
      },
      nodes:[],
      links: [],
      value: ""
    }
  }
  handleClose = () => {
    this.setState({
      showNodeModal: false
      });
  };
  handleShow = () => {
      this.setState({
        showNodeModal: true
      });
  };

  render() {
    return (
      <>
        <div className="mapping-drop-panel dropppable "
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e)=>this.onDrop(e)}>
          <span className="pull-right logo-color"> Drawing panel</span>
          <NodeAddModal show={this.state.showNodeModal} handleClose={this.handleClose}
          table ={this.state.droppedTable} createNodeType={this.createNodeType}/>
        <GraphPanel2 nodes={this.state.nodes} links={this.state.links} addEdge={this.addEdge}/>
        </div>
      </>
    );
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  getNodeObject = (table, id, name) => {
    return {
      id: id,
      name: name,
      table: table
    }
  }

  createNodeType = (name) => {
    this.handleClose();
    let newNode = this.getNodeObject(this.state.droppedTable, this.state.nodes.length, name);
    console.log("dropped node", newNode);
    let nodeList = this.state.nodes;
    
    this.setState(prevState => ({
      nodes: [...prevState.nodes, newNode]
    }));
    // nodeList.push(newNode);
    // console.log("nodeList",nodeList);
    let action = {
      id:0,
      type : 1,
      node : newNode,
      description : newNode.name+" node type created."
    }
    console.log("this.state.nodes",this.state.nodes);
    this.props.onChangeGraph(action, newNode, null);
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
    this.props.onChangeGraph(action, null, newLink)
  }

  onDrop = (ev) => {
    let id = ev.dataTransfer.getData("tableId");
    console.log("dropped Table ID", id);

    this.setState({
      showNodeModal: true,
      droppedTable: this.props.tables[id]
    });
  }
}

export default DrawingPanel;
