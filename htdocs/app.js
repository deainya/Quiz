// Подключаем библиотеки и внешние скрипты
const config = require('./config');
const data = require('./data_238');
const try1 = data.left_try;
const try2 = data.last_try;
const try3 = data.done_try;

const { Telegraf } = require('telegraf');
const { Extra, Markup } = Telegraf;

// Квиз бот
const bot = new Telegraf(config.bot_token);
//const chats = config.chats;
const yc = config.yc;

// Объявляем переменные
var chats = [];
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
bot.start((ctx) => {
    var c = ctx.message.chat;
    var stp = 0;
    console.log(c);
    chats.push(c.id);
    console.log(ctx.message.from);
    qRs.push({
        chat: c.id, user: ctx.message.from,
        step: stp, ok: 0, t1: [], t2: [],
        a: [[],[],[],[],[], [],[],[],[],[], [],[],[],[],[], [],[]],
        trys: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0],
        pts:  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0],
        total: 0
    });
    qRs[i].t1.push(Date.now());
    //await ctx.reply(`Привет, ${ctx.message.from.first_name}.\n`);
    ctx.replyWithMarkdown(data.tasks[0]);
})
bot.help((ctx) => {
    ctx.replyWithMarkdown(data.tasks[0]);
})

// Подсчёт результатов
bot.command('scoreit', async (ctx) => {
    //Evaluating scores per each chat & user
    var score = [];
    var str = '';
    for (var i = 0; i < qRs.length; i++) {
        qRs[i].total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            //Change!!! Результаты: * qRs[i].trys[j]
            qRs[i].total = qRs[i].total + qRs[i].pts[j];
        }
        score.push({
            id: qRs[i].chat,
            u: qRs[i].user,
            t: qRs[i].total});
        str = str + qRs[i].chat.toString() + '\n'
                  + 'user: ' + qRs[i].user.toString() + '\n'
                  + 'try: ' + qRs[i].trys.toString() + '\n'
                  + 'pts: ' + qRs[i].pts.toString() + '\n\n';
    }
    await ctx.reply(str);
    var msg = '';
    quickSort(score, 0, score.length - 1);
    for (var i = 0; i < score.length; i++) {
        msg = msg + score[i].t.toString() + ' - ' +
                    score[i].u.toString() + ' (' + score[i].id.toString() + ')\n';
    }
    await ctx.reply(msg);
})

// Реакция на новых пользователей в группе
bot.on('new_chat_members', (ctx) => {
    console.log(ctx.message.new_chat_members);
    ctx.replyWithMarkdown(`Привет, *${ctx.message.new_chat_members[0].first_name}*!\nДобро пожаловать на ДИТ challenge! Вводи команду *\/start*`);
})

// Реакция на текстовые сообщения
bot.on('text', async (ctx) => {
    var c = ctx.message.chat;
    var m = ctx.message.message_id;
    var txt = ctx.message.text.toLowerCase();
    var i = chats.indexOf(c.id);

    if (i == -1) {
        ctx.replyWithMarkdown(`Привет, *${ctx.message.chat.first_name}*!\nДобро пожаловать на ДИТ challenge! Вводи команду *\/start*`);
    } else {
        var stp = qRs[i].step;

        if (stp < data.tasks.length-1) {
            //chk = (qRs[i].answer).test(txt);
            let chk1 = data.conds[stp].answer.includes(txt);
            let chk2 = data.conds[stp].tryouts == 0;
            let chk3 = txt.substr(0, 1) == '!';
            var stp19 = stp == 19;
            if (chk1 && chk2) {
                //Вывод следующего задания
                if (stp19) {stp = nextStep(qRs[i], false);} else {stp = nextStep(qRs[i], true);} //Hardcode
                await ctx.replyWithMarkdown(data.tasks[stp]);
            } else if (chk1) {
                //Верный ответ
                if (!qRs[i].a[stp].includes(txt)) {
                    //Фиксируем ответ
                    qRs[i].a[stp].push(txt);
                    //Начисляем очки
                    qRs[i].pts[stp] = data.conds[stp].points;
                    //Фиксируем попытки
                    qRs[i].trys[stp]++;
                    let trs = data.conds[stp].tryouts-qRs[i].trys[stp];
                    await ctx.replyWithMarkdown('*' + data.right[getRandom(0, 11)] + '*\n' + try1 + trs, {reply_to_message_id : m});
                    //Проверяем что получили все ответы
                    if (qRs[i].a[stp].length == data.conds[stp].answer.length) {
                        //Выводим gif-ку
                        await bot.telegram.sendDocument(c.id, yc + data.ok[qRs[i].ok], [{disable_notification: true}]);
                        qRs[i].ok++;
                        stp = nextStep(qRs[i], true);
                        //Change!!! Новое задание
                        await ctx.replyWithMarkdown(data.tasks[stp]);
                    }
                } else {
                    if (qRs[i].a[stp].includes(txt)) { await ctx.replyWithMarkdown(try3, {reply_to_message_id : m}); }
                    else {
                        //Неверный ответ
                        qRs[i].trys[stp]++;
                        let trs = data.conds[stp].tryouts-qRs[i].trys[stp];
                        //Исчерпали все попытки
                        if (trs > 0) { await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + try1 + trs, {reply_to_message_id : m}); }
                        else {
                            await ctx.replyWithMarkdown('*' + data.wrong[getRandom(0, 6)] + '*\n' + try2, {reply_to_message_id : m});
                            stp = nextStep(qRs[i], true);
                            await ctx.replyWithMarkdown(data.tasks[stp]);
                        }
                    }
                }
            }
        }

    }

})

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('Doh!\n', err);
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
