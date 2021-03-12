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
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// GET tweets – search for text / hashtag
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
const API_ENDPOINT = 'search/tweets.json';

// post responses to my local server
app.post('/api/v1/get-tweets', (req, res) => {
  // get params from form input
  console.log('testing', req.body);

  // get search term from form
  const { search } = req.body;

  // get tweets
  (async () => {
    try {
      const response = await client.get(
        API_ENDPOINT,
        // match format in docs { q: '#etherium' }
        { q: search, count: 50, lang: 'eu' },
        // callback
        function (error, tweets, response) {
          if (error) {
            console.log('err', error);
            return res.status(500).send(err);
          }
          console.log(tweets);
          res.status(201).json(tweets);
        },
      );
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(err);
    }
  })();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

/*
const endpoint = 'search/tweets.json';
const params = { q: '#etherium' };

client.get(endpoint, params, function (error, tweets, response) {
  if (error) {
    console.log('err', error);
  }
  console.log(tweets);
});

*/
