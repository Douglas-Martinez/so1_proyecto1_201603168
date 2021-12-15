import {BrowserRouter, Routes, Route} from 'react-router-dom'

import './App.css';

import Layout from './components/Layout';
import Procesos from './components/Procesos';
import Ram from './components/Ram';
import Cpu from './components/Cpu';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Procesos />} />
          <Route path="/procesos" element={<Procesos />} />
          <Route path="/ram-monitor" element={<Ram />} />
          <Route path="/cpu-monitor" element={<Cpu />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

/* 
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/