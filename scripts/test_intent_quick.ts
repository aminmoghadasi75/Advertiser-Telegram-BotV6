import { detectIntent } from '../src/conversation/intentEngine';

const r1 = detectIntent('یک ماهه چنده؟');
console.log('detectIntent("یک ماهه چنده؟"):', r1);
