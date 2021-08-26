import React, { Component } from "react";

import GraphPanel from "./GraphPanel";
import NodeAddModal from "./NodeAddModal";
import EdgeAddModal from "./EdgeAddModal";

class DrawingPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNodeModal: false,
      showEdgeModal: false,
      fromNode: {},
      toNode: {},
      droppedTable: {
        name:""
      },
      nodes:[],
      links: [],
      value: ""
    }
  }
  baseURL = "http://localhost:8080/http://localhost:1294/";

  colors = ['#E03E1A', '#4566F7', '#72DB42', '#6EB1E0', '#16F2B0'];
  handleClose = () => {
    this.setState({
      showNodeModal: false
      });
      this.setState({
        showEdgeModal: false
        });
  };
  handleShow = () => {
      this.setState({
        showNodeModal: true
      });
  };

  componentDidMount() {
    if (localStorage.getItem('graph')) {
      console.log("localStorage.getItem('graph')",localStorage.getItem('graph'));
      let graph = JSON.parse(localStorage.getItem('graph'));
      this.setState({
        nodes: graph.nodes,
        links: graph.links
      })
    }
    
  }

  render() {
    return (
      <>
        <div className="mapping-drop-panel dropppable "
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e)=>this.onDrop(e)}>
          <span className="pull-right logo-color"> Drawing panel</span>
          <NodeAddModal show={this.state.showNodeModal} handleClose={this.handleClose}
          table ={this.state.droppedTable} createNodeType={this.createNodeType}/>
          <EdgeAddModal tables = {this.props.tables} show={this.state.showEdgeModal} handleClose={this.handleClose}
          fromNode ={this.state.fromNode} toNode ={this.state.toNode} createEdgeType={this.createEdgeType}/>
        <GraphPanel nodes={this.state.nodes} links={this.state.links} addEdge={this.addEdge}
        />
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
      table: table,
      color: this.colors[id]
    }
  }

  

  createNodeType = (name) => {
    this.handleClose();
    let newNode = this.getNodeObject(this.state.droppedTable, this.state.nodes.length, name);
    console.log("dropped node", newNode);

    let queryURL = this.baseURL + "query?q=CREATE VERTEX "+name+" ON "+this.state.droppedTable.name+";";
    fetch(queryURL, {})
      .then(res  => res.json())
      .then(
        (result) => {
          console.log("result", result);
          if(result.success == true) {
            this.setState(prevState => ({
              nodes: [...prevState.nodes, newNode]
            }));
            let action = {
              id:0,
              type : 1,
              node : newNode,
              description : newNode.name+" node type created."
            }
            console.log("this.state.nodes",this.state.nodes);
            this.props.onChangeGraph(action, newNode, null);
          } else {
            console.log("error", result.error);
            alert('Error ' + result.error);
          }
        },
        (error) => {
          console.log("error", error);
          alert('Error ' + error);
        }
      )    
  }

  createEdgeType = (name, joinCondition, isLeft) => {
    this.handleClose();
    let source = this.state.fromNode;
    let target = this.state.toNode;
    let id = this.state.links.length;
    let newLink ={ id: id,name:name, source: source, target: target, left : isLeft, right : !isLeft, joinCondition:joinCondition };
    let queryURL = this.baseURL + 
    "query?q=CREATE EDGE  "+name+" ON "+joinCondition.table.name;
    let fromNodeString = source.name +" REFERENCES "+joinCondition.sourceCOL;
    let toNodeString = target.name +" REFERENCES "+joinCondition.targetCOL;
    if(isLeft){
      queryURL += " ( FROM "+fromNodeString+", TO "+toNodeString+" ); ";
    } else {
      queryURL += " ( FROM "+toNodeString+", TO "+fromNodeString+" ); ";
    }
    console.log("queryURL", queryURL)
    fetch(queryURL, {})
      .then(res  => res.json())
      .then(
        (result) => {
          console.log("result", result);
          if(result.success == true) {
            this.setState(prevState => ({
              links: [...prevState.links, newLink]
            }));
            let action = {
              type : 2,
              link : newLink,
              description : name+" edge type created."
            }
            this.props.onChangeGraph(action, null, newLink)
          } else {
            console.log("error", result.error);
            alert('Error ' + result.error);
          }
        },
        (error) => {
          console.log("error", error);
          alert('Error ' + error);
        }
      )    
  }


  addEdge = (source, target) => {
    console.log("Souce", source);
    console.log("target", target);
    this.setState(prevState => ({
      showEdgeModal: true,
      fromNode: source,
      toNode: target
    }));
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
