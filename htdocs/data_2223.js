module.exports = {
    ok: [ 'r01.mp4','r02.mp4','r03.mp4','r04.mp4','r05.mp4','r06.mp4','r07.mp4','r08.mp4',
          'r09.gif','r10.gif','r11.gif','r12.gif','r13.gif','r14.gif','r15.gif','r16.gif','r17.gif','r18.gif'],
    nok: [],
    images: [
      [{type: 'photo', name: 'Рисунок1.jpg'}], //0
      [{type: 'photo', name: 'Рисунок2.png'}], //1
      [], //2
      [{type: 'photo', name: 'Рисунок3.png'}], //3
      [], //4
      [{type: 'photo', name: 'Рисунок4.png'}], //5
      [], //6
      [{type: 'photo', name: 'Рисунок5.png'}, {type: 'photo', name: 'Рисунок7.png'}], //7
      [{type: 'photo', name: 'Рисунок8.png'}], //8
      [{type: 'photo', name: 'Рисунок9.png'}], //9
      [{type: 'photo', name: 'Рисунок10.png'}], //10
      [{type: 'photo', name: 'Рисунок11.png'}], //11
      [{type: 'document', name: '1.mp3'}], //12
      [{type: 'document', name: '2.mp3'}], //13
      [{type: 'document', name: '3.mp3'}], //14
      [{type: 'document', name: '4.mp3'}], //15
      [{type: 'document', name: '5.mp3'}], //16
      [{type: 'document', name: '6.mp3'}], //17
      [{type: 'document', name: '7.mp3'}], //18
      [{type: 'document', name: '8.mp3'}], //19
      [{type: 'document', name: '9.mp3'}], //20
      [{type: 'document', name: '10.mp3'}], //21
      [{type: 'photo', name: 'Рисунок12.png'}], //22
      [{type: 'photo', name: 'Рисунок13.png'}], //23
      [{type: 'photo', name: 'Рисунок14.png'}], //24
      [{type: 'photo', name: 'Рисунок15.png'}], //25
      [], //26
      [{type: 'photo', name: 'Рисунок16.png'}], //27
      [], //28
      [{type: 'photo', name: 'Рисунок17.png'}] //29
    ],
    tasks: [
        //0
        "Каков проказник! Не хватило Гринчу в прошлом году неудачного похищения серверов! Он украл наших котиков Тима и Фичу. Скорее отправляйся на поиски!\n\nКак только будете готовы, введите слово «поехали» с восклицательным знаком вначале, вот так:\n\n*!поехали*",
        //1
        "Мы нашли следы Гринча. Прежде чем отправиться дальше, Гринч покатался по московскому метро. Кажется, он зашифровал в станциях, которые посетил, какую-то подсказку. Посмотри на картинку, и ответь, в какой город направился Гринч.\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //2
        "Ого! Как ты догадался? Впрочем, это не так важно, как наши котики! Скорее отправляемся в Варшаву!\n\nКак только будете готовы, введите слово «поехали» с восклицательным знаком вначале, вот так:\n\n*!поехали*",
        //3
        "Ага! Посмотри, что мы нашли прямо в центре Варшавы, на доске розыска! Оказывается, Гринч случайно попал на фото в каком-то городе... Только вот в каком? Попытайся угадать, в каком городе был Гринч.\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //4
        "Ты просто невероятный детектив! Это, действительно, Берлин! Скорее бы нам спасти Тима и Фичу. Не теряй времени, погнали дальше!\n\nКак только будете готовы, введите слово «поехали» с восклицательным знаком вначале, вот так:\n\n*!поехали*",
        //5
        "Гринч обронил свой телефон в парке Люстгарден рядом с Берлинским кафедральным собором. Внимательно посмотри на него — должно быть здесь есть какая-то подсказка, которая поможет нам понять, куда он направился дальше. В ответе напиши город, зашифрованный на картинке.\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //6
        "Париж — город любви и, надеюсь, раскрытых преступлений! Только не засматривайся на Эйфелеву Башню — нужно торопиться! Может, спросишь у местных, не видели ли они этого злобного зелёного эльфа!\nКак только будете готовы, введите фразу «расспроситьместных» с восклицательным знаком вначале, вот так:\n\n*!расспроситьместных*",
        //7
        "Нам чрезвычайно везёт! Расспросы сотрудников аэропорта дали свои плоды: один из них припомнил зелёного эльфа среди пассажиров, но, как назло, куда он ехал, сотрудник вспомнить не может...\nЗато он передал тебе две странные бумаги, которые изъял у Гринча на паспортном контроле. Неужели это очередная загадка от Гринча? Разгадай бонусы и напиши, куда отправился этот зелёный хулиган?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //8
        "Так вот где Гринч решил спрятать наших котов — в Британском музее — главном историко-археологическом музее Великобритании! Открой Гугл карты и введи координаты с шифровок Гринча: 51.5200649, -0.1279236\nПерейди в режим просмотра улиц в этой точке, нажав на значок человечка в правом нижнем углу.\n\nКак только будете готовы, введите фразу «явмузее» с восклицательным знаком вначале, вот так:\n\n*!явмузее*",
        //9
        "Ты оказался в Библиотеке Британского музея, тут находятся древние рукописные и первые печатные книги, а также где-то тут ты сможешь найти следующую подсказку. Отдохни немного на скамейке перед доспехами японского самурая, и отправляйся вверх по лестнице в следующий зал.\n\nТам найди эту корзину и скажи, какое время года изображено на картине над ней.\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //10
        "Всё верно! Смотри, вот и подсказка от Гринча! И когда он только успел заменить фотографию...\nВидимо, он оставил Фичу именно в этом месте, которое ты видишь на картинке. Постой, я знаю где это... кажется, мы видели эту панель с рыбой, которая так напугала нашу кошечку, на первом этаже Британского музея. Спустись с места, на котором ты сейчас стоишь, на первый этаж. Тебе нужно пройти от двух каменных львов в самом начале зала прямо по галерее до стенда с рыбой. Внимательно смотри по сторонам!\nЧтобы переключаться между этажами, воспользуйтесь панелью в правом нижнем углу экрана.\nКак только будете готовы, введите фразу «мынашлистенд» с восклицательным знаком вначале, вот так:\n\n*!мынашлистенд*",
        //11
        "Видимо Гринч пересмотрел мультфильмов и решил подшутить над нами — он превратил редкий экспонат музея в говорящую рыбу! Теперь она поёт какие-то песни, да еще и в обратном порядке. Послушай отрывки, и напиши, какие песни зашифрованы\n\nКак только будете готовы, введите слово «начинаем» с восклицательным знаком вначале, вот так: *!начинаем*",
        //12
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //13
        "Как называется эта песня?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //14
        "А как называется эта песня?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //15
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //16
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //17
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //18
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //19
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //20
        "Какая группа исполняет эту песню?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //21
        "Как зовут исполнительницу этой песни?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //22
        "Ура! Как же круто, что удалось расколдовать эту бедную рыбу!\nПостой, кажется, я слышу хихиканье где-то в противоположном конце зала... Мы идём по горячим следам! Надо пройти по залу мимо круглого мраморного ограждения, звуки раздавались откуда-то слева.\nИ вновь Гринч напроказничал! Он украл что-то с этого стенда! Кажется, это место совсем рядом. Найди его, осмотри и напиши, что же украл Гринч?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //23
        "Верно! Гринч украл лошадь! Хорошо хоть ненастоящую.\nКажется, на седле спрятана подсказка... Посмотри, что там Гринч для нас оставил? Такое ощущение, что нам нужно на третий этаж. Не двигаясь с места перед стендом с лошадью, переместись на третий этаж.\nКак только будете готовы, введите слово «поднялись» с восклицательным знаком вначале, вот так: *!поднялись*",
        //24
        "Так, мы на третьем этаже. Что дальше делаем? В зале справа от нас ничего нет. Ищем дальше... Слева что-то подозрительное, присмотрись. Найди иероглифы, изображенные на фотографии, и напиши в единственном числе, что изображено на плакате справа от них?\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //25
        "Проказы Гринча не перестают удивлять, он умудрился испортить даже такую древнюю реликвию! Кажется, он что-то зашифровал здесь. Может, и эта разгадка поможет нам в поисках?\nРазгадай, что Гринч зашифровал в эмоджи-иероглифах?\nДля ответа сначала укажи номер вопроса, затем ответ без пробелов, например: *!12названиефильма*",
        //26
        "Ничего себе! Да ты блистаешь своей эрудицией! Все экспонаты в этом музее расколдованы.\nВведи в Гугл картах название следующей локации: Earls Court Police Box\n\nКак только будете готовы, введите слово «ввели» с восклицательным знаком вначале, вот так: *!ввели*",
        //27
        "Ого... Кажется мы попали на английскую улочку Эрлс-Корт-Роуд. Нужно оглядеться: вдруг и здесь будет что-то подозрительное. Слева аптека и велосипеды, дальше — светящаяся будка... Стой! В синей будке виднеется какое-то странное голубое свечение...\n\nНайди способ попасть в синюю будку, а после напиши, сколько ступеней у лестницы, оказавшейся справа от тебя.",
        //28
        "Что же это за чудо-место? Нужно осмотреть всё помещение. Здесь столько панелей, как в них только возможно разобраться?\nСмотри, кажется, там какой-то странный экран, на ней изображен какой-то космический объект! Экран как раз расположен прямо над всеми панелями управления.\nНайди эту панель в будке и напиши, что изображено на ней.\n\nФормат ответа:\n\n*!слово (БЕЗ пробелов)*",
        //29
        "29 the end for now"
        //30
        //"Ура!!! Наконец-то мы спасли наших котиков! Вы молодецы!\nЧтобы котики помнили своих героев – пришлите фотографии участников команды!\nУ вас есть 20 минут, чтобы сделать и выслать 5 фото от команды"
    ],
    conds: [
        {answer: ["!поехали"], time: 0, tryouts: 0, points: 0}, //0
        {answer: ["!варшава"], time: 0, tryouts: 3, points: 5}, //1
        {answer: ["!поехали"], time: 0, tryouts: 0, points: 0}, //2
        {answer: ["!берлин"], time: 0, tryouts: 3, points: 5}, //3
        {answer: ["!поехали"], time: 0, tryouts: 0, points: 0}, //4
        {answer: ["!париж"], time: 0, tryouts: 3, points: 5}, //5
        {answer: ["!расспроситьместных"], time: 0, tryouts: 0, points: 0}, //6
        {answer: ["!британскиймузей"], time: 0, tryouts: 3, points: 5}, //7
        {answer: ["!явмузее"], time: 0, tryouts: 0, points: 0}, //8
        {answer: ["!зима"], time: 0, tryouts: 3, points: 5}, //9
        {answer: ["!мынашлистенд"], time: 0, tryouts: 0, points: 0}, //10
        {answer: ["!начинаем"], time: 0, tryouts: 0, points: 0}, //11 --песни
        {answer: ["!агатакристи"], time: 0, tryouts: 3, points: 10}, //12
        {answer: ["!акула"], time: 0, tryouts: 3, points: 10}, //13
        {answer: ["!альянс"], time: 0, tryouts: 3, points: 10}, //14
        {answer: ["!аукцыон"], time: 0, tryouts: 3, points: 10}, //15
        {answer: ["!жуки"], time: 0, tryouts: 3, points: 10}, //16
        {answer: ["!мираж"], time: 0, tryouts: 3, points: 10}, //17
        {answer: ["!мумийтролль"], time: 0, tryouts: 3, points: 10}, //18
        {answer: ["!отпетыемошенники"], time: 0, tryouts: 3, points: 10}, //19
        {answer: ["!смысловыегаллюцинации"], time: 0, tryouts: 3, points: 10}, //20
        {answer: ["!софияротару"], time: 0, tryouts: 3, points: 10}, //21
        {answer: ["!лошадь"], time: 0, tryouts: 3, points: 5}, //22
        {answer: ["!поднялись"], time: 0, tryouts: 0, points: 0}, //23
        {answer: ["!пирамида"], time: 0, tryouts: 3, points: 5}, //24
        {answer: ["!1гарипоттер","!2ледиибродяга","!3интерстеллар","!4теориябольшоговзрыва","!5улицыразбитыхфонарей","!6леон","!7назадвбудущее","!8форрестгамп","!9историяигрушек","!10пятыйэлемент","!11шерлок","!12томиджерри"], time: 0, tryouts: 36, points: 10}, //25
        {answer: ["!ввели"], time: 0, tryouts: 0, points: 0}, //26
        {answer: ["!8"], time: 0, tryouts: 3, points: 5}, //27
        {answer: ["!галактика"], time: 0, tryouts: 3, points: 5} //28
    ],
    right: [ //12 random
        "БЕЗОШИБОЧНО! 💪",
        "БЕССПОРНО! 😜",
        "В ТОЧКУ! 😉",
        "В ЯБЛОЧКО! 😎",
        "ВЕРНО! 💪",
        "ВЕРНО! 🤓",
        "ВЫПОЛНЕНО! 😎",
        "ЗАСЧИТАНО! 😉",
        "МОЛОДЕЦ! 🤓",
        "ПРАВИЛЬНО! 😉",
        "ТАК ДЕРЖАТЬ! 😜",
        "ТОЧНО! 😎"
    ],
    wrong: [ //7 random
        "Тебе стоит приложить больше усилий, вероятно 😐",
        "Думаю, это не тот ответ, который я жду 🙃",
        "Кажется, не совсем верный ответ 🤔",
        "Не хочу тебя расстраивать, но это не тот ответ, который я жду 😐",
        "Неправильно. Какие еще варианты? 🙃",
        "Нет-нет, это не то. Жду другой вариант 😐",
        "Это неправильный ответ. Подумай ещё 🤔"
    ],
    left_try: "Осталось попыток: ",
    done_try: "Уже засчитал этот ответ 🤓",
    last_try: "Увы, попытки закончились 😮"
}
