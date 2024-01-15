import { Router } from "express";
const router = Router();

import createAncestriesPosts from "../controllers/ancestries_posts/upload";
import { getAncestriesPosts } from "../controllers/ancestries_posts/get";
import { getAncestriesPostById } from "../controllers/ancestries_posts/getById";
import { addComment } from "../controllers/ancestries_posts/addComment";
import { getAllAncestriesPosts } from "../controllers/ancestries_posts/getAll";
import { getCommentsByPostId } from "../controllers/ancestries_posts/getCommentsByPostId";

router.post("/", createAncestriesPosts);
router.get("/", getAncestriesPosts);
router.get("/getAncestriesPostById", getAncestriesPostById);
router.post("/addComment", addComment);
router.get("/getAllAncestriesPosts", getAllAncestriesPosts);
router.get("/getCommentsByPostId", getCommentsByPostId);

export default router;
