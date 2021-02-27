// Copyright (C) 2021 Jeremie SALVI.
// License GPLv3+: GNU GPL version 3 or later.

// This file is part of Roger le DJ.

// Roger le DJ is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Roger le DJ is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Roger le DJ.  If not, see <https://www.gnu.org/licenses/>.

// Originally written by Jeremie SALVI <jeremie.salvi@unixyourbrain.org>.

// please visit https://github.com/beastie-git/Roger_le_DJ

const Scrapeyt = require('scrape-yt')
const Ytstream = require('ytdl-core')
const Discord = require('discord.js')
const Fs = require('fs')

const playlist = []
let playlistdisplay =''
const debug = false

const bot = new Discord.Client()

bot.on('message', function(message) {
  if (message.content.startsWith('/play')) {
    playsong(message)
  } else if (message.content.startsWith('/initplaylist')) {
    initplaylist(message)
  } else if (message.content.startsWith('/df')) {
    dice(message)
  } else if (message.content.startsWith('/help')) {
    displayhelp(message)
  } else if (message.content.startsWith("/bulkdelete")) {
    bulkdelete(message)
  } else if (message.content.startsWith("/displayplaylist")) {
    displayplaylist(message)
  }
})

bot.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

function displayplaylist(message) {
  if (playlist.length > 0) {
    message.channel.send(playlistdisplay)
  } else {
    message.channel.send('comprend pas... (playlist empty)')
    return 0
  }
}

function bulkdelete(message) {
  arg = message.content.split(' ')
  if (Number.isInteger(parseInt(arg[1])) && parseInt(arg[1]) <= 100 && parseInt(arg[1]) >= 2) {
    message.channel.bulkDelete(arg[1])
    .catch(() => {
      message.channel.send('comprend pas... (bulk can supress more than 100 message or messages older than 14 days)')
    });
  }
}

function displayhelp(message) {
  Fs.readFile('./help.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return 0
    }
    // console.log(data)
    message.channel.send(data)
  })
  
}

function dice(message) {
  roll = message.content.split(' ')

    if(!roll[1]) {
      message.channel.send('comprend pas... (No args)')
      return 0
    }
    roll.shift()
    dices = roll[0].split('d')

    if(dices.length != 2) {
      message.channel.send('comprend pas... (Bad syntax)')
      return 0
    }
    nbofdice = parseInt(dices[0])
    valueofdice = parseInt(dices[1])

    if(!Number.isInteger(nbofdice) || !Number.isInteger(valueofdice)) {
      message.channel.send('comprend pas... (Not an integer)')
      return 0
    }

    let member = message.guild.member(message.author)
    strresult = member.displayName + ' roll : `'
    result = 0

    for (let i = 0; i < nbofdice; i++) {
      tmpresult = Math.floor(Math.random() * valueofdice + 1)
      result += tmpresult
      strresult += '[' + tmpresult + ']'
      if (i < nbofdice - 1) {
        strresult += ' '
      }
    }
    roll.shift()

    var buff = ''
    for (i = 0; i < roll.length ; i++) {
      buff += roll[i]
    }
    buff = buff.replace(/-/gi, ' - ')
    buff = buff.replace(/\+/gi, ' + ')
    roll = buff.split(' ')

    while(roll.length > 0) {
      if (roll[0] === '+' && Number.isInteger(parseInt(roll[1]))) {
        strresult += ' + ' + roll[1]
        result += parseInt(roll[1])
        roll.shift()
        roll.shift()
      } else if (roll[0] === '-' && Number.isInteger(parseInt(roll[1]))) {
        strresult += ' - ' + roll[1]
        result -= parseInt(roll[1])
        roll.shift()
        roll.shift()
      } else {
        roll.shift()
      }
    }

    strresult += '` = ' + result
    message.channel.send(strresult)
}

function playsong(message) {
  // console.log(playlist.length)
  let args = message.content.split(' ')
  if (args[1]) {
    // console.log('we have args')
    if (args[1].startsWith('https://www.youtube.com/')) {
      // console.log('we have an url')
      play(message, args[1])
    } else if (Number.isInteger(parseInt(args[1]))) {
      // console.log('arg is a integer')
      if (args[1] >= 1 && args[1] <= playlist.length) {
        // console.log('good integer arg')
        url = 'https://www.youtube.com/watch?v=' + playlist[args[1]-1].id
        play(message, 'https://www.youtube.com/watch?v=' + playlist[args[1]-1].id)
      } else if (playlist.length === 0) {
        message.channel.send('comprend pas... (playlist empty)')
        return 0
      } else {
        message.channel.send('comprend pas... (playlist have ' + playlist.length + ' entries **' + args[1] + '** is a bad arg)')
        return 0
      }
    } else {
      message.channel.send('comprend pas... (bad syntax)')
      return 0
    }
  } else {
    message.channel.send('comprend pas... (no args)')
    return 0
  }
}

function play(message, url) {
  const voicechannel = message.guild.channels.cache
    .filter(function(channel) { 
      return channel.type === 'voice' && channel.rawPosition === 0
    })
    .first()
  voicechannel.join()
    .then((connection) => {
        function dispatch() {
          const dispatcher = connection
            .play(Ytstream(url, {filter : 'audio'}), {bitrate: 192000, seek : 0, volume : 1})
            .on('finish', () => {
              dispatch()
            })
        }
        dispatch()
    })
}

function initplaylist(message) {
  length =playlist.length
  for (i = 0; i < length; i++) {
    playlist.shift()
  }
  let args = message.content.split(' ')
  if (args[1] && args[1].split('=')[1]) {
    let playlistid = args[1].split('=')[1]
    Scrapeyt.getPlaylist(playlistid)
      .then(videos => {
        for (let i = 0 ; i < videos.videos.length ; i++) {
          playlist[i] = {"title": videos.videos[i].title, "id": videos.videos[i].id}
        }
        playlistdisplay = '```\n'
        for (i = 0; i < playlist.length; i++) {
          playlistdisplay += i+1 + ') ' + playlist[i].title + '\n'
        }
        playlistdisplay += '```'
        message.channel.send('\n**playlist ID :** ' + playlistid + '\n' + playlistdisplay)
      })
      .catch(error => {
        // console.error(error)
        message.channel.send('comprend pas... (error 404, invalid url)')
      })
  } else {
    message.channel.send('comprend pas... (bad or empty arg, we need an arg as : https://www.youtube.com/playlist?list=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)')
    return 0
  }
}
