import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';


function App() {
  
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/:username/profile/">
            <UserProfile />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;