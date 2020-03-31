const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commandes/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hey, ${client.user.username} est en ligne`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "/help | by SonMaxime",
            type: "WATCHING"
        }
    }); 
});

client.on('guildCreate', async (guild) => {
    if (!guild.available) return;

    const embed = new MessageEmbed({
        author: {
            name: "Hello, I'm Daisy !",
            iconURL: client.user.displayAvatarURL()
        },
        description: `Tu viens de m'ajouter à **${guild.name}**.\n\n Je suis un bot créé par SonMaxime.#9355`,

        timestamp: moment().format('LLL'),
        footer: {
            text: client.user.tag
        }
    });

    guild.owner.send({embed});
})

client.on('guildMemberAdd', (member) => {
    member.createDM()
      .then((channel) => {
        channel.send(`Bienvenue sur le serveur : ${member.displayName} :sunglasses:`);
      })
      .catch();
  });

client.on("message", async message => {
    const prefix = "/";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});

client.login(process.env.TOKEN);
