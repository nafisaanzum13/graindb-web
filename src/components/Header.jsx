import React, { Component } from "react";
import graphDbLogo from '../assets/images/logo.png';
class Header extends Component {
  state = {};
  render() {
    return (
      <>
      <>
        <div className="row header-body">
          <div className="col-md-2 logo">
            {/* <img src={graphDbLogo}></img> */}
            <span style={{fontSize: 44+"px", verticalAlign:"bottom"}}>
              g</span>
              <span>

              <span style={{fontSize: 36+"px"}}>
              R</span>
              <span className = "logo-green-strokeme ">ainDB</span>
              </span>
              
              
              
          </div>
          {/* <div className="col-md-2 offset-md-6" style={{paddingRight : 0+'rem'}}>
            <button type="button"
                className="btn btn-block btn-mapper"
>             Define Graph in DB
            </button>
          </div>
          <div className="col-md-2"  style={{paddingLeft : 0.5+'rem'}}>
            <button type="button"
                className="btn btn-block btn-explore"
> Explore Graph with GRQL
            </button>
          </div> */}
         
        </div>
        {/* <hr/> */}
      </>
      </>
    );
  }
}

export default Header;
