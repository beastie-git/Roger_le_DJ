# Roger le DJ

version : 1.0.0  
author : beastie  
mail : beastie@unixyourbrain.org  

## How To :

### create a node folder :
```
mkdir Roger_le_DJ
cd  Roger_le_DJ
node init
```

### add the folloing nodes libraries
discord.js https://www.npmjs.com/package/discordjs-stable  
ytdl-core https://www.npmjs.com/package/ytdl-core  
scrape-yt https://www.npmjs.com/package/scrape-yt  
@discord/opus https://www.npmjs.com/package/@discordjs/opus (you need to have make and g++ installed)  
```
npm install --save discordjs
npm install --save ytdl-core
npm install --save scrape-yt
npm install --save @discord/opus
```

### install ffmpeg on your distribution
```
aptitude install ffmpeg
```

### create an discord bot on your discord api interface :
https://discord.com/developers/applications

### Generate an invite link and add the bot to your discord server
https://discordapi.com/permissions.html

### Take your own token and replace it on line 26 of index.js
```js
bot.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
```

### launch the bot
```
nodejs index.js
```

## Ressources : 
https://grafikart.fr/tutoriels/bot-discordjs-892
