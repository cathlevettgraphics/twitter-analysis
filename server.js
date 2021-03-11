require('dotenv').config();
const Twitter = require('twitter');
const express = require('express');

// twitter keys
const {
  PORT = 3333,
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} = process.env;

// defensive checks
if (!consumer_key) throw new Error('no consumer key provided');
if (!consumer_secret) throw new Error('no consumer secret provided');
if (!access_token_key) throw new Error('no access token key provided');
if (!access_token_secret)
  throw new Error('no access token secret key provided');

// twitter client
const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

// make app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// GET tweets – search for text / hashtag
// search tweets API page – https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
const TWITTER = 'https://api.twitter.com/1.1/';
const API_ENDPOINT = 'search/tweets.json';
const FULL_API_ENDPOINT = `${TWITTER}${API_ENDPOINT}`;

app.post('/api/v1/get-tweets', (req, res) => {
  // get params from form input
  console.log('testing', req.body);

  const { params } = req.body;

  (async () => {
    try {
      const response = await client.get(
        FULL_API_ENDPOINT,
        params,
        function (error, tweets, response) {
          if (error) {
            console.log('err', error);
          }
          console.log(tweets);
        },
      );
      // RES STATUS HERE
      res.status(201).json(response);
    } catch (err) {
      console.log('err', err);
    }
  })();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

/* working api call
const endpoint = 'search/tweets.json';
const params = { q: '#etherium' };

client.get(endpoint, params, function (error, tweets, response) {
  if (error) {
    console.log('err', error);
  }
  console.log(tweets);
});

*/
