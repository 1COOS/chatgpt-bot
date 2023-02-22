import WebSocket from 'ws';
import config from '../utils/config';

const generateHash = () => {
  const chars = 'qwertyuopasdfghjklizxcvbnm0123456789';
  let hash = '';
  for (let i = 0; i < 11; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return {
    session_hash: hash,
    fn_index: 2,
  };
};

const generate = (prompt, cb, tryCount = 5) => {
  const client = new WebSocket(config.stableDiffusion.API_URL);
  const hash = generateHash();

  const tmr = setTimeout(() => {
    client.close();
    cb({
      error: true,
    });
  }, 120000);

  client.on('open', () => {
    console.log('ws connected!');
  });

  client.on('error', (err) => {
    console.log(err);
    cb({
      error: true,
    });
  });

  client.on('message', (message) => {
    const msg = JSON.parse('' + message);
    switch (msg.msg) {
      case 'send_hash':
        client.send(JSON.stringify(hash));
        break;
      case 'send_data':
        {
          const data = {
            data: [prompt, '', 9],
            ...hash,
          };
          client.send(JSON.stringify(data));
        }
        break;
      case 'process_completed':
        clearTimeout(tmr);
        try {
          const results = msg.output.data[0];
          cb({
            error: false,
            results,
          });
        } catch (e) {
          cb({
            error: true,
          });
        }
        break;
      case 'queue_full':
        if (tryCount <= 0) {
          cb({
            error: true,
          });
        } else {
          setTimeout(() => {
            generate(prompt, cb, tryCount - 1);
          }, 5000);
        }
    }
  });
};

export default {
  generate,
};
