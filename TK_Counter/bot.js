const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

var teamkillers = [] // Empty array to be populated of the teamkillers.
var killCount = [] // Corrisponding kill count for perso who killed.

client.on('message', receivedMessage => {
  if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
      return
  }
  
  if (receivedMessage.content.startsWith("!")) {
      processCommand(receivedMessage)
  }
})

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
  let argument = receivedMessage.mentions.users.first() //splitCommand[1] // This should be the @username

  console.log("Command received: " + primaryCommand)
  console.log("Argument: " + argument) // There may not be any arguments

  if (primaryCommand == "help") {
      helpCommand(receivedMessage)
  } else if (primaryCommand == "teamkill") {
      teamkillCounter(argument, receivedMessage)
  } else if (primaryCommand == "total") {
      displayCount(client) 
  }else {
      receivedMessage.channel.send("I don't understand the command. Try `!help`, `!teamkill`, or '!total'")
  }
}

function helpCommand(receivedMessage) {
  receivedMessage.reply('To add 1 kill to a user, issue the !teamkill command, followed by the @ tagged user but seperated with a space.')
  receivedMessage.reply('Or use !total to display the current list of players and their total teamkills.')
}

function teamkillCounter(argument, receivedMessage) {
  if (!argument) {
    return receivedMessage.reply('you need to follow the !teamkill with the tagged user!')
  }
  var i = 0
  var found = false
  teamkillers.forEach((value) => {
      if (value == argument){
        killCount[i] = killCount[i] + 1
        found = true
      }else{
        i = i + 1
      }
  })
  if (found == false){
    teamkillers[i] = argument
    killCount[i] = 1
  }
  displayCount(receivedMessage)
}

function displayCount (receivedMessage) {
  i = 0
  teamkillers.forEach((value) => {
    receivedMessage.channel.send(value.username + " has a total of " + killCount[i] + " teamkills.")
    i = i + 1
  })
}

client.login(config.DISCORD_TOKEN)