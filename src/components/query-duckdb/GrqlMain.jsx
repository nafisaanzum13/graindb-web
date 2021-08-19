import React, { Component } from "react";

import QueryContainer from "./QueryContainer";
import QueryResultContainer from "./QueryResultContainer";
import PastQueryContainer from "./PastQueryContainer";

class GrqlMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pastQueries: [],
          searchQuery: null,
          queryResult: {}
        };
    }

    querySubmit = (searchQuery) => {
        console.log("searchQuery", searchQuery)
        // this.setState({
        //     searchQuery: searchQuery
        // });
        //TODO: Query to duckDB
        //TODO: update Query result to queryResult 
    }

  render() {
    const queryList = this.state.pastQueries.map((singleQuery) => <PastQueryContainer query={singleQuery} />);
    return (
      <>
        <h5 className="logo-color">Query DuckDB on your mapped graph as well as stored tables!</h5>
        <div className="row">
            <div className="col-md-8">
             <QueryContainer querySubmit = {this.querySubmit}/>
             {/* <hr className="zero-margin"/> */}
             {this.state.searchQuery}
             <QueryResultContainer queryResult={this.queryResult}/>
            </div>
            <div className="col-md-4">
                <h5 className="logo-color">Past Queries </h5>
                <hr />
                {queryList}
            </div>
        </div>
      </>
    );
  }
}

export default GrqlMain;
