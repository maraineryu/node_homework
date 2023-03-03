const express = require("express");
const app = express();
const port = 3000;

const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
const connect = require("./schemas");
connect();

app.use(express.json());

app.use("/", [commentsRouter, postsRouter]);

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.use((req, res, next) => {
  res.status(400).send("데이터형식이 올바르지 않습니다.");
});
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
1;
