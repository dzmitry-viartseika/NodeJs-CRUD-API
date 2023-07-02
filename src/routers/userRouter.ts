import Router from "../app/router";
import userController from "../controllers/userController";

export const usersRouter = new Router();

usersRouter.get('api/users', userController.getUsers);
usersRouter.post('api/users', userController.createUser);
usersRouter.put('api/users', userController.updateUser);
usersRouter.delete('api/users', userController.deleteUser);