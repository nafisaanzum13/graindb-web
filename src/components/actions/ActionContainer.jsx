import React, { Component} from "react";
import Accordion from 'react-bootstrap/Accordion'

class ActionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  render() {
    
    return (
        <>    
    <div className="row">
    <div className="col-md-12 right-padding-half">
        <div className="list-items row">
            <div className="col-md-10" >
              {this.props.action.id}. {this.props.action.description}
            </div>
            <div className="col-md-1 zero-padding">
              <button className="btn zero-padding" type="button" onClick={this.handleClick} >
              {this.state.isToggleOn? <i class="fa fa-angle-down"></i> :<i class="fa fa-angle-up"></i>}
                </button>
              
            </div>

            
        </div> 
        <div className={this.state.isToggleOn? 'hidden' : 'row zero-margin'}>
              <div className="col-md-11" style={{background: "#128e3a42", fontSize: '0.85rem'}}>
                Details:<br/>
                Action Type: {this.props.action.type ==1 ? 'Node Create':"Edge Create"}<br/>
                {this.props.action.type == 1 ? 'Node Type: '+this.props.action.node.name:"Edge Type: "} {}
              </div>
              <hr></hr>
        </div>
        <hr className="zero-margin"/>
    </div>
    </div>
</>
  )
    
  }
}

export default ActionContainer;
