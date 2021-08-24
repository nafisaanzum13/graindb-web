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
          queryResult: {
            data:[],
            columns:[],
            query:""
          }
        };
    }

    querySubmit = (data, columns, query) => {
        console.log("submitQuery")
        this.setState({
          queryResult: {
            data : data,
            columns : columns,
            query: query
          }
        });
        var today = new Date();
        let newPastQuery = {
          id: this.state.pastQueries.length,
          query: query,
          time: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()+" "+
          today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

        }
        this.setState(prevState => ({
          pastQueries: [newPastQuery, ...prevState.pastQueries]
        }));
        //TODO: pastQueries
    }

  render() {
    const queryList = this.state.pastQueries.map((singleQuery) => <PastQueryContainer query={singleQuery} />);
    return (
      <>
        <h5 className="logo-color">Query GrainDB on your mapped graph as well as stored tables!</h5>
        <div className="row">
            <div className="col-md-8">
             <QueryContainer querySubmit = {this.querySubmit}/>
             {/* <hr className="zero-margin"/> */}
             {/* {this.state.searchQuery} */}
             <QueryResultContainer data={this.state.queryResult.data}  query={this.state.queryResult.query}
              columns={this.state.queryResult.columns}/>
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
