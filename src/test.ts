import { startRecording, stopRecording, recordAndUpload, SSHOptions } from './automation';

const opts: SSHOptions = {
  host: '192.168.1.42',   // ← your Pi’s IP
  username: 'vault',      // ← your Pi username
  password: 'yourPasswordHere',  // ← your Pi password
};

async function runTest() {
  try {
    console.log('▶️  Testing startRecording…');
    console.log(await startRecording(opts));

    await new Promise(r => setTimeout(r, 5000));

    console.log('⏹  Testing stopRecording…');
    console.log(await stopRecording(opts));

    await new Promise(r => setTimeout(r, 5000));

    console.log('🔄 Testing recordAndUpload…');
    console.log(await recordAndUpload(opts, 1, 15));
  } catch (err) {
    console.error('❌  Test error:', err);
  }
}

runTest();
