import Ticket from "../models/ticket";
import { inngest } from "../inngest/client";

export const createTicket = async (req , res) => {
    try {
        const { title , description } = req.body;
        if(!title || !description) {
            res.status(400).json({ message: "Title and Description are required" });
        }
        const newTicket = Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })

        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: (await newTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });

        return res.status(201).json({
            message: "Ticket created and processing started.",
            ticket: newTicket
        })
    } catch (error) {
        console.error("Error creating a ticket: " , error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}