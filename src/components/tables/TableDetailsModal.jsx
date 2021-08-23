import React, { Component } from "react";
import { Modal, Button, Table } from "react-bootstrap";
class TableDetailsModal extends Component {
    
  constructor(props) {
    super(props);
    this.state ={
        value: ""
    }
  }
  


  render() {
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Details on Table {this.props.table.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        Table {this.props.table.name} has {this.props.table.columns.length} Columns
                        <hr className="zero-margin"/>
                        <Table className="table-sm " responsive="sm"  bordered hover >
                        <thead>
                            <tr>
                                <th> Column Name </th>
                                <th> Data Type</th>
                            </tr>

                        </thead>
                        <tbody>
                
                        {this.props.table.columns.map((column, index) => (
                      <tr>
                        
                          
                          <td >{column} </td>
                          <td >{this.props.table.dataTypes[index]}</td>
                          
                      </tr>
                        ))}
                    
                        </tbody>  
                        </Table>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default TableDetailsModal;