import { IRouter, THandler } from '../types/types';

export default class Router {
    public endpoints: IRouter;
    constructor() {
        this.endpoints = {};
    }

    private request(method: string = "GET", path: string, handler: THandler) {
        if (!this.endpoints[path]) {
            this.endpoints[path] = {};
        }
        const endpoint = this.endpoints[path];
        if (endpoint[method]) {
            throw new Error(`${method} with path ${path} already exists`);
        }
        endpoint[method] = handler;
    }

    public get(path: string, handler: THandler) {
        this.request("GET", path, handler);
    }
    public post(path: string, handler: THandler) {
        this.request("POST", path, handler);
    }
    public put(path: string, handler: THandler) {
        this.request("PUT", path, handler);
    }
    public delete(path: string, handler: THandler) {
        this.request("DELETE", path, handler);
    }
}