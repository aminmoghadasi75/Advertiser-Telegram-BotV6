import { detectIntent } from '../src/conversation/intentEngine';

const history = [
  { sender: 'stranger' as const, text: 'سلام فیلترشکن با پینگ زیر ۸۰ برای وارزون داری؟' },
  { sender: 'me_melody' as const, text: 'سلام آره سرورهای گیمینگ پینگ ۶۰ داریم' }
];

const r = detectIntent('یک ماهه چنده؟', history);
console.log('With history:', r);
