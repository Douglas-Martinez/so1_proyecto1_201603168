import React, { useState, useEffect } from "react";

import Table from 'react-bootstrap/Table';
import { VictoryChart, VictoryArea, VictoryTheme } from 'victory';

import API from '../services/api';

const Ram = () => {
    let init = {
        x: 0,
        y: 0
    }
    let ramInit = {
        TOTAL: 0,
        CONSUMIDA: 0,
        PCT: 0
    }
    const [ramList, setRamList] = useState([init]);
    const [ram, setRam] = useState(ramInit);
    const [loading, setLoad] = useState(true);
    const [temp, setTemp] = useState(0);
    const [secs, setSecs] = useState(2);

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp+1);
        }, 2000);
    }, []);

    useEffect(() => {
        getRam();
    }, [temp]);

    const getRam = () => {
        API.get("/ram")
            .then((res) => {
                setRam(res.data);
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
        if(ram.PCT !== undefined) {
            setRamList([...ramList, {
                x: secs,
                y: ram.PCT
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
                <h1 className="text-center">RAM - Monitor</h1>
                <br />
                <div className="d-grid col-12 col-lg-5 mx-auto">
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr className="text-center">
                                <th>Total (MB)</th>
                                <th>Consumida (MB)</th>
                                <th>Total (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="1" className="text-center align-middle">
                                <td>{ram.TOTAL}</td>
                                <td>{ram.CONSUMIDA}</td>
                                <td>{ram.PCT}</td>
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
                            style={{ data: { fill: "#09AA"}}}
                            x="x"
                            y="y"
                            data={ramList}
                        />
                    </VictoryChart>
                </div>
            </React.Fragment>
        );
    }
}

export default Ram;