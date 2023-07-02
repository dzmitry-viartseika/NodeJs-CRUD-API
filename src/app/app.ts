import EventEmitter from 'events';
import { Server, createServer } from 'http';
import { IError, IRequest, IResponse, THandler } from '../types/types';
import { Codes, Messages } from '../constants/enums';
import Router from './router';

export default class Application {
    emitter: EventEmitter;
    server: Server;
    middlewares: THandler[];

    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer();
        this.middlewares = [];
    }

    public use(middleware: THandler) {
        this.middlewares.push(middleware);
    }

    public listen(port: number, callback: () => void) {
        this.server.listen(port, callback);

        this.server.on('error', (err: IError) => {
            if (err.code === 'EACCES') {
                console.log(`No access to port: ${port}`);
            }
        });
    }

    public addRouter(router: Router) {
        Object.keys(router.endpoints).forEach((path) => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach((method) => {
                this.emitter.on(this._getRouteMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res);
                });
            });
        });
    }

    private _createServer() {
        return createServer((req: IRequest, res: IResponse) => {
            let body = '';
            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", () => {
                try {
                    if (body) {
                        req.body = JSON.parse(body);
                    }
                    this.middlewares.forEach((middleware) => middleware(req, res));
                    const emitted = this.emitter.emit(this._getRouteMask(req.pathname!, req.method!), req, res);
                    if (!emitted) {
                        res.send!(Messages.INVALID_ENDPOINT, Codes.NOT_FOUND);
                    }
                } catch (err) {
                    res.writeHead(Codes.SERVER_ERROR);
                    res.end(Messages.SERVER_ERROR);
                }
            });
        });
    }

    private _getRouteMask(path: string, method: string): string {
        return `[${path}]:[${method}]`;
    }

    public close() {
        this.server.close();
    }
}