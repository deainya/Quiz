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
var globe = 1;

//Timer
function myFunc(arg) {
  console.log(`arg was => ${arg}`);
}

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
    /*var c = ctx.message.chat;
    var stp = 0;
    console.log(c);
    chats.push(c.id);
    qRs.push({
        chat: c.id, user: c,
        step: stp, ok: 0, t1: [Date.now()], t2: [],
        a: [[],[],[],[],[], [],[],[],[],[], [],[],[],[],[], [],[],[],[],[]],
        trys: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pts:  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 0
    });
    ctx.replyWithMarkdown(data.tasks[0] + "\n\nКак только будете готовы, введите фразу «поехали» БЕЗ ПРОБЕЛОВ и с восклицательным знаком вначале, вот так: *!поехали*");*/
    ctx.replyWithMarkdown('Приветик!');
})
bot.help((ctx) => {
    //ctx.replyWithMarkdown(data.tasks[0]);
    ctx.replyWithMarkdown('А вот и помощь!');
})
bot.command('messageit', (ctx) => {
    bot.telegram.sendMessage(5291523486, 'Отличная работа! Ты играл как боженька! Красивая игра и второе место в общем рейтинге из 94 участников. Напиши, пожалуйста, Асе Губайдуллиной в Teams (или @deainya в Telegram), чтобы забрать свой подарок!', { parse_mode: "Markdown" });
    ctx.reply('Сообщение отправлено Retrum');
})

// Подсчёт результатов
/*bot.command('score', (ctx) => {
    var c = ctx.message.chat;
    var i = chats.indexOf(c.id);

    if (i == -1) {
        ctx.replyWithMarkdown(`Привет, *${ctx.message.chat.first_name}*!\nДобро пожаловать на ДИТ challenge! Вводи команду *\/start*`);
    } else {
        let total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            if (qRs[i].pts[j] > 0) {
                if (qRs[i].trys[j] == 1) {total = total + qRs[i].pts[j];}
                else if (qRs[i].trys[j] == 2) {total = total + qRs[i].pts[j] - 25;}
                else if (qRs[i].trys[j] == 3) {total = total + qRs[i].pts[j] - 50;}
            }
        }
        ctx.reply(total);
    }
})
bot.command('scoreit', async (ctx) => {
    //Evaluating scores per each chat & user
    console.log(qRs);
    var score = [];
    for (var i = 0; i < qRs.length; i++) {
        var str = '';
        qRs[i].total = 0;
        for (var j = 0; j < qRs[i].pts.length; j++) {
            if (qRs[i].pts[j] > 0) {
                if (qRs[i].trys[j] == 1) {qRs[i].total = qRs[i].total + qRs[i].pts[j];}
                else if (qRs[i].trys[j] == 2) {qRs[i].total = qRs[i].total + qRs[i].pts[j] - 25;}
                else if (qRs[i].trys[j] == 3) {qRs[i].total = qRs[i].total + qRs[i].pts[j] - 50;}
            }
        }
        score.push({id: qRs[i].chat, u: qRs[i].user, t: qRs[i].total});
        str = qRs[i].chat.toString() + '\n'
            + 'user: ' + qRs[i].user.username + ' ' + qRs[i].user.first_name + ' ' + qRs[i].user.second_name + '\n'
            + 'try: ' + qRs[i].trys.toString() + '\n'
            + 'pts: ' + qRs[i].pts.toString() + '\n';
        if (i%25 == 0) {await setTimeout(myFunc, 5000, 'funky');}
        await ctx.reply(str);
    }
    quickSort(score, 0, score.length - 1);
    console.log(score);
    var msg = '';
    for (var i = 0; i < score.length; i++) {
        msg = msg + score[i].t.toString() + ' - ' + score[i].u.username + ' ' + score[i].u.first_name + ' ' + score[i].u.second_name + '\n';
        if (i%25 == 0) {
            await ctx.reply(msg);
            msg = '';
        }
    }
    await ctx.reply(msg);
})
bot.command('quizitknowit', (ctx) => {
    for (var i = 0; i < qRs.length; i++) {
        if (qRs[i].step == globe + 1) {
            bot.telegram.sendMessage(qRs[i].chat, data.tasks[qRs[i].step], { parse_mode: "Markdown" });
        }
        //console.log(qRs[i]);
    }
    if (globe == 11 || globe == 16) {globe++; globe++; globe++;}
    else if (globe == 14) {globe++; globe++;}
    else {globe++;}
    ctx.reply('Номер доступного сейчас шага ' + globe.toString());
})*/

// Реакция на текстовые сообщения
/*bot.on('text', async (ctx) => {
    var c = ctx.message.chat;
    var m = ctx.message.message_id;
    var txt = ctx.message.text.toLowerCase();
    var i = chats.indexOf(c.id);

    if (i == -1) {
        ctx.replyWithMarkdown(`Привет, *${ctx.message.chat.first_name}*!\nДобро пожаловать на ДИТ challenge! Вводи команду *\/start*`);
    } else {
        var stp = qRs[i].step;
        if (stp <= globe) {
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
                            if (stp <= globe) {await ctx.replyWithMarkdown(data.tasks[stp]);}
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
                                if (stp <= globe) {await ctx.replyWithMarkdown(data.tasks[stp]);}
                            }
                        }
                    }
                } else if (!chk2 && chk3) {
                    //Неверный ответ
                    qRs[i].trys[stp]++;
                    let trs = data.conds[stp].tryouts-qRs[i].trys[stp];
                    //Исчерпали все попытки
                    if (trs > 0) { await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*\n' + try1 + trs, {reply_to_message_id : m}); }
                    else {
                        await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*\n' + try2, {reply_to_message_id : m});
                        stp = nextStep(qRs[i], true);
                        if (stp <= globe) {await ctx.replyWithMarkdown(data.tasks[stp]);}
                    }
                }
            }
        }

    }

})*/

// Ловим ошибки приложеньки
bot.catch((err) => {
    console.log('Doh!\n', err);
})

// Запускаем poll обработчик бота
console.log('started');
bot.startPolling();
