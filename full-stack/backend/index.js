const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json("You've connected to 🐳🐳🐋🐋!");
});

app.listen(5000, () => console.log("listening on poart 5000"));
