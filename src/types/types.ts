import { IncomingMessage, ServerResponse } from 'http';

export interface IResponse extends ServerResponse {
    send?: (data: any, code: number) => void;
}

export interface IRequest extends IncomingMessage {
    body?: IUser;
    pathname?: string;
    id?: string;
}

export type THandler = (req: IRequest, res: IResponse) => void;

export interface IRouter {
    [path: string]: {
        [method: string]: THandler;
    };
}

export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export interface IError extends Error {
    code?: string;
}