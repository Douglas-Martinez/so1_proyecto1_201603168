import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Procesos from './components/Procesos';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Procesos />} />
          <Route path="/procesos" element={<Procesos />} />
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