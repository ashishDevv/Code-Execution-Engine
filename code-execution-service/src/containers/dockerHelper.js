import Docker from 'dockerode';
import getDockerSocketPath from './hostOS.js';

const docker = new Docker({ socketPath: getDockerSocketPath() });

async function createContainer(imageName, cmd, containerId) {

    try {
        const container = await docker.createContainer({
            Image: imageName,
            Cmd: cmd,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: true,
            Tty: false,
            name: containerId,
            HostConfig: {
                AutoRemove: true,
                Memory: 200 * 1024 * 1024, // 30MB memory limit
                NetworkMode: 'none', // Disable network access
                // PidsLimit: 13,
                Ulimits: [
                    {
                        Name: "cpu",      // cpu time limit
                        Soft: 2,
                        Hard: 3
                    },
                    {
                        Name: "nproc",      // number of processes limit
                        Soft: 5,
                        Hard: 5
                    }
                ],
                // CpuPeriod: 1000,         // 1ms
                // CpuQuota: 1000,
            }
        })

        return container;
    } catch (error) {
        console.error(`Error in creating container: ${error}`);
        throw error;

    }

}


async function pullImage(imageName) {
    try {
        console.log(`Pulling Dockerimage: ${imageName}`);
        const stream = await docker.pull(imageName);
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err, res) => {
                if (err) {
                    reject(new Error(`Error in pulling image: ${err.message}`));
                } else {
                    console.log(`Image pulled successfully: ${imageName}`);
                    resolve(res);
                }
            });
        });
    } catch (error) {
        console.error(`Error pulling image ${imageName}:`, error.message);
        throw error;
    }
}




async function streamContainerLogs(container) {

    try {

        // Fetch logs from the container
        const logsStream = await container.logs({
            stdout: true, // To Capture stdout
            stderr: true, // To Capture stderr
            follow: true, // To Continuously stream logs
            since: 0
            // tail: 100,    // To Limit to the last 100 lines of logs
        });

        return new Promise((resolve, reject) => {
       
            const completeBuffer = [];     // To collect all the chunks

            // const timeoutId = setTimeout(async () => {                   // To kill the container if it exceeds the time limit
            //     try {
            //         await container.kill();
            //         stderr += '\nError: Time Limit Exceeded';
            //         resolve({ stdout, stderr });
            //     } catch (error) {
            //         console.error('Error killing container:', error);
            //         reject(new Error('Time Limit Exceeded'));
            //     }
            // }, 1500); 

            logsStream.on('data', (chunk) => {
                completeBuffer.push(chunk);
            })

            logsStream.on('end', () => {
                // clearTimeout(timeoutId);
                console.log('Log streaming finished.');
                resolve(Buffer.concat(completeBuffer));

            });

            logsStream.on('error', (err) => {
                // clearTimeout(timeoutId);
                console.error('Error in log streaming:', err);
                reject(new Error('Error in Streaming Logs'));
            });
        })

    } catch (err) {
        console.error('Error in fetching logs:', err);
        throw err;
    }
}


export { createContainer, pullImage, streamContainerLogs };