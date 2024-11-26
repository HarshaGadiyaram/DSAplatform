import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runCpp(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];

  console.log("Initialising a new cpp docker container");
  await pullImage(CPP_IMAGE);
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | ./main`;
  console.log(runCommand);
  const cppDockerContainer = await createContainer(CPP_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);

  await cppDockerContainer.start();

  console.log("Started the docker container");

  const loggerStream = await cppDockerContainer.logs({
    stdout: true,
    stderr: true,
    timestamps: false,
    follow: true,
  });

  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  const response = await new Promise((res) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      console.log(decodedStream.stdout);
      res(decodedStream);
    });
  });

  await cppDockerContainer.remove();
  return response;
}

export default runCpp;
