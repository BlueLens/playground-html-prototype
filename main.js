var StyleApi = require('stylelens-sdk-js');

var api = new StyleApi.FeedApi()

var opts = {
    'offset': 0, // {Number}
    'limit': 10 // {Number}
};

var callback = function(error, data, response) {
    console.log('getFeeds CallBack.')
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
        console.log(data)
    }
};
api.getFeeds(opts, callback);
