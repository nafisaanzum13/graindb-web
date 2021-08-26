import * as d3 from "d3";

export const menuFactory = (x, y, menuItems, data, svgId) => {
    d3.select('.contextMenu').remove();

    // Draw the menu
    d3.select(svgId)
        .append('g').attr('class', 'contextMenu')
        .selectAll('tmp')
        .data(menuItems).enter()
        .append('g').attr('class', 'menuEntry')
        .style({'cursor': 'pointer'});

    // Draw menu entries
    d3.selectAll('.menuEntry')
        .append('rect')
        .attr('x', x)
        .attr('y', (d, i) => { return y + (i * 30); })
        .attr('rx', 2)
        .attr('width', 150)
        .attr('height', 30)
        .on('click', (event, d) => { 
            console.log("click in context menu ",d);
            d.action(data);
         });

    d3.selectAll('.menuEntry')
        .append('text')
        .text((d) => { return d.title; })
        .attr('x', x-20)
        .attr('y', (d, i) => { return y + (i * 30); })
        .attr('dy', 20)
        .attr('dx', 45)
        .on('click', (event, d) => { 
            console.log("click in context menu",d);
            d.action(data);
        });

    // Other interactions
    d3.select('body')
        .on('click', () => {
            d3.select('.contextMenu').remove();
        });
}

export const createContextMenu = (d, menuItems, width, height, svgId, event) => {
    menuFactory(event.pageX - width / 2, event.pageY - height / 1.5, menuItems, d, svgId);
    event.preventDefault();
}