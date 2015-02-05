
getTweets('china');

function getTweets(alert) {
    var socket = io.connect(location.protocol + '//' + location.host);
    socket.emit('join', alert);
    socket.on(alert, function displayTweet(data) {
        document.getElementById('contentList').innerHTML =
            '<li>'+
            data.tweet.text +
            '</li>' +
            document.getElementById('contentList').innerHTML;
    });
}