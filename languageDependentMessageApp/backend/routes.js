import { Router } from 'express';
const routes = new Router();
import * as authController from "./controllers/authController";
import * as userController from "./controllers/usersController";
import * as chatController from "./controllers/chatController";
// import {authController, chatController, usersController} from './controllers';

routes.post("/login", authController.login);
routes.post("/signup", authController.signup);
routes.get("/users", userController.findAll);
routes.get("/getMessages", chatController.getMessages);
routes.post("/sentMessage", chatController.sendMessage);

export default routes;