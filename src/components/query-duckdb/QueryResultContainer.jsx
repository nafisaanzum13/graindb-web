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

  nodePkHash = {}

  resetVars () {
    this.nodePkHash = {}
    this.state ={
      nodes:[],
      links:[]
    };
  }

  prepareNodePkHash () {
    this.nodePkHash = {}
    this.props.graph.nodes.map((node) => {
      this.nodePkHash[node.id] = {};
    })
  }  
  createNodeObject(id, nodeType, propertyObject, pk, nodes) {
    if(this.nodePkHash[nodeType.id][pk]!== undefined) {
      let existingNodeId = this.nodePkHash[nodeType.id][pk];
      // console.log("[existingNodeId]",existingNodeId);
      // console.log("this.state.nodes",this.state.nodes);
      // console.log("this.state.nodes[existingNodeId]",this.state.nodes[existingNodeId]);
      return nodes[existingNodeId];
    }
    else {

      let newNodeObject = {
        id: id,
        pk: pk,
        type: nodeType,
        properties: propertyObject,
        color:"",
        brightColor:""
      }
      this.nodePkHash[nodeType.id][pk] = id;
      console.log("newNodeObject",newNodeObject);
      return newNodeObject;
    }
  }

  getNodeTypeObject(name) {
    console.log("name: ",name.toLowerCase())
    let returnNode = null;
    this.props.graph.nodes.forEach((node) => {
      console.log("node.name.toLowerCase()",node.name.toLowerCase());
      console.log("(node.name.toLowerCase()) == (name.toLowerCase())",((node.name.toLowerCase()) == (name.toLowerCase())) );
      if((node.name.toLowerCase()) == (name.toLowerCase())) {
        console.log("node: ", node);
        returnNode = node;
      }
    })
    return returnNode;
  }

  getNodeTypeAndVarNamesFromQuery = () => {
    let nodeAndVar = {}; //Contains node type name and variable used in the query e.g. (n, vPerson), n=variable, vPerson= nodeTypeName
    var regex = /\((.*?)\)/g;
    var m;
    while(m= regex.exec(this.props.query.toLowerCase())) {
      let nodeAndVarSplit = m[1].split(":")
      nodeAndVar[nodeAndVarSplit[0].trim()] = nodeAndVarSplit[1].trim();
    }
    return nodeAndVar;
  }

  getReturnNodesAndTypes = () => {
    let returnNodeTypesArray = [];
    let nodeTypeAndVarNameObjects = this.getNodeTypeAndVarNamesFromQuery();
    
    let returnString = this.props.query.toLowerCase().match(/select(.*)from/)[1];
    let words = returnString.split(',');
    words.forEach(word => { 
      let elem = word.trim();
      console.log("elem",elem);
      console.log("nodeTypeAndVarNameObjects[elem]: ",nodeTypeAndVarNameObjects[elem]);
      console.log("elem elem.split('.').length: ",elem.split('.').length);
      if(elem.split('.').length==1) {
        let nodeTypeNode = this.getNodeTypeObject(nodeTypeAndVarNameObjects[elem]);
        console.log("nodeTypeNode",nodeTypeNode);
        returnNodeTypesArray.push(nodeTypeNode);
      }
    });
    return returnNodeTypesArray;
  }

  convertTabularDataIntoNodesAndEdges = () => {
    //figure out the return nodes
    let nodes = [];
    let returnNodeArray = this.getReturnNodesAndTypes();
    console.log("returnNodeArray",returnNodeArray);
    let id = 0;
    
    for(let i=0; i<this.props.data[0].length; i++) {
      let start = 0
      for(let j =0; j<returnNodeArray.length; j++) {
       let nodeType =returnNodeArray[j];
        let propertyObject = {};
        for(let k=0; k<nodeType.table.columns.length; k++) {
          propertyObject[nodeType.table.columns[k]] = this.props.data[start+k][i];
        }
        let newNodeObject = this.createNodeObject(id, nodeType, propertyObject, this.props.data[start][i], nodes)
        console.log("newNodeObject",newNodeObject);
        if(newNodeObject.id==id) {
          nodes.push(newNodeObject)
          id ++;
        }
        start = nodeType.table.columns.length;
      }
    }
    this.setState({
      nodes: nodes
    })

  }

  componentDidMount() {
    if(this.props.graph.nodes.length==0 || this.props.query.length==0 || this.props.data.length==0) return;
    this.resetVars();
    this.prepareNodePkHash ();
    this.convertTabularDataIntoNodesAndEdges();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.graph.nodes.length==0 || this.props.query.length==0 && this.props.data.length==0) return;
    if(prevProps != this.props) {
      this.resetVars();
      this.prepareNodePkHash ();
      this.convertTabularDataIntoNodesAndEdges();
    }
  }

  render() {
    let graphDiv =null;
    console.log("nodes", this.state.nodes);
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
