import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth" , userRoutes);

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connection succeeded");
            app.listen(PORT , () => {
                console.log("Server up at http://localhost:3000");
            })
        })
        .catch((err) => console.error("MongoDB error: " , err));