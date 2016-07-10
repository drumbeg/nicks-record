var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

var config = fs.readFileSync('config.json');
config = JSON.parse(config);

var randomRecord;

function go() {
request.get({
  uri: 'http://api.discogs.com/users/vinylmemory/collection?page=1&per_page=1000',
  headers: {"user-agent": 'vinylmemory/0.1'}
}, function(err, response, body) {
  var parsedCollection = JSON.parse(body);
  var records = parsedCollection.releases;
  var randomRecord = records[Math.floor(Math.random() * records.length)];

  request.get({
    uri: 'http://api.discogs.com/releases/' + randomRecord.release_id,
    headers: {"user-agent": 'vinylmemory/0.1'}
  }, function(err, response, body) {

    var parsedRelease = JSON.parse(body);
    var videoLink = parsedRelease.hasOwnProperty("videos") ? parsedRelease.videos[0].uri : '';
    var discogsUrl = parsedRelease.uri;

    var client = new Twitter({
      consumer_key: config.twitter_auth.consumer_key,
      consumer_secret: config.twitter_auth.consumer_secret,
      access_token_key: config.twitter_auth.access_token_key,
      access_token_secret: config.twitter_auth.access_token_secret
    });

    client.post('statuses/update', {
      status:randomRecord.basic_information.artists[0].name + ' : ' + 
      randomRecord.basic_information.title +
      ' released in ' +
      randomRecord.basic_information.year +
      '. ' +
      videoLink + ' ' + discogsUrl
    }, function(error, tweets, response) {
      if (error) {
        process.exit();
        console.log(error);
      }
    });
  });
});
setTimeout(go, 1 * 60 * 1000);
}

go();


