import React, { Component } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import GraphShowPanel from "./GraphShowPanel";

class QueryResultContainer extends Component {
  constructor(props) {
    super(props);
    this.state ={
      activeTab : 0,
      nodes:[],
      links:[],
      tableAttributes:[],
      tableData : []
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
  getEdgeTypeAndVarNamesFromQuery = () => {
    let edgeAndVar = {}; //Contains node type name and variable used in the query e.g. (n, vPerson), n=variable, vPerson= nodeTypeName
    var regex = /\[(.*?)\]/g;
    var m;
    while(m= regex.exec(this.props.query.toLowerCase())) {
      let edgeAndVarSplit = m[1].split(":")
      edgeAndVar[edgeAndVarSplit[0].trim()] = edgeAndVarSplit[1].trim();
    }
    return edgeAndVar;
  }
  

  getReturnVarsAndTypes = () => {
    let returnTypesArray = [];
    let nodeTypeAndVarNameObjects = this.getNodeTypeAndVarNamesFromQuery();
    let edgeTypeAndVarNameObjects = this.getEdgeTypeAndVarNamesFromQuery();

    if(nodeTypeAndVarNameObjects=={} && edgeTypeAndVarNameObjects=={}) {
      return returnTypesArray;
    }
    //At least one node and edge query
    
    let returnString = this.props.query.toLowerCase().match(/select(.*)from/)[1];
    let words = returnString.split(',');
    words.forEach(word => { 
      let elem = word.trim();
      console.log("elem",elem);
      console.log("elem elem.split('.').length: ",elem.split('.').length);
      if(elem.split('.').length==1) {
        let nodeTypeNode = this.getNodeTypeObject(nodeTypeAndVarNameObjects[elem]);
        console.log("nodeTypeNode",nodeTypeNode);
        returnTypesArray.push(nodeTypeNode);
      }
    });
    return returnTypesArray;
  }

  setTableAttributes(attributes) {
    this.setState({
      tableAttributes: attributes
    })
  }

  setTableData(dataArray) {
    this.setState({
      tableData: dataArray
    })
  }

  convertTabularDataIntoNodesAndEdges = (returnNodeArray) => {
    //figure out the return nodes
    let nodes = [];
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

  getTableDataAndAttributes() {
    let returnVarArray = this.getReturnVarsAndTypes();
    if(returnVarArray.length==0) { //no node or edge used in the query
      this.setTableDataFromDataArray();
    } else { //node and/ßor edge var present;

    }
  }

  setTableDataFromDataArray() {
    let dataArray = [];
    if(!this.props.data[0] || this.props.data[0].length==0) return;

    for(let i=0;i<this.props.data[0].length; i++) {
      let values = [];
      for(let j=0; j<this.props.data.length; j++) {
        values.push(this.props.data[j][i]);
      }
      dataArray.push(values)
    }
    this.setTableAttributes(this.props.columns);
    this.setTableData(dataArray);
  }

  init() {
    if(this.props.graph.nodes.length==0 || this.props.query.length==0 || this.props.data.length==0) {
      return;
    }
    this.resetVars();
    this.prepareNodePkHash ();
    this.convertTabularDataIntoNodesAndEdges();
  }

  componentDidMount() {
    if(this.props.columns.length>0) this.setTableDataFromDataArray();
    this.init();
  }

  componentDidUpdate(prevProps, prevState) {
    this.init();
    if(prevProps != this.props) {
      this.setTableDataFromDataArray()
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
                      {this.state.tableAttributes.map(column => (
                        <th> {column} </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                
                    {this.state.tableData.map((data) => (
                      <tr>
                        {data.map((value) => (
                          
                          <td >{value}</td>
                          ))
                        }
                      </tr>
                    ))}
                    
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
