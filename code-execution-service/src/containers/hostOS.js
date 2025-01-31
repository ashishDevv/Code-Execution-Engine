function getDockerSocketPath() {
    const hostOS = process.env.HOST_OS;    // Get the value of HOST_OS from environment variable, and don't need dotenv setup , because it directly taken from docker-compose.yaml file

    if (hostOS === 'linux') {
        return '/var/run/docker.sock';                     // Unix socket for Linux
    } else if (hostOS === 'windows' || hostOS === 'macos') {
        return 'tcp://host.docker.internal:2375';         // TCP for Windows and macOS
    } else {
        throw new Error('Unsupported platform');
    }
}


export default getDockerSocketPath;


// supported host OS are 
//    linux
//    windows
//    macos