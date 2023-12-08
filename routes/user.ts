// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import the necessary functions from comments controller
import { createUser } from "../controllers/users/createUser";
import { loginUser } from "../controllers/users/login";
import { createUserInfo } from "../controllers/users/usersInfo/postUserInfo";
import { getUserInfo } from "../controllers/users/usersInfo/getUserInfo";
import { logout } from "../controllers/users/logOut";

// route path and function
router.post("/", createUser);
router.post("/login", loginUser);

router.post("/createUserInfo", createUserInfo);
router.get("/getUserInfo", getUserInfo);
router.post("/logout", logout);

// export router
export default router;
