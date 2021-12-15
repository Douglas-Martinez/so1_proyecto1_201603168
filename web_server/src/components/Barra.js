import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

export default function Barra() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/procesos">Proyecto 1 - 201603168</Navbar.Brand>
                    <Nav className="justify-content-center">
                        <Nav.Link href="/procesos">Procesos</Nav.Link>
                        <Nav.Link href="/ram-monitor">RAM</Nav.Link>
                        <Nav.Link href="/cpu-monitor">CPU</Nav.Link>
                    </Nav>
            </Container>
        </Navbar>
    )
}