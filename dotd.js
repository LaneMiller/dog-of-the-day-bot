document.addEventListener("DOMContentLoaded", (e) => {
  PIC_URL = `https://random.dog/woof.json`;
  KEY = config.API_KEY
  POST_URLS = config.CHANNELS.map( channel =>
    `https://slack.com/api/chat.postMessage?token=${KEY}&channel=%23${channel}&as_user=false&icon_emoji=%3Adog%3A&unfurl_media=true&username=Good%20Boi%20bot&pretty=1&text=`
  )

  const posted = [];
  const datesPosted = [];

  fetchDogPic = (now, date) => {
    return fetch(PIC_URL).then(res => res.json()).then(json => {
      const urlArr = json.url.split('.');
      const rightFileType = urlArr[urlArr.length - 1].toLowerCase() === `jpg`
      const uniqueDoggo = !posted.includes(json.url);

      if (rightFileType && uniqueDoggo) {
        posted.push(json.url);
        POST_URLS.forEach( (postUrl) => {postDogPic(postUrl, json.url)} )
        console.log(`posted at ${now.getHours()}:${now.getMinutes()}`);
      } else {
        fetchDogPic(now, date);
      }
    }).catch(error => {console.log(error); setTimeout(startApp, 10000)});
  }

  postDogPic = (postUrl, picUrl) => {
    fetch(postUrl + `Here's your Dog of the Day!!    ${picUrl}    Am I misbehaving? Reach out to <@U9H9T6KLG> with any error reports! `);
  }

  startApp = () => {
    const now = new Date();
    console.log('startApp called at', now);
    const date = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}`
    console.log(date);

    const msTillDog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0) - now;
    const noDogYet = !datesPosted.includes(date);
    console.log('No dog yet?', noDogYet);

    if (noDogYet) {
      datesPosted.push(date);
      console.log(`all datesPosted:`, datesPosted)
      if (msTillDog > 0) {
        console.log('It should be before 9am');
        setTimeout(() => {fetchDogPic(now, date)}, msTillDog);
        setTimeout(startApp, msTillDog + 30000)
      } else if (msTillDog <= 0) {
        console.log('It should after, or exactly, 9am');
        fetchDogPic(now, date)
        setTimeout(startApp, 30000)
      }
    } else {
      console.log('It should be after 9am on a day we already posted');
      setTimeout(startApp, 3600000); //check again in 1 hour
    }
  }

 startApp()
});
