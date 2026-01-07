import express from "express";
import cors from "cors";
import morgan from "morgan";
import { GENERAL } from "./config/constants";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.get("/",(req,res) => {
    return res.status(200).send({message:GENERAL.SERVER_RUNNING});
})

export default app;
