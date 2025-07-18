import { NonRetriableError } from "inngest";
import User from "../../models/user";
import { inngest } from "../client";
import { sendMail } from "../../utils/mailer";
import Ticket from "../../models/ticket"
import analyseText from "../../utils/ai";

export const onCreateTicket = inngest.createFunction(
    { id: "on-ticket-created" , retries: 2 },
    { event: "ticket/created" },

    async ({event , step}) => {
        try {
            const {ticketId} = event.data

            // fetch the ticket from DB
            const ticket = await step.run("fetch-ticket" , async () => {
                const ticketObject = await Ticket.findById(ticketId);
                if(!ticketObject) {
                    throw new NonRetriableError("Ticket not found");
                }
                return ticketObject;
            })

            await step.run("update-ticket-status" , async () => {
                await Ticket.findByIdAndUpdate(ticket._id , {
                    status: "TODO"
                })
            })

            const aiResponse = await analyseText(ticket);

            const relatedSkills = await step.run("ai-processing" , async () => {
                let skills = [];
                if(aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id , {
                        priority: !["low" , "medium" , "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills
                    })
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            })

            const moderator = await step.run("assign-moderator" , async () => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i",
                        }
                    }
                })
                if(!user) {
                    user = await User.findOne({
                        role: "admin"
                    })
                }
                await Ticket.findByIdAndUpdate(ticket._id , {
                    assignedTo: user?._id || null
                })
                return user;
            })

            await step.run("send-email-notification" , async () => {
                if(moderator) {
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendMail(
                        moderator.email,
                        "Ticket assigned",
                        `A new ticket is assigned to you ${finalTicket.title}`
                    )
                }
            })
            return { success: true };

        } catch(error) {
            console.log("Error runnig the step: " , error.message);
            return { success: false };
        }
    }
)