function processDockerLogs (buffer) {

    let stdout = '';
    let stderr = '';
    let i = 0;

    while (i < buffer.length) {

        const streamType = buffer[i];

        const messageLength = buffer.readUInt32BE(i + 4);
        
        i = i + 8;

        if(streamType === 1) {
            stdout += buffer.toString('utf-8', i, i + messageLength);
        } else if (streamType === 2) {
            stderr += buffer.toString('utf-8', i, i + messageLength);
        }

        i += messageLength;
    }

    return {
        stdout: stdout.trim(),
        stderr: stderr.trim()
    }
}


export default processDockerLogs;