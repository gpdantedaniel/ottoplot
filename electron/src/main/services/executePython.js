import { spawn } from 'child_process'

export const executePython = (code) => {
  return new Promise((resolve, reject) => {
    const worker = spawn(
      "../python/.venv/bin/python",
      ["../python/runtime.py"],
      {cwd: "../workspace"}
    )
    
    let stdout = "";
    let stderr = "";

    worker.stdout.on("data", data => {
      stdout += data.toString();
    });

    worker.stderr.on("data", data => {
      stderr += data.toString();
    });

    worker.on("close", () => {
      if (stderr.length > 0) {
          reject(stderr);
          return;
      }
      resolve(JSON.parse(stdout));
    });

    worker.stdin.write(JSON.stringify({
      id: crypto.randomUUID(),
      code: code
    }));

    worker.stdin.end();
  })
}