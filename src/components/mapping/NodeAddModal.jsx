import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
class NodeAddModal extends Component {
    
  constructor(props) {
    super(props);
    this.state ={
        value: "",
        attribute: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAttributeChange = this.handleAttributeChange.bind(this)
    
  }

  handleAttributeChange(event) {
    this.setState({attribute: event.target.value});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.props.createNodeType(this.state.value, this.state.attribute);
    event.preventDefault();
    this.setState({value: "", attribute: ""});
  }

  render() {
    console.log("")
    const columns= this.props.table.columns.map((col) => <option value={col}> {col}</option>)
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        // centered
        >
            <Modal.Header closeButton className="text-center">
            <Modal.Title className="text-center">Create node on Table {this.props.table.name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                    {/* <label> */}
                    <div className="logo-color"><b>Node Type:</b></div>
                    <input type="text" name="name" class="form-control"
                    value={this.state.value} onChange={this.handleChange}
                    placeholder="Enter type of the node"/>
                {/* </label> */}
                    </div>
                </div>
              
                <div className="row" style={{marginTop:0.5+'em'}}>
  
                    <div className="col-md-10 offset-md-1">
                    {/* <hr className=""/> */}
                      <div className="logo-color"><b>Attribute value to show as node label:</b></div>
                        <select class="form-select"
                            value={this.state.attribute} 
                            onChange={this.handleAttributeChange} >
                                <option selected>Select a column from the {this.props.table.name} table</option>
                                {columns}
                        </select>
                        
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
                Cancel
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

export default NodeAddModal;