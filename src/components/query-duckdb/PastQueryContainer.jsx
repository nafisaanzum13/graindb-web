import React, { Component } from "react";
class PastQueryContainer extends Component {
  state = {};
  render() {
    return (
      <>
        <div>
          <small>{this.props.query.time}</small><br />
          {this.props.query.query}
          <hr className="zero-margin" />
        </div>
      </>
    );
  }
}

export default PastQueryContainer;