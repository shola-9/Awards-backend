// import express
import express from "express";
import helmet from "helmet";

// import http
import http from "http";

// // import cors
import cors from "cors";

// // import dotenv
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);

dotenv.config();

app.use(helmet());
// // use cors
app.use(cors());

// // use express.json
app.use(express.json());

// // use urlencoded
app.use(express.urlencoded({ extended: true }));

// // import the route
import postsRouter from "./routes/post";
import commentsRouter from "./routes/comments";
import nominateRouter from "./routes/nominate";
import shortVideosRouter from "./routes/shortVideos";
import userRouter from "./routes/user";
import clubRouter from "./routes/club";
import storyRouter from "./routes/story";
import chatRouter from "./routes/chat";
import ancestriesRouter from "./routes/ancestries_posts";
import voteRouter from "./routes/vote";

// // create paths and use the imported routes
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/nominate", nominateRouter);
app.use("/api/v1/shortVideos", shortVideosRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/club", clubRouter);
app.use("/api/v1/story", storyRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/ancestries", ancestriesRouter);
app.use("/api/v1/vote", voteRouter);

// start the server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
