import { Router } from 'express';
const routes = new Router();
import * as userController from "./controllers/usersController";
import * as chatController from "./controllers/chatController";
import * as translatorController from "./controllers/translatorController"

routes.get("/getUserData", userController.getUserData);
routes.post("/addUserData", userController.addUserData);
routes.get("/users", userController.findAll);
routes.get("/getMessages", chatController.getMessages);
routes.get("/getLanguages", translatorController.getLanguages);
routes.post("/changePassword", userController.changePassword);
routes.post("/saveUserDetails", userController.saveUserDetails);

export default routes;