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
        console.error("Error creating ticket: " , error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTickets = async (req , res) => {
    try {
        const user = req.user;
        let tickets = [];
        if(user.role !== "user") {
            tickets = Ticket.find({})
                            .populate("assignedTo" , ["email" , "_id"])
                            .sort({ createdAt: -1 });
        } else {
            tickets = Ticket.find({ createdBy: user._id })
                            .select("title description status createdAt")
                            .sort({ createdAt: -1 })
        }
        return res.status(200).json({ tickets });
    } catch (error) {
        console.error("Error fetching ticket: " , error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}