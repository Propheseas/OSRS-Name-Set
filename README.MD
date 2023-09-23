# RSN Name Change Bot

Because it's been requested multiple times and Grams doesn't mind, I have created a public source code for the name-change part we enforce within Star Miners discord.

## How to use
1. Clone or download this repository
2. run `npm install`
3. Copy `config.example.json` to `config.json`
4. Get yourself a discord bot token here: https://discord.com/developers/applications. MAKE SURE TO ENABLE "MESSAGE CONTENT" PRIVILEGED GATEWAY
5. Fill in the fields in `config.json`
6. run `npm start` to run the bot.

## Required permissions
The bot requires the following;
- Message content privileged gateway
- Manage nicknames
- Manage members
- Manage messages on the RSN channel

Also make sure the role you want to apply is BELOW the role of the bot in your server's roles. Otherwise the bot cannot apply it.

## I DonT knoW TypEsCript
Learn it! it's a great addition to javascript.  
You can run `npx tsc` to convert the typescript code to javascript code.

## Support
This code is as-is and support is not provided. The code should contain enough comments to guide you on your way.