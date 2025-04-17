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

/** Start-only recording via shell script */
export async function startRecording(opts: SSHOptions): Promise<string> {
  return runCommand(opts, 'bash ~/start_recording.sh');
}

/** Stop-only recording via shell script */
export async function stopRecording(opts: SSHOptions): Promise<string> {
  return runCommand(opts, 'bash ~/stop_recording.sh');
}

/** Full record → download → upload via Python script */
export async function recordAndUpload(
  opts: SSHOptions,
  vaultId: number,
  duration: number
): Promise<string> {
  const cmd = `python3 ~/gopro_script.py ${vaultId} ${duration}`;
  return runCommand(opts, cmd);
}
