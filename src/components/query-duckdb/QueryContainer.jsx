import React, { useState, Component } from "react";
class QueryContainer extends Component {
  state = {
      queryString: "",
      data: [],
      columns: [],
      query: ""

  };
//  [searchString, setSearchString] = useState();
    baseURL = "http://localhost:8080/http://localhost:1294/"
    setSearchString (value) {
        this.setState({
            queryString : value
         })
    }

    handleClick = () => {
        console.log("in handle click");
        let query = this.state.queryString.replace(/=/g,"%3D");
        query = query.replace('+', '%2b');
        let queryURL = this.baseURL+"query?q="+query;
        fetch(queryURL, {})
        .then(res  => res.json())
        .then(
          (result) => {
            console.log("result", result);
            if(result.success == true) {
              this.props.querySubmit(result.data,result.names, result.query);
              
            } else {
              console.log("error", result.error);
              alert('Error ' + result.error);
            }
            this.clearSearchField();
          },
          (error) => {
            console.log("error", error);
            alert('Error ' + error);
          }
        )    
    } 

    clearSearchField = () => {
        this.setState({
           queryString : ""
        })
    }
  render() {
    return (
      <>
        <div className=" query-input-area">
            
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"
                    value={this.state.queryString} placeholder="Write Query in GRQL"
                    onChange={(e) => this.setSearchString(e.target.value)}></textarea>
            
            <div className="row zero-margin">
                <div className=" offset-md-8 col-md-2 padding-point1em ">

                    <button className="middle-position-vertical  "
                    onClick={this.clearSearchField} class="btn btn-clear btn-block btn-sm"> Clear </button>
                </div>
                <div className="col-md-2  padding-point1em">
                    <button className="pull-right middle-position-vertical"
                    onClick={this.handleClick} class="btn btn-block btn-info btn-sm"><i class="fa fa-search"></i></button>
                </div>
            </div>
        </div>
        
      </>
    );
  }
}

export default QueryContainer;
