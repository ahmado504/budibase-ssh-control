var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/automation.ts
import { Client } from 'ssh2';
/**
 * Internal helper to run any shell command over SSH.
 */
function runCommand(opts, command) {
    return new Promise((resolve, reject) => {
        var _a;
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
                stream.on('data', (data) => {
                    stdout += data.toString();
                });
                stream.stderr.on('data', (data) => {
                    stderr += data.toString();
                });
                stream.on('close', (code) => {
                    conn.end();
                    if (code === 0) {
                        resolve(stdout.trim());
                    }
                    else {
                        reject(new Error(`Exit ${code}: ${stderr.trim()}`));
                    }
                });
            });
        })
            .on('error', reject)
            .connect({
            host: opts.host,
            port: (_a = opts.port) !== null && _a !== void 0 ? _a : 22,
            username: opts.username,
            password: opts.password,
        });
    });
}
/**
 * Starts the GoPro recording by invoking the remote script.
 */
export function startRecording(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        // Adjust the path to wherever your start script lives on the Pi:
        const cmd = 'bash /home/pi/start_recording.sh';
        return runCommand(opts, cmd);
    });
}
/**
 * Stops the GoPro recording by invoking the remote script.
 */
export function stopRecording(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        // Adjust the path to wherever your stop script lives on the Pi:
        const cmd = 'bash /home/pi/stop_recording.sh';
        return runCommand(opts, cmd);
    });
}
