import React, { Component } from "react";
import ReactDOM from 'react-dom'
import * as d3 from 'd3';


var FORCE = (function(nsp){
  
    var 
    width = 600,
    height = 550,
    color = d3.scaleOrdinal(d3.schemeCategory10),
    selectedNode = null,
    initForce = (nodes, links) => {
      nsp.force = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-200))
        .force("link", d3.forceLink(links).distance(70))
        .force("center", d3.forceCenter().x(nsp.width /2).y(nsp.height / 2))
        .force("collide", d3.forceCollide([5]).iterations([5]));
    },
  
    enterNode = (selection) => {
      var circle = selection.select('circle')
        .attr("r", 25)
        .style("fill", 'tomato' ) 
        .style("stroke", "bisque")
        .style("stroke-width", "3px")
        // .on('contextmenu', this.rightClick)
  
      selection.select('text')
        .style("fill", "honeydew")
        .style("font-weight", "100")
        .style("text-transform", "uppercase")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "10px")
        .style("font-family", "cursive")

        
        
        // selection.on("mousemove", d=> {
        //     selectedNode = d.data;
        //     console.log("mousedown", selectedNode);
        // });
      },
      
    rightClick= (selection) => {
        console.log("right click on node: ", selection);
    },
    updateNode = (selection) => {
      selection
        .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        .attr("cx", function(d) { return d.x = Math.max(30, Math.min(width - 30, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(30, Math.min(height - 30, d.y)); })
      },
  
    enterLink = (selection) => {
      selection
        .attr("stroke-width", 3)
        .attr("stroke","bisque")
    },
  
    updateLink = (selection) => {
      selection
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    },
  
    updateGraph = (selection) => {
      selection.selectAll('.node')
        .call(updateNode)
      selection.selectAll('.link')
        .call(updateLink);
    },
  
    dragStarted = (event, d) => {
      if (!event.active) nsp.force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y
    },
  
    dragging = (event, d) => {
      d.fx = event.x;
      d.fy = event.y
    },
        
    dragEnded = (event, d) => {
      if (!event.active) nsp.force.alphaTarget(0);
        d.fx = null;
        d.fy = null
    },
  
    drag = () => d3.selectAll('g.node')
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    ),
  
    tick = (that) => {
      that.d3Graph = d3.select(ReactDOM.findDOMNode(that));
      nsp.force.on('tick', () => {
        that.d3Graph.call(updateGraph)
      });
    };
    
    nsp.width = width;
    nsp.height = height;
    nsp.enterNode = enterNode;
    nsp.updateNode = updateNode;
    nsp.enterLink = enterLink;
    nsp.updateLink = updateLink;
    nsp.updateGraph = updateGraph;
    nsp.initForce = initForce;
    nsp.dragStarted = dragStarted;
    nsp.dragging = dragging;
    nsp.dragEnded = dragEnded;
    nsp.drag = drag;
    nsp.tick = tick;
nsp.contextMenu = rightClick
    
    return nsp
    
  })(FORCE || {})
  
  ////////////////////////////////////////////////////////////////////////////
  /////// class App is the parent component of Link and Node
  ////////////////////////////////////////////////////////////////////////////
  
  class GraphPanel extends Component {
    constructor(props){
      super(props)
      this.state = {
        addLinkArray: [], 
        name: "",
      }
      this.handleAddNode = this.handleAddNode.bind(this)
      this.addNode = this.addNode.bind(this)
    }
    
      componentDidMount() {
          const data = this.props;
              FORCE.initForce(data.nodes, data.links)
                  FORCE.tick(this)
                  FORCE.drag()
                  FORCE.contextMenu();
        // const node =d3.select(ReactDOM.findDOM(this))
        //           .selecttAll("circle");
        //     node.on()

      }
  
      componentDidUpdate(prevProps, prevState) {
          if (prevProps.nodes !== this.props.nodes || prevProps.links !== this.props.links) {
              const data = this.props;
                  FORCE.initForce(data.nodes, data.links)
                  FORCE.tick(this)
                  FORCE.drag()
                  FORCE.contextMenu();
          }
      }
    
    handleAddNode(e) {
          this.setState({ [e.target.name]: e.target.value });
      }
    
    addNode(e) {
          e.preventDefault();
          this.setState(prevState => ({
              nodes: [...prevState.nodes, { name:this.state.name, id: prevState.nodes.length + 1,}], name: ''
          }));
      }

   
      render() {
          var links = this.props.links.map( (link) => {
              return (
                  <Link
                      key={link.id}
                      data={link}
                  />);
          });
          var nodes = this.props.nodes.map( (node) => {
                return (
                <Node
                    data={node}
                    name={node.name}
                    key={node.id}
                />);
            });
          return (
            <div className="graph__container">
              <svg className="graph" width="100%" height={FORCE.height}>
                  <g>
                      {links}
                  </g>
                  <g>
                      {nodes}
                  </g>
              </svg>
            </div>
          );
      }
  }
  
  export default GraphPanel;
  ///////////////////////////////////////////////////////////
  /////// Link component
  ///////////////////////////////////////////////////////////
  
  class Link extends Component {
  
      componentDidMount() {
        this.d3Link = d3.select(ReactDOM.findDOMNode(this))
          .datum(this.props.data)
          .call(FORCE.enterLink);
      }
    
      componentDidUpdate() {
        this.d3Link.datum(this.props.data)
          .call(FORCE.updateLink);
      }
  
      render() {
        return (
          <line className='link' />
        );
      }
  }
  
  ///////////////////////////////////////////////////////////
  /////// Node component
  ///////////////////////////////////////////////////////////
  
  class Node extends Component {
  
      componentDidMount() {
        this.d3Node = d3.select(ReactDOM.findDOMNode(this))
          .datum(this.props.data)
          .call(FORCE.enterNode)
        this.d3Node.on("mousemove", d=> {
            FORCE.selectedNode = this.d3Node.id;
            console.log("mousedown", FORCE.selectedNode);
        });
      }
  
      componentDidUpdate() {
        this.d3Node.datum(this.props.data)
          .call(FORCE.updateNode)
      }
  
      render() {
        return (
          <g className='node'>
            <circle onClick={this.props.addLink}/>
            <text>{this.props.data.name}</text>
          </g>
        );
      }
  }