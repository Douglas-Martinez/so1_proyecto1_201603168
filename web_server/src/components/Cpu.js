import React, { useState, useEffect } from "react";

import Table from 'react-bootstrap/Table';
import { VictoryChart, VictoryArea, VictoryTheme } from 'victory';

import API from '../services/api';

const Cpu = () => {
    let init = {
        x: 0,
        y: 0
    }

    let cpuInit = {
        TOTAL: 0,
        CONSUMIDA: 0,
        PCT: 0
    }

    const [cpuList, setCpuList] = useState([init]);
    const [cpu, setCpu] = useState(cpuInit);
    const [loading, setLoad] = useState(true);
    const [temp, setTemp] = useState(0);
    const [secs, setSecs] = useState(2);

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp+1);
        }, 2000);
    }, []);

    useEffect(() => {
        getCpu();
    }, [temp]);

    const getCpu = () => {
        API.get("/cpu")
            .then((res) => {
                setCpu(res.data);
                addList();
                setLoad(false);
            })
            .catch(err => {
                console.error(err);
            })
    };

    const addList = () => {
        // var today = new Date();
        // today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        if(cpu.CPU !== undefined) {
            setCpuList([...cpuList, {
                x: secs,
                y: cpu.CPU
            }]);
        }

        setSecs(secs+2);
    }

    if(loading) {
        return (
            <React.Fragment>
                <div />
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <br />
                <h1 className="text-center">CPU - Monitor</h1>
                <br />
                <div className="d-grid col-7 col-lg-3 mx-auto">
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr className="text-center">
                                <th>Total Utilizado (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="1" className="text-center align-middle">
                                <td>{cpu.CPU}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="d-grid col-lg-7 mx-auto">
                    <VictoryChart
                        theme={VictoryTheme.material}
                        width={700}
                        height={330}
                        domain={{ y: [0, 100]}}
                    >
                        <VictoryArea 
                            style={{ data: { fill: "#FF5936"}}}
                            x="x"
                            y="y"
                            data={cpuList}
                        />
                    </VictoryChart>
                </div>
            </React.Fragment>
        );
    }
}

export default Cpu;