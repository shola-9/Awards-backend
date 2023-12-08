// import express
import express from "express";
const app = express();

// import cors
import cors from "cors";

// import dotenv
import dotenv from "dotenv";
dotenv.config();

// use cors
app.use(cors());

// use express.json
app.use(express.json());

// use urlencoded
app.use(express.urlencoded({ extended: true }));

// import the route
import postsRouter from "./routes/post";
import commentsRouter from "./routes/comments";
import nominateRouter from "./routes/nominate";
import shortVideosRouter from "./routes/shortVideos";
import userRouter from "./routes/user";
import clubRouter from "./routes/club";
import storyRouter from "./routes/story";

// create paths and use the imported routes
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/nominate", nominateRouter);
app.use("/api/v1/shortVideos", shortVideosRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/club", clubRouter);
app.use("/api/v1/story", storyRouter);

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
