import React, { Component } from "react";
class TableContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
  render() {
    return (
        <div className="row">
            <div className="col-md-10 offset-md-1">
                <div className="list-items row">
                    <div className="col-md-10 selectable-table-div" draggable="true">
                    {this.props.table.name}<i class="fa fa-hand-rock-o"></i>
                    </div>
                    <div className="col-md-1 text-right"><i class="fa fa-bars"></i></div>
                </div> 
                <hr className="zero-margin"/>
            </div>
        </div>
    );
  }
}

export default TableContainer;
