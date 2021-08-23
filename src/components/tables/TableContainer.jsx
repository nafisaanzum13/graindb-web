import React, { Component } from "react";
import TableDetailsModal from "./TableDetailsModal";

class TableContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal : false
        };

      }
      handleClose = () => {
        this.setState({
            showModal: false
          });
      };
      handleShow = () => {
          this.setState({
            showModal: true
          });
      };

  render() {
    return (
        <div className="row">
            <div className="col-md-10 offset-md-1">
                <div className="list-items row">
                    <div className="col-md-10 selectable-table-div" draggable="true"
                    onDragStart = {(e) => this.onDragStart(e, this.props.table)}
                    >
                    <b>{this.props.table.name}</b> <i className="fa fa-hand-rock-o"></i>
                    </div>
                    <div className="col-md-1 text-right">
                        <div className="tooltip-on-icon">
                            <i className="fa fa-bars" onClick={this.handleShow}/> 
                            <small class="tooltiptext">See Table Details</small>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <small><b>|</b>|</small>
                    {this.props.table.columns.map(column => (
                        <small> {column} |</small>
                    ))}
                    <small><b>|</b></small>
                    </div>
                </div> 
                <TableDetailsModal show={this.state.showModal} handleClose={this.handleClose}
                table = {this.props.table} />
                <hr className="zero-margin"/>
            </div>
        </div>
    );
  }

  onDragStart = (ev, table) => {
      console.log("dragStart:", table.id);
      ev.dataTransfer.setData("tableId", table.id);
  }
}

export default TableContainer;
