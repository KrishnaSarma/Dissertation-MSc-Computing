import { Router } from 'express';
const routes = new Router();
import {authController, chatController, usersController} from './controllers';

routes.post("/login", authController.login);
routes.get("/users", userController.findAll());
routes.get("/chatMessages", chatController.getMessages());
routes.post("/sentMessage", chatController.sendMessage());

export default routes;