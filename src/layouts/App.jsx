import React, { Component } from "react";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.mainPanel = React.createRef();
  }
  render() {
    return (
      <div className='wrapper'>
        <div className="font-body">
          <div className="header">
            <Header {...this.props} />
          </div>
          <div className="mainbody ">
            <Dashboard {...this.props} />
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
