import React from 'react';
import NavBar from './components/Navigation/NavBar';
import './App.css'
const App: React.FC = () => {
  return (
    <div className='App'>
      {/* Additional components and routing can be added here */}
      <div className='contenedor-left-side'>
        <NavBar/>
      </div>
    </div>
  );
};

export default App;