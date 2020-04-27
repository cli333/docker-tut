import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json("hello docker");
});

app.listen(8080, () => console.log("Listening on port 8080"));
