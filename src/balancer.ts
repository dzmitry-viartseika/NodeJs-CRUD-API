import cluster, { Worker } from 'cluster';
import { createServer, request } from 'http';
import { IUser } from './types/types'
import { nextWorkerId } from './utils';

export const startBalancer = (port: number) => {
    const workers: Worker[] = [];
    let currentWorkerID = 0;
    const numCPUs = require("os").cpus().length;

    console.log(`Multi thread mode enabled. Number of CPUs is ${numCPUs} and that's great!`);

    for (let i = 0; i < numCPUs; i++) {
        const fork = cluster.fork({ WORKER_PORT: port + i + 1 });
        workers.push(fork);
    }

    createServer(async (req, res) => {
        req.pipe(
            request(
                `http://localhost:${Number(port) + currentWorkerID + 1}${req.url}`,
                { method: req.method, headers: req.headers },
                (resp) => resp.pipe(res)
            )
        );
        currentWorkerID = nextWorkerId(currentWorkerID, numCPUs);
    }).listen(port, () => {
        console.log(`Main process with pid: ${process.pid} started. Main server is listening on port ${port}.`);
        console.log("Please wait few seconds to start worker processes...");
    });

    cluster.on("message", (_, db: IUser[]) => {
        workers.forEach((w) => w.send(db));
    });
};