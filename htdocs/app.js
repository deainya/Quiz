// Подключаем библиотеки и внешние скрипты
const config = require('./config');

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;
const session = require('telegraf/session');
//const cron = require('node-cron');

// Quiz bot
const app = new Telegraf(config.bot_token);
app.use(session());

// Reaction on must have commands
app.start((ctx) => ctx.reply(`Hello. \nMy name Quiz \nI'm working on Cloud Function in the Yandex.Cloud.`))
app.help((ctx) => ctx.reply(`Hello, ${ctx.message.from.username}.\nI can say Hello and nothing more`))

app.command('yo', (ctx) => {
    console.log('yo', ctx.from);
    ctx.reply('Привет');
});

// Reaction on new user joined to the chat
app.on('new_chat_members', (ctx) => {
    console.log(ctx.message.new_chat_members);
    ctx.replyWithMarkdown(`Привет, *${ctx.message.new_chat_members[0].first_name}*!\nДобро пожаловать в чат вашей команды!`);
});

// Ловим ошибки приложеньки
app.catch((err) => {
    console.log('Oops', err);
});

// Запускаем poll обработчик бота
app.startPolling();

