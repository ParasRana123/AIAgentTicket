import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connection succeeded");
            app.listen(PORT , () => {
                console.log("Server up at http://localhost:3000");
            })
        })
        .catch((err) => console.error("MongoDB error: " , err));