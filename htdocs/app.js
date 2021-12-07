// Подключаем библиотеки и внешние скрипты
const config = require('./config');
const data = require('./data');

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;

// Квиз бот
const bot = new Telegraf(config.bot_token);

// Объявляем переменные
var qRs = [
        {chat: -1001742053790, step: 0, t1:[], t2:[], trys:[], pts:[], total: 0},
        {chat: -671590480, step:0, t1:[], t2:[], trys:[], pts:[], total: 0}
    ];

// Вспомогательные функции
function toMin(mSec) {
    return Math.round(mSec/60000);
};

// Возвращает случайное число между min (включая) и max (не включая)
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Реакция на must have команды
bot.start((ctx) => ctx.reply(`Hi. My name is Quiz.\nI'm providing Quiz for IT.\nI work on Cloud Function`))
bot.help((ctx) => ctx.reply(`Hi, ${ctx.message.from.first_name}.\nI can say hi and nothing more 🙂`))
bot.command('quizit', (ctx) => {
    for (var i = 0; i < qRs.length; i++) {
        qRs[i].step = 0;
        qRs[i].t1 = [];
        qRs[i].t1.push(Date.now());
        qRs[i].t2 = [];
        qRs[i].trys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].pts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].total = 0;
        bot.telegram.sendMessage(qRs[i].chat, data.descs[qRs[i].step], { parse_mode: "MarkdownV2" }) //team 1
    }
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
    var c = ctx.message.chat;
    for (var i = 0; i < qRs.length; i++) {
        if (qRs[i].chat == c.id) {
            console.log(c);
            if (qRs[i].step < data.descs.length-1) {
                var txt = ctx.message.text.toLowerCase();
                //check = (qRs[step].answer).test(txt);
                let check0 = txt.substr(0, 1) == '!';
                let check1 = data.tasks[qRs[i].step].answer == txt;
                let check2 = data.tasks[qRs[i].step].tryouts == 0;
                if (check1 && check2) {
                    //Вывод следующего задания
                    ctx.replyWithMarkdown(data.descs[qRs[i].step+1]);
                    qRs[i].t1.push(Date.now());
                    qRs[i].t2.push(qRs[i].t1);
                    qRs[i].step++;
                    //ctx.reply('Chat: '+ctx.message.chat.id.toString()+
                    //          ' step: '+step.toString()+
                    //          ' time: '+toMin(dnow-dstart).toString()+
                    //          ' points: '+tasks[step].points.toString());
                } else if (check1) {
                    //Верный ответ
                    ctx.reply(data.right[getRandom(0, 13)]);
                    qRs[i].trys[qRs[i].step]++;
                    ctx.reply('Осталось попыток: '+(data.tasks[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString());
                    qRs[i].t2.push(qRs[i].t1);
                    qRs[i].t1.push(Date.now());
                    ctx.replyWithMarkdown(data.descs[qRs[i].step+1]);
                    qRs[i].step++;
                    //setImmediate((arg) => {
                    //    console.log(`executing immediate: ${arg}`);
                    //}, 'so immediate');
                } else if (check0) {
                    //Неверный ответ
                    ctx.reply(data.wrong[getRandom(0, 6)]);
                    qRs[i].trys[qRs[i].step]++;
                    ctx.reply('Осталось попыток: '+(data.tasks[qRs[i].step]-qRs[i].trys[qRs[i].step]).toString());
                }
            }
        }
    }
})

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('Oops', err);
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
