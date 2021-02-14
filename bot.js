// Bot settings
const Discord = require("discord.js");
const bot = new Discord.Client();

const prefix = "!";
const ownerID = process.env.OWNER_ID;
const logChannel = process.env.LOG_CHANNEL

const superagent = require("superagent");
const pack = require("./package.json");
require("events").EventEmitter.defaultMaxListeners = Infinity;

// Database connection
const data = require("./database.json");
const joke = data.joke;
const maps = data.maps;

// Bot connection
bot.login(process.env.TOKEN);
bot.on("ready", () => {
  bot.user.setPresence({
    status: "dmd",
    activity: {
      name: "Sabaton",
      type: 2
    }
  });
});

// Ordinary functions
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getRandArrIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

// !say
bot.on("message", async message => {
  if (message.author.bot) return;
  if (
    message.content.startsWith(prefix + "say") &&
    message.author.id === ownerID
  ) {
    await message.delete().catch(o_O => {
      console.log(o_O);
    });
    message.channel.send(message.content.slice(5));
  }
});

// !invite
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "invite")) {
    message.channel.send(
      `https://discord.com/api/oauth2/authorize?client_id=672043257219252224&permissions=0&scope=bot`
    );
  }
});

// !help
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "help")) {
    message.reply("привет, я Opeks! Чем могу быть полезен?");
    message.channel.send({
      embed: {
        author: {
          name: "Opeks"
        },
        color: "#ad1914",
        thumbnail: {
          url: bot.user.displayAvatarURL({
            dynamic: true,
            size: 1024
          })
        },
        fields: [
          {
            name: "Вызов команд",
            value: "!command args"
          },
          {
            name: "Список команд",
            value: "В разработке :)" //"http://opeks-discord.glitch.me/"
          },
          {
            name: "Бот создан",
            value: "29 января 2020 в 11:39:58 (UTC)"
          },
          {
            name: "Написан на",
            value: `Node.js: v${pack.engines.node}\nDiscord.js: v${
              Object.values(pack.dependencies)[0]
            }`
          },
          {
            name: "Хостинг",
            value: process.env.HOSTING
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !roll
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "roll")) {
    let args = message.content.split(" ").slice(1);
    let value = args;
    if (isNaN(args[0])) {
      value = 20;
    } else {
      value = args[0];
    }
    let result = getRandomInt(value) + 1;
    let fresult = result;
    let mods = [];
    for (let i of args.slice(1)) {
      if (!isNaN(args[0])) {
        fresult += i;
        mods.append(i);
      }
    }
    message.channel.send({
      embed: {
        author: {
          name: `🔢 Случайное число от 1 до ${value}`
        },
        color: "#ad1914",
        fields: [
          {
            name: ":game_die: Выпало значение:",
            value: `**${getRandomInt(value) + 1}**`
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !кубик
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "кубик")) {
    let number = message.content.split(" ").slice(1)[0];
    let results = [];
    let sum = 0;
    let result;
    if (number > 1 && number < 101) {
      for (let i = 0; i < number; i++) {
        result = getRandomInt(6) + 1;
        sum += result;
        if (result == 1) {
          results[i] = ':one:'
        }
        if (result == 2) {
          results[i] = ':two:'
        }
        if (result == 3) {
          results[i] = ':three:'
        }
        if (result == 4) {
          results[i] = ':four:'
        }
        if (result == 5) {
          results[i] = ':five:'
        }
        if (result == 6) {
          results[i] = ':six:'
        }
      }
      message.channel.send(`Брошено кубиков: ${number}\nРезультаты: ${results.join(' ')}\nСумма: ${sum}`);
    }
    if (number == 1 || !number) {
      let result = getRandomInt(6) + 1;
        if (result == 1) {
          result = ':one:'
        }
        if (result == 2) {
          result = ':two:'
        }
        if (result == 3) {
          result = ':three:'
        }
        if (result == 4) {
          result = ':four:'
        }
        if (result == 5) {
          result = ':five:'
        }
        if (result == 6) {
          result = ':six:'
        }
      message.channel.send(`Брошен кубик. Результат: ${result}`);
    }
    
  }
});

// !d
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith("!d")) {
    let args = message.content.split("").slice(2).join("").split(" ");
    let preresult = Number(Math.floor(Math.random() * Math.floor(args[0])));
    let result = preresult + Number(args[1]);
    message.channel.send(result)
  }
});

// question
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.mentions.users.first() == bot.user) {
    let messg = message.content.split("");
    if (messg.slice(-1) == "?") {
      let w = getRandomInt(100) + 1;
      let answer;
      if (w <= 50) {
        answer = [
          "да!",
          "определённо, да!",
          "да, конечно!",
          "да, ясно дело!",
          "однозначно.",
          "конечно!",
          "да. А как может быть иначе?"
        ];
      } else {
        answer = [
          "нет!",
          "определённо, нет!",
          "нет, конечно!",
          "ни в коем случае.",
          "я так не думаю.",
          "ответ отрицателен.",
          "с чего? Нет, конечно."
        ];
      }
      message.reply(answer[getRandArrIndex(answer)]);
    }
  }
});

// !chance
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "chance")) {
    let args = message.content.split(" ").slice(1);
    let chance;
    let action;
    if (isNaN(args[0])) {
      chance = 50;
      action = args.join(" ");
    } else {
      chance = args[0];
      action = args.slice(1).join(" ");
    }
    let w = getRandomInt(100) + 1;
    let answer;
    if (w <= chance) {
      answer = [
        "Да!",
        "Определённо, да!",
        "Да, конечно!",
        "Однозначно.",
        "Почему бы и нет?",
        "Конечно!",
        "Да. А как может быть иначе?"
      ];
    } else {
      answer = [
        "Нет!",
        "Определённо, нет!",
        "Нет, конечно!",
        "Ни в коем случае.",
        "Я так не думаю.",
        "Ответ отрицателен.",
        "С чего? Нет, конечно."
      ];
    }
    message.channel.send({
      embed: {
        author: {
          name: "🎲 Вероятность события"
        },
        color: "#ad1914",
        fields: [
          {
            name: ":grey_question: Событие:",
            value: action
          },
          {
            name: ":scales: Вероятность удачи:",
            value: `${chance} %`
          },
          {
            name: ":ballot_box_with_check: Результат:",
            value: answer[getRandArrIndex(answer)]
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !joke (jokes from the S.T.A.L.K.E.R. game)
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "joke")) {
    let value = getRandArrIndex(joke);
    message.channel.send({
      embed: {
        author: {
          name: "Внимание, анекдот!"
        },
        color: "#ad1914",
        fields: [
          {
            name: `№${value}`,
            value: joke[value]
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !clean
bot.on("message", async message => {
  if (message.author.bot) return;
  if (
    message.content.startsWith(prefix + "clean") ||
    message.content.startsWith(prefix + "чистка")
  ) {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let amount = parseInt(args[0]) + 1;
    let messCount = args[0];
    if (isNaN(amount))
      return message.reply(
        "введите количество сообщений, которые нужно удалить."
      );
    if (amount <= 1 || amount > 100)
      return message.reply("необходимо ввести число от 1 до 99.");
    if (
      !message.member.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID
    )
      return message.reply("Вам недоступна эта функция.");
    message.channel.bulkDelete(amount, true);
    message.channel
      .send(`Удалено ${messCount} сообщений!`)
      .then(msg => msg.delete({
        timeout: 5000,
        reason: "Чтобы было"
      }));
    bot.channels.cache
      .get(logChannel)
      .send(
        `${message.author.username} удалил ${amount - 1} сообщений в канале ${
          message.channel
        } (${message.guild}).`
      );
  }
});

// !mute
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "mute")) {
    let args = message.content.split(" ").slice(1);
    let mUser = message.guild.member(
      message.mentions.users.first() ||
        message.guild.members.cache.find(
          m => m.user.username == args[0] || m.id == args[0]
        )
    );
    if (!mUser)
      return message.channel.send("Не могу найти этого пользователя...");
    if (
      !message.member.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != mUser.id
    )
      return message.channel.send("У тебя недостаточно прав для этого");
    if (
      mUser.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != mUser.id
    )
      return message.channel.send("Этот пользователь не может быть заглушен");
    let reason = args.slice(1).join(" ");
    let muterole = message.guild.roles.cache.find(r => r.name === "Заглушен");
    if (!muterole)
      muterole = await message.guild.roles.create({
        data: {
          name: "Заглушен",
          color: 0x607d8d
        }
      });
    mUser.send(
      `${message.author.username} заглушил вас на сервере «${message.guild}» по причине: ${reason}`
    );
    bot.channels.cache
      .get(logChannel)
      .send(
        `${message.author.username} заглушил ${mUser.user.username} на сервере «${message.guild}» по причине: ${reason}`
      );
    await mUser.roles.add(muterole.id);
    message.channel.send({
      embed: {
        author: {
          name: "Мут пользователя"
        },
        color: "#ad1914",
        fields: [
          {
            name: "Заглушенный пользователь:",
            value: mUser
          },
          {
            name: "Был заглушен:",
            value: message.author
          },
          {
            name: "Дата:",
            value: message.createdAt
          },
          {
            name: "Причина:",
            value: reason
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !kick
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "kick")) {
    let args = message.content.split(" ").slice(1);
    let kUser = message.guild.member(
      message.mentions.users.first() ||
        message.guild.members.cache.find(
          m => m.user.username == args[0] || m.id == args[0]
        )
    );
    if (!kUser)
      return message.channel.send("Не могу найти этого пользователя...");
    if (
      !message.member.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != kUser.id
    )
      return message.channel.send("У тебя недостаточно прав для этого");
    if (
      kUser.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != kUser.id
    )
      return message.channel.send("Этот пользователь не может быть кикнут");
    let reason = args.slice(1).join(" ");
    kUser.send(
      `${message.author.username} кикнул вас с сервера «${message.guild}» по причине: ${reason}`
    );
    await bot.channels.cache
      .get(logChannel)
      .send(
        `${message.author.username} кикнул ${kUser.user.username} на сервере «${message.guild}» по причине: ${reason}`
      );
    await kUser.kick(reason);
    message.channel.send({
      embed: {
        author: {
          name: "Кик пользователя"
        },
        color: "#ad1914",
        fields: [
          {
            name: "Удалённый пользователь:",
            value: kUser
          },
          {
            name: "Был удалён:",
            value: message.author
          },
          {
            name: "Дата:",
            value: message.createdAt
          },
          {
            name: "Причина:",
            value: reason
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !ban
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "ban")) {
    let args = message.content.split(" ").slice(1);
    let bUser = message.guild.member(
      message.mentions.users.first() ||
        message.guild.members.cache.find(
          m => m.user.username == args[0] || m.id == args[0]
        )
    );
    if (!bUser) return message.channel.send("Пользователь не найден");
    if (
      !message.member.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != bUser.id
    )
      return message.channel.send("У тебя недостаточно прав для этого");
    if (
      bUser.permissions.has("MANAGE_MESSAGES") &&
      message.author.id !== ownerID &&
      message.author.id != bUser.id
    )
      return message.channel.send(
        "Этот пользователь не может быть заблокирован"
      );
    let reason = args.slice(1).join(" ");
    bUser.send(
      `${message.author.username} заблокировал вас на сервере «${message.guild}» по причине: ${reason}`
    );
    bot.channels.cache
      .get(logChannel)
      .send(
        `${message.author.username} заблокировал ${bUser.user.username} на сервере «${message.guild}» по причине: ${reason}`
      );
    await bUser.ban(reason);
    message.channel.send({
      embed: {
        author: {
          name: "Бан пользователя"
        },
        color: "#ad1914",
        fields: [
          {
            name: "Заблокированный пользователь:",
            value: bUser
          },
          {
            name: "Был заблокирован:",
            value: message.author
          },
          {
            name: "Дата:",
            value: message.createdAt
          },
          {
            name: "Причина:",
            value: reason
          }
        ],
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !gr
bot.on("message", async message => {
  if (message.author.bot) return;
  if (
    message.content.startsWith(prefix + "gr") &&
    message.author.id == ownerID
  ) {
    await message.delete();
    let args = message.content.split(" ").slice(1);
    let user = message.guild.member(
      message.mentions.users.first() ||
        message.guild.members.cache.find(
          m => m.user.username == args[0] || m.id == args[0]
        )
    );
    let role = message.guild.roles.cache.find(
      r => r.name === args.slice(1).join(" ")
    );
    user.roles.add(role.id);
  }
});

// !rr
bot.on("message", async message => {
  if (message.author.bot) return;
  if (
    message.content.startsWith(prefix + "rr") &&
    message.author.id == ownerID
  ) {
    await message.delete();
    let args = message.content.split(" ").slice(1);
    let user = message.guild.member(
      message.mentions.users.first() ||
        message.guild.members.cache.find(
          m => m.user.username == args[0] || m.id == args[0]
        )
    );
    let role = message.guild.roles.cache.find(
      r => r.name === args.slice(1).join(" ")
    );
    user.roles.remove(role.id);
  }
});

// !voting
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "voting")) {
    let args = message.content.split(" ").slice(1);
    let variables = args.join(" ");
    variables = variables.split("|");
    /*let vararr = '';
    for (let i = 1; i++; i < variables.lenght) {
      if (i == 1) vararr += '1️⃣' + variables[1] + '\n';
      if (i == 2) vararr += '2️⃣' + variables[2] + '\n';
      if (i == 3) vararr += '3️⃣' + variables[3] + '\n';
      if (i == 4) vararr += '4️⃣' + variables[4] + '\n';
      if (i == 5) vararr += '5️⃣' + variables[5] + '\n';
      if (i == 6) vararr += '6️⃣' + variables[6] + '\n';
      if (i == 7) vararr += '7️⃣' + variables[7] + '\n';
      if (i == 8) vararr += '8️⃣' + variables[8] + '\n';
      if (i == 9) vararr += '9️⃣' + variables[9] + '\n';
      if (i == 10) vararr += '0️⃣' + variables[10];
      message.channel.send(vararr)
    }*/
    message.channel
      .send({
        embed: {
          author: {
            name: "Голосование"
          },
          color: "#ad1914",
          fields: [
            {
              name: "Описание",
              value: variables[0]
            },
            {
              name: "Варианты",
              value: variables.slice(1).join("\n")
            }
          ],
          footer: {
            text: "Opeks powered by Оррин"
          },
          timestamp: new Date()
        }
      })
      .then(msg => {
        let i = 1;
        function reactionLoop() {
          setTimeout(function() {
            if (i == 1) msg.react("1️⃣");
            if (i == 2) msg.react("2️⃣");
            if (i == 3) msg.react("3️⃣");
            if (i == 4) msg.react("4️⃣");
            if (i == 5) msg.react("5️⃣");
            if (i == 6) msg.react("6️⃣");
            if (i == 7) msg.react("7️⃣");
            if (i == 8) msg.react("8️⃣");
            if (i == 9) msg.react("9️⃣");
            if (i == 10) msg.react("0️⃣");
            i++;
            if (i < variables.length) {
              reactionLoop();
            }
          }, 500);
        }
        reactionLoop();
      });
  }
});

// !choise
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "choise")) {
    let args = message.content.split(" ").slice(1);
    message.channel.send(args[getRandArrIndex(args)])
  }
});

// !nekos-life
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "nekos-life")) {
    if (!message.channel.nsfw)
      return message.reply(
        "команда может использоваться только в канале NSFW."
      );
    let category = message.content.split(" ").slice(1);
    let resp = await superagent.get(
      `https://nekos.life/api/v2/img/${category}`
    );
    let { body } = await superagent.get(
      `https://nekos.life/api/v2/img/${category}`
    );
    if (body.msg == "404" || resp.statusCode !== 200)
      return message.reply("не могу найти картинку по этому запросу...");
    message.channel.send({
      embed: {
        color: "#ad1914",
        image: {
          url: body.url
        },
        footer: {
          text: "Opeks powered by Оррин"
        },
        timestamp: new Date()
      }
    });
  }
});

// !wttr
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "wttr")) {
    let args = message.content.split(" ").slice(1);
    let type = args[0];
    let city = args.slice(1).join(" ");
    if (type == "text") {
      let url = encodeURI(`http://wttr.in/${city}?m&M&format=2&lang=ru`);
      let resp = await superagent.get(url);
      return message.channel.send({
        embed: {
          color: "#ad1914",
          fields: {
            name: `Погода: ${city}`,
            value: resp.text
          },
          footer: {
            text: "Opeks powered by Оррин"
          },
          timestamp: new Date()
        }
      });
    }
    if (type == "img") {
      let url = encodeURI(`http://wttr.in/${city}.png?m&M&p&0&Q&lang=ru`);
      return message.channel.send({
        embed: {
          color: "#ad1914",
          author: {
            name: `Погода: ${city}`
          },
          image: {
            url: url
          },
          footer: {
            text: "Opeks powered by Оррин"
          },
          timestamp: new Date()
        }
      });
    }
  }
});

// Выдача ролей на Ламоране
bot.on("guildMemberAdd", async member => {
  let role = member.guild.roles.cache.find(r => r.name == "Начинающий");
  await member.roles.add(role.id)
});

//////////////////////////////////////////
///////////Reaction → Role////////////////
//////////////////////////////////////////
/*bot.on("messageReactionAdd", async (MessageReaction, user) => {
  if (MessageReaction.message.id === "740155922613141535") {
    console.log("Yes");
  } else {
    console.log("No");
  }
});*/

////////////////////////////////////////////////////////
////////////////Games///////////////////////////////////
////////////////////////////////////////////////////////
const kmaps = Object.keys(maps);
const vmaps = Object.values(maps);
let chan = 0;
let game = 0;
let cell = 0;

bot.on("message", async message => {
  if (message.author.bot) return;
  if (
    message.channel.id === chan &&
    !message.content.startsWith(prefix + "game")
  ) {
    if (game === "map") {
      for (let i of vmaps[cell]) {
        if (message.content.includes(i)) {
          chan = 0;
          cell = 0;
          game = 0;
          return message.reply("правильно!");
        }
      }
      return message.reply("неверно!");
    }
  }
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "game")) {
    chan = message.channel.id;
    let args = message.content.split(" ").slice(1);
    if (args[0] === "map-state") {
      game = "map";
      cell = getRandArrIndex(kmaps);
      message.channel.send({
        embed: {
          color: "#ad1914",
          author: {
            name: "Игра «Карта — Страна»"
          },
          image: {
            url: kmaps[cell]
          },
          fields: {
            name: "Что написать в ответе:",
            value: "Название страны, изображённой на карте."
          },
          footer: {
            text: "Opeks powered by Оррин"
          },
          timestamp: new Date()
        }
      });
    }
  }
});