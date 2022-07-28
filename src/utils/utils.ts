import { exec } from 'child_process';

// from

export function execCmd(
  cmd: string,
  execOptions: any = {},
  rejectWithOutput = false,
  pipeOutput = false,
): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    if (process.env.VERBOSE === 'true') {
      console.debug('$ ' + cmd);
      pipeOutput = true;
    }

    const execProcess = exec(
      cmd,
      { maxBuffer: 1024 * 10000, ...execOptions },
      (err, stdout, stderr) => {
        if (process.env.VERBOSE === 'true') {
          console.debug(stdout.toString());
        }
        if (err || process.env.VERBOSE === 'true') {
          console.error(stderr.toString());
        }
        if (err) {
          if (rejectWithOutput) {
            reject([err, stdout.toString(), stderr.toString()]);
          } else {
            reject(err);
          }
        } else {
          resolve([stdout.toString(), stderr.toString()]);
        }
      },
    );

    if (pipeOutput) {
      if (execProcess.stdout) {
        execProcess.stdout.pipe(process.stdout);
      }
      if (execProcess.stderr) {
        execProcess.stderr.pipe(process.stderr);
      }
    }
  });
}
