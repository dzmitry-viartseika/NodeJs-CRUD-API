import { IncomingMessage } from 'http';
import { IResponse, IUser } from '../types/types';

export default (req: IncomingMessage, res: IResponse): void => {
    res.send = (data: IUser, code: number): void => {
        if (200 <= code && code <= 299) {
            res.writeHead(code, { "Content-type": "application/json" });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(code);
            res.end(data);
        }
    };
};