// import Router from express to create routes
import { Router } from "express";
const router = Router();

// import createNomination from controllers as the function to be excuted via the route
import {
  createNomination,
  getNominations,
  createShowcasedNominationsOnTheNominationPage,
  getShowcasedNominationsOnTheNominationPage,
} from "../controllers/nominate";

// route path and function
router.post("/", createNomination);
router.get("/", getNominations);
router.post(
  "/createShowcasedNominationsOnTheNominationPage",
  createShowcasedNominationsOnTheNominationPage
);
router.get(
  "/getShowcasedNominationsOnTheNominationPage",
  getShowcasedNominationsOnTheNominationPage
);

// export router
export default router;
