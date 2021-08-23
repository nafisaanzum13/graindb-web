import React, { Component } from "react";
class TableContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

      }
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
                    <div className="col-md-1 text-right"><i className="fa fa-bars"></i></div>
                    <div className="col-md-12 ">
                        <small><b>|</b>|</small>
                    {this.props.table.columns.map(column => (
                        <small> {column} |</small>
                    ))}
                    <small><b>|</b></small>
                    </div>
                </div> 
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
