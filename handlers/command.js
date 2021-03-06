const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commandes");
table.setHeading("nom", "Status de chargement");

module.exports = (client) => {
    readdirSync("./commandes/").forEach(dir => {
        const commands = readdirSync(`./commandes/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../commandes/${dir}/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> manque un help.name, ou help.name is not a string.`);
                continue;
            }
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    
    console.log(table.toString());
}