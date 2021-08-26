
import React, { Component } from "react";
import { Button } from "react-bootstrap";
class LandingPage extends Component {
  state = {};
  render() {
    return (
      <>
       <div className="LandingPage">
           <div className="row" style={{padding: 2+"rem"}}>
               <div className= "col-md-8 offset-md-2">
                   
                    <h2 className="text-center logo">
                    <span style={{fontSize: 9+"rem", verticalAlign:"bottom"}}>
                            g</span>
                            <span>

                            <span style={{fontSize: 7+"rem"}}>
                            R</span>
                            <span style={{fontSize: 5+"rem"}} className = "logo-green-strokeme ">ainDB</span>
                            </span>
                    </h2>
                    <hr></hr>
                   {/* <div style={{background:"white", padding: 1.5+"em", borderRadius: 5+"px"}}> */}
                   <div className="row">
                            <div className="col-md-6 offset-md-3">
                            {/* <form autocomplete="off"> */}
                            <input  className="form-control" name="url"
                            placeholder="Database URL" autocomplete="off"/>

                            <br/>

                            <input  className="form-control" name="port"
                            placeholder="Port" autocomplete="off"/>
  <br/>
                            <input  className="form-control" name="db"
                            placeholder="Database Name" autocomplete="off"/>
  <br/>
                            <input  className="form-control" type="text" name="person"
                            placeholder="Username" autocomplete="new-password"/>
  <br/>

                            < input  className="form-control" type="password" name="password"
                            placeholder="Password" autocomplete="new-password"/>
  <br/>
                            <Button type="submit" className="btn-block btn-success"
                            onClick={this.props.handleSubmitButton}>
                            Submit
                            </Button>
                            
                            {/* </form> */}
                            </div>
                        {/* </div> */}

                   </div>
                        
                        
                    
               </div>

           </div>

       </div>
      </>
    );
  }
}

export default LandingPage;
