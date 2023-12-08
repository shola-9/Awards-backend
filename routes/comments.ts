// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import the necessary functions from comments controller
import { createComment } from "../controllers/postComments";

// route path and function
router.post("/", createComment);

// export router
export default router;
