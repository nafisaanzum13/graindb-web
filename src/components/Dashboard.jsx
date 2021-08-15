import React, { Component } from "react";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import MappingPanel from "./MappingPanel";

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  state = { count: 0 };
  render() {
    return (
      <div className="row">
        <div className="col-md-3 left-panel " >
          <LeftPanel {...this.props}  />
        </div>
        <div className="col-md-9 middle-panel " style={{borderRight: 2+" px solid black"}}>
        <MappingPanel {...this.props}  />
        </div>
        {/* <div className="col-md-2 right-panel">
          <RightPanel {...this.props}  />
        </div> */}
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
