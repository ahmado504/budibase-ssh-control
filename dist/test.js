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
const automation_1 = require("./automation");
const opts = {
    host: '192.168.1.42',
    username: 'vault',
    password: 'yourPasswordHere', // ← your Pi password
};
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('▶️  Testing startRecording…');
            console.log(yield (0, automation_1.startRecording)(opts));
            yield new Promise(r => setTimeout(r, 5000));
            console.log('⏹  Testing stopRecording…');
            console.log(yield (0, automation_1.stopRecording)(opts));
            yield new Promise(r => setTimeout(r, 5000));
            console.log('🔄 Testing recordAndUpload…');
            console.log(yield (0, automation_1.recordAndUpload)(opts, 1, 15));
        }
        catch (err) {
            console.error('❌  Test error:', err);
        }
    });
}
runTest();
