import express from "express";
import redis from "redis";

const app = express();
const client = redis.createClient({
  host: "redis-server", // use a host name of the other container that was created, check *.yml and see services that were composed
  port: 6379, // default redis port, just being explicit here
});

client.set("visits", String(0));

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  client.get("visits", (err: Error | null, visits: string) => {
    res.json(`Number of visits is ${visits}`);
    client.set("visits", String(Number(visits) + 1));
  });
});

app.listen(8081, () => console.log(`Listening on port 8081`));
