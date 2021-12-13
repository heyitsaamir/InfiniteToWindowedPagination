import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { doWork } from './graphql/infiniteListMockServer';

function App() {
  const [res, setRes] = useState('');
  useEffect(() => {
    doWork().then((res) => {
      setRes(JSON.stringify(res, null, 2));
    });
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <pre style={{width: '100%'}}>
          {res}
        </pre>
    </div>
  );
}

export default App;
