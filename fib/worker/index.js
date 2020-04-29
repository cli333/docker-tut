const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

const fib = (idx) => (idx < 2 ? idx : fib(idx - 1) + fib(idx - 2));

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
