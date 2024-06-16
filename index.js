const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName('publicacion')
    .setDescription('Crea una publicación de Instagram')
    .addStringOption(option => 
      option.setName('titulo')
        .setDescription('El título de la publicación')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('descripcion')
        .setDescription('La descripción de la publicación')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('imagen')
        .setDescription('URL de la imagen')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('localizacion')
        .setDescription('La localización de la publicación')
        .setRequired(false))
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'publicacion') {
    const titulo = interaction.options.getString('titulo');
    const descripcion = interaction.options.getString('descripcion');
    const imagen = interaction.options.getString('imagen');
    const localizacion = interaction.options.getString('localizacion');
    const timestamp = new Date();
    const footerImageURL = 'https://i.blogs.es/4714e7/375593064_778731280602001_6601361369208148137_n/450_1000.png';

    const embed = new EmbedBuilder()
      .setColor('#E1306C')
      .setTitle(titulo)
      .setDescription(descripcion)
      .setImage(imagen)
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: `Publicado el ${timestamp.toLocaleDateString()} a las ${timestamp.toLocaleTimeString()}`, iconURL: footerImageURL });

    if (localizacion) {
      embed.addFields({ name: 'Localización', value: localizacion });
    }

    await interaction.reply({ embeds: [embed] });
  }
});

client.on('messageCreate', async message => {
  if (message.channel.id === process.env.CHANNEL_ID && !message.author.bot) {
    await message.delete();
  }
});

client.login(process.env.TOKEN);
