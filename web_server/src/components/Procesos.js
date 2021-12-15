import React, { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table'

import API from '../services/api';

const Procesos = () => {
    const [procesos, setProcesos] = useState({});
    const [loading, setLoad] = useState(true);
    const [temp, setTemp] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp+1);
        }, 20000);
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
                                <tr>
                                    <th>Tipo</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="1">
                                    <td className="text-left">Ejecucion (Running)</td>
                                    <td>{procesos.EJECUCION}</td>
                                </tr>
                                <tr key="2">
                                    <td>Suspendidos (Sleeping)</td>
                                    <td>{procesos.SUSPENDIDOS}</td>
                                </tr>
                                <tr key="3">
                                    <td>Detenidos (Stopped)</td>
                                    <td>{procesos.DETENIDOS}</td>
                                </tr>
                                <tr key="4">
                                    <td>Procesos Zombie</td>
                                    <td>{procesos.ZOMBIE}</td>
                                </tr>
                                <tr key="5">
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
                        <Table responsive size="sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>PID</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Estado</th>
                                    <th>%RAM</th>
                                    <th>Bytes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    procesos && procesos.PROCESOS.map((proc) => {
                                        return (
                                            <tr key={proc.PID}>
                                                <td>
                                                    <button 
                                                        className="btn btn-//#endregion"
                                                        data-toggle="collapse"
                                                        data-target={`#collapse${+ proc.PID}`}
                                                        aria-expanded="true"
                                                        aria-controls={`collapse${+ proc.PID}`}>{'->'}</button>
                                                </td>
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
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Procesos;