// src/automation.ts
import { Client } from 'ssh2';

export interface SSHOptions {
  host: string;
  port?: number;
  username: string;
  password: string;
}

/**
 * Runs a shell command over SSH and returns stdout.
 */
function runCommand(opts: SSHOptions, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on('ready', () => {
        conn.exec(command, (err, stream) => {
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
        });
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

/**
 * (Optional) Existing individual controls.
 */
export async function startRecording(opts: SSHOptions): Promise<string> {
  const cmd = 'bash ~/start_recording.sh';
  return runCommand(opts, cmd);
}

export async function stopRecording(opts: SSHOptions): Promise<string> {
  const cmd = 'bash ~/stop_recording.sh';
  return runCommand(opts, cmd);
}

/**
 * 🔄 All‑in‑one: SSH in and run your full Python script.
 * Calls: python3 ~/gopro_script.py <vaultId> <duration>
 */
export async function recordAndUpload(
  opts: SSHOptions,
  vaultId: number,
  duration: number
): Promise<string> {
  const cmd = `python3 ~/gopro_script.py ${vaultId} ${duration}`;
  return runCommand(opts, cmd);
}
