import React, { Component } from "react";
import graphDbLogo from '../assets/images/logo.png';
class Header extends Component {
  state = {};
  render() {
    return (
      <>
      <>
        <div className="row header-body">
          <div className="col-md-2">
            {/* <img src={graphDbLogo}></img> */}
            GrainDBLogo
          </div>
          <div className="col-md-2" style={{paddingRight : 0+'rem'}}>
            <button type="button"
                className="btn btn-block btn-mapper"
>             Define Graph
            </button>
          </div>
          <div className="col-md-2"  style={{paddingLeft : 0.5+'rem'}}>
            <button type="button"
                className="btn btn-block btn-explore"
> Explore Graph
            </button>
          </div>
        </div>
       
      </>
      </>
    );
  }
}

export default Header;
