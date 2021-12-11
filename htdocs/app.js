// Подключаем библиотеки и внешние скрипты
const config = require('./config');
const data = require('./data');

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;

// Квиз бот
const bot = new Telegraf(config.bot_token);
const chats = config.chats;
const yc = config.yc;

// Объявляем переменные
var qRs = [];

// Переводит милисекунды в минуты
function toMin(mSec) {
    return Math.round(mSec/60000);
};

// Возвращает случайное число между min (включая) и max (не включая)
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Быстрая сортировка. Смена элементов
function partition(arr, left, right){
    // Taking the last element as the pivot
    const pivotValue = arr[right];
    let pivotIndex = left;
    for (let i = left; i < right; i++) {
            if (arr[i] < pivotValue) {
            // Swapping elements
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            // Moving to next element
            pivotIndex++;
        }
    }
    // Putting the pivot value in the middle
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]]
    return pivotIndex;
};

// Быстрая сортировка
function quickSort(arr, left, right) {
    // Base case or terminating case
    if (left >= right) {
        return;
    }
    // Returns pivotIndex
    let index = partition(arr, left, right);
    // Recursively apply the same logic to the left and right subarrays
    quickSort(arr, left, index - 1);
    quickSort(arr, index + 1, right);
}

// Реакция на must have команды
bot.start((ctx) => ctx.reply(`Hi. My name is Quiz.\nI'm providing Quiz for IT.\nI work on Cloud Function`))
bot.help((ctx) => ctx.reply(`Hi, ${ctx.message.from.first_name}.\nI can say hi and nothing more 🙂`))
// Реакция на команды
bot.command('chatit', (ctx) => {
    ctx.reply(ctx.message.chat);
})
bot.command('quizit', async (ctx) => {
    var c = ctx.message.chat;
    var stp = 0
    qRs = [];
    for (var i = 0; i < chats.length; i++) {
        qRs.push({
            chat: chats[i],
            step: stp, ok: 0, t1: [], t2: [], dif: [],
            trys: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            pts:  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            a25: [], a27: [], total: 0
        });
        qRs[i].t1.push(Date.now());
        await bot.telegram.sendPhoto(chats[i], yc + data.images[stp][0]);
        await bot.telegram.sendMessage(chats[i], data.tasks[stp], { parse_mode: "MarkdownV2" });
    }
    ctx.reply('Привет...\nКлюч на старт и от винта!');
})
bot.command('scoreit', (ctx) => {
    /*let a4 = [];
    let a6 = [];
    let a7 = [];
    for (var i = 0; i < chats.length; i++) {
        if (qRs[i].dif.length > 0) {
            a4.push({chat: qRs[i].chat, t: qRs[i].dif[0], p: qRs[i].pts[17]});
            a6.push({chat: qRs[i].chat, t: qRs[i].dif[1], p: qRs[i].pts[21]});
            a7.push({chat: qRs[i].chat, t: qRs[i].dif[2], p: qRs[i].pts[23]});
        }
    }
    ctx.reply(qRs.chat, qRs.dif, qRs.pts);*/
    var a = [7, -2, 4, 1, 6, 5, 0, -4, 2];
    quickSort(a, 0, a.length - 1);
    console.log(a);
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
    var i = chats.indexOf(c.id);
    var stp = qRs[i].step;

    //console.log(c.title);
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
            qRs[i].t2.push(Date.now());
            qRs[i].step++;
            stp = qRs[i].step;

            //Hardcode
            if (data.images[stp].length > 0) {
                  await ctx.replyWithPhoto(yc + data.images[stp][0]);
                  if (stp == 1) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                      await bot.telegram.sendDocument(c.id, yc + data.images[stp][2], [{disable_notification: true}]);
                  } else if (stp == 3) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                  } else if (stp == 17) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                  } else if (stp == 19) {
                      await bot.telegram.sendDocument(c.id, yc + data.images[stp][1], [{disable_notification: true}]);
                  } else if (stp == 21) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                      await ctx.replyWithPhoto(yc + data.images[stp][2]);
                  } else if (stp == 23) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                  } else if (stp == 25) {
                      await ctx.replyWithPhoto(yc + data.images[stp][1]);
                      await ctx.replyWithPhoto(yc + data.images[stp][2]);
                      await ctx.replyWithPhoto(yc + data.images[stp][3]);
                  } else if (stp == 27) {
                      await bot.telegram.sendDocument(c.id, yc + data.images[stp][1], [{disable_notification: true}]);
                  } else if (stp == 29) {
                      await bot.telegram.sendDocument(c.id, yc + data.images[stp][1], [{disable_notification: true}]);
                  }
            }
            await ctx.replyWithMarkdown(data.tasks[stp]);
        } else if (check1) {
            //Верный ответ
            qRs[i].pts[stp] = data.conds[stp].points;
            qRs[i].trys[stp]++;

            let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
            await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
            if (stp < 6 || stp > 14) {
                await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                qRs[i].ok++;
            }
            qRs[i].t1.push(Date.now());
            qRs[i].t2.push(Date.now());
            qRs[i].step++;
            stp = qRs[i].step;

            await ctx.replyWithMarkdown(data.tasks[stp]);
        } else if (check0 && check4) {
            if (data.conds[stp].answer.includes(txt)) {
                //Хардкод. Верный ответ на вопрос 25
                if (stp == 25 && !qRs[i].a25.includes(txt)) {
                    qRs[i].a25.push(txt);
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;

                    let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
                    if (qRs[i].a25.length == 3) {
                        await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                        qRs[i].ok++;

                        qRs[i].t1.push(Date.now());
                        qRs[i].t2.push(Date.now());
                        qRs[i].step++;
                        stp = qRs[i].step;

                        await ctx.replyWithMarkdown(data.tasks[stp]);
                    }
                }
                //Хардкод. Верный ответ на вопрос 27
                if (stp == 27 && !qRs[i].a27.includes(txt)) {
                    qRs[i].a27.push(txt);
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;

                    let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
                    if (qRs[i].a27.length == 5) {
                        await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                        qRs[i].ok++;

                        qRs[i].t1.push(Date.now());
                        qRs[i].t2.push(Date.now());
                        qRs[i].step++;
                        stp = qRs[i].step;

                        await ctx.replyWithMarkdown(data.tasks[stp]);
                    }
                }
            } else {
                //Неверный ответ на вопросы 25 и 27
                qRs[i].trys[stp]++;
                let trs = data.conds[stp].tryouts-qRs[i].trys[stp];
                //Исчерпали все попытки
                if (trs > 0) {
                    let msg = 'Осталось попыток: ' + trs.toString();
                    await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + msg, {reply_to_message_id : m});
                } else {
                    let msg = 'Увы, попытки закончились 😮';
                    await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + msg, {reply_to_message_id : m});

                    qRs[i].t1.push(Date.now());
                    qRs[i].t2.push(Date.now());
                    qRs[i].step++;
                    stp = qRs[i].step;

                    await ctx.replyWithMarkdown(data.tasks[stp]);
                }
            }
        } else if (check0 && !check2) {
            //Неверный ответ
            qRs[i].trys[stp]++;
            let trs = data.conds[stp].tryouts-qRs[i].trys[stp];
            //Исчерпали все попытки
            if (trs > 0) {
                let msg = 'Осталось попыток: ' + trs.toString();
                await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + msg, {reply_to_message_id : m});
            } else {
                let msg = 'Увы, попытки закончились 😮';
                await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + msg, {reply_to_message_id : m});

                qRs[i].t1.push(Date.now());
                qRs[i].t2.push(Date.now());
                qRs[i].step++;
                stp = qRs[i].step;

                await ctx.replyWithMarkdown(data.tasks[stp]);
            }
        } else {
            //Специальные вопросы
            if (stp == 21 && check3) {
                if (data.Qs21.includes(txt)) {
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*', {reply_to_message_id : m});
                } else {
                    await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*', {reply_to_message_id : m});
                }
            }
        }
    }
})

// Реакция на фото
bot.on('photo', async (ctx) => {
    var c = ctx.message.chat;
    var m = ctx.message.message_id;
    var i = chats.indexOf(c.id);
    var stp = qRs[i].step;
    //Вопрос 29 с получением фото
    if (stp == 29) {
        qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
        if (qRs[i].pts[stp] >= 250) {
            //qRs[i].t1.push(Date.now());
            qRs[i].t2.push(Date.now());
            qRs[i].step++;
            stp = qRs[i].step;

            for (var j = 0; j < qRs[i].pts.length; j++) {
                if (j == 17 || j == 21 || j == 23) {
                    qRs[i].dif.push(qRs[i].t2[j] - qRs[i].t1[j]);
                }
                else {
                    qRs[i].total = qRs[i].total + qRs[i].pts[j];
                }
            }
            console.log(c.title, qRs, qRs[i].pts.length);
            await ctx.replyWithMarkdown('Сумма баллов (без учёта времени): ' + qRs[i].total.toString() +
                                        '\n\n' + data.tasks[stp]);
        }
    }
})

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('doh', err);
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
