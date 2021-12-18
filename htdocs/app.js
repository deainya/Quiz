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
var aspec = [25, 27];
var tspec = [17, 21, 23];

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
    const pivotValue = arr[right].t;
    let pivotIndex = left;
    for (let i = left; i < right; i++) {
            if (arr[i].t < pivotValue) {
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

// Отправка стикера, фотки или документа
async function sendMedia(chat, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'sticker') {
            await bot.telegram.sendSticker(chat, yc + arr[i].name);
        } else if (arr[i].type == 'photo') {
            await bot.telegram.sendPhoto(chat, yc + arr[i].name);
        } else if (arr[i].type == 'document') {
            await bot.telegram.sendDocument(chat, yc + arr[i].name, [{disable_notification: true}]);
        }
    }
}

// Реакция на must have команды
bot.start((ctx) => ctx.reply(`Hi. My name is Quiz.\nI'm providing Quiz for IT.\nI work on Yandex Cloud`))
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
            step: stp, ok: 0, t1: [], t2: [],
            a: [],
            a25: [], a27: [],
            trys: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            pts:  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            total: 0
        });
        qRs[i].t1.push(Date.now());
        await sendMedia(chats[i], data.images[stp]);
        await bot.telegram.sendMessage(chats[i], data.tasks[stp], { parse_mode: "MarkdownV2" });
    }
    ctx.reply('Привет...\nКлюч на старт и от винта!');
})
bot.command('scoreit', async (ctx) => {
    var arr = [];
    for (var i = 0; i < tspec.length; i++) {
        arr.push([]);
        var k = tspec[i];
        for (var j = 0; j < chats.length; j++) {
            if (qRs[j].pts[k] != 0) { arr[i].push({chat: qRs[j].chat, t: qRs[j].t2[k] - qRs[j].t1[k]}); }
            else { arr[i].push({chat: qRs[j].chat, t: 33000000}); }
        }
        quickSort(arr[i], 0, arr[i].length - 1);
        for (var j = 0; j < arr[i].length; j++) {
            if (qRs[chats.indexOf(arr[i][j].chat)].pts[k] != 0) {
                qRs[chats.indexOf(arr[i][j].chat)].pts[k] = 100 - (arr[i].length - j - 1); //Hardcode 100 (-1)
            }
        }
    }

    for (var i = 0; i < chats.length; i++) {
        qRs[i].total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            qRs[i].total = qRs[i].total + qRs[i].pts[j];
        }
        console.log(qRs[i].chat, qRs[i].total);
        await ctx.reply(qRs[i].chat.toString() + ': ' + qRs[i].total.toString());
    }
    console.log(qRs);
    await ctx.reply(qRs);


    //var a17 = [];
    //var a21 = [];
    //var a23 = [];

    /*
    for (var i = 0; i < chats.length; i++) {
        //Filling temp arrays
        for (var j = 0; j < qRs[i].tspec.length; j++) {
            arr.push([]);
            var k = qRs[i].tspec[j];
            if (qRs[i].pts[k].length > 0) {
                if (qRs[i].pts[k] == -1) { arr[i].push({chat: qRs[i].chat, t: qRs[i].t2[k] - qRs[i].t1[k]}); }
                else { arr[i].push({chat: qRs[i].chat, t: 33000000}); }
            } else { arr[i].push({chat: qRs[i].chat, t: 33000000}); }
        }
        //Sorting temp arrays on time values
        if (arr[i].length > 0) {
            quickSort(arr[i], 0, arr[i].length - 1);
            for (var j = 0; j < arr[i].length; j++) {
                var k = qRs[i].tspec[j];
                if (qRs[chats.indexOf(arr[i][j].chat)].pts[k] == -1) {
                    qRs[chats.indexOf(arr[i][j].chat)].pts[k] = 100 - (arr[i].length - j - 1); //Hardcode 100 (-1)
                }
            }
        }
    */

        //Hardcode for time questions
        //Filling temp arrays
        /*if (qRs[i].pts[17].length == 0) { a17.push({chat: qRs[i].chat, t: 33000000, p: 0}); }
        else if (qRs[i].pts[17] == -1) {
            a17.push({chat: qRs[i].chat, t: qRs[i].t2[17] - qRs[i].t1[17], p: 0});
        } else { a17.push({chat: qRs[i].chat, t: 33000000, p: 0}); }

        if (qRs[i].pts[21].length == 0) { a21.push({chat: qRs[i].chat, t: 33000000, p: 0}); }
        else if (qRs[i].pts[21] == -1) {
            a21.push({chat: qRs[i].chat, t: qRs[i].t2[21] - qRs[i].t1[21], p: 0});
        } else { a21.push({chat: qRs[i].chat, t: 33000000, p: 0}); }

        if (qRs[i].pts[23].length == 0) { a23.push({chat: qRs[i].chat, t: 33000000, p: 0}); }
        else if (qRs[i].pts[23] == -1) {
            a23.push({chat: qRs[i].chat, t: qRs[i].t2[23] - qRs[i].t1[23], p: 0});
        } else { a23.push({chat: qRs[i].chat, t: 33000000, p: 0}); }*/
    //} //Commented!!!
    //Sorting temp arrays on time values
    /*quickSort(a17, 0, a17.length - 1);
    for (var i = 0; i < a17.length; i++) {
        a17[i].p = 100 - (a17.length - i - 1);
        if (qRs[chats.indexOf(a17[i].chat)].pts[17] == -1) {
            qRs[chats.indexOf(a17[i].chat)].pts[17] = a17[i].p;
        }
    }
    quickSort(a21, 0, a21.length - 1);
    for (var i = 0; i < a21.length; i++) {
        a21[i].p = 100 - (a21.length - i - 1);
        if (qRs[chats.indexOf(a21[i].chat)].pts[21] == -1) {
            qRs[chats.indexOf(a21[i].chat)].pts[21] = a21[i].p;
        }
    }
    quickSort(a23, 0, a23.length - 1);
    for (var i = 0; i < a23.length; i++) {
        a23[i].p = 100 - (a23.length - i - 1);
        if (qRs[chats.indexOf(a23[i].chat)].pts[23] == -1) {
            qRs[chats.indexOf(a23[i].chat)].pts[23] = a23[i].p;
        }
    }*/
    //Evaluating scores per each chat
    //console.log(a17, a21, a23);
    //for (var i = 0; i < chats.length; i++) { //Commented!!!

    /*
        qRs[i].total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            qRs[i].total = qRs[i].total + qRs[i].pts[j];
        }
        console.log(qRs[i].chat, qRs[i].total);
        await ctx.reply(qRs[i].chat.toString() + ': ' + qRs[i].total.toString());
    }
    console.log(qRs);
    await ctx.reply(qRs);
    */

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

            await sendMedia(c.id, data.images[stp]);
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
                    if (qRs[i].a25.length == 4) {
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
    //Хардкод. Вопрос 29 с получением фото от пользователей
    if (stp == 29) {
        qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
        if (qRs[i].pts[stp] >= 250) {
            //qRs[i].t1.push(Date.now());
            qRs[i].t2.push(Date.now());
            qRs[i].step++;
            stp = qRs[i].step;

            await ctx.replyWithMarkdown(data.tasks[stp]);
        }
    }
})

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('Doh!\n', err);
    //Trying to handle "Too Many Requests..."
    //if (err.code == 429 && err.on.method == 'sendMessage') {
    //    setTimeout(bot.telegram.sendMessage(err.on.payload.chat_id, err.on.payload.text/*, { parse_mode: "MarkdownV2" }*/), 3000);
    //}
    //if (err.code == 429 && err.on.method == 'sendPhoto') {
    //    setTimeout(bot.telegram.sendPhoto(err.on.payload.chat_id, err.on.payload.photo), 3000);
    //}
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
