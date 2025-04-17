"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAndUpload = exports.stopRecording = exports.startRecording = void 0;
const ssh2_1 = require("ssh2");
function runCommand(opts, command) {
    return new Promise((resolve, reject) => {
        var _a;
        const conn = new ssh2_1.Client();
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
                    if (code === 0)
                        resolve(stdout.trim());
                    else
                        reject(new Error(`Exit ${code}: ${stderr.trim()}`));
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
/** Start-only recording via shell script */
function startRecording(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return runCommand(opts, 'bash ~/start_recording.sh');
    });
}
exports.startRecording = startRecording;
/** Stop-only recording via shell script */
function stopRecording(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return runCommand(opts, 'bash ~/stop_recording.sh');
    });
}
exports.stopRecording = stopRecording;
/** Full record → download → upload via Python script */
function recordAndUpload(opts, vaultId, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = `python3 ~/gopro_script.py ${vaultId} ${duration}`;
        return runCommand(opts, cmd);
    });
}
exports.recordAndUpload = recordAndUpload;
