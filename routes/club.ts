import { Router } from "express";
const router = Router();

// import the function to be excuted from the controller
import { createClub } from "../controllers/club/createClub";
import { getClubById } from "../controllers/club/getClubById";
import { getClubOptions } from "../controllers/club/getClubOptions";
import createClubPost from "../controllers/club/createClubPost";
import { getClubPost } from "../controllers/club/getClubPost";
import { increaseClubPostLikes } from "../controllers/club/increaseClubPostLikes";
import { decreaseClubPostLikes } from "../controllers/club/decreaseClubPostLikes";
import { getClubPostByUserId } from "../controllers/club/getClubPostByUserId";
import { createClubMember } from "../controllers/club/createClubMember";
import { getClubMember4JoinBtn } from "../controllers/club/getClubMembers4JoinBtn";
import { deleteClubMember } from "../controllers/club/deleteClubMember";
import { getClubMembers } from "../controllers/club/getClubMembers";
import { increaseClubPostViews } from "../controllers/club/updateClubPostViews";
import { postCommentToPost } from "../controllers/club/postCommentToPost";
import { searchForClub } from "../controllers/club/searchClub";
import { getGroupsByMemberId } from "../controllers/club/getGroupsByMemberId";

router.route("/").post(createClub);
router.route("/getClubById").get(getClubById);
router.route("/getClubOptions").get(getClubOptions);
router.route("/createClubPost").post(createClubPost);
router.route("/getClubPost").get(getClubPost);
router.route("/increaseClubPostLikes").put(increaseClubPostLikes);
router.route("/decreaseClubPostLikes").put(decreaseClubPostLikes);
router.route("/getClubPostByUserId").get(getClubPostByUserId);
router.route("/createClubMember").post(createClubMember);
router.route("/getClubMember4JoinBtn").get(getClubMember4JoinBtn);
router.route("/deleteClubMember").delete(deleteClubMember);
router.route("/getClubMembers").get(getClubMembers);
router.route("/increaseClubPostViews").put(increaseClubPostViews);
router.route("/postCommentToPost").post(postCommentToPost);
router.route("/searchForClub").get(searchForClub);
router.route("/getGroupsByMemberId").get(getGroupsByMemberId);

export default router;
