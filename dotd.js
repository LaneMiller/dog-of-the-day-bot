document.addEventListener("DOMContentLoaded", (e) => {
  PIC_URL = `https://random.dog/woof.json`;
  KEY = config.API_KEY
  POST_URLS = config.CHANNELS.map( channel =>
    `https://slack.com/api/chat.postMessage?token=${KEY}&channel=%23${channel}&as_user=false&icon_emoji=%3Adog%3A&unfurl_media=true&username=Good%20Boi%20bot&pretty=1&text=`
  )

  const posted = [];
  const datesPosted = [];

  fetchDogPic = (now) => {
    return fetch(PIC_URL).then(res => res.json()).then(json => {
      const urlArr = json.url.split('.');
      const rightFileType = urlArr[urlArr.length - 1].toLowerCase() === `jpg`
      const uniqueDoggo = !posted.includes(json.url);

      if (rightFileType && uniqueDoggo) {
        posted.push(json.url);
        console.log(now);
        datesPosted.push(`${now.getMonth()} ${now.getDate()}`);
        POST_URLS.forEach( (postUrl) => {postDogPic(postUrl, json.url)} )
        console.log(`posted at ${now.getHours()}:${now.getMinutes()}`);
      } else {
        fetchDogPic();
      }
    }).catch(error => {console.log(error); setTimeout(startApp, 10000)});
  }

  postDogPic = (postUrl, picUrl) => {
    fetch(postUrl + `Here's your Dog of the Day!!   ${picUrl}`);
  }

  startApp = () => {
    const now = new Date();
    console.log(now);
    const msTillDog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0) - now;
    const noDogYet = !datesPosted.includes(`${now.getMonth()} ${now.getDate()}`);

    if (noDogYet) {
      if (msTillDog > 0) {
        setTimeout(() => {fetchDogPic(now).then(startApp)}, msTillDog);
      } else if (msTillDog <= 0) {
        fetchDogPic(now).then(startApp);
      }
    } else {
      setTimeout(startApp, 3600000); //check again in 1 hour
    }
  }

  startApp()
});
