import React from 'react';
import * as d3 from 'd3'

export default function StackedBar() {
    const data = [
        { name: "Simon", Ascore: 80, Bscore: 20, Cscore: 60 },
        { name: "Mary", Ascore: 90, Bscore: 20, Cscore: 40 },
        { name: "John", Ascore: 60, Bscore: 60, Cscore: 80 },
    ];
    
    const width = 800;
    const height = 400;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    
    // append a svg in div name of "d3-container" with designed height n width
    // view box 0, 0 stand for the coordinates of the top left corner pixel
    // [0.0]            [width, 0]
    // [0, height]      [width, height]
    const svg = d3.select("#d3-container")
        .append("svg")
        .attr("height", height - margin.top - margin.bottom)
        .attr("width", width - margin.left - margin.right)
        .attr("viewBox", [0, 0, width, height]);
    
    // allocate even space for different bars
    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    
    // allocate even space for y axis
    const y = d3.scaleLinear()
        .domain([0, 200])
        .range([height - margin.bottom, margin.top]);
    
    // define color
    const subject = Object.keys(data[0]).slice(1);
    const color = d3.scaleOrdinal()
        .domain(subject)
        .range(["#4DAF4A", "#377EB8", "#E41A1C"]);
    
    // define stack data
    const stackedData = d3.stack()
        .keys(subject);
    var stackedSeries = stackedData(data.sort((a, b) => d3.descending(a.Ascore+a.Bscore+a.Cscore, b.Ascore+b.Bscore+b.Cscore)));
    console.log(stackedSeries);
    
    svg.append("g")
        .selectAll("g")                                                                              // apply setting to all selected shape
        .data(stackedSeries)             // sort the data
        .join("g")                                                                                   // add rectangle for each data
            .attr("fill", (d) => color(d.key))                                                                      // fill the area with certain colour
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", (d, i) => x(i))                                                                  // set x coordinate using the allocated space from x above (top left corner of bar)
                .attr("y", (d) => y(d[1]))                                                              // set y coordinates using the score (top left corner of bar chart)
                .attr("height", d => y(d[0]) - y(d[1]))                                                    // total height of bar
                .attr("width", x.bandwidth())                                                               // width allocated by x
    
    function xAxis(g) {
        g.attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => data[i].name))
            .attr("font-size", "20px");
    }
    svg.append("g").call(xAxis);
    
    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(null, stackedSeries.format))
            .attr("font-size", "20px");
    }
    svg.append("g").call(yAxis);
    
    svg.node();

    return (
        <div>
            <h2>Rendered from StackedBar</h2>
            <svg height={height} width={width}>
                <g id="d3-container"></g>
            </svg>
        </div>
    )
}
