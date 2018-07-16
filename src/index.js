import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const el = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const target = document.getElementById("root");
ReactDOM.render(el, target);

// "proxy": "https://polar-dusk-36385.herokuapp.com",
