<a name="readme-top"></a>
<h1 align="center">🤖 ChatGPT-BOT </h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
   <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> Get a discord bot and a telegram bot in a few steps  

## Features
- [x] Private conversation 
- [x] Group conversation
- [x] Generate images according to prompts
- [x] Export response messages to file
- [x] Support Dockerfile to deploy.
- [ ] Other

## Screenshot
<p>
  <img width="700" src="./assets/screenshot_v1.png" alt="screenshot">
</p>

## Prerequisites

[![node](https://img.shields.io/badge/node-%3E%3D16-green)](https://nodejs.org/)

You should install `pnpm` (recommended) or `yarn` or `npm` in your local system.


## How to run

### *Locally*

1. Clone the repo
   ```sh
   $ git clone git@github.com:1COOS/chatgpt-bot.git
   ```
2. Config environment variables
   
   Copy `.env.example` to `.env`
   ```properties
   ENABLE_DISCORD = true
   ENABLE_TELEGRAM = false
   DISCORD_BOT_TOKEN = your_discord_token
   DISCORD_CLIENT_ID = your_discord_client_id
   TELEGRAM_BOT_TOKEN = your_discord_token
   OPENAI_KEY = your_openai_key
   ```
3. Start the bot
   ```sh
   # Install dependencies
   $ pnpm i

   # Start the bot
   $ pnpm run run

   # Or run in the dev mode
   $ pnpm run dev

   # Or run in pm2 - https://pm2.keymetrics.io
   $ pnpm run run:pm2
   ```

### *Docker*
1. Pull the docker image
   ```sh
   $ docker pull 1coos/chatgpt-bot:latest
   ``` 

2. Start docker container
   ```sh
   $ docker run -d \
      --name=chatgpt-bot \
      -e TZ=Etc/UTC \
      -e ENABLE_DISCORD = true \
      -e ENABLE_TELEGRAM = true \
      -e DISCORD_BOT_TOKEN = your_discord_token \
      -e DISCORD_CLIENT_ID = your_discord_client_id \
      -e TELEGRAM_BOT_TOKEN = your_telegram_token \
      -e OPENAI_KEY = your_openai_key \
      --restart unless-stopped \
      1coos/chatgpt-bot:latest
   ```

   or you can run docker with docker-compose


   ```yaml
   version: '3.9'
   services:
      chatgpt-bot:
      image: 1coos/chatgpt-bot:latest
      container_name: chatgpt-bot
      environment:
         ENABLE_DISCORD: true
         ENABLE_TELEGRAM: false
         DISCORD_BOT_TOKEN: [your_discord_token]
         DISCORD_CLIENT_ID: [your_discord_client_id]
         TELEGRAM_BOT_TOKEN: [your_telegram_token]
         OPENAI_KEY: [your_openai_key]
      restart: unless-stopped 
   ```


## Contributing 👏🏻 

>If you have a suggestion that would make this better, please fork the repo and create a pull request. 
>
>Don't forget to give the project a star! Thanks again! 🍵


## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Contact

1COOS - [Discord](https://discord.gg/nxWJGvfq) - 1coosgroup@gmail.com

<p align="right">[<a href="#readme-top">back to top</a>]</p>




