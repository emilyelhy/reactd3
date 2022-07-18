import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HEIGHT = 450;
const WIDTH = 2000;
const MARGIN = { top: 30, bottom: 30, left: 30, right: 30 };
const COLOR = ["#ff7577", "#55ff7f", "#55ffff"];
const DATA = [
    [80, 20, 60, 34, 23, 56, 45, 23, 75, 23, 67, 34, 76, 23, 54, 76, 23, 62, 46, 24, 75, 23],
    [90, 20, 40, 43, 65, 73, 54, 83, 48, 48, 52, 43, 29, 75, 65, 74, 56, 21, 18, 65, 75, 26],
    [60, 60, 80, 79, 90, 56, 25, 34, 85, 10, 84, 45, 56, 74, 52, 13, 54, 70, 56, 85, 43, 58],
];

export default function DynamicBox() {
    const inputRef0 = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const [data, setData] = useState(DATA);
    const [showGraph, setShowGraph] = useState([]);
    const inputRefs = [inputRef0, inputRef1, inputRef2];
    const handleBoxOpen = (prev, id, value) => {
        const current = [...prev];
        for (let i = 0; i < current.length; i++) {
            if (i === id) current[i] = value;
            else current[i] = {};
        }
        return current;
    }

    const resetShowGraph = () => {
        const temp = [];
        DATA.forEach(() => temp.push({}));
        setShowGraph(temp);
    }

    // Init all useState with usable data
    useEffect(() => {
        setData(DATA);
        resetShowGraph();
    }, []);

    // Rendering 1st Graph
    useEffect(() => {
        if (inputRef0.current && data) {
            const svg = d3.select(inputRef0.current)
                .attr("height", HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, WIDTH, HEIGHT]);

            const x = d3.scaleBand()
                .domain(d3.range(data[0].length))
                .range([MARGIN.left, WIDTH - MARGIN.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

            svg.selectAll("rect")
                .data(data[0])
                .enter()
                .append("rect")
                .attr("x", (_, i) => x(i))
                .attr("y", (d) => y(d))
                .attr("height", d => HEIGHT - MARGIN.bottom - y(d))
                .attr("width", x.bandwidth())
                .attr("fill", (_, i) => COLOR[i % 3])
                .attr("id", d => d);

            function xAxis(g) {
                g.attr("transform", `translate(0, ${HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x))
            }
            svg.append("g").call(xAxis);

            function yAxis(g) {
                g.attr("transform", `translate(${MARGIN.left}, 0)`)
                    .call(d3.axisLeft(y).ticks(null, data[0].format))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(yAxis);

            const brush = d3.brushX()
                .extent([
                    [d3.min(x.range()), d3.min(y.range())],
                    [d3.max(x.range()), d3.max(y.range())]
                ])
                .on("brush end", (e) => {
                    if(e.selection != null){
                        console.log(e.selection);
                        const [x0, x1] = e.selection;
                        const selected = data[0].filter((d, i) => {
                            if(x0 <= (x(i) + 40) && x1 >= (x(i) + 40)) return d;
                        })
                        const average = selected.reduce((a, b) => a + b, 0) / selected.length;
                        const value = {selected: selected, average: average};
                        setShowGraph(prev => handleBoxOpen(prev, 0, value));
                    } else resetShowGraph();
                });
                svg.selectAll(".brushContainer")
                    .data([1])
                    .join("g")
                    .attr("class", "brushContainer")
                    .call(brush);

            return () => {
                svg.selectAll("*").remove()
            }
        }
    }, [data]);

    // Rendering 2nd Graph
    useEffect(() => {
        if (inputRef1.current && data) {
            const svg = d3.select(inputRef1.current)
                .attr("height", HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, WIDTH, HEIGHT]);

            const x = d3.scaleBand()
                .domain(d3.range(data[1].length))
                .range([MARGIN.left, WIDTH - MARGIN.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

            svg.selectAll("rect")
                .data(data[1])
                .enter()
                .append("rect")
                .attr("x", (_, i) => x(i))
                .attr("y", (d) => y(d))
                .attr("height", d => HEIGHT - MARGIN.bottom - y(d))
                .attr("width", x.bandwidth())
                .attr("fill", (_, i) => COLOR[i % 3])
                .attr("id", d => d);

            function xAxis(g) {
                g.attr("transform", `translate(0, ${HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x))
            }
            svg.append("g").call(xAxis);

            function yAxis(g) {
                g.attr("transform", `translate(${MARGIN.left}, 0)`)
                    .call(d3.axisLeft(y).ticks(null, data[1].format))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(yAxis);

            const brush = d3.brushX()
                .extent([
                    [d3.min(x.range()), d3.min(y.range())],
                    [d3.max(x.range()), d3.max(y.range())]
                ])
                .on("brush end", (e) => {
                    if(e.selection != null){
                        console.log(e.selection);
                        const [x0, x1] = e.selection;
                        const selected = data[1].filter((d, i) => {
                            if(x0 <= (x(i) + 40) && x1 >= (x(i) + 40)) return d;
                        })
                        const average = selected.reduce((a, b) => a + b, 0) / selected.length;
                        const value = {selected: selected, average: average};
                        setShowGraph(prev => handleBoxOpen(prev, 1, value));
                    } else resetShowGraph();
                });
            svg.selectAll(".brushContainer")
                .data([1])
                .join("g")
                .attr("class", "brushContainer")
                .call(brush);

            return () => {
                svg.selectAll("*").remove()
            }
        }
    }, [data]);

    // Rendering 3rd Graph
    useEffect(() => {
        if (inputRef2.current && data) {
            const svg = d3.select(inputRef2.current)
                .attr("height", HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, WIDTH, HEIGHT]);

            const x = d3.scaleBand()
                .domain(d3.range(data[2].length))
                .range([MARGIN.left, WIDTH - MARGIN.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

            svg.selectAll("rect")
                .data(data[2])
                .enter()
                .append("rect")
                .attr("x", (_, i) => x(i))
                .attr("y", (d) => y(d))
                .attr("height", d => HEIGHT - MARGIN.bottom - y(d))
                .attr("width", x.bandwidth())
                .attr("fill", (_, i) => COLOR[i % 3])
                .attr("id", d => d);

            function xAxis(g) {
                g.attr("transform", `translate(0, ${HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x))
            }
            svg.append("g").call(xAxis);

            function yAxis(g) {
                g.attr("transform", `translate(${MARGIN.left}, 0)`)
                    .call(d3.axisLeft(y).ticks(null, data[2].format))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(yAxis);

            const brush = d3.brushX()
                .extent([
                    [d3.min(x.range()), d3.min(y.range())],
                    [d3.max(x.range()), d3.max(y.range())]
                ])
                .on("brush end", (e) => {
                    if(e.selection != null){
                        console.log(e.selection);
                        const [x0, x1] = e.selection;
                        const selected = data[2].filter((d, i) => {
                            if(x0 <= (x(i) + 40) && x1 >= (x(i) + 40)) return d;
                        })
                        const average = selected.reduce((a, b) => a + b, 0) / selected.length;
                        const value = {selected: selected, average: average};
                        setShowGraph(prev => handleBoxOpen(prev, 2, value));
                    } else resetShowGraph();
                });
            svg.selectAll(".brushContainer")
                .data([1])
                .join("g")
                .attr("class", "brushContainer")
                .call(brush);

            return () => {
                svg.selectAll("*").remove()
            }
        }
    }, [data]);

    return (
        <div style={{ display: "flex", flexDirection: "column", marginTop: "10%", marginLeft: "3%", marginRight: "3%" }}>
            <h3>DynamicBox.js</h3>
            {DATA.map((_, i) => {
                return (
                    <div key={i} style={{ marginBottom: "5%" }}>
                        {showGraph && showGraph[i] != null && Object.keys(showGraph[i]).length > 0 && <div onClick={resetShowGraph}>
                            <h2>Chosen value: {showGraph[i].selected.toString()} Average: {showGraph[i].average}</h2>
                        </div>}
                        <svg height={HEIGHT} width={WIDTH} ref={inputRefs[i]}>
                        </svg>

                    </div>
                )
            })}
        </div>
    )
}