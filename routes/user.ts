// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import the necessary functions from comments controller
import { createUser } from "../controllers/users/createUser";
import { loginUser } from "../controllers/users/login";
import { completeUserInfo } from "../controllers/users/completeUserInfo";
import { getUserInfo } from "../controllers/users/usersInfo/getUserInfo";
import { logout } from "../controllers/users/logOut";
import changePassword from "../controllers/users/changePassword";

// route path and function
router.post("/", createUser);
router.post("/login", loginUser);

router.post("/completeUserInfo", completeUserInfo);
router.get("/getUserInfo", getUserInfo);
router.post("/logout", logout);
router.post("/changePassword", changePassword);

// export router
export default router;
