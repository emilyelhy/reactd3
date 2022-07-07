import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3'
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { Slider } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.css';

const PATH = "/data/Accelerometer/Accelerometer-test.csv";
const BAR_HEIGHT = 450;
const BAR_WIDTH = 510;
const LINE_HEIGHT = 450;
const LINE_WIDTH = 760;
const MARGIN = { top: 30, bottom: 30, left: 30, right: 30 };
const COLOR = { X: "#ff7577", Y: "#55ff7f", Z: "#55ffff" };

export default function Crossfiltering() {
    const [data, setData] = useState([]);
    const [currSelection, setCurrSelection] = useState("All");
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const d3BarContainer = useRef(null);
    const d3LineContainer = useRef(null);
    const HEADER = ["X", "Y", "Z"];
    const [header, setHeader] = useState(HEADER);
    const [min, setMin] = useState(-1.0);
    const [max, setMax] = useState(1.0);
    const [range, setRange] = useState([]);
    const [color, setColor] = useState(COLOR);
    const [focus, setFocus] = useState(false);

    // import csv as csvData
    useEffect(() => {
        d3.csv(PATH, (csvRow) => {
            csvRow.X = Number(csvRow.X);
            csvRow.Y = Number(csvRow.Y);
            csvRow.Z = Number(csvRow.Z);
            csvRow.timestamp = Number(csvRow.timestamp);
            csvRow.timeString = timestampConverter(csvRow.timestamp);
            return csvRow;
        }).then((d) => {
            setData(d);
            setBarData(d);
            setLineData(d);
            setMin(Math.floor(d3.min([d3.min(d, (val) => { return val.X }), d3.min(d, (val) => { return val.Y }), d3.min(d, (val) => { return val.Z })]) * 10) / 10);
            setMax(Math.ceil(d3.max([d3.max(d, (val) => { return val.X }), d3.max(d, (val) => { return val.Y }), d3.max(d, (val) => { return val.Z })]) * 10) / 10);
            setRange([d[0].timestamp, d[d.length - 1].timestamp]);
            setColor(COLOR);
        });
    }, []);

    // construct bar chart
    useEffect(() => {
        if (d3BarContainer.current && barData) {
            const svg = d3.select(d3BarContainer.current)
                .attr("height", BAR_HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", BAR_WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, BAR_WIDTH, BAR_HEIGHT]);

            // calculating average of X, Y, Z
            var totalX = 0, totalY = 0, totalZ = 0;
            for (let i = 0; i < barData.length; i++) {
                totalX = totalX + barData[i].X;
                totalY = totalY + barData[i].Y;
                totalZ = totalZ + barData[i].Z;
            }
            const average = [];
            average.push(totalX / (barData.length));
            average.push(totalY / (barData.length));
            average.push(totalZ / (barData.length));

            const x = d3.scaleBand()
                .domain(d3.range(header.length))
                .range([MARGIN.left, BAR_WIDTH - MARGIN.right])
                .padding(0.45 / header.length);

            const y = d3.scaleLinear()
                .domain([min, max])
                .range([BAR_HEIGHT - MARGIN.bottom, MARGIN.top]);

            if (currSelection === "All") {
                svg.selectAll("rect")
                    .data(average)
                    .enter()
                    .append("rect")
                    .attr("x", (_, i) => x(i))
                    .attr("y", (d) => y(d))
                    .attr("height", d => BAR_HEIGHT - MARGIN.bottom - y(d))
                    .attr("width", x.bandwidth())
                    .attr("fill", (_, i) => color[header[i]])
                    .attr("id", (_, i) => header[i]);
            } else {
                let newAverage;
                if (currSelection === "X") newAverage = average[0];
                if (currSelection === "Y") newAverage = average[1];
                if (currSelection === "Z") newAverage = average[2];
                svg.append("rect")
                    .data([newAverage])
                    .attr("x", (_, i) => x(i))
                    .attr("y", (d) => y(d) - MARGIN.bottom)
                    .attr("height", d => BAR_HEIGHT - y(d))
                    .attr("width", x.bandwidth())
                    .attr("fill", (_, i) => color[currSelection])
                    .attr("id", (_, i) => header[i])
            }

            function xAxis(g) {
                g.attr("transform", `translate(0, ${BAR_HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x).tickFormat(i => header[i]))
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
    }, [barData, currSelection, header, max, min, color]);

    // construct line chart
    useEffect(() => {
        if (d3LineContainer.current && lineData) {
            const svg = d3.select(d3LineContainer.current)
                .attr("height", LINE_HEIGHT - MARGIN.top - MARGIN.bottom)
                .attr("width", LINE_WIDTH - MARGIN.left - MARGIN.right)
                .attr("viewBox", [0 - MARGIN.left, 0, LINE_WIDTH, LINE_HEIGHT]);

            const x = d3.scaleTime()
                .domain(d3.extent(lineData, (d) => { return d.timestamp }))
                .range([MARGIN.left, LINE_WIDTH - MARGIN.right]);

            const y = d3.scaleLinear()
                .domain([min, max])
                .range([LINE_HEIGHT - MARGIN.bottom, MARGIN.top]);

            const valueLine = [];
            for (let i = 0; i < header.length; i++) {
                valueLine.push(d3.line()
                    .x((d) => { return x(d.timestamp); })
                    .y((d) => { return y(d[header[i]]); }));
            }

            for (let i = 0; i < valueLine.length; i++) {
                svg.append("path")
                    .data([lineData])
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", color[header[i]])
                    .attr("stroke-width", 1.5)
                    .attr("d", valueLine[i])
                    .attr("id", header[i]);
            }

            function xAxis(g) {
                g.attr("transform", `translate(0, ${LINE_HEIGHT - MARGIN.bottom})`)
                    .call(d3.axisBottom(x))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(xAxis);

            function yAxis(g) {
                g.attr("transform", `translate(${MARGIN.left}, 0)`)
                    .call(d3.axisLeft(y))
                    .attr("font-size", "20px");
            }
            svg.append("g").call(yAxis);

            return () => {
                svg.selectAll("*").remove()
            }
        }
    }, [lineData, header, max, min, range, color]);

    // set event listener on pointer event and update state "color"
    useEffect(() => {
        if (d3BarContainer.current && d3LineContainer.current) {
            const barSvg = d3.select(d3BarContainer.current);
            barSvg.selectAll("rect")
                .on("pointerenter", (e) => {
                    setColor(prev => {
                        const newColor = { ...prev };
                        Object.keys(prev).forEach(key => {
                            if (key !== e.target.id) {
                                newColor[key] = "#e2ebff";
                            }
                        })
                        if (JSON.stringify(newColor) === JSON.stringify(prev)) return prev;
                        return newColor;
                    });
                })
                .on("pointerleave", () => {
                    setColor(COLOR);
                    setLineData(snipData(range));
                    setFocus(false);
                })
                .on("pointerdown", (e) => {
                    if (focus === false) {
                        var temp = getSelectedData(snipData(range), e.target.id);
                        setLineData(temp);
                        setFocus(!focus);
                    } else {
                        setLineData(snipData(range));
                        setFocus(!focus);
                    }
                });
            const lineSvg = d3.select(d3LineContainer.current);
            lineSvg.selectAll("path")
                .on("pointerenter", (e) => {
                    setColor(prev => {
                        const newColor = { ...prev };
                        Object.keys(prev).forEach(key => {
                            if (key !== e.target.id) {
                                newColor[key] = "#e2ebff";
                            }
                        })
                        if (JSON.stringify(newColor) === JSON.stringify(prev)) return prev;
                        return newColor;
                    });
                })
                .on("pointerleave", () => {
                    setColor(COLOR);
                });
        }
    });

    const timestampConverter = (timestamp) => {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

    const print = () => {
        console.log(color);
    };

    const handleCurrSelection = (sel) => {
        setCurrSelection(sel);
        if (sel === "All") {
            setBarData(snipData(range));
            setLineData(snipData(range));
            setHeader(HEADER);
        }
        else {
            var temp = getSelectedData(snipData(range), sel);
            setHeader(sel);
            setBarData(temp);
            setLineData(temp);
        }
    };

    const snipData = (newValue) => {
        var tempDataArray = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].timestamp >= newValue[0] && data[i].timestamp <= newValue[1])
                tempDataArray.push(data[i]);
        }
        return tempDataArray;
    };

    const getSelectedData = (data, sel) => {
        var temp = [];
        for (let i = 0; i < data.length; i++)
            temp.push({ [sel]: data[i][sel], timestamp: data[i]["timestamp"], timeString: data[i]["timeString"] });
        return temp;
    }

    const handleSliderRange = (_, newValue) => {
        setBarData(snipData(newValue));
        setLineData(snipData(newValue));
    };

    return (
        <div style={{ marginTop: "8%", marginBottom: "3%", marginRight: "1%", marginLeft: "1%" }}>
            <h2>Crossfiltering Page</h2>
            {data.length > 0 && <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around" }}>
                <Slider
                    min={data[0].timestamp}
                    max={data[data.length - 1].timestamp}
                    value={range}
                    onChangeCommitted={handleSliderRange}
                    onChange={(_, newValue) => setRange(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => <div>{timestampConverter(value)}</div>}
                    style={{ marginLeft: "5%", marginRight: "30%" }}
                />
                <DropdownButton id="dropdown-basic-button" title={currSelection} style={{ alignSelf: "flex-end" }} onSelect={(sel) => handleCurrSelection(sel)}>
                    {HEADER.map((h) => {
                        return <Dropdown.Item eventKey={h} key={h} value={h}>{h}</Dropdown.Item>
                    })}
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="All" value="All">All</Dropdown.Item>
                </DropdownButton>
            </div>}
            <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "5%" }}>
                {data.length > 0 &&
                    <svg height={BAR_HEIGHT} width={BAR_WIDTH} ref={d3BarContainer}>
                    </svg>
                }
                {data.length > 0 &&
                    <svg height={LINE_HEIGHT} width={LINE_WIDTH} ref={d3LineContainer}>
                    </svg>
                }
            </div>
            <Button style={{ marginBottom: "3%" }} onClick={print}>
                For Test
            </Button>
        </div >
    )
}