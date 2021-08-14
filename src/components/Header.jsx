import React, { Component } from "react";
import graphDbLogo from '../assets/images/logo.png';
class Header extends Component {
  state = {};
  render() {
    return (
      <>
      <>
        <div className="row header-body">
          <div className="col-md-2" style={{color: "#11a53ff5", marginTop: -3+"vh"}}>
            {/* <img src={graphDbLogo}></img> */}
            <span style={{fontSize: 44+"px", verticalAlign:"bottom"}}>
              g</span>ra<span style={{ color:"black"}}>inDB</span>
          </div>
          <div className="col-md-2" style={{paddingRight : 0+'rem'}}>
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
          </div>
         
        </div>
        <hr/>
      </>
      </>
    );
  }
}

export default Header;
