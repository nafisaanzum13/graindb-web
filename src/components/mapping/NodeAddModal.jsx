import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
class NodeAddModal extends Component {
    
  constructor(props) {
    super(props);
    this.state ={
        value: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.props.createNodeType(this.state.value)
    event.preventDefault();
    this.setState({value: ""});
  }

  render() {
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        // centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Create node on Table {this.props.table.name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                    <label>
                    Node Type:
                    <input type="text" name="name" 
                    value={this.state.value} onChange={this.handleChange}
                    placeholder="Enter type of the node"/>
                </label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
                Create
            </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default NodeAddModal;