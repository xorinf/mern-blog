import exp, { response } from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
config({ path: "../.env", debug : true, quiet: true });

const app = exp();
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
