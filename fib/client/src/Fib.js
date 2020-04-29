import React from "react";
import axios from "axios";

export default () => {
  const [seenIndexes, setSeenIndexes] = React.useState([]);
  const [values, setValues] = React.useState({});
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  async function fetchValues() {
    const vals = await axios.get("/api/values/current");
    setValues(vals.data);
  }

  async function fetchIndexes() {
    const seenIdxs = await axios.get("/api/values/all");
    setSeenIndexes(seenIdxs.data);
  }

  function renderSeenIndexes() {
    return seenIndexes.map(({ number }) => number).join(", ");
  }

  function renderValues() {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("/api/value", {
      index: value,
    });
    setValue("");
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Enter your index:</label>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};
