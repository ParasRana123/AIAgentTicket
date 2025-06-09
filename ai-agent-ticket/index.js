import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {serve} from "inngest/express";
import userRoutes from "./routes/user";
import ticketRoutes from "./routes/ticket";
import {inngest} from "./inngest/client";
import { onUserSignUp } from "./inngest/functions/on-signup";
import { onTicketCreated } from "./inngest/functions/on-create-ticket";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth" , userRoutes);
app.use("/api/tickets" , ticketRoutes);

// Route for inngest
app.use("/api/inngest",serve({
    client: inngest,
    functions: [onUserSignUp , onTicketCreated]
}))

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connection succeeded");
            app.listen(PORT , () => {
                console.log("Server up at http://localhost:3000");
            })
        })
        .catch((err) => console.error("MongoDB error: " , err));