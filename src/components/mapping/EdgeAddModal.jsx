import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
class EdgeAddModal extends Component {
    
  constructor(props) {
    super(props);
    this.state ={
        value: "",
        edgeTable: -1,
        direction: false,
        columns:[],
        sourceCol: "",
        targetCol:""
    }
    this.handleChangeONName = this.handleChangeONName.bind(this)
    this.handleDirectionChange = this.handleDirectionChange.bind(this)
    this.handleEdgeTableChange = this.handleEdgeTableChange.bind(this)
    this.handleSourceColChange = this.handleSourceColChange.bind(this)
    this.handleTargetColChange = this.handleTargetColChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  componentDidMount() {
    // this.setState({edgeTable: this.props.tables[0]});
  }

  handleChangeONName(event) {
    this.setState({value: event.target.value});
  }

  handleDirectionChange(event) {
    this.setState({direction: event.target.value});
  }

  handleEdgeTableChange(event) {
    this.setState({
        columns: []
    })
    this.setState({edgeTable: event.target.value});
    
    this.setState({
        columns: this.props.tables[event.target.value].columns
    })
  }
  handleSourceColChange(event) {
    this.setState({sourceCol: event.target.value});
  }
  handleTargetColChange(event) {
    this.setState({targetCol: event.target.value});
  }


  handleSubmit(event) {
    let joinCondition = {
        table: this.props.tables[this.state.edgeTable],
        sourceCOL: this.state.sourceCol,
        targetCOL: this.state.targetCol,

    }
    this.props.createEdgeType(this.state.value, joinCondition, this.state.direction)
    event.preventDefault();
    this.setState({
        value: "",
        edgeTable: -1,
        direction: false,
        columns:[],
        sourceCol: "",
        targetCol:""
    });
  }

  render() {
    console.log(this.props.tables[this.state.edgeTable]);
    const tablesSelect = this.props.tables.map((table) => <option value={table.id}> {table.name}</option>)
    
    const columns= this.state.columns.map((col) => <option value={col}> {col}</option>)
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        // centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Create Edge Type from Node {this.props.fromNode.name} - {this.props.toNode.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                    <div className="logo-color">
                    Edge Type:</div>
                    <input type="text" name="name" class="form-control"
                    value={this.state.value} onChange={this.handleChangeONName}
                    placeholder="Enter a type for the edge"/>
               
                    </div>
                </div>
                <div className="row" style={{marginTop:0.5+'em'}}>
                    <div className="col-md-8 offset-md-2">
                    <div className="logo-color">
                        Edge Table</div>
                        <select class="form-select"
                            value={this.state.edgeTable} 
                            onChange={this.handleEdgeTableChange} >
                                <option value="-1">Select a Table to join node keys columns</option>
                                {tablesSelect}
                        </select>
                      
                    </div>
                </div>
                <div className="row" style={{marginTop:0.5+'em'}}>
                    <div className="col-md-8 offset-md-2">
                        <div className="logo-color">
                        Join Node {this.props.fromNode.name} on: </div>
                        <select class="form-select"
                            value={this.state.sourceCol} 
                            onChange={this.handleSourceColChange} >
                                <option value="-1">Select the join column</option>
                                {columns}
                        </select>
                    </div>
                </div>
                <div className="row" style={{marginTop:0.5+'em'}}>
                    <div className="col-md-8 offset-md-2">
                    <div className="logo-color">
                        Join Node {this.props.toNode.name} on:  </div>
                        <select class="form-select"
                            value={this.state.targetCol} 
                            onChange={this.handleTargetColChange} >
                                <option value="-1">Select the join column</option>
                                {columns}
                        </select>
                        
                    </div>
                </div>
                <div className="row" style={{marginTop:0.5+'em'}}>
                    <div className="col-md-8 offset-md-2">
                    <div className="logo-color">
                   Edge Direction:</div>
                    <select class="form-select"
                    value={this.state.direction} 
                    onChange={this.handleDirectionChange} >
                        <option value="true">LEFT</option>
                    <option value="false">RIGHT</option>
                </select>
               
                
                    </div>
                </div>
                
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
                Close
            </Button>
            <Button variant="success" onClick={this.handleSubmit}>
                Create
            </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EdgeAddModal;