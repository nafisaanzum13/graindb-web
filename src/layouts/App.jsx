import React, { Component } from "react";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";

import LandingPage from "../components/LandingPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHomePage :  false
    };
    this.handleHomePageSet = this.handleHomePageSet.bind(this);
  }

 
  handleHomePageSet = () => {
   this.setState({
    isHomePage : true
   })

  }

  render() {
    let showPage =
        <>
          <div className="header">
            <Header {...this.props} />
          </div>
          <div className="mainbody ">
            <Dashboard {...this.props} />
          </div>
          <div className="footer">
            <Footer />
          </div>
        
      </>
    if(!this.state.isHomePage) showPage = <LandingPage handleSubmitButton = {this.handleHomePageSet}/>
    return (
      <>
      <div className='wrapper'>
        <div className="font-body">
        {showPage}
        </div>
      </div>
      </>
    );
  }
}

export default App;
