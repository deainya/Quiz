// Подключаем библиотеки и внешние скрипты
const config = require('./config');
const data = require('./data');

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;

// Квиз бот
const bot = new Telegraf(config.bot_token);

// Объявляем переменные
// Кол-во чатов - хардкод
var yc = 'https://storage.yandexcloud.net/deain/';
var qRs = [
        {step: 0, t1:[], t2:[], trys:[], pts:[], total: 0},
        {step: 0, t1:[], t2:[], trys:[], pts:[], total: 0}
    ];
var a25 = [];
var a27 = [];
var j = 0;

// Переводит милисекунды в минуты
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
bot.command('quizit', async (ctx) => {
    var c = ctx.message.chat;
    var stp = 0
    j = 0;
    for (var i = 0; i < qRs.length; i++) {
        qRs[i].step = stp;
        qRs[i].t1 = [];
        qRs[i].t1.push(Date.now());
        qRs[i].t2 = [];
        qRs[i].trys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].pts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].total = 0;
        await bot.telegram.sendPhoto(data.chats[i], yc+data.images[stp][0]);
        await bot.telegram.sendMessage(data.chats[i], data.tasks[stp], { parse_mode: "MarkdownV2" });
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
bot.on('text', async (ctx) => {
    var c = ctx.message.chat;
    var m = ctx.message.message_id;
    var txt = ctx.message.text.toLowerCase();
    var i = data.chats.indexOf(c.id);
    var stp = qRs[i].step;

    //console.log(c.title);
    //check this condition
    if (stp < data.tasks.length-1) {
        //check = (qRs[i].answer).test(txt);
        let check0 = txt.substr(0, 1) == '!';
        let check1 = data.conds[stp].answer == txt;
        let check2 = data.conds[stp].tryouts == 0;
        let check3 = txt.substr(0, 1) == '?';
        let check4 = (stp == 25 || stp == 27);
        if (check1 && check2) {
            //Вывод следующего задания
            qRs[i].t1.push(Date.now());
            qRs[i].t2.push(qRs[i].t1);
            qRs[i].step++;
            stp = qRs[i].step;

            //hardcode
            if (data.images[stp].length > 0) {
                  await ctx.replyWithPhoto(yc+data.images[stp][0]);
                  if (stp == 1) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                      await bot.telegram.sendDocument(c.id, yc+data.images[stp][2], [{disable_notification: true}]);
                  } else if (stp == 3) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                  } else if (stp == 17) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                  } else if (stp == 19) {
                      await bot.telegram.sendDocument(c.id, yc+data.images[stp][1], [{disable_notification: true}]);
                  } else if (stp == 21) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                      await ctx.replyWithPhoto(yc+data.images[stp][2]);
                  } else if (stp == 22) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                  } else if (stp == 24) {
                      await ctx.replyWithPhoto(yc+data.images[stp][1]);
                      await ctx.replyWithPhoto(yc+data.images[stp][2]);
                      await ctx.replyWithPhoto(yc+data.images[stp][3]);
                  } else if (stp == 26) {
                      await bot.telegram.sendDocument(c.id, yc+data.images[stp][1], [{disable_notification: true}]);
                  } else if (stp == 28) {
                      await bot.telegram.sendDocument(c.id, yc+data.images[stp][1], [{disable_notification: true}]);
                  }
            }
            await ctx.replyWithMarkdown(data.tasks[stp]);
            //console.log('next - ', qRs[i]);

        } else if (check1) {
            //Верный ответ
            await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*', {reply_to_message_id : m});
            qRs[i].pts[stp] = data.conds[stp].points;
            qRs[i].trys[stp]++;
            //let msg = 'Осталось попыток: '+(data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
            //await ctx.reply(msg);
            if (stp < 6 || stp > 15) {
                await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
                j++;
            }
            qRs[i].t2.push(qRs[i].t1);
            qRs[i].t1.push(Date.now());
            qRs[i].step++;
            stp = qRs[i].step;

            await ctx.replyWithMarkdown(data.tasks[stp]);
            //console.log('right - ', qRs[i]);

        } else if (check0 && check4) {
            if (data.conds[stp].answer.includes(txt)) {
                //верный ответ на спец. вопрос + хардкод 25
                if (stp == 25 && !a25.includes(txt)) {
                    a25.push(txt);
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*', {reply_to_message_id : m});
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;
                    let msg = 'Осталось попыток: '+(data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.reply(msg);
                    if (a25.length == 3) {
                        await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
                        j++;
                        qRs[i].t2.push(qRs[i].t1);
                        qRs[i].t1.push(Date.now());
                        qRs[i].step++;
                        stp = qRs[i].step;

                        await ctx.replyWithMarkdown(data.tasks[stp]);
                        //console.log('right - ', qRs[i]);
                    }
                }
                //верный ответ на спец. вопрос + хардкод 27
                if (stp == 27 && !a27.includes(txt)) {
                    a27.push(txt);
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*', {reply_to_message_id : m});
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;
                    let msg = 'Осталось попыток: '+(data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.reply(msg);
                    if (a27.length == 5) {
                        await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
                        j++;
                        qRs[i].t2.push(qRs[i].t1);
                        qRs[i].t1.push(Date.now());
                        qRs[i].step++;
                        stp = qRs[i].step;

                        await ctx.replyWithMarkdown(data.tasks[stp]);
                        //console.log('right - ', qRs[i]);
                    }
                }
            } else {
                //неверный ответ на спец. вопрос
                await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*', {reply_to_message_id : m});
                qRs[i].trys[stp]++;
                let msg = 'Осталось попыток: '+(data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                await ctx.reply(msg);
                //исчерпали все попытки
                //...
            }

        } else if (check0 && !check2) {
            //Неверный ответ
            await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*', {reply_to_message_id : m});
            qRs[i].trys[stp]++;
            let msg = 'Осталось попыток: '+(data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
            await ctx.reply(msg);
            //console.log('wrong - ', qRs[i]);
            //Исчерпали все попытки
            //...

        } else {
            //Специальные вопросы
            if (stp == 21 && check3) {
                if (data.Qs21.includes(txt)) {
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*', {reply_to_message_id : m});
                } else {
                    await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*', {reply_to_message_id : m});
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
