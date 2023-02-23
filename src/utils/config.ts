import { config } from 'dotenv';

config({ path: '.env' });

export default {
  app: {
    ENABLE_DISCORD: process.env.ENABLE_DISCORD,
    ENABLE_TELEGRAM: process.env.ENABLE_TELEGRAM,
  },
  discord: {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    ENABLE_DIRECT_MESSAGE: true,
    ENABLE_EMBED_MESSAGE: true,
    MAX_RESPONSE_CHUNK_LENGTH: 1500,
  },
  telegram: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  },
  openai: {
    OPENAI_KEY: process.env.OPENAI_KEY,
  },
  stableDiffusion: {
    API_URL: 'wss://stabilityai-stable-diffusion.hf.space/queue/join',
    // "wss://runwayml-stable-diffusion-v1-5.hf.space/queue/join"
  },
  logger: {
    level: 'debug',
  },
};
