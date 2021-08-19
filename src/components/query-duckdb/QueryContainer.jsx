import React, { useState, Component } from "react";
class QueryContainer extends Component {
  state = {
      queryString: ""
  };
//  [searchString, setSearchString] = useState();

    setSearchString (value) {
        this.setState({
            queryString : value
         })
    }

    handleClick = () => {
        console.log("in handle click");
        this.props.querySubmit(this.state.queryString);
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
            
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="2"
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
