import { PYTHON_IMAGE, JAVA_IMAGE, CPP_IMAGE } from "./images.js"


export function getCommand(code, language, input) {
    switch (language.toLowerCase()) {
        case 'python':
            return `cd home && echo '${code.replace(/'/g, `'\\"`)}' > main.py && echo '${input.replace(/'/g, `'\\"`)}' | python3 main.py`;
        case 'java':
            return `cd home && echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${input.replace(/'/g, `'\\"`)}' | java Main`;
        case 'cpp':
            return `cd home && echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${input.replace(/'/g, `'\\"`)}' | ./main`;
        default:
            throw new Error('Unsupported language');
    }
}


export function getImage(language) {
    switch (language.toLowerCase()) {
        case 'python':
            return PYTHON_IMAGE;
        case 'java':
            return JAVA_IMAGE;
        case 'cpp':
            return CPP_IMAGE;
        default:
            throw new Error('Unsupported language');
    }
}

