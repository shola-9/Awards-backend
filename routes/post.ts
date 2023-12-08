// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import createPost from controllers as the function to be excuted via the route
import {
  createPost,
  // getAllPostsAndComments,
  getWinnersOnHomePage,
  getAllPostsWithTotalCommentNumber,
  getPostsByYear,
  getPostByIdWithComments,
  getPostsByTagPastHeros,
} from "../controllers/post";

// route path and function
router.post("/", createPost);
router.get("/getWinnersOnHomePage", getWinnersOnHomePage);
router.get(
  "/getAllPostsWithTotalCommentNumber",
  getAllPostsWithTotalCommentNumber
);
// router.get("/", getAllPostsAndComments);
router.get("/getPostsByYear", getPostsByYear);
router.get("/getPostByIdWithComments", getPostByIdWithComments);
router.route("/getPostsByTagPastHeros").get(getPostsByTagPastHeros);

// export router
export default router;
