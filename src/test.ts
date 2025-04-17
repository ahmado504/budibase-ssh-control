// src/test.ts
import { startRecording, stopRecording, SSHOptions } from './automation';

const opts: SSHOptions = {
  host: '192.168.1.146',       // ← your Pi’s IP
  username: 'vault',
  password: 'polevault62',
};

async function runTest() {
  try {
    console.log('▶️  Starting recording…');
    console.log(await startRecording(opts));

    // wait 10s to simulate a session
    await new Promise(r => setTimeout(r, 10000));

    console.log('⏹  Stopping recording…');
    console.log(await stopRecording(opts));
  } catch (err) {
    console.error('❌  Test error:', err);
  }
}

runTest();
