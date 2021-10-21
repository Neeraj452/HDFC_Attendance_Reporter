// App.js - WEB
import React from "react";
import './App.css';
import { Route, Switch } from 'react-router-dom';
import UserInput from "./components/UserInput"
import Employee from "./components/Employee";
import UploadRecord from "./components/UploadRecord";
import Report from "./components/Report";
import HomeScreen from "./components/HomeScreen";


const App = () => {
  return (
    <div>
      <HomeScreen />
      <Switch>
        <Route exact path="/">
          <UserInput />
        </Route>
        <Route path="/Employee">
          <Employee />
        </Route>
        <Route path="/UploadRecord">
          <UploadRecord />
        </Route>
        <Route path="/Report">
          <Report />
        </Route>
      </Switch>
    </div>
  )
}

export default App

