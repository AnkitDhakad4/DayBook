import "dotenv/config";
import app from "./app.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const port = process.env.PORT || 8000;

app.listen(port,
    '0.0.0.0',
     () => console.log(`Taskly API listening on port ${port}`)
);
