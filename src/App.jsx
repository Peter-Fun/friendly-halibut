import './App.css';
import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home.jsx";
import Visualize from "./components/Visualize.jsx";
import ChooseYourStory from "./components/ChooseYourStory.jsx";
import OwnStory from "./components/OwnStory";
import Final from './components/Final';
import NavBar from './components/Navbar';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <div class = "App">
        <Router>
          <Routes>
            <Route 
              path= "/"
              element = {<Home></Home>}
            />
            <Route
              path = "/visualize"
              element = {<Visualize />}
            />
            <Route
              path = "/chooseyourstory"
              element = {<ChooseYourStory />}
            />
            <Route
              path = "/ownstory"
              element = {<OwnStory />}
            />
            <Route
              path = "/final"
              element = {<Final />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
