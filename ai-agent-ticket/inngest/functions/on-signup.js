import { NonRetriableError } from "inngest";
import User from "../../models/user";
import { inngest } from "../client";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup" , retries: 2 },
    { event: "user/signup" },

    async ({event , step}) => {
        try {
            const {email} = event.data
            const user = await step.run("get-user-email" , async() => {
                const userObject = await User.findOne({email});
                if(!userObject) {
                    throw new NonRetriableError("User no longer exists in the DB");
                }
                return userObject;
            })
        } catch(error) {

        }
    }
)