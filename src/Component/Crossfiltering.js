import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3'
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const PATH = "/data/Accelerometer/Accelerometer-test.csv";
const BAR_HEIGHT = 410;
const BAR_WIDTH = 510;
const LINE_HEIGHT = 410;
const LINE_WIDTH = 760;
const MARGIN = { top: 30, bottom: 30, left: 30, right: 30 };
const COLOR = ["#ff7577", "#55ff7f", "#55ffff"]

export default function Crossfiltering() {
    const [data, setData] = useState([]);
    const d3BarContainer = useRef(null);

    // import csv as csvData
    useEffect(() => {
        d3.csv(PATH, function (csvRow) {
            csvRow.timeString = timestampConverter(csvRow.timestamp);
            return csvRow;
        }).then(function (d) {
            setData(d);
        });
    }, []);

    // construct bar chart
    useEffect(() => {
        if (d3BarContainer.current && data) {
            const svg = d3.select(d3BarContainer.current)
                .attr("height", BAR_HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", BAR_WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, BAR_WIDTH, BAR_HEIGHT]);

            // calculating average of X, Y, Z
            var totalX = 0, totalY = 0, totalZ = 0;
            for (let i = 0; i < data.length; i++) {
                totalX = totalX + Number(data[i].X);
                totalY = totalY + Number(data[i].Y);
                totalZ = totalZ + Number(data[i].Z);
            }
            const average = [];
            average.push(totalX / (data.length));
            average.push(totalY / (data.length));
            average.push(totalZ / (data.length));
            const entryTitle = ["X", "Y", "Z"];
            console.log(average);

            const x = d3.scaleBand()
                .domain(d3.range(entryTitle.length))
                .range([MARGIN.left, BAR_WIDTH - MARGIN.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([-1.0, 1.0])
                .range([BAR_HEIGHT - MARGIN.bottom, MARGIN.top]);

            svg.selectAll("rect")
                .data(average)
                .enter()
                .append("rect")
                .attr("x", (_, i) => x(i))
                .attr("y", (d) => y(d) - MARGIN.bottom)
                .attr("height", d => BAR_HEIGHT - y(d))
                .attr("width", x.bandwidth())
                .attr("fill", (_, i) => COLOR[i]);

            function xAxis(g) {
                g.attr("transform", `translate(0, ${BAR_HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x).tickFormat(i => entryTitle[i]))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(xAxis);

            function yAxis(g) {
                g.attr("transform", `translate(${MARGIN.left}, 0)`)
                    .call(d3.axisLeft(y).ticks(null, average.format))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(yAxis);

            return () => {
                svg.selectAll("*").remove()
            }
        }
    }, [data])

    const timestampConverter = (timestamp) => {
        var date = new Date(Number(timestamp));
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    }

    const print = () => {
        console.log(data.columns);
    }

    return (
        <div style={{ marginTop: "8%", marginBottom: "3%", marginRight: "1%", marginLeft: "1%" }}>
            <h2>Crossfiltering Page</h2>
            <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "5%" }}>
                {data.length > 0 &&
                    <svg height={BAR_HEIGHT} width={BAR_WIDTH} ref={d3BarContainer}>
                    </svg>
                }
                {data.length > 0 &&
                    <svg height={LINE_HEIGHT} width={LINE_WIDTH} style={{ backgroundColor: "#00ff00" }}>
                    </svg>
                }
            </div>
            <Button style={{ marginBottom: "3%" }} onClick={print}>
                For Test
            </Button>
            {data.length > 0 &&
                <Table bordered striped hover className="table-light">
                    <thead>
                        <tr key={"header"}>
                            {data.columns.map((key) => {
                                return <th key={key}>{key}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                {data.columns.map((h) => {
                                    if (h === "timestamp") return <th key={d["timeString"]}>{d["timeString"]}</th>
                                    return <th key={d[h]}>{d[h]}</th>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
        </div >
    )
}