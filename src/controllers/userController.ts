import { v4 as uuidv4 } from 'uuid';
import { IRequest, IResponse } from '../types/types';
import { Codes, Messages } from '../constants/enums';
import { users } from '../db/usersDatabase';
import { isMulti, validateUserData, validateUserId } from '../utils';

const updateMainDBIfMultiMode = () => {
    if (isMulti()) {
        process.send!(users);
    }
};

const usersController = {
    getUsers(req: IRequest, res: IResponse) {
        const userId = req.id;
        if (!userId) {
            return res.send!(users, Codes.OK);
        }
        if (!validateUserId(userId)) {
            return res.send!(Messages.INVALID_USER_ID, Codes.INVALID);
        } else {
            const user = users.find((user) => user.id === userId);
            if (user) {
                return res.send!(user, Codes.OK);
            } else {
                return res.send!(Messages.NOT_FOUND_USER, Codes.NOT_FOUND);
            }
        }
    },

    createUser(req: IRequest, res: IResponse) {
        if (req.body) {
            const user = req.body;
            if (validateUserData(user)) {
                user.id = uuidv4();
                users.push(user);
                updateMainDBIfMultiMode();
                return res.send!(user, Codes.CREATE);
            }
        }
        return res.send!(Messages.INVALID_BODY, Codes.INVALID);
    },

    updateUser(req: IRequest, res: IResponse) {
        const userId = req.id;
        if (!userId || !validateUserId(userId)) {
            return res.send!(Messages.INVALID_USER_ID, Codes.INVALID);
        }
        if (req.body) {
            const user = req.body;
            if (validateUserData(user)) {
                user.id = userId;
                const userIndex = users.findIndex((user) => user.id === userId);
                if (userIndex > -1) {
                    users[userIndex] = user;
                    updateMainDBIfMultiMode();
                    return res.send!(user, Codes.OK);
                } else {
                    return res.send!(Messages.NOT_FOUND_USER, Codes.NOT_FOUND);
                }
            }
        }
        return res.send!(Messages.INVALID_BODY, Codes.INVALID);
    },

    deleteUser(req: IRequest, res: IResponse) {
        const userId = req.id;
        if (!userId || !validateUserId(userId)) {
            return res.send!(Messages.INVALID_USER_ID, Codes.INVALID);
        } else {
            const userIndex = users.findIndex((user) => user.id === userId);
            if (userIndex > -1) {
                users.splice(userIndex, 1);
                updateMainDBIfMultiMode();
                return res.send!(Messages.USER_DELETED, Codes.DELETE);
            } else {
                return res.send!(Messages.NOT_FOUND_USER, Codes.NOT_FOUND);
            }
        }
    },
};

export default usersController;