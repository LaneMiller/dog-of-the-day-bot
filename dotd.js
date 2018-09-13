
document.addEventListener("DOMContentLoaded", (e) => {
  PIC_URL = `https://random.dog/woof.json`;
  POST_URL = config.POST_URL;
  const posted = [];
  const datesPosted = [];

  const startDate = new Date();

  fetchDogPic = (now) => {
    fetch(PIC_URL).then(res => res.json()).then(json => {
      const urlArr = json.url.split('.');
      const rightFileType = urlArr[urlArr.length - 1].toLowerCase() === `jpg`
      const uniqueDoggo = !posted.includes(json.url);

      if (rightFileType && uniqueDoggo) {
        posted.push(json.url);
        datesPosted.push(`${now.getMonth()} ${now.getDate()}`);
        // change config.POST_URL to return an array of urls,
        // then update postDogPic to take postUrl and picUrl
        // POST_URL.forEach( (postUrl) => {postDogPic(postUrl, json.url)} )
        postDogPic(json.url);
        console.log(`posted at ${now.getHours()}:${now.getMinutes()}`);
      } else {
        fetchDogPic();
      }
    }).catch(error => {console.log(error); setTimeout(startApp, 60000)});
  }

  postDogPic = (picUrl) => {
    fetch(POST_URL + `${picUrl} Here's your Dog of the Day!!`);
  }

  startApp = () => {
    const now = new Date();
    console.log(now);
    const msTillDog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0) - now;
    const oneDogPerDay = !datesPosted.includes(`${now.getMonth()} ${now.getDate()}`);

    if (msTillDog <= 0 && oneDogPerDay) {
      fetchDogPic(now);
    }
    setTimeout(startApp, 3600000); //check again in 1 hour
  }

  startApp()
});
