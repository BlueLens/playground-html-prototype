let StyleApi = require('stylelens-sdk-js');

let playground_api = new StyleApi.PlaygroundApi()

/******
 * APIs
 * *****/
category = ''
offset = 0
limit = 100

function getImagesDatasetByCategory (category) {
    $( '#search-prev-button' ).prop("disabled", true)
    $( '#search-next-button' ).prop("disabled", true)
    $('.result-list').empty()

    let source = 'deepfashion'
    var opts = {
        'category': category,
        'offset': offset,
        'limit': limit
    };
    playground_api.getImagesDatasetByCategory(source, opts, function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('getImagesDatasetByCategory API called successfully.\n Returned data: ')
            console.log(data)
            drawResults(category, data.data)
        }
    })
}

function updateImagesDatasetByIds (ids, valid) {
    let source = 'deepfashion'
    playground_api.updateImagesDatasetByIds(source, ids, valid, function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('updateImagesDatasetByIds API called successfully.\n Returned data: ')
            console.log(data)
        }

        getImagesDatasetByCategory(category)
    })
}

function generateResultImage (image) {
    let _id = image.id ? image.id : '""'
    let url_with_box = image.url_with_box ? image.url_with_box : '""'

    return '<figure class="figure image-box-result" is-selected="false" ' +
        '_id="' + _id +
        '"> <img src="' + url_with_box + '" alt="" /></figure>'
}

function drawResults (category, data) {
    $( '#search-keywords-result-count' ).text('(' + category + ' : ' + data.total_count + '개)')

    if (offset > 0) {
        $( '#search-prev-button' ).prop("disabled", false)
    }
    if (data.images.length == limit) {
        $( '#search-next-button' ).prop("disabled", false)
    }

    $( '#search-results-current' ).text(' ( ' + (offset+1) + ' ~ )')
    if (data.images.length == 0) {
        $( '#search-results-current' ).text('( )')
    }

    for(let i=0; i<data.images.length; i++) {
        $('.result-list').append(generateResultImage(data.images[i]))
    }

    $( '.search-result-image' ).click(function () {
        console.log('_id : ' + $(this).attr('_id'))
    })

    $( '.image-box-result' ).click(function () {
        if ( $(this).attr('is-selected') == 'false' ) {
            $(this).attr('is-selected', 'true')
        } else {
            $(this).attr('is-selected', 'false')
        }

        $( '.image-box-result' ).each(function () {
            if ($(this).attr('is-selected') == 'true') {
                $(this).append('<figcaption>🚨🚨🚨SELECT🚨🚨🚨</figcaption>')
            } else {
                $(this).children('figcaption').remove()
            }
        })
    })
}

function getBaseUrl () {
    var re = new RegExp(/^.*\//);
    return re.exec(window.location.href);
}

function searchImageBoxButtonClicked () {
    if ($( '#search-image-box-input' ).val().trim() == '') {
        alert('Please enter the Search Category.')
        return
    }
    $( '#search-keywords-result-count' ).text('')
    category = $( '#search-image-box-input' ).val()
    offset = 0
    limit = 100
    $( '#search-results-current' ).text('')

    getImagesDatasetByCategory(category)

    $( '#search-image-box-input' ).val('')
}

function prevButtonClicked () {
    offset -= limit
    getImagesDatasetByCategory(category)
}

function nextButtonClicked () {
    offset += limit
    getImagesDatasetByCategory(category)
}

function saveButtonClicked () {
    let valid_ids = []
    let invalid_ids = []
    $( '.image-box-result' ).each(function () {
        if ( $(this).attr('is-selected') == 'false' ) {
            valid_ids.push($(this).attr('_id'))
        } else if ( $(this).attr('is-selected') == 'true' ) {
            invalid_ids.push($(this).attr('_id'))
        }
    })

    if (confirm('Category: ' + category + ' \nSELECTED(Invalid) : ' + invalid_ids.length)) {
        updateImagesDatasetByIds(valid_ids, true)
        updateImagesDatasetByIds(invalid_ids, false)
    } else {
    }
}

$(document).ready(function() {

    $('.navigate-to-playground').click(function () {
        $(location).attr('href', getBaseUrl());
    });

    $('.navigate-to-search').click(function () {
        $(location).attr('href', getBaseUrl() + 'search.html');
    });

    $('.navigate-to-image-box').click(function () {
        $(location).attr('href', getBaseUrl() + 'image_box.html');
    });

    $( '#search-image-box-button' ).click(searchImageBoxButtonClicked)
    $( '#search-prev-button' ).click(prevButtonClicked)
    $( '#search-next-button' ).click(nextButtonClicked)
    $( '.button-save' ).click(saveButtonClicked)

    let image_box_categories = ['Anorak',
        'Blazer',
        'Blouse',
        'Bomber',
        'Button-Down',
        'Cardigan       ',
        'Flannel        ',
        'Halter         ',
        'Henley         ',
        'Hoodie         ',
        'Jacket         ',
        'Jersey         ',
        'Parka          ',
        'Peacoat        ',
        'Poncho         ',
        'Sweater        ',
        'Tank           ',
        'Tee            ',
        'Top            ',
        'Turtleneck     ',
        'Capris         ',
        'Chinos         ',
        'Culottes       ',
        'Cutoffs        ',
        'Gauchos        ',
        'Jeans          ',
        'Jeggings       ',
        'Jodhpurs       ',
        'Joggers        ',
        'Leggings       ',
        'Sarong         ',
        'Shorts         ',
        'Skirt          ',
        'Sweatpants     ',
        'Sweatshorts    ',
        'Trunks         ',
        'Caftan         ',
        'Cape           ',
        'Coat           ',
        'Coverup        ',
        'Dress          ',
        'Jumpsuit       ',
        'Kaftan         ',
        'Kimono         ',
        'Nightdress     ',
        'Onesie         ',
        'Robe           ',
        'Romper         ',
        'Shirtdress     ',
        'Sundress       ']
    for (let i=0; i<image_box_categories.length; i++) {
        image_box_category = image_box_categories[i].trim()
        $('#search_image_box_categories').append('<option value="' + image_box_category + '">')
    }

})