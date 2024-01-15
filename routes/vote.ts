// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import createPost from controllers as the function to be excuted via the route
import { createAwards } from "../controllers/vote/createAwards";
import { addAwardCandidates } from "../controllers/vote/candidates/awardCandidates";
// import { getCandidatesByAward } from "../controllers/vote/candidates/getCandidatesByAward";
import { getAll } from "../controllers/vote/award/getAll";
import { getAwardCandidates } from "../controllers/vote/award/getAwardCandidates";
import { addVote } from "../controllers/vote/voting/addVote";
import { getRankingByAward } from "../controllers/vote/voting/getRankingByAward";

// route path and function
router.post("/", createAwards);
router.post("/addAwardCandidates", addAwardCandidates);
// router.get("/getCandidatesByAward", getCandidatesByAward);
router.get("/", getAll);
router.get("/getAwardCandidates", getAwardCandidates);
router.post("/addVote", addVote);
router.get("/getRankingByAward", getRankingByAward);

// export router
export default router;
