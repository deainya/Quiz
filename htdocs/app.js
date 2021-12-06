// Подключаем библиотеки и внешние скрипты
const config = require('./config');

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;

// Квиз бот
const bot = new Telegraf(config.bot_token);

// Чаты
//config.chats[0]
//config.chats[1]

// Объявляем переменные
var tasks = [
    {step: 0, task: "Задание 1 (поехали)", answer: "!поехали", time: 0, tryouts:0, points: 0, img: []},
    {step: 1, task: "Задание 2 (насвязи)", answer: "!насвязи", time: 10, tryouts:0, points: 0, img: []},
    {step: 2, task: "Задание 3 (характер)", answer: "!характер", time: 7, tryouts:3, points: 50, img: []},
    {step: 3, task: "Задание 4 (уровень)", answer: "!уровень", time: 3, tryouts:0, points: 0, img: []},
    {step: 4, task: "Задание 5 (верн)", answer: "!верн", time: 7, tryouts:3, points: 50, img: []}
];

var dstart = Date.now();
var dnow = dstart;
var step = 0;

// Вспомогательные функции
function toMin(mSec) {
    return Math.round(mSec/60000);
};

// Реакция на must have команды
bot.start((ctx) => ctx.reply(`Hi. My name is Quiz.\nI'm providing Quiz for IT.\nI work on Cloud Function`))
bot.help((ctx) => ctx.reply(`Hi, ${ctx.message.from.first_name}.\nI can say hi and nothing more 🙂`))
bot.command('quizit', (ctx) => {
    step = 0;
    dstart = Date.now();
    dnow = dstart;
    ctx.reply('Привет...\n'+
              'Ключ на старт и от винта!');
})

// Реакция на новых пользователей в группе
bot.on('new_chat_members', (ctx) => {
    console.log(ctx.message.new_chat_members);
    ctx.replyWithMarkdown(`Привет, *${ctx.message.new_chat_members[0].first_name}*!\nДобро пожаловать в чат вашей команды!`);
})

// Реакция на текстовые сообщения
bot.on('text', (ctx) => {
    if (step < tasks.length) {
        var txt = ctx.message.text.toLowerCase();
        //check = (tasks[step].answer).test(txt);
        check = tasks[step].answer == txt;

        if (check) {
            ctx.replyWithMarkdown(tasks[step].task);
            dnow = Date.now();
            ctx.reply('Chat: '+ctx.message.chat.id.toString()+
                      ' step: '+step.toString()+
                      ' time: '+toMin(dnow-dstart).toString()+
                      ' points: '+tasks[step].points.toString());
            step++;
        }
    } else {
        console.log('Step (last): '+step.toString());
    }
})

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('Oops', err);
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
