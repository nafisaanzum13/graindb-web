import React, { Component } from "react";

import ActionContainer from "./ActionContainer";
class Actions extends Component {
  state = {};
  render() {
    // const revActionArray = this.props.actions.reverse()
    const actionList = this.props.actions.map((singleAction) => <ActionContainer action={singleAction} />);
    return (
      <>
      <h5 className="logo-color">Actions  
       <div className="tooltip-on-icon">
          <i className="fa fa-undo " style={{fontSize: '1em', color:'red', marginLeft:"0.3em"}}/> 
          <small class="tooltiptext">Undo the most recent action</small>
       </div>
        
         </h5> 
      
      <div>
      {actionList}
      </div>
      
      </>
    );
  }
}

export default Actions;
