# Roger le DJ

version : 1.0.0 author : \
beastie mail : \
beastie@unixyourbrain.org \
licence : gpl v3

## How To :
### Requirement :
nodejs v12.x or later \
npm v6.x or later \
make v4.2.1 or later \
g++ 8.3.0 or later
### Create a node folder :

```
mkdir Roger_le_DJ
cd Roger_le_DJ
npm init
```

### Add the folloing nodes libraries :

discord.js <https://www.npmjs.com/package/discordjs-stable>\
ytdl-core <https://www.npmjs.com/package/ytdl-core>\
scrape-yt <https://www.npmjs.com/package/scrape-yt>\
@discord/opus <https://www.npmjs.com/package/@discordjs/opus> (you need to have make and g++ installed)

```
npm install --save discordjs 
npm install --save ytdl-core 
npm install --save scrape-yt
npm install --save @discord/opus
```

### Install ffmpeg on your distribution :

```
aptitude install ffmpeg
```

### Create an discord bot on your discord api interface :

<https://discord.com/developers/applications>

### Generate an invite link and add the bot to your discord server :

<https://discordapi.com/permissions.html>

### Take your own token and replace it on line 26 of index.js :

```
bot.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
```

### launch the bot :

```
nodejs index.js
```

## Ressources :

<https://grafikart.fr/tutoriels/bot-discordjs-892>

## Licence

Rojer le DJ v 1.0.0 Copyright (C) 2021 beastie(beastie@unixyourbrain.org)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

This file is part of Roger le DJ.

Roger le DJ is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

You should have received a copy of the GNU General Public License along with Roger le DJ. If not, see <https://www.gnu.org/licenses/>.
