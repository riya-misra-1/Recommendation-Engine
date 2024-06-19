import * as readline from "readline";

export function getInputFromClient(promptMessage = ""): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (input) => {
      rl.close();
      resolve(input.trim());
    });
  });
}
