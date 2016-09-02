const express = require('express')
    , bodyParser = require('body-parser')
    , config = require('./config')
const PubNub = require('pubnub');

// get/create/store UUID
// var UUID = PubNub.db.get('session') || (function(){
//     var uuid = PubNub.uuid();
//     PubNub.db.set('session', uuid);
//     return uuid;
// })();

var pubnub = new PubNub({
    subscribeKey: config.testSubscribeKey,
    publishKey: config.testPublishKey,
    secretKey: config.testSecretKey,
    logVerbosity: true,
    uuid: "0bbb304b-13ae-4fd7-9f5e-e3596e520b6c",
    ssl: true,
    presenceTimeout: 130,
})


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/node_modules', express.static('./node_modules'));
app.use(express.static('./public'));

pubnub.addListener({
  message: function(message) {
    console.log(message);
  },
  presence: function(presence) {
    console.log(presence)
  },
  status: function(status) {
    console.log(status);
  }
})

pubnub.subscribe({
    channels: ['my_channel'],
    withPresence: true // also subscribe to presence instances.
});

app.get('/test', function (req, res, next) {
  console.log('reached endpoint!');
  pubnub.publish(
    {
        message: {
            such: 'object'
        },
        channel: 'my_channel',
        sendByPost: false, // true to send via post
        storeInHistory: false, //override default storage options
        meta: {
            "cool": "meta"
        }   // publish extra meta with the request
    },
    function (status, response) {
        if (status.error) {
            // handle error
            console.log(status)
        } else {
            console.log("message Published w/ timetoken", response.timetoken)
        }
    }
);
  res.send('yeah yeah yeah');
})

const port = 3000;
app.listen(port, function() {
  console.log('Listening on port');
})
