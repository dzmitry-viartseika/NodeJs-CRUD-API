import { IUser } from '../types/types';

export const validateUserData = (user: IUser) => {
    return (
        Object.keys(user).length === 3 &&
        Array.isArray(user.hobbies) &&
        user.hobbies.every((hobby: string) => true)
    );
};