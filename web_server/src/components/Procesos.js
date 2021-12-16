import React, { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

import API from '../services/api';

const Procesos = () => {
    const [procesos, setProcesos] = useState({});
    const [loading, setLoad] = useState(true);
    const [temp, setTemp] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp+1);
        }, 15000);
    }, []);

    useEffect(() => {
        getProcesos();
    }, [temp]);

    const killProceso = id => {
        API.delete(`/proc/${id}`)
            .then((res) => {
                if(res.status === 200) {
                    alert(`Proceso No. ${id} eliminado satisfactoriamente`);
                    getProcesos();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const getProcesos = () => {
        API.get("/proc")
            .then((res) => {
                setProcesos(res.data)
                setLoad(false)
            })
            .catch(err => {
                console.error(err);
            })
    };

    const trStyle = {
        border: '0px',
        color: '#fff'
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
                <div className="d-grid col-12 col-lg-10 mx-auto text-center align-middle">
                    <br />
                    <h1>Procesos</h1>
                    <br />
                    <div className="d-grid col-12 col-lg-5 mx-auto">
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr key="T1H">
                                    <th>Tipo</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="T1B1">
                                    <td className="text-left">Ejecucion (Running)</td>
                                    <td>{procesos.EJECUCION}</td>
                                </tr>
                                <tr key="T1B2">
                                    <td>Suspendidos (Sleeping)</td>
                                    <td>{procesos.SUSPENDIDOS}</td>
                                </tr>
                                <tr key="T1B3">
                                    <td>Detenidos (Stopped)</td>
                                    <td>{procesos.DETENIDOS}</td>
                                </tr>
                                <tr key="T1B4">
                                    <td>Procesos Zombie</td>
                                    <td>{procesos.ZOMBIE}</td>
                                </tr>
                                <tr key="T1B5">
                                    <td>Total de Procesos</td>
                                    <td>{procesos.TOTAL}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <br />
                    <br />
                    <br />
                    <div>
                        <Accordion>
                            <Accordion.Item eventKey="ACH0">
                                <Accordion.Header>
                                    <Table>
                                        <thead>
                                            <tr style={trStyle} key="T2H0">
                                                <td>____</td>
                                                <td>________________</td>
                                                <td>________________</td>
                                                <td>_______</td>
                                                <td>___</td>
                                                <td>____</td>
                                                <td>_______</td>
                                            </tr>
                                            <tr key="T2H1">
                                                <th>PID</th>
                                                <th>Nombre</th>
                                                <th>Usuario</th>
                                                <th>Estado</th>
                                                <th>%RAM</th>
                                                <th>Bytes</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                </Accordion.Header>
                            </Accordion.Item>
                        </Accordion>

                        <Accordion>
                            {
                                procesos && procesos.PROCESOS.map((proc) => {
                                    return (
                                        <Accordion.Item eventKey={'AC'+proc.PID}>
                                            <Accordion.Header>
                                                <Table>
                                                    <tbody className="align-middle">
                                                        <tr style={trStyle} key={'THI'+proc.PID}>
                                                            <td>____</td>
                                                            <td>________________</td>
                                                            <td>________________</td>
                                                            <td>_______</td>
                                                            <td>___</td>
                                                            <td>____</td>
                                                            <td>_______</td>
                                                        </tr>
                                                        <tr key={proc.PID}>
                                                            <td>{proc.PID}</td>
                                                            <td>{proc.NOMBRE}</td>
                                                            <td>{proc.UNAME}</td>
                                                            <td>{proc.ENAME}</td>
                                                            <td>{proc.RAM}</td>
                                                            <td>{proc.RAM_BYTES}</td>
                                                            <td>
                                                                <button className="btn btn-danger m-2" onClick={() => killProceso(proc.PID)}>Kill</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Accordion.Header>
                                            {
                                                proc.HIJOS.length > 0 
                                                ?<Accordion.Body> 
                                                    <Table>
                                                        <thead>
                                                            <tr key={proc.PID+''+0}>
                                                                <td>PID (Hijo)</td>
                                                                <td>Nombre (Hijo)</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                proc.HIJOS.map((hijo, index) => {
                                                                    return (
                                                                        <tr key={proc.PID+''+hijo.PID}>
                                                                            <td>{hijo.PID}</td>
                                                                            <td>{hijo.NOMBRE}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Accordion.Body>
                                                : <div />
                                            }
                                        </Accordion.Item>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Procesos;