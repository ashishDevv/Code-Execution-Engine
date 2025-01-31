import Code from "../models/codeModel.js";
import codeSubmissionQueue from "../queues/codeSubmissionQueue.js";

async function submitCode(req, res) {

    try {
        let { code, lang, stdInput } = req.body;
    
        if (!code || !lang) {
            return res.status(400).json({ error: "Code and language are required" });
        }
        if(!stdInput) {
            stdInput = ""
        }

        const codeSubmission = await Code.create({ code, lang, stdInput, stdOutput: "", stdError: "" });

        console.log("Submission added to DB successfully");

        const response = await codeSubmissionQueue.add("code-submission", { codeSubmissionId: codeSubmission._id });

        console.log("Job added to Queue successfully")

        res.status(201).json({ message: "Code submission queued successfully", codeSubmissionId: codeSubmission._id });

    } catch (error) {
        console.error("Error submitting Job to Queue", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



async function checkResult (req, res) {
    try {
        const { submissionId } = req.params;

        const codeSubmission = await Code.findById(submissionId);

        if (!codeSubmission) {
            return res.status(404).json({ error: "Code submission not found" });
        }

        if (codeSubmission.status === "pending") {
            return res.status(200).json({ message: "Code execution is still pending" });
        }

        
        return res.status(200).json(codeSubmission);

    } catch (error) {
        console.error("Error checking result", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default { submitCode, checkResult };






