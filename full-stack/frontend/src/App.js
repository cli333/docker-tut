import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [target, setTarget] = React.useState("");

  React.useEffect(() => {
    axios.get("/api").then((res) => setTarget(res.data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>{target}</div>
      </header>
    </div>
  );
}

export default App;
