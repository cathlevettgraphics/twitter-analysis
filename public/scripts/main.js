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

// send data from form to the  server
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
      renderTweets();
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.log('error', err.sendMessage || err.statusText);
  }
}

// render data into dom
function renderTweets() {}
