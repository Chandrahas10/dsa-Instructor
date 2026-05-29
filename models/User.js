import mongoose from "mongoose";
import { type } from "node:os";

const UserSchema = new mongoose.Schema(
    {
        _id:{type : String,
            required:true
        },
        name:{type : String,
            required:true
        },
        email:{type : String,
            required:true
        },
        image:{type : String,
            required:true
        }
    },{timestamps:true}
);

const User = mongoose.models.User || mongoose.model("User",UserSchema)

export default User;