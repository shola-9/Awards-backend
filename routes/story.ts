// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import the function to be excuted from the controller
import { createStory } from "../controllers/story/upload";
import { getStory } from "../controllers/story/get";
import { getStoryByUserId } from "../controllers/story/getByUserId";
import { getStoryByStoryId } from "../controllers/story/getByStoryId";

// route path and function
router.post("/", createStory);
router.get("/", getStory);
router.get("/getStoryByUserId", getStoryByUserId);
router.get("/getStoryByStoryId", getStoryByStoryId);

// export router
export default router;
