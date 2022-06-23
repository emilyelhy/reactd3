import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const PATH = "/data/Accelerometer/Accelerometer-test.csv";
var flag = true;

export default function Crossfiltering() {
    const [data, setData] = useState([]);
    const [header, setHeader] = useState([]);

    useEffect(() => {
        d3.csv(PATH, function (row) {
            if (flag === true) setHeader(Object.keys(row));
            flag = false;
            return row;
        }).then(function (d) {
            console.log(d);
            setData(d);
        });
    }, []);

    const print = () => {
        console.log(data[0].X);
    }

    return (
        <div style={{marginTop: "15%", marginBottom: "5%"}}>
            <h2>Crossfiltering Page</h2>
            {data.length > 0 && <Table bordered striped hover className="table-light">
                <thead>
                    <tr key={"header"}>
                        {header.map((key) => {
                            return <th key={key}>{key}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr>
                            {header.map((h) => (
                                <th key={d[h]}>{d[h]}</th>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>}
            <Button onClick={print}>
                For Test
            </Button>
        </div >
    )
}