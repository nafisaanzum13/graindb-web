import React, { Component } from "react";

import RelationalTables from "./tables/RelationalTables";

class LeftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

  render() {
    return (
      <>
      <div className="theme-green-background-light">
            <h5 className = "table-space-headers">Relational Tables</h5>
            {/* <SearchBox defaultRefinement="iphone"  /> */}
            <div style={{height: 45+"vh", overflowY:"overlay", overflowX:"hidden"}}>
                <div className = "table-space">
                    <hr className="zero-margin solid-margin-1em white-backgrou "/>
                    <RelationalTables />
                </div>
                
            </div>
            
      </div>
      <div style={{height: 0.5+"vh", background:"white"}}></div>
      <div  className="theme-green-background-light">
            <h5 className = "table-space-headers">Mapped Graph</h5>
            <div style={{height: 40+"vh", overflowY:"auto", overflowX:"hidden"}}>

                <div className = "table-space">
                <hr className="zero-margin solid-margin-1em white-backgrou "/>
                   <p> No graph mapped yet!</p>
                    {/* <RelationalTables /> */}
                </div>
                
            </div>
            
      </div>
      </>
    );
  }

}




export default LeftPanel;
