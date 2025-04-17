// src/automation.ts
import { Client, ClientChannel } from 'ssh2';

export interface SSHOptions {
  host: string;
  port?: number;
  username: string;
  password: string;
}

function runCommand(opts: SSHOptions, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on('ready', () => {
        conn.exec(
          command,
          (err: Error | undefined, stream: ClientChannel) => {
            if (err) {
              conn.end();
              return reject(err);
            }
            let stdout = '';
            let stderr = '';
            stream.on('data', (data: Buffer) => {
              stdout += data.toString();
            });
            stream.stderr.on('data', (data: Buffer) => {
              stderr += data.toString();
            });
            stream.on('close', (code: number) => {
              conn.end();
              if (code === 0) resolve(stdout.trim());
              else reject(new Error(`Exit ${code}: ${stderr.trim()}`));
            });
          }
        );
      })
      .on('error', reject)
      .connect({
        host: opts.host,
        port: opts.port ?? 22,
        username: opts.username,
        password: opts.password,
      });
  });
}

// … your existing exports …
