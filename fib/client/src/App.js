import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Fib from "./Fib";
import OtherPage from "./OtherPage";
import { BrowserRouter, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="App-Header">
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
