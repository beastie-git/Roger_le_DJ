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
let dicevalue = NaN

const bot = new Discord.Client()

bot.on('message', function(message) {
  if (message.content.startsWith('/play')) {
    playsong(message)
  } else if (message.content.startsWith('/initplaylist')) {
    initplaylist(message)
  } else if (message.content.startsWith('/df')) {
    dicef(message)
  } else if (message.content.startsWith('/help')) {
    displayhelp(message)
  } else if (message.content.startsWith("/bulkdelete")) {
    bulkdelete(message)
  } else if (message.content.startsWith("/displayplaylist")) {
    displayplaylist(message)
  } else if (message.content.startsWith('/dm')) {
    dicem(message)
  } else if (message.content.startsWith('/setdicevalue')) {
    setdicevalue(message)
  } else if (message.content.startsWith('/displaydicevalue')) {
    displaydicevalue(message)
  }
})

bot.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

function dicem(message) {
  roll = message.content.split(' ')
  roll.shift()
  roll = roll.join('')
  // split and launch dice
  roll = roll.replace(/g/gi, ' g ')
  roll = roll.replace(/d/gi, ' d ')
  roll = roll.replace(/\+/gi, ' + ')
  roll = roll.replace(/-/gi, ' - ')
  roll = roll.split(' ')
  // add dice value if set and not given
  roll[0] = parseInt(roll[0])
  roll[2] = parseInt(roll[2])

  if (Number.isInteger(dicevalue) && roll.length >= 3 && Number.isInteger(roll[0]) && ( !roll[3] || roll[3] != 'd' )) {
    roll.splice(3, 0, dicevalue)
    roll.splice(3, 0, 'd')
  }
  // roll dice
  roll[4] = parseInt(roll[4])
  if (roll.length >= 5 && roll[1] === 'g' && roll[3] === 'd' && Number.isInteger(roll[0]) && Number.isInteger(roll[2]) && Number.isInteger(roll[4]) && roll[0] >= roll[2] && roll[0] > 0 && roll[2] > 0 && roll[4] > 0) {
    result = {value : 0, string : ''}
    rolldm(roll[0], roll[2], roll[4], result)
    for (i = 0; i < 5; i++) {
      roll.shift()
    }
    // add bonuses
    while(roll.length > 1) {
      if (roll[0] === '+' && Number.isInteger(parseInt(roll[1]))) {
        roll.shift()
        roll[0] = parseInt(roll[0])
        result.string += ' + ' + roll[0]
        result.value += roll[0]
        roll.shift()
      } else if (roll[0] === '-' && Number.isInteger(parseInt(roll[1]))) {
        roll.shift()
        roll[0] = parseInt(roll[0])
        result.string += ' - ' + roll[0]
        result.value -= roll[0]
        roll.shift()
      } else {
        roll.shift()
        roll.shift()
      }
    }
    message.channel.send(result.string + ' = ' + result.value)
  } else {
    message.channel.send('comprend pas... (bad args)')
  }
}

function rolldm(totaldice, keepdice, dicevalue, result) {
  explodenb = 0
  buff = []
  // launch dice
  for (i = 0; i < totaldice; i++ ) {
    buff.push(Math.floor(Math.random() * dicevalue + 1))
  }
  //sort dice
  buff.sort((a, b) => b - a)
  //remove non keeping dice
  if (totaldice - keepdice > 0) {
    result.string += '('
    for (i = 0; i < totaldice - keepdice; i++) {
      result.string += ' ' + buff[buff.length - 1]
      buff.pop()
    }
    result.string += ' )'
  }
  // count explode dice
  for (i = 0; i < buff.length; i++) {
    if (buff[i] === dicevalue) {      
      explodenb++
    }
  }
  // format result
  result.string += '['
  buff.forEach(element => {
    result.value += element
    result.string += ' ' + element
  });
  result.string += ' ]'
  if (explodenb > 0) {
    rolldm(explodenb, explodenb, dicevalue, result)
  }
}

function dicef(message) {
  roll = message.content.split(' ')
  roll.shift(' ')
  roll = roll.join('')
  // split and launch dice
  roll = roll.replace(/d/gi, ' d ')
  roll = roll.replace(/\+/gi, ' + ')
  roll = roll.replace(/-/gi, ' - ')
  roll = roll.split(' ')
  // add dice value if set and not given
  roll[0] = parseInt(roll[0])
  if (Number.isInteger(dicevalue) && roll.length >= 1 && Number.isInteger(roll[0]) && ( !roll[1] || roll[1] != 'd' )) {
    roll.splice(1, 0, dicevalue)
    roll.splice(1, 0, 'd')
  }
  roll[2] = parseInt(roll[2])
  // roll dice
  if (roll.length >= 3 && roll[1] === 'd' && Number.isInteger(roll[0]) && Number.isInteger(roll[2]) && roll[0] > 0 && roll[2] > 0) {
    result = {value : 0, string : ''}
    result.string += 'roll'
    for (i = 0; i < roll[0]; i++) {
      buff = Math.floor(Math.random() * roll[2] + 1)
      result.string += ' [' + buff + ']'
      result.value += buff
    }
    for (i = 0; i < 3; i++) {
      roll.shift()
    }
    // add bonuses
    while(roll.length > 1) {
      if (roll[0] === '+' && Number.isInteger(parseInt(roll[1]))) {
        roll.shift()
        roll[0] = parseInt(roll[0])
        result.string += ' + ' + roll[0]
        result.value += roll[0]
        roll.shift()
      } else if (roll[0] === '-' && Number.isInteger(parseInt(roll[1]))) {
        roll.shift()
        roll[0] = parseInt(roll[0])
        result.string += ' - ' + roll[0]
        result.value -= roll[0]
        roll.shift()
      } else {
        roll.shift()
        roll.shift()
      }
    }
    message.channel.send(result.string + ' = ' + result.value)
  } else {
    message.channel.send('comprend pas... (Bad args)')
  }
}

function setdicevalue(message) {
  buff = message.content.split(' ')
  if (buff[1]) {
    buff = parseInt(buff[1])
    if (Number.isInteger(buff) && buff > 0) {
      message.channel.send('Dice value is set to ' + buff)
      dicevalue = buff
    } else {
      message.channel.send('arg must be an integer upper than 0')
    }
  } else {
    message.channel.send('arg must be an integer upper than 0')
  } 

}

function displaydicevalue(message) {
  if (Number.isInteger(dicevalue)) {
    message.channel.send('Dice value is set to ' + dicevalue)
  } else {
    message.channel.send('Dice value not set')
  }
}

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