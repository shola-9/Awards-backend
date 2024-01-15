// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import createPost from controllers as the function to be excuted via the route
import { postChat } from "../controllers/chat/post";
import { getChat } from "../controllers/chat/get";

// route path and function
router.post("/", postChat);
router.get("/", getChat);
// export router
export default router;
