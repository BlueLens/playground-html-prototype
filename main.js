let StyleApi = require('stylelens-sdk-js');

let playground_api = new StyleApi.PlaygroundApi()
let feed_api = new StyleApi.FeedApi()

/******
* APIs
* *****/
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
        }
    });
}

function getPlaygroundObjectsByUserImageFile (file) {
    resetViews()

    playground_api.getPlaygroundObjectsByUserImageFile(file, function(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('getPlaygroundObjectsByUserImageFile API called successfully.\n Returned data: ')
            console.log(data.data.boxes)
            drawObjectBoxes(data.data.boxes)
            drawDataSelect(data.data.boxes.length)
        }
    })
}
/******
 * ends of APIs
 * *****/

/******
 * Views
 * *****/
const USER_IMAGE_MAX_SIZE = 380
let RATIO

function loadPreviewImage(url, anImage) {
    let preview_img = $('.detecting-preview-img');
    preview_img.attr('src', url);

    // fit image to parent
    if (anImage.width >= anImage.height) {
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

    let detectingWrapW
    let detectingWrapH
    // ObjectBox restriction
    preview_img.one('load', function() {
        detectingWrapW = $(this).outerWidth();
        detectingWrapH = $(this).outerHeight();

        $('.detecting-wrap').css({
            'width': detectingWrapW,
            'height': detectingWrapH
        });

        console.log('ratio before : ' + RATIO)

        if (anImage.width >= anImage.height) {
            RATIO = detectingWrapW / USER_IMAGE_MAX_SIZE
        } else {
            RATIO = detectingWrapH / USER_IMAGE_MAX_SIZE
        }
    }).each(function() {
        if(this.complete) {
            preview_img.load();
        }

        let aFile = dataURLtoFile(url, anImage.name)
        getPlaygroundObjectsByUserImageFile(aFile)
    });
}

function resetViews() {
    resetObjectBoxes()
    resetDataSelect()
}

function resetObjectBoxes() {
    $('.detecting-wrap').empty()
}

function drawBox(box, index) {
    let div = document.createElement('div');
    div.className = 'detecting-square'

    div.style.left = box.left * RATIO + 'px'
    div.style.top = box.top * RATIO + 'px'
    div.style.width = (box.right - box.left) * RATIO + 'px'
    div.style.height = (box.bottom - box.top) * RATIO + 'px'

    if (index == 0) {
        div.className += ' is-selected'
    }
    let span = document.createElement('span');
    span.innerHTML = index + 1 + ''
    div.appendChild(span)

    $('.detecting-wrap').append(div)

    /*
     Detecting square랑 Attributes 번호 연결시키기
     */
    $('.detecting-square').mousedown(function() {
        $('.detecting-square').removeClass('is-selected');
        $('.page-item').removeClass('active');
        $(this).addClass('is-selected');
        if($(this).is(':first-child')) {
            $('.page-item:first-child').addClass('active');
        } else if($(this).is(':nth-child(2)')) {
            $('.page-item:nth-child(2)').addClass('active');
        } else if($(this).is(':nth-child(3)')) {
            $('.page-item:nth-child(3)').addClass('active');
        } else if($(this).is(':nth-child(4)')) {
            $('.page-item:nth-child(4)').addClass('active');
        } else if($(this).is(':nth-child(5)')) {
            $('.page-item:nth-child(5)').addClass('active');
        };
    });
}

function drawObjectBoxes(boxes) {
    boxes.forEach((value, index) => {
        drawBox(value.box, index)
    });
}

function resetDataSelect() {
    $('.data-select').empty()
}

function drawDataSelect(count) {
    let li, a
    for (let i=0; i<count; i++) {
        li = document.createElement('li')
        li.className = 'page-item'
        if (i==0) {
            li.className += ' active'
        }
        a = document.createElement('a')
        a.innerHTML = i + 1 + ''

        li.appendChild(a)

        $('.data-select').append(li)
    }

    $('.page-item').mousedown(function() {
        $('.detecting-square').removeClass('is-selected');
        $('.page-item').removeClass('active');
        $(this).addClass('active');
        if($(this).is(':first-child')) {
            $('.detecting-square:first-child').addClass('is-selected');
        } else if($(this).is(':nth-child(2)')) {
            $('.detecting-square:nth-child(2)').addClass('is-selected');
        } else if($(this).is(':nth-child(3)')) {
            $('.detecting-square:nth-child(3)').addClass('is-selected');
        } else if($(this).is(':nth-child(4)')) {
            $('.detecting-square:nth-child(4)').addClass('is-selected');
        } else if($(this).is(':nth-child(5)')) {
            $('.detecting-square:nth-child(5)').addClass('is-selected');
        };
    });
}
/******
 * ends of Views
 * *****/

/******
 * Utils
 * *****/
function resizeWithRatio (anImage) {
    var maxWidth = USER_IMAGE_MAX_SIZE;
    var maxHeight = USER_IMAGE_MAX_SIZE;
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
/******
 * ends of Utils
 * *****/

/******
 * from stylens.js
 * *****/
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

                var canvas = document.createElement('canvas');
                var context = canvas.getContext("2d");
                canvas.width = resizedImage.width;
                canvas.height = resizedImage.height;
                context.drawImage(resizedImage, 0, 0, resizedImage.width, resizedImage.height);

                console.log('original: \n' + resizedImage.width + ' x ' + resizedImage.height)

                let fileURL = canvas.toDataURL()
                loadPreviewImage(fileURL, resizedImage)

                // downloadToLocalWithURI(fileURL, resizedImage.name)
            }
            anImage.src = src
        }
        reader.readAsDataURL(anImageFile);
    }
}
