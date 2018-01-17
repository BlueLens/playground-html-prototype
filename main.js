let StyleApi = require('stylelens-sdk-js');

let playground_api = new StyleApi.PlaygroundApi()
let feed_api = new StyleApi.FeedApi()

function getFeeds () {
    var opts = {
        'offset': 0,
        'limit': 100
    };

    feed_api.getFeeds(opts, function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('getFeeds API called successfully.\n Returned data: ')
            console.log(data)
            console.log(response)
        }
    });
}

function getObjectsWithUserFile (file) {
    playground_api.getPlaygroundObjectsByUserImageFile(file, function(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('getPlaygroundObjectsByUserImageFile API called successfully.\n Returned data: ')
            console.log(data)
        }
    })
}

function resizeWithRatio (anImage) {
    var maxWidth = 380;
    var maxHeight = 380;
    var ratio = 0;
    var width = anImage.width
    var height = anImage.height

    if (width >= height) {
        ratio = maxWidth / width;
        anImage.width = maxWidth;
        anImage.height = height * ratio;
    } else {
        ratio = maxHeight / height;
        anImage.width = width * ratio;
        anImage.height = maxHeight;
    }
    return anImage;
}

function dataURLtoFile (dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function downloadToLocalWithURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function loadPreviewImage(url, width, height) {
    let preview_img = $('.detecting-preview-img');
    preview_img.attr('src', url);

    if (width >= height) {
        preview_img.css({
            'width': '100%',
            'height' : 'auto'
        })
    } else {
        preview_img.css({
            'width': 'auto',
            'height': '100%'
        })
    }
    // console.log(preview_img)
    $('.detecting-preview-img').one('load', function() {
        var detectingWrapW = $(this).outerWidth();
        var detectingWrapH = $(this).outerHeight();
        $('.detecting-wrap').css({
            'width': detectingWrapW,
            'height': detectingWrapH
        });

    }).each(function() {
        if(this.complete) {
            $('.detecting-preview-img').load();
        }
    });
}

window.readInputFile = function (input) {
    if (input[0] && input[0].files[0]) {
        let anImageFile = input[0].files[0]

        var reader = new FileReader();
        reader.onload = function (e) {
            let src = e.target.result;

            let anImage = new Image()
            anImage.onload = function () {
                anImage.name = anImageFile.name
                anImage.type = anImageFile.type

                let resizedImage = resizeWithRatio(anImage)
                console.log(resizedImage.width + ' x ' + resizedImage.height)

                var canvas = document.createElement('canvas');
                var context = canvas.getContext("2d");
                canvas.width = resizedImage.width;
                canvas.height = resizedImage.height;
                context.drawImage(resizedImage, 0, 0, resizedImage.width, resizedImage.height);

                let fileURL = canvas.toDataURL()
                loadPreviewImage(fileURL, resizedImage.width, resizedImage.height)

                // downloadToLocalWithURI(fileURL, resizedImage.name)
                let aFile = dataURLtoFile(fileURL, resizedImage.name)
                getObjectsWithUserFile(aFile)
            }
            anImage.src = src
        }
        reader.readAsDataURL(anImageFile);
    }
}
