import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="app">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
