import React, { Component } from "react";
import ReactDOM from 'react-dom'
import * as d3 from 'd3';

  class GraphPanel extends Component {
    
  svgRef= React.RefObject;
  dataset = [];
  width = 600;
  height = 500;
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  radius = 25
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
    componentDidMount() {
      
      this.nodes = [];
      this.links = [];
      this.initialize();
      this.initializeData()
      this.restart();
    }

    initializeData() {
      let idHash = [];
      let nodes = this.props.nodes;
      let links = this.props.links;
      this.nodes = [];
      this.links = [];
      nodes.forEach(node => {
        this.nodes.push(node);
        idHash[this.nodes[this.nodes.length-1].id]=this.nodes[this.nodes.length-1];
      });

      links.forEach(link => {
        this.links.push({id: link.id, name: link.name, source:idHash[link.source.id], target:idHash[link.target.id], left: false, right: true});
      });
    }

    emptyData() {
      this.nodes = [];
      this.links = [];
      this.restart();
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
          .attr('refX', 10)
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
          .attr("refX", 10)
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
        .data(this.links)
        .enter()
        .append("path")
        .attr("stroke", "black")
        .attr("marker-end", "#end-arrow")
        .attr("stroke-width", "2px");;

        this.circle = this.svg.append('svg:g').selectAll('g');

        this.labels = this.svg.append('svg:g').selectAll('path');
    
        // app starts here
        this.svg.on('mousedown', (event, d) => this.mousedown(event, d))
        //   .on('mousemove', (event, d) => this.mousemove(event, d))
          .on('mouseup', (event, d) => this.mouseup(event, d));
    
        // d3.select(window)
        //   .on('keydown', (event, d) => this.keydown(event, d))
        //   .on('keyup', (event, d) => this.keyup(event, d));
        // this.labels = this.svg.append('svg:g').selectAll('path').append('svg:text');

      //   this.labels.attr("x", function(d) {
      //     return ((d.source.x + d.target.x)/2);
      // })
      // .attr("y", function(d) {
      //     return ((d.source.y + d.target.y)/2);
      // });

        this.restart();
      }

    
      componentDidUpdate(prevProps, prevState) {
        if (prevProps.nodes !== this.props.nodes || prevProps.links !== this.props.links) {
          this.emptyData();
          this.initializeData();
          this.restart()
        }
        this.restart();
      }

      restart = () => {
        // path (link) group
      

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
          .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : 'url(#start-arrow)')
          .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : 'url(#end-arrow)')
          .on('mousedown', (event, d) => {
            if (event.ctrlKey) return;
    
            // select link
            this.mousedownLink = d;
            this.selectedLink = (this.mousedownLink === this.selectedLink) ? null : this.mousedownLink;
            this.selectedNode = null;
            this.restart();
          }).merge(this.path);

          this.labels = this.labels.data(this.links);
          this.labels.exit().remove();

          this.labels = this.labels.enter().append('svg:text').attr('class', 'linklabels')
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("x", function (d) {
            if (d.target.id == d.source.id) { return (d.source.x+2); }
          else if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x) / 2); }
          else { return (d.target.x + (d.source.x - d.target.x) / 2);} 
          })
          .attr("y", function (d) {
            console.log("in tick y", d);
              if (d.target.id == d.source.id) { return (d.source.y + d.source.y); }
              else if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y) / 2); }
              else { return (d.target.y + (d.source.y - d.target.y) / 2); }
              
          })
          .text(function (d) { return d.name}).merge(this.labels)
          
    
        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        this.circle = this.circle.data(this.nodes, (d) => d.id);
        

        // update existing nodes (reflexive & selected visual states)
        this.circle.selectAll('circle')
          .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(d.color).brighter().toString() : d.color)
          .classed('reflexive', (d) => d.reflexive);
    
        // remove old nodes
        this.circle.exit().remove();
    
        // add new nodes
        const g = this.circle.enter().append('svg:g');
    
        g.append('svg:circle')
          .attr('class', 'node')
          .attr('r', this.radius)
          .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(d.color).brighter().toString() : d.color)
          .style('stroke', (d) => d3.rgb(d.color).darker().toString())
          .classed('reflexive', (d) => d.reflexive)
          .on('contextmenu', this.rightClick)
         
          .on('mouseover', (event, d) => {
            if (!this.mousedownNode || d === this.mousedownNode) return;
            // enlarge target node
            this.edgeDraw = true;
            d3.select(event.currentTarget).attr('transform', 'scale(1.1)');
          })
          .on('mouseout', (event, d) => {
            // if (!this.mousedownNode || d === this.mousedownNode) return;
            if (!this.mousedownNode) return;
            // unenlarge target node
            this.edgeDraw = true;
            d3.select(event?.currentTarget).attr('transform', '');
          })
          .on('mousedown', (event, d) => {
            if (event.ctrlKey) return;
    
            // select node
            this.mousedownNode = d;
            this.selectedNode = (this.mousedownNode === this.selectedNode) ? null : this.mousedownNode;
            this.selectedLink = null;
            this.edgeDraw = false;
            // reposition drag line
            this.dragLine
              .style('marker-end', 'url(#end-arrow)')
              .classed('hidden', false)
              .attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${this.mousedownNode.x},${this.mousedownNode.y}`);
    
            this.restart();
          })
          .on('mouseup', (event, d) => {
            if (!this.mousedownNode || !this.edgeDraw) return;
    
            // needed by FF
            this.dragLine
              .classed('hidden', false)
              .style('marker-end', '');
    
            // check for drag-to-self
            this.mouseupNode = d;
            // if (this.mouseupNode === this.mousedownNode) {
            //   this.resetMouseVars();
            //   return;
            // }
    
            // unenlarge target node
            d3.select(event.currentTarget).attr('transform', '');
    
            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            // const isRight = this.mousedownNode.id < this.mouseupNode.id;
            // const source = this.mouseupNode ;
            // const target = this.mousedownNode;
            // const isRight = true;

            this.props.addEdge(this.mousedownNode, this.mouseupNode)
    
            // let link = this.links.filter((l) => l.source === source && l.target === target)[0];
            // if (link) {
            //   link[isRight ? 'right' : 'left'] = true;
            // } else {
            //   this.links.push({ source, target, left: !isRight, right: isRight });
            // }
    
            // select new link
            // this.selectedLink = link;
            this.selectedNode = null;
            this.resetMouseVars();
            this.restart();
          });
    
        // show node IDs
        g.append('svg:text')
          .attr('x', 0)
          .attr('y', 4)
          .attr('class', 'id')
          .text((d) => d.name);
    
        this.circle = g.merge(this.circle);
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
    
        if (event.ctrlKey || this.mousedownNode || this.mousedownLink) return;
    
        // insert new node at point
        const point = d3.pointer(event);
        // const node = { id: ++this.lastNodeId, reflexive: false, x: point[0], y: point[1] };
        // this.nodes.push(node);
    
        this.restart();
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
    
      // keydown(event, d) {
      //   event.preventDefault();
    
      //   if (this.lastKeyDown !== -1) return;
      //   this.lastKeyDown = event.keyCode;
    
      //   // ctrl
      //   if (event.keyCode === 17) {
      //     this.circle.call(this.drag);
      //     this.svg.classed('ctrl', event.currentTarget);
      //     return;
      //   }
    
      //   if (!this.selectedNode && !this.selectedLink) return;
    
      //   switch (event.keyCode) {
      //     case 8: // backspace
      //     case 46: // delete
      //       if (this.selectedNode) {
      //         this.nodes.splice(this.nodes.indexOf(this.selectedNode), 1);
      //         this.spliceLinksForNode(this.selectedNode);
      //       } else if (this.selectedLink) {
      //         this.links.splice(this.links.indexOf(this.selectedLink), 1);
      //       }
      //       this.selectedLink = null;
      //       this.selectedNode = null;
      //       this.restart();
      //       break;
      //     case 66: // B
      //       if (this.selectedLink) {
      //         // set link direction to both left and right
      //         this.selectedLink.left = true;
      //         this.selectedLink.right = true;
      //       }
      //       this.restart();
      //       break;
      //     case 76: // L
      //       if (this.selectedLink) {
      //         // set link direction to left only
      //         this.selectedLink.left = true;
      //         this.selectedLink.right = false;
      //       }
      //       this.restart();
      //       break;
      //     case 82: // R
      //       if (this.selectedNode) {
      //         // toggle node reflexivity
      //         this.selectedNode.reflexive = !this.selectedNode.reflexive;
      //       } else if (this.selectedLink) {
      //         // set link direction to right only
      //         this.selectedLink.left = false;
      //         this.selectedLink.right = true;
      //       }
      //       this.restart();
      //       break;
      //   }
      // }
    
      // keyup(event, dy) {
      //   this.lastKeyDown = -1;
    
      //   // ctrl
      //   if (event.keyCode === 17) {
      //     this.circle.on('.drag', null);
      //     this.svg.classed('ctrl', false);
      //   }
      // }
  

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

      // return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      var x1 = d.source.x,
      y1 = d.source.y,
      x2 = d.target.x,
      y2 = d.target.y+this.radius,
      dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy),

      // Defaults for normal edge.
      drx = dr,
      dry = dr,
      xRotation = 0, // degrees
      largeArc = 0, // 1 or 0
      sweep = 1; // 1 or 0

    // Self edge.
    if (d.source == d.target) {
      // Fiddle with this angle to get loop oriented.
      xRotation = 45;

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop. 
      //sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 50;
      dry = 50;

      // For whatever reason the arc collapses to a point if the beginning
      // and ending points of the arc are the same, so kludge it.
      x2 = x2 + 1;
      y2 = y2 + 1;
      return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
  
      
    }
    else return `M${sourceX},${sourceY}L${targetX},${targetY}`;

    
    });
    this.labels
    .attr("x", function (d) {
      if (d.target.id == d.source.id) { return (d.source.x + 25); }
    else if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x) / 2); }
    else { return (d.target.x + (d.source.x - d.target.x) / 2);} 
    })
    .attr("y", function (d) {
        if (d.target.id == d.source.id) { return (d.source.y+35); }
        else if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y) / 2); }
        else { return (d.target.y + (d.source.y - d.target.y) / 2); }
        
    })
   
  }
  }
  
  export default GraphPanel;
