import { validate as uuidValidate } from "uuid";

export const validateUserId = (userId: string) => {
    return uuidValidate(userId);
};
