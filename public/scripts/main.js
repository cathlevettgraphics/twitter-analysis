// get form
const twitterForm = document.forms['twitter-form'];
// get data from form
twitterForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(twitterForm);
  const data = Object.fromEntries(formData);
  console.log('searching twitter for', data);
  // SEARCH TWEETS
  searchTweets(data);
});

// get data from form and call render to page function
async function searchTweets(data) {
  try {
    const response = await fetch('/api/v1/get-tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('response', response);
      // save and pass the tweets we received from the server line 61 to render function
      const tweets = await response.json();
      // save to local if needed to stote
      renderTweets(tweets);
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.log('error', err.sendMessage || err.statusText);
  }
}

const postsMountNode = document.getElementById('tweet-mount-node');

// render data into dom
function renderTweets(tweets) {
  console.log({ tweets });

  if (tweets.statuses.length) {
    const list = document.createElement('ul');
    list.classList.add('tweet-list');
    // pull from local if needed to stote
    console.log({ tweets });

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const optionsTime = {
      hour: '2-digit',
      minute: '2-digit',
    };

    for (const user of tweets.statuses) {
      const li = document.createElement('li');
      li.innerHTML = `
      <div class="tweet-wrapper">
      <p>${new Date(Date.parse(user.created_at)).toLocaleString(
        undefined,
        options,
      )}</p>
      <h2>${user.user.name}</h2>
      <p>${user.text}</p>
      <p>tweeting from ${
        user.user.location ? user.user.location : 'unknown location'
      }</p>
      <p>${user.user.followers_count.toLocaleString('en-US')} followers</p>
      <p>${user.retweet_count.toLocaleString('en-US')} retweets</p>
      </div>
      `;
      list.append(li);
    }
    postsMountNode.innerHTML = '';
    postsMountNode.append(list);
  } else {
    postsMountNode.innerHTML = `<p>no tweets found, search for a more popular topic!</p>`;
  }
}
