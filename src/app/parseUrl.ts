import { USER_ENDPOINT } from '../constants/endpoints/usersEndPoint';
import { IRequest } from '../types/types';

export default (req: IRequest) => {
    let pathName = req.url!;
    if (pathName.endsWith("/")) {
        pathName = pathName.slice(0, pathName.length - 1);
    }

    Object.values(USER_ENDPOINT).forEach((endpoint) => {
        if (pathName.includes(endpoint)) {
            req.pathname = endpoint;
        }
        const id = pathName.replace(`/${endpoint}`, '');
        if (id) {
            req.id = id.slice(1);
        }
    });
};