// import mysql
import mysql from "mysql";

// import dotenv
import dotenv from "dotenv";
dotenv.config();

// create connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "award",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  }
  console.log("db " + connection.state);
});

export default connection;
