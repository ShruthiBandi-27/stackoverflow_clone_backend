import express from "express";
import {
  MongoClient
} from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
//const API = process.env.API;

//create connection
async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Connected to mongodb");
    return client;
  }
  
  export const client = await createConnection();
  app.use(express.json());
  app.use(cors())
  
  app.get("/", (req, res) => {
    res.send("<h1>Hello,😊<br> Stack Overflow</h1>");
  });


//Get questions
app.get("/questions", async (req, res) => {
  console.log("get questions api new");
  const questions = await client
    .db("stackoverflow")
    .collection("questions")
    .find({})
    .toArray();
    console.log(questions);
  res.status(200).send(questions);
});

//Posting question
  app.post("/ask-question", async (req, res) => {
    console.log("Posting question api");
    console.log(req);
    const {title, body, tags, user} = req.body;
    const createdAt = new Date();
    console.log(`title: ${title}, body: ${body}, tags: ${tags}, user : ${user}`);
      //Posting the question
      await client
        .db("stackoverflow")
        .collection("questions")
        .insertOne({
            title: title,
            body: body,
            tags: tags,
            user: user,
            created_at: createdAt
        });
      res.status(200).send({
        message: "Question Posted"
      });
 
  });

//Posting answer
  app.post("/answer", async (req, res) => {
    const {question_id, answer, user} = req.body;
    const createdAt = new Date();
    console.log(`question_id: ${question_id}, answer: ${answer}, user : ${user}`);
      //Posting the question
      await client
        .db("stackoverflow")
        .collection("answers")
        .insertOne({
          question_id: question_id,
          answer: answer,
          user: user,
          created_at: createdAt
        });
      res.status(200).send({
        message: "Answer Posted"
      });
 
  });

  //Posting comment
  app.post("/:id", async (req, res) => {
    const {comment, user} = req.body;
    const createdAt = new Date();
    console.log(`id: ${req.params.id}, comment: ${comment}, user : ${user}`);
      //Posting the question
      await client
        .db("stackoverflow")
        .collection("comments")
        .insertOne({
          question_id: req.params.id,
          comment: comment,
          user: user,
          created_at: createdAt
        });
      res.status(200).send({
        message: "Comment Posted"
      });
 
  });

  app.listen(PORT, () => {
    console.log(`The server is listing on port ${process.env.PORT}`);
  });
  
  console.log("end of index.js");