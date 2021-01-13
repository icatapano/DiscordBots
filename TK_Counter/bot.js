const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
// const Keyv = require('keyv');
// const keyv = new keyv(auth.MONGO_CONNECT)

var teamkillers = []; // Empty array to be populated with the teamkillers, this will be removed once DB is added.
var killCount = []; // Corrisponding kill count for person commited the kill, also will be removed with the addition of the DB.

client.on('message', receivedMessage => {
  if (receivedMessage.author == client.user) { // Prevent bot from responding to itself and causing a infinite loop.
      return;
  }
  
  if (receivedMessage.content.startsWith("!")) { // Check to see if we have a bot command being sent.
      processInput(receivedMessage);
  }
})

function processInput(receivedMessage) {
  let splitInput = receivedMessage.content.split(" "); // Split the menu option from the tagged user if there is one.
  let menuChoice = splitInput[0]; // Variable for the exclamation command word.

  console.log("Command received: " + menuChoice); // Used for debugging but sending this information to the console window.

  // Switch statement used to call the correct function for the correct command.
  switch (menuChoice) {
    case '!help':
      helpCommand(receivedMessage);
      break;
    case '!teamkill':
      teamkillCounter(receivedMessage);
      break;
    case '!total':
      displayCount(receivedMessage);
      break;
    default:
      receivedMessage.channel.send("I don't understand the command. Try `!help`, `!teamkill`, or `!total`");
  }
}

// List off the various commands and how to use them for the user.
function helpCommand(receivedMessage) {
  receivedMessage.reply('To add 1 kill to a user, issue the !teamkill command, followed by the @ tagged user but seperated with a space.');
  receivedMessage.reply('Or use !total to display the current list of players and their total teamkills.');
}

// Add the user ID if it doesn't exist and increament the counter for that ID by 1.
function teamkillCounter(receivedMessage) {
  let argument = receivedMessage.mentions.users.first(); // Retrieves the user's ID and assigns to the variable

  console.log("Argument: " + argument); // Used for debugging but sending this information to the console window.

  if (!argument) {
    return receivedMessage.reply('you need to follow the !teamkill with the tagged user!'); // Command was issued without a tagged user, reminder of how it should be used.
  }
  let i = 0; // Counter for array elements.
  let found = false; // Flag to identify if ID exists or not.

  // Step through array checking if ID exist and adding a kill to the count.
  teamkillers.forEach((value) => {
      if (value == argument){
        killCount[i] = killCount[i] + 1;
        found = true;
      }else{
        i = i + 1; 
      }
  })
  // If ID wasnt found, it is added here with a kill count of 1.
  if (found == false){
    teamkillers[i] = argument; 
    killCount[i] = 1;
  }
  displayCount(receivedMessage);
}

// Displays all users and the total of friendly kills they have.
function displayCount(receivedMessage) {
  i = 0
  teamkillers.forEach((value) => {
    receivedMessage.channel.send(value.username + " has a total of " + killCount[i] + " teamkills.")
    i = i + 1
  })
}

client.login(auth.DISCORD_TOKEN) // Logs bot in with it's token.