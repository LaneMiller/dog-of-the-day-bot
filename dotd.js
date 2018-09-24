const fs = require('fs');
const fetch = require('node-fetch');
const { config } = require('./config.js')

PIC_URL = `https://random.dog/woof.json`;
KEY = config.API_KEY
POST_URLS = config.CHANNELS.map( channel =>
  `https://slack.com/api/chat.postMessage?token=${KEY}&channel=%23${channel}&as_user=false&icon_emoji=%3Adog%3A&unfurl_media=true&username=Good%20Boi%20bot&pretty=1&text=`
)

const posted = [];
const datesPosted = [];

fetchDogPic = (time, logLines) => {
  return fetch(PIC_URL).then(res => res.json()).then(json => {
    const urlArr = json.url.split('.');
    const rightFileType = urlArr[urlArr.length - 1].toLowerCase() === `jpg`
    const uniqueDoggo = !posted.includes(json.url);

    if (rightFileType && uniqueDoggo) {
      posted.push(json.url);
      POST_URLS.forEach( (postUrl) => {postDogPic(postUrl, json.url)} )
      logLines += `[${time}]: dog posted.\n`;
    } else {
      fetchDogPic(time, logLines);
    }
  }).catch(error => {logLines += `[${time}]: error - ${error}\n`; setTimeout(startApp, 10000)});
}

postDogPic = (postUrl, picUrl) => {
  fetch(postUrl + `Here's your Dog of the Day!!    ${picUrl}    Am I misbehaving? Reach out to <@U9H9T6KLG> with any error reports! `);
}

startApp = () => {
  let logLines = ``;

  const now = new Date();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  const date = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}`
  logLines += `[${time}]: startApp called at ${now}\n`;

  const msTillDog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0) - now;
  const noDogYet = !datesPosted.includes(date);
  logLines += `[${time}]: No dog yet? ${noDogYet}\n`;

  if (noDogYet) {
    datesPosted.push(date);
    logLines += `[${time}]: datesPosted: ${datesPosted}\n`;

    if (msTillDog > 0) {
      logLines += `[${time}]: It should be before 9am\n`;
      setTimeout(() => {fetchDogPic(time, logLines)}, msTillDog);
      setTimeout(startApp, msTillDog + 30000)
    } else if (msTillDog <= 0) {
      logLines += `[${time}]: It should be after, or exactly, 9am\n`;
      fetchDogPic(time, logLines)
      setTimeout(startApp, 30000)
    }

  } else {
    logLines += `[${time}]: It should be after 9am on a day we already posted\n`;
    setTimeout(startApp, 3600000); //check again in 1 hour
  }

  fs.writeFile(`/home/pi/dog-of-the-day-bot/logs/log-${date}.txt`, logLines, {flag: 'a'}, function(err) {
    if(err) {
      console.log('error: ', err);
      logLines += `[${time}]: error - ${err}\n`;
    }
    console.log(`log-${date}.txt written.`);
  });
}

startApp();
