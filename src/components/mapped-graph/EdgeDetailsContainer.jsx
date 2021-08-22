import React, { Component} from "react";

class EdgeDetailsContainer extends Component {
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
    console.log(this.props.edge)
    return (
        <>    
    <div className="row">
    <div className="col-md-12">
        <div className="list-items row">
            <div className="col-md-10" >
            {this.props.edge.id} {this.props.edge.name}
            </div>
            <div className="col-md-1 zero-padding">
              <button className="btn zero-padding" type="button" onClick={this.handleClick} >
              {this.state.isToggleOn? <i class="fa fa-angle-down"></i> :<i class="fa fa-angle-up"></i>}
                </button>
              
            </div>

            
        </div> 
        <div className={this.state.isToggleOn? 'hidden' : 'row zero-margin'}>
              <div className="col-md-12" style={{background: "#128e3a42", fontSize: '0.85rem'}}>
                Details:<br/>
                Edge Type:  {this.props.edge.name} <br/>
                Source Node: {this.props.edge.source.name}<br/>
                Target Node: {this.props.edge.target.name}<br/>
                Direction: {this.props.edge.left? "Left": "Right"}<br/>
                {/* Table: {this.props.node.table.name} */}
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

export default EdgeDetailsContainer;
