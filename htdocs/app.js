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
    j = 0;
    for (var i = 0; i < qRs.length; i++) {
        qRs[i].step = 0;
        qRs[i].t1 = [];
        qRs[i].t1.push(Date.now());
        qRs[i].t2 = [];
        qRs[i].trys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].pts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        qRs[i].total = 0;
        await bot.telegram.sendPhoto(data.chats[i], yc+data.images[qRs[i].step][0]);
        await bot.telegram.sendMessage(data.chats[i], data.tasks[qRs[i].step], { parse_mode: "MarkdownV2" }) //team 1
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
    var i = data.chats.indexOf(c.id);

    //console.log(c.title);
    if (qRs[i].step < data.tasks.length-1) {
        var txt = ctx.message.text.toLowerCase();
        //check = (qRs[i].answer).test(txt);
        let check0 = txt.substr(0, 1) == '!';
        let check1 = data.conds[qRs[i].step].answer == txt;
        let check2 = data.conds[qRs[i].step].tryouts == 0;
        let check3 = txt.substr(0, 1) == '?';
        let check4 = (qRs[i].step == 25 || qRs[i].step == 27);
        if (check1 && check2) {
            //Вывод следующего задания
            qRs[i].t1.push(Date.now());
            qRs[i].t2.push(qRs[i].t1);
            qRs[i].step++;

            //hardcode
            if (data.imgaes[qRs[i].step].length > 0) {
                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][0]);
                  //hardcode
                  if (qRs[i].step == 1) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][2], [{disable_notification: true}]);
                  } else if (qRs[i].step == 3) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 17) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 19) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  } else if (qRs[i].step == 21) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                  } else if (qRs[i].step == 23) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 25) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][3]);
                  } else if (qRs[i].step == 27) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  } else if (qRs[i].step == 29) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  }
            }
            await ctx.replyWithMarkdown(data.tasks[qRs[i].step]);
            //console.log('next - ', qRs[i]);

        } else if (check1) {
            //Верный ответ
            await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*');
            qRs[i].pts[qRs[i].step] = data.conds[qRs[i].step].points;
            qRs[i].trys[qRs[i].step]++;
            //let msg = 'Осталось попыток: '+(data.conds[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString();
            //await ctx.reply(msg);
            await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
            j++;
            qRs[i].t2.push(qRs[i].t1);
            qRs[i].t1.push(Date.now());
            qRs[i].step++;

            if (data.imgaes[qRs[i].step].length > 0) {
                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][0]);
                  //hardcode
                  if (qRs[i].step == 1) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][2], [{disable_notification: true}]);
                  } else if (qRs[i].step == 3) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 17) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 19) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  } else if (qRs[i].step == 21) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                  } else if (qRs[i].step == 23) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                  } else if (qRs[i].step == 25) {
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                      await ctx.replyWithPhoto(yx+data.images[qRs[i].step][3]);
                  } else if (qRs[i].step == 27) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  } else if (qRs[i].step == 29) {
                      await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                  }
            }
            await ctx.replyWithMarkdown(data.tasks[qRs[i].step]);
            //console.log('right - ', qRs[i]);

        } else if (check0 && check4) {
            if (data.conds[qRs[i].step].answer.includes(txt)) {
                //верный ответ на спец. вопрос + хардкод 25
                if (qRs[i].step == 25 && !a25.includes(txt)) {
                    a25.push(txt);
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*');
                    qRs[i].pts[qRs[i].step] = qRs[i].pts[qRs[i].step] + data.conds[qRs[i].step].points;
                    qRs[i].trys[qRs[i].step]++;
                    let msg = 'Осталось попыток: '+(data.conds[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString();
                    await ctx.reply(msg);
                    if (a25.length == 3) {
                        await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
                        j++;
                        qRs[i].t2.push(qRs[i].t1);
                        qRs[i].t1.push(Date.now());
                        qRs[i].step++;

                        if (data.imgaes[qRs[i].step].length > 0) {
                              await ctx.replyWithPhoto(yx+data.images[qRs[i].step][0]);
                              //hardcode
                              if (qRs[i].step == 1) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][2], [{disable_notification: true}]);
                              } else if (qRs[i].step == 3) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 17) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 19) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              } else if (qRs[i].step == 21) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                              } else if (qRs[i].step == 23) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 25) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][3]);
                              } else if (qRs[i].step == 27) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              } else if (qRs[i].step == 29) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              }
                        }
                        await ctx.replyWithMarkdown(data.tasks[qRs[i].step]);
                        //console.log('right - ', qRs[i]);
                    }
                }
                //верный ответ на спец. вопрос + хардкод 27
                if (qRs[i].step == 27 && !a27.includes(txt)) {
                    a27.push(txt);
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*');
                    qRs[i].pts[qRs[i].step] = qRs[i].pts[qRs[i].step] + data.conds[qRs[i].step].points;
                    qRs[i].trys[qRs[i].step]++;
                    let msg = 'Осталось попыток: '+(data.conds[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString();
                    await ctx.reply(msg);
                    if (a27.length == 5) {
                        await bot.telegram.sendDocument(c.id, yc+data.ok[j], [{disable_notification: true}]);
                        j++;
                        qRs[i].t2.push(qRs[i].t1);
                        qRs[i].t1.push(Date.now());
                        qRs[i].step++;

                        if (data.imgaes[qRs[i].step].length > 0) {
                              await ctx.replyWithPhoto(yx+data.images[qRs[i].step][0]);
                              //hardcode
                              if (qRs[i].step == 1) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][2], [{disable_notification: true}]);
                              } else if (qRs[i].step == 3) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 17) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 19) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              } else if (qRs[i].step == 21) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                              } else if (qRs[i].step == 23) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                              } else if (qRs[i].step == 25) {
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][1]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][2]);
                                  await ctx.replyWithPhoto(yx+data.images[qRs[i].step][3]);
                              } else if (qRs[i].step == 27) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              } else if (qRs[i].step == 29) {
                                  await bot.telegram.sendDocument(c.id, yc+data.imgaes[qRs[i].step][1], [{disable_notification: true}]);
                              }
                        }
                        await ctx.replyWithMarkdown(data.tasks[qRs[i].step]);
                        //console.log('right - ', qRs[i]);
                    }
                }
            } else {
                //неверный ответ на спец. вопрос
                await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*');
                qRs[i].trys[qRs[i].step]++;
                let msg = 'Осталось попыток: '+(data.conds[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString();
                await ctx.reply(msg);
                //исчерпали все попытки
                //...
            }

        } else if (check0 && !check2) {
            //Неверный ответ
            await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*');
            qRs[i].trys[qRs[i].step]++;
            let msg = 'Осталось попыток: '+(data.conds[qRs[i].step].tryouts-qRs[i].trys[qRs[i].step]).toString();
            await ctx.reply(msg);
            //console.log('wrong - ', qRs[i]);
            //Исчерпали все попытки
            //...

        } else {
            //Специальные вопросы
            if (qRs[i].step == 21 && check3) {
                if (data.Qs21.includes(txt)) {
                    await ctx.replyWithMarkdown('*'+data.right[getRandom(0, 13)]+'*');
                } else {
                    await ctx.replyWithMarkdown('*'+data.wrong[getRandom(0, 6)]+'*');
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
