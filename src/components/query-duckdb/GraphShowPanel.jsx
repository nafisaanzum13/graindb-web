import React, { Component } from "react";
import ReactDOM from 'react-dom'
import * as d3 from 'd3';

  class GraphShowPanel extends Component {
    
  svgRef= React.RefObject;
  dataset = [];
  width = 600;
  height = 500;
  
  radius = 20
  svg;

  nodes = [];
  lastNodeId = 0;
  links =[];
  force;
  drag;
  dragLine;
  path;
  circle;
  labels;

  // mouse event vars
  selectedNode= null;
  selectedLink= null;
  mousedownLink= null;
  mousedownNode= null;
  mouseupNode= null;


  // only respond once per keydown
  lastKeyDown = -1;
    constructor(props){
      super(props)
      this.state = {
        addLinkArray: [], 
        name: "",
      }
      this.svgRef = React.createRef();
      
    }

    componentDidMount(){
      this.initializeData();
      this.initialize();
    }

    initialize() {
        
        this.svg = d3.select(this.svgRef.current)
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .on('contextmenu', (event, d) => { event.preventDefault(); })
    
        // set up initial nodes and links
        //  - nodes are known by 'id', not by index in array.
        //  - reflexive edges are indicated on the node (as a bold black circle).
       
        // this.nodes = this.props.nodes;
        // this.links = this.props.links;
        this.lastNodeId = 2;

        // init D3 force layout
        this.force = d3.forceSimulation()
          .force('link', d3.forceLink().id((d) => d.id).distance(150))
          .force('charge', d3.forceManyBody().strength(-500))
          .force('x', d3.forceX(this.width / 2))
          .force('y', d3.forceY(this.height / 2))
          .on('tick', () => this.tick());
    
        // init D3 drag support
        this.drag = d3.drag()
          .filter((event, d) => event.button === 0 || event.button === 2)
          .on('start', (event, d) => {
            if (!event.active) this.force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) this.force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          });
        // define arrow markers for graph links
        this.svg.append('svg:defs').append('svg:marker')
          .data(['start'])
          .enter().append("svg:marker") 
          .attr('id', 'start-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 0)
          .attr('markerWidth', 10)
          .attr('markerHeight', 10)
          .attr('orient', 'auto')
          .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', '#000');
    
          this.svg.append("svg:defs").selectAll("marker")
          .data(['end'])
          .enter().append("svg:marker") 
          .attr("id", "end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 0)
          .attr("markerWidth", 10)
          .attr("markerHeight", 10)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "#000");
    
        // line displayed when dragging new nodes
        this.dragLine = this.svg.append('svg:path')
          .attr('class', 'link dragline')
          .attr('d', 'M0,0L0,0'); //TODO: fix this
    
        // handles to link and node element groups
        this.path = this.svg.append('svg:g').selectAll('path')
        .append("link")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "1px")
        .attr("marker-end","url(#end-arrow)");

        this.circle = this.svg.append('svg:g').selectAll('g');

        this.labels = this.svg.append('svg:g').selectAll('path');
    
        // app starts here
        // this.svg.on('mousedown', (event, d) => this.mousedown(event, d))
        // //   .on('mousemove', (event, d) => this.mousemove(event, d))
        //   .on('mouseup', (event, d) => this.mouseup(event, d));

        this.restart();
      }

      

      initializeData() {
        let idHash = [];
        let nodes = this.props.nodes;
        let links = this.props.links;
        console.log("nodes", nodes);
        console.log("links", links);
        this.nodes = [];
        this.links = [];
        nodes.forEach(node => {
          this.nodes.push(node);
          idHash[this.nodes[this.nodes.length-1].id]=this.nodes[this.nodes.length-1];
        });

        links.forEach(link => {
          this.links.push({id: link.id, source:idHash[link.source], target:idHash[link.target], left: false, right: true});
        });
        console.log("this.nodes", this.nodes);
        console.log("this.links", this.links);
      }

      emptyData() {
        this.nodes = [];
        this.links = [];
        this.restart();
      }
    
      componentDidUpdate(prevProps, prevState) {
        if (prevProps.nodes !== this.props.nodes || prevProps.links !== this.props.links) {
            // this.nodes = this.props.nodes;
            // this.links = this.props.links;
            this.emptyData();
            this.initializeData();
            this.restart()
        }
        this.restart();
      }

      restart = () => {

        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        this.circle = this.circle.data(this.nodes, (d) => d.id);
        

        // update existing nodes (reflexive & selected visual states)
        this.circle.selectAll('circle')
          .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(d.type.color).brighter().toString() : d.type.color)
          .classed('reflexive', (d) => d.reflexive);
    
        // remove old nodes
        this.circle.exit().remove();
    
        // add new nodes
        const g = this.circle.enter().append('svg:g');
        g.append('svg:circle')
          .attr('class', 'node')
          .attr('r', this.radius)
          .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(d.type.color).brighter().toString() : d.type.color)
          .style('stroke', (d) => d3.rgb(d.type.color).darker().toString())
          .classed('reflexive', (d) => d.reflexive)
          .call(this.drag)
          
    
        // show node IDs
        g.append('svg:text')
          .attr('x', 0)
          .attr('y', 4)
          // .attr('class', 'id')
          .text((d) => d.pk);
    
        this.circle = g.merge(this.circle);

        // path (link) group
        this.svg.append("svg:defs").append("svg:marker")
          .attr("id", "end-arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 10)
          .attr("markerWidth", 10)
          .attr("markerHeight", 10)
          .attr("orient", "auto")
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("fill", "#000");

        this.path = this.path.data(this.links);
        // update existing links
        this.path.classed('selected', (d) => d === this.selectedLink)
          .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
          .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');
    
        // remove old links
        this.path.exit().remove();
    
        // add new links
        this.path = this.path.enter().append('svg:path')
          .attr('class', 'link')
          .classed('selected', (d) => d === this.selectedLink)
          // .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : 'url(#start-arrow)')
          .style('marker-end','#url(end-arrow)' )
          .merge(this.path);

          this.labels = this.labels.data(this.links);
          this.labels.exit().remove();

          this.labels = this.labels.enter().append('svg:text')
          .attr("x", (d) => ((d.source.x + d.target.x)/2))
            .attr("y",  (d) => ((d.source. y+ d.target.y)/2))
          .text("label").merge(this.path)

          this.path = this.path.merge(this.path);
          
    
        
        // this.linkLabels = g.merge(this.linkLabels);
        
        // set the graph in motion
        this.force
            .nodes(this.nodes)
            .force('link').links(this.links);
      
          this.force.alphaTarget(0.3).restart();
        
      }
      render() {
          return (
            <div ref={this.svgRef}> </div>
          );
      }

      resetMouseVars() {
        this.mousedownNode = null;
        this.mouseupNode = null;
        this.mousedownLink = null;
      }

      mousedown(event, d) {
        // because :active only works in WebKit?
        this.svg.classed('active', event.currentTarget);
      }
    
      mousemove(event, d) {
        if (!this.mousedownNode) return;
        // update drag line
        this.dragLine.attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${d3.pointer(event)[0]},${d3.pointer(event)[1]}`);
      }
    
      mouseup(event, d) {
        if (this.mousedownNode) {
          // hide drag line
          this.dragLine
            .classed('', event.currentTarget)
            .style('marker-end', '');
        }
    
        // because :active only works in WebKit?
        this.svg.classed('active', false);
    
        // clear mouse event vars
        this.resetMouseVars();
      }
    
      spliceLinksForNode(node) {
        const toSplice = this.links.filter((l) => l.source === node || l.target === node);
        for (const l of toSplice) {
          this.links.splice(this.links.indexOf(l), 1);
        }
      }

  tick() {
    this.initializeData();
    // console.log("Graph edges ", this.links);
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    // draw directed edges with proper padding from node centers
    this.path.attr('d', (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    // this.labels
    //       .attr("x", (d) => ((d.source.x + d.target.x)/2))
    //         .attr("y",  (d) => ((d.source. y+ d.target.y)/2));
          
    this.labels.attr("x", function(d) {
      const sourceDx = Math.max(this.radius, Math.min(this.width - this.radius, d.source.x));

      const targetDx = Math.max(this.radius, Math.min(this.width - this.radius, d.target.x));
      return ((sourceDx + targetDx) / 2);
      // return ((d.source.x + d.target.x) / 2);
    })
    .attr("y", function(d) {
      const sourceDy = Math.max(this.radius, Math.min(this.height - this.radius, d.source.y));
      const targetDy = Math.max(this.radius, Math.min(this.height - this.radius, d.target.y));
      return ((sourceDy + targetDy) / 2);
      // return ((d.source.y + d.target.y) / 2);
    });

   
  }
  }
  
  export default GraphShowPanel;
