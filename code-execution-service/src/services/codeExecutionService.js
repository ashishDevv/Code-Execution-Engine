import { v4 as uuidv4 } from 'uuid';
import dbConfig from '../config/dbConfig.js';
import { createContainer, streamContainerLogs } from '../containers/dockerHelper.js';
import { getCommand, getImage } from '../containers/languageOption.js'
import processDockerLogs from '../containers/logsProcessor.js';




async function executeCode(code, language, input) {

    // console.log("code", code);
    // console.log("language", language);
    // console.log("input", input);

    try {
        const image = getImage(language)

        const command = getCommand(code, language, input)

        const containerId = uuidv4()

        const container = await createContainer(image, ['/bin/sh', '-c', command], containerId)

        console.log(`Container created successfully.`);

        await container.start()

        console.log(`Container started successfully.`);

        const logs = await streamContainerLogs(container)

        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);

        const processedLogs = processDockerLogs(logs)    // processedLogs: {stdout: , stderr: }

        return processedLogs;


    } catch (error) {
        console.error('Error in executing code:', error);
        throw error;
    }
}


async function jobHandler(job) {

    try {
        // get code submission id from job data
        const codeSubmissionId = await job.data.codeSubmissionId

        // get code submission from database
        const codeSubmission = await dbConfig.getCodeSubmissionById(codeSubmissionId)

        if (!codeSubmission) {
            throw new Error("Code Submission not found")
        }
        const { code, lang, stdInput } = codeSubmission


        // execute code using docker container
        const result = await executeCode(code, lang, stdInput)


        console.log("-------------RESULT-------------");


        console.log("stdout:", result.stdout);  // Log stdout separately
        console.log("stderr:", result.stderr);  // Log stderr separately

        

        // save result to database
        await dbConfig.updateCodeSubmission(codeSubmissionId, result)

        return "success"

    } catch (error) {
        console.error("Error in jobHandler", error);
        throw error;
    }
}




export default jobHandler;
