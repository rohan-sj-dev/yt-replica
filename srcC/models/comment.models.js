import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const userSchema = new Schema({
    content: {
        type: String
    },
    video: {
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
},
{timestamps: true}
)

userSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", userSchema)