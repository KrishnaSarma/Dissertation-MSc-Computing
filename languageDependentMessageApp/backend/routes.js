import { Router } from 'express';
const routes = new Router();
import * as authController from "./controllers/authController";
import * as userController from "./controllers/usersController";
import * as chatController from "./controllers/chatController";
import * as translatorController from "./controllers/translatorController"
// import {authController, chatController, usersController} from './controllers';

routes.post("/login", authController.login);
routes.post("/signup", authController.signup);
routes.get("/users", userController.findAll);
routes.get("/getMessages", chatController.getMessages);
routes.get("/getLanguages", translatorController.getLanguages);
// routes.post("/sentMessage", chatController.sendMessage);

export default routes;