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
  edgeType = "";
  resetVars () {
    this.nodePkHash = {}
    this.state = {
      nodes:[],
      links:[],
      dataArray: [],
      tableAttributes: []
    };
    this.edgeType = "";
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
      if(nodeAndVarSplit.length>1) nodeAndVar[nodeAndVarSplit[0].trim()] = nodeAndVarSplit[1].trim();
    }
    return nodeAndVar;
  }
  getEdgeTypeAndVarNamesFromQuery = () => {
    let edgeAndVar = {}; //Contains node type name and variable used in the query e.g. (n, vPerson), n=variable, vPerson= nodeTypeName
    var regex = /\[(.*?)\]/g;
    var m;
    while(m= regex.exec(this.props.query.toLowerCase())) {
      let edgeAndVarSplit = m[1].split(":")
      if(edgeAndVarSplit.length>1) {

        edgeAndVar[edgeAndVarSplit[0].trim()] = edgeAndVarSplit[1].trim();
        this.edgeType = edgeAndVarSplit[1].trim();
      }
    }
    return edgeAndVar;
  }
  

  getReturnVarsAndTypes = () => {
    let returnTypesArray = [];
    let nodeTypeAndVarNameObjects = this.getNodeTypeAndVarNamesFromQuery();
    let edgeTypeAndVarNameObjects = this.getEdgeTypeAndVarNamesFromQuery();

    if(Object.keys(nodeTypeAndVarNameObjects).length==0 && Object.keys(edgeTypeAndVarNameObjects).length==0) {
      console.log("This is where it should enter")
      return returnTypesArray;
    }
    console.log("This should not print!")
    //At least one node and edge query
    
    let returnString = this.props.query.toLowerCase().match(/select(.*)from/)[1];
    let words = returnString.split(',');
    words.forEach(word => { 
      let elem = word.trim();
      console.log("elem",elem);
      console.log("elem elem.split('.').length: ",elem.split('.').length);
      let splits = elem.split('.');
      let retObject = {
        name: elem,
        type: "",
        object: {}
      }
      if(splits.length>1 && splits[1] != "*") {
        retObject['type'] = "property";
      } else {
        if(splits.length>1 && splits[1] != "*") {
          
          elem = splits[0];
        }
        let type = nodeTypeAndVarNameObjects[elem];
        if(type === undefined) {
          type = edgeTypeAndVarNameObjects[elem];
          if(type === undefined) {
            alert('Error: return type is neither node or edge!');
            return;
          } else {
            retObject['type']='edge';
            retObject['object'] = this.getEdgeTypeObject(type);
          }
        } else {
          retObject['type']='node';
          retObject['object'] = this.getNodeTypeObject(type);
        }
      }
      console.log("retObject",retObject);
      returnTypesArray.push(retObject);
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

  convertTabularDataIntoNodesAndEdges = (returnTypeArray) => {
    //figure out the return nodes
    let nodes = [];
    let links = [];
    let attributeArray = [];
    let dataArray = [];
    console.log("returnNodeArray",returnTypeArray);
    let id = 0;
    
    for(let i=0; i<this.props.data[0].length; i++) {
      let start = 0
      let data = [];
      let nodesForEdges = [];
      for(let j =0; j<returnTypeArray.length; j++) {
          let type =returnTypeArray[j];
          if(type.type == "property") {
            data.push(this.props.data[start][i])
            start++
          } else if(type.type == 'node') {
            let propertyObject = {};
            let nodeType = type.object;
            console.log("nodeType",nodeType);
            for(let k=0; k<nodeType.table.columns.length; k++) {
              propertyObject[this.props.columns[start+k]] = this.props.data[start+k][i];
            }
            console.log("propertyObject", propertyObject);
            data.push(JSON.stringify(propertyObject));
            let newNodeObject = this.createNodeObject(id, nodeType, propertyObject, this.props.data[start][i], nodes)
            console.log("newNodeObject",newNodeObject);
            nodesForEdges.push(newNodeObject);
            if(newNodeObject.id==id) {
              nodes.push(newNodeObject)
              id ++;
            }
            start =start + nodeType.table.columns.length;
          }
          else {
            //Handle EDGE
            let edgeType = type.object;
          }
          
      }
      console.log("data", data);
      dataArray.push(data);
      if(nodesForEdges.length>1) {
        let newLink ={ 
          id: links.length, 
          source: nodesForEdges[0].id, 
          target: nodesForEdges[1].id, 
          left : false, 
          right : true,
          type: this.edgeType
        };
        links.push(newLink);
      }
      
    }
    for(let j =0; j<returnTypeArray.length; j++) {
      attributeArray.push(returnTypeArray[j].name);
    }

    console.log("dataArray",dataArray);
    console.log("attributeArray",attributeArray);

    this.setTableAttributes(attributeArray);
    this.setTableData(dataArray);
    this.setState({
      nodes: nodes,
      links: links
    })

  }

  getTableDataAndAttributes() {
    let returnVarArray = this.getReturnVarsAndTypes();
    console.log("returnVarArray",returnVarArray);
    if(returnVarArray.length==0) { //no node or edge used in the query
      console.log("No node and edges")
      this.setTableDataFromDataArray();
    } else { //node and/ßor edge var present;
      console.log("node and edge present")
      this.convertTabularDataIntoNodesAndEdges(returnVarArray);
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
    this.getTableDataAndAttributes();
  }

  componentDidMount() {
    if(this.props.columns.length>0) this.setTableDataFromDataArray();
    this.init();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("inside component did update!")
    if((prevProps.query != this.props.query)
    || (prevProps.attributes != this.props.attributes) ||
    (prevProps.data != this.props.data)  ) {
      console.log("prop changed!", this.props.data)

      this.resetVars();
      this.init();
    }
   
  }

  render() {
    let graphDiv =null;
    console.log("nodes", this.state.nodes);
    graphDiv=<GraphShowPanel nodes={this.state.nodes} links={this.state.links} />
    return (
      <>
        <p className="logo-color">QUERY: {this.props.query}</p>
        <Tabs
              defaultActiveKey={0} 
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
                
                    {this.state.tableData.map((_,i) => (
                      <tr>
                        {this.state.tableAttributes.map((_, j) => (
                          
                          <td >{this.state.tableData[i][j]}</td>
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
