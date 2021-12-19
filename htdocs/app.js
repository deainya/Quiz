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

// Следующий шаг
function nextStep(arr, isntFinal) {
    if (isntFinal) { arr.t1.push(Date.now()); }
    arr.t2.push(Date.now());
    arr.step++;
    return arr.step;
}

// Отправка стикера, фотки или документа
async function sendMedia(chat_id, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'sticker') {
            await bot.telegram.sendSticker(chat_id, yc + arr[i].name);
        } else if (arr[i].type == 'photo') {
            await bot.telegram.sendPhoto(chat_id, yc + arr[i].name);
        } else if (arr[i].type == 'document') {
            await bot.telegram.sendDocument(chat_id, yc + arr[i].name, [{disable_notification: true}]);
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
    var stp = 0;
    var chat_title = '';
    qRs = [];
    for (var i = 0; i < chats.length; i++) {
        await bot.telegram.getChat(chats[i])
        .then(chat => chat_title = chat.title)
        .catch(err => console.error(err));
        qRs.push({
            chat: chats[i], title: chat_title,
            step: stp, ok: 0, t1: [], t2: [],
            a: [], a25: [], a27: [],
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
    //Evaluating scores for time questions
    var arr = [];
    for (var i = 0; i < tspec.length; i++) {
        //Filling temp array
        arr.push([]);
        var k = tspec[i];
        for (var j = 0; j < chats.length; j++) {
            if (qRs[j].pts[k] != 0) { arr[i].push({chat: qRs[j].chat, t: qRs[j].t2[k] - qRs[j].t1[k]}); }
            else { arr[i].push({chat: qRs[j].chat, t: 33000000}); } //Hardcode longtime
        }
        //Sorting temp array on time values
        quickSort(arr[i], 0, arr[i].length - 1);
        console.log(arr);
        for (var j = 0; j < arr[i].length; j++) {
            if (qRs[chats.indexOf(arr[i][j].chat)].pts[k] != 0) {
                qRs[chats.indexOf(arr[i][j].chat)].pts[k] = 100 - j; //Hardcode 100 (-1)
            }
        }
    }
    //Evaluating scores per each chat
    var score = [];
    for (var i = 0; i < chats.length; i++) {
        qRs[i].total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            qRs[i].total = qRs[i].total + qRs[i].pts[j];
        }
        //console.log(qRs[i].chat, qRs[i].title, qRs[i].total);
        score.push({id: qRs[i].chat, title: qRs[i].title, t: qRs[i].total});
    }
    //console.log(qRs);
    await ctx.reply(qRs);
    quickSort(score, 0, score.length - 1);
    for (var i = 0; i < score.length; i++) {
        await ctx.reply(score[i].t.toString() + ' - ' +
                        score[i].title + ' (' + score[i].id.toString() + ')');
    }
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
        let chk0 = txt.substr(0, 1) == '!';
        let chk1 = data.conds[stp].answer == txt;
        let chk2 = data.conds[stp].tryouts == 0;
        let chk3 = txt.substr(0, 1) == '?';
        var stp25 = stp == 21;
        var stp25 = stp == 25;
        var stp27 = stp == 27;
        var stp29 = stp == 29;
        if (chk1 && chk2) {
            //Вывод следующего задания
            if (stp29) {stp = nextStep(qRs[i], false);} //Hardcode
            else {stp = nextStep(qRs[i], true);}
            await sendMedia(c.id, data.images[stp]);
            await ctx.replyWithMarkdown(data.tasks[stp]);
        } else if (chk1) {
            //Верный ответ
            qRs[i].pts[stp] = data.conds[stp].points;
            qRs[i].trys[stp]++;
            let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts - qRs[i].trys[stp]).toString();
            await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
            //Hardcode
            if (stp < 6 || stp > 14) {
                await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                qRs[i].ok++;
            }
            stp = nextStep(qRs[i], true);
            await ctx.replyWithMarkdown(data.tasks[stp]);
        } else if (chk0 && (stp25 || stp27)) {
            if (data.conds[stp].answer.includes(txt)) {
                //Хардкод. Верный ответ на вопрос 25
                if (stp25 && !qRs[i].a25.includes(txt)) {
                    qRs[i].a25.push(txt);
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;
                    let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
                    if (qRs[i].a25.length == 4) {
                        await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                        qRs[i].ok++;

                        stp = nextStep(qRs[i], true);
                        await ctx.replyWithMarkdown(data.tasks[stp]);
                    }
                }
                //Хардкод. Верный ответ на вопрос 27
                if (stp27 && !qRs[i].a27.includes(txt)) {
                    qRs[i].a27.push(txt);
                    qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
                    qRs[i].trys[stp]++;
                    let msg = 'Осталось попыток: ' + (data.conds[stp].tryouts-qRs[i].trys[stp]).toString();
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 13)] + '*\n' + msg, {reply_to_message_id : m});
                    if (qRs[i].a27.length == 5) {
                        await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                        qRs[i].ok++;

                        stp = nextStep(qRs[i], true);
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

                    stp = nextStep(qRs[i], true);
                    await ctx.replyWithMarkdown(data.tasks[stp]);
                }
            }
        } else if (chk0 && !chk2) {
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

                stp = nextStep(qRs[i], true);
                await ctx.replyWithMarkdown(data.tasks[stp]);
            }
        } else {
            //Специальные вопросы
            if (chk3 && stp21) {
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
    var stp29 = stp == 29;
    //Хардкод. Вопрос 29 с получением фото от пользователей
    if (stp29) {
        qRs[i].pts[stp] = qRs[i].pts[stp] + data.conds[stp].points;
        if (qRs[i].pts[stp] >= 250) {
            stp = nextStep(qRs[i], false);
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
