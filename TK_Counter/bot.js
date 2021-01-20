const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const PlayerModel = require('./Player');
const mongoose = require('mongoose');

// Log bot login and set a status message.
client.on("ready", () => {
  client.user.setActivity("for !help", {type: "WATCHING"});
  console.log(`Logged in as ${client.user.tag}!`);
});

// Check if a command was sent to the bot.
client.on('message', async (receivedMessage) => {
  if (receivedMessage.author == client.user) { // Prevent bot from responding to itself and causing a infinite loop.
      return;
  }
  
  if (receivedMessage.content.startsWith("!")) { // Check to see if we have a bot command being sent.
      processInput(receivedMessage);
  }
});

// Connect to MongoDB
(async () => {
  await mongoose.connect(auth.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
})()


// Determine which command the user issued.
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
    case '!removekill':
      subtractTeamkill(receivedMessage);
      break;
    case '!total':
      displayCount(receivedMessage);
      break;
    case '!delete':
      removeUser(receivedMessage);
      break;
    default:
      receivedMessage.channel.send("I don't understand the command. Try `!help` for more information.");
  }
}

// List off the various commands and how to use them for the user.
function helpCommand(receivedMessage) {
  receivedMessage.channel.send("<!teamkill @username> will add 1 teamkill to that user.");
  receivedMessage.channel.send("<!removekill @username> will subtract 1 teamkill from that user. This is for when mistakes are made, don't make me block you!");
  receivedMessage.channel.send("<!delete @username> will completely remove that user from the database. Again, don't make me!");
  receivedMessage.channel.send("<!total> will display all users with teamkills and their counts.");
}

// Add the user ID if it doesn't exist and increament the counter for that ID by 1.
async function teamkillCounter(receivedMessage) {
  let argument = receivedMessage.mentions.users.first().username; // Retrieves the user's ID and assigns to the variable

  console.log("Argument: " + argument); // Used for debugging but sending this information to the console window.

  if (!argument) {
    return receivedMessage.reply('Error! No @username followed the command. Type <!help> for more informaiton.'); // Command was issued without a tagged user, reminder of how it should be used.
  } else {
    await PlayerModel.findOneAndUpdate({_id: receivedMessage.mentions.users.first().username}, { $inc: {count: 1} }, {upsert: true, new: true});
  }
  displayCount(receivedMessage);
}

// Remove one from the teamkill counter on the specified user, intended for if a mistake was made.
async function subtractTeamkill(receivedMessage) {
  let argument = receivedMessage.mentions.users.first().username; // Retrieves the user's ID and assigns to the variable

  console.log("Argument: " + argument); // Used for debugging but sending this information to the console window.

  if (!argument) {
    return receivedMessage.reply('Error! No @username followed the command. Type <!help> for more informaiton.'); // Command was issued without a tagged user, reminder of how it should be used.
  } else {
    await PlayerModel.findOneAndUpdate({_id: receivedMessage.mentions.users.first().username}, { $inc: {count: -1} }, {new: true});
  }

  displayCount(receivedMessage);
}

// Remove user from database
async function removeUser(receivedMessage) {
  let argument = receivedMessage.mentions.users.first().username; // Retrieves the user's ID and assigns to the variable

  console.log("Argument: " + argument); // Used for debugging but sending this information to the console window.

  if (!argument) {
    return receivedMessage.reply('Error! No @username followed the command. Type <!help> for more informaiton.'); // Command was issued without a tagged user, reminder of how it should be used.
  } else {
    try {
      await PlayerModel.deleteOne({_id: receivedMessage.mentions.users.first().username});
    } catch (error) {
      console.error(error);
    }
  }
}

// Displays all users and the total of friendly kills they have.
async function displayCount(receivedMessage) {
  try {
    const doc = await PlayerModel.find();
    var len = doc.length;

    for (var i = 0; i < len; i++) {
      receivedMessage.channel.send(doc[i]._id + " has " + doc[i].count + " teamkills.");
    }
  } catch (error){
    console.error(error);
  }
}

client.login(auth.DISCORD_TOKEN); // Logs bot in with it's token.