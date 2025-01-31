import { Schema, model } from "mongoose";

const codeSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    lang: { 
        type: String,
        enum:["cpp", "java", "python"],      // can be c++, java, python
        required: true 
    },
    stdInput: {
        type: String,
    },
    stdOutput: {
        type: String,
    },
    stdError: {
        type: String,
    },
    status: {                // has to be enum 
        type: String,
        enum: ["pending", "completed"],
        required: true,
        default: "pending"
    }
},
{
    timestamps: true
});

const Code = model("Code", codeSchema);

export default Code;
