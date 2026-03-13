import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { userAPP } from "./APIs/UserAPI.js";
import { authorAPP } from "./APIs/AuthorAPI.js";
import { adminAPP } from "./APIs/AdminAPI.js";
import {commonAPP} from "./APIs/CommonAPI.js"

config({ path: "../.env", debug: true, quiet: true });

const app = exp();

// use body parser
app.use(exp.json())

//path level middlewares
app.use("/user-api", userAPP);
app.use("/author-api", authorAPP);
app.use("/admin-api", adminAPP);
app.use("/auth", commonAPP)

// port and db 
const port = process.env.PORT || 9110;
const db_address = process.env.DB_ADDRESS;

//start server and connect to DB
try {
  await connect(db_address);
  console.log(`The DataBase is connected!`);
  app.listen(port, () => console.log(`server listning at port : ${port} ...`));
} catch (err) {
  console.log("con refused :", err);
}
//handle invalid path
app.use((response, request, next) => {
  console.log("ERROR : INVALID URL");
  return response.status(404).json({ message: "Invalid URL" });
});
//handle errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
});
