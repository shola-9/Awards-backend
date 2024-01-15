// import express, { Request, Response } from "express";

// import connection from "../../../db/db";

// export const getCandidatesByAward: express.RequestHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const query = `
//       SELECT va.award_name, vac.vote_awards_candidate_names, vac.image
//       FROM vote_awards va
//       INNER JOIN vote_awards_candidates vac ON va.award_id = vac.award_id
//       ORDER BY va.award_id;
//     `;

//     const results = await new Promise<boolean>((resolve) => {
//       connection.query(
//         query,
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             resolve(false);
//           } else {
//             resolve(result.length > 0);
//           }
//         }
//       );
//     });

//     if (!results) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const awards = {};

//     for (const award of results) {
//       const awardName = award.award_name;

//       if (!awards[awardName]) {
//         awards[awardName] = {
//           name: awardName,
//           candidates: [],
//         };
//       }

//       awards[awardName].candidates.push({
//         name: award.vote_awards_candidate_names,
//         image: award.image,
//       });
//     }

//     res.status(200).json({ awards });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
