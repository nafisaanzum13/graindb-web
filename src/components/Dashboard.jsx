import React, { Component } from "react";
class Dashboard extends Component {
  state = { count: 0 };
  render() {
    return (
      <div className="row">
        <div className="col-md-3 left-panel " >
          {/* <h1>count: {this.formatCode()}</h1>
          <button onClick={this.handleClick}>Increment</button> */}
        tables
        </div>
        <div className="col-md-6 middle-panel" style={{borderRight: 2+" px solid black"}}>

        </div>
        <div className="col-md-3 right-panel">

        </div>
      </div>
    );
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  formatCode() {
    const { count } = this.state;
    return count === 0 ? "Zero" : count;
  }
}

export default Dashboard;
