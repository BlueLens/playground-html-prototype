let StyleApi = require('stylelens-sdk-js');

let playground_api = new StyleApi.PlaygroundApi()

/******
 * APIs
 * *****/
keyword = ''
offset = 0
limit = 100

function getImagesByKeyword (keyword) {
    $( '#search-prev-button' ).prop("disabled", true)
    $( '#search-next-button' ).prop("disabled", true)
    $('.result-list').empty()

    var opts = {
        'keyword': keyword,
        'offset': offset,
        'limit': limit
    };
    playground_api.getImagesByKeyword(opts, function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('getImagesByKeywords API called successfully.\n Returned data: ')
            console.log(data)
            drawResults(keyword, data.data)
        }
    })
}

function generateResultImage (image) {
    console.log(image.name)
    let product_name = image.name ? image.name : '""'
    let cate = image.cate ? image.cate : '""'
    let tags = image.tags ? image.tags : '""'
    let image_src = image.main_image_mobile_full ? image.main_image_mobile_full : '""'

    return '<figure class="figure search-result-image"' +
        'product_name="' + product_name +
        '" cate="' + cate +
        '" tags="' + tags +
        '"> <img src="' + image_src + '" alt="" />' +
        '<figcaption>' + keyword + '</figcaption> </figure>'
}

function drawResults (keyword, data) {
    $( '#search-keywords-result-count' ).text('(' + keyword + ' : ' + data.total_count + '개)')

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
        console.log('product_name : ' + $(this).attr('product_name')
            + '\ncate : ' + $(this).attr('cate')
            + '\ntags : ' + $(this).attr('tags'))
    })
}

function getBaseUrl () {
    var re = new RegExp(/^.*\//);
    return re.exec(window.location.href);
}

function searchButtonClicked () {
    if ($( '#search-keywords-input' ).val().trim() == '') {
        alert('Please enter the Search Keyword.')
        return
    }
    $( '#search-keywords-result-count' ).text('')
    keyword = $( '#search-keywords-input' ).val()
    offset = 0
    limit = 100
    $( '#search-results-current' ).text('')

    getImagesByKeyword(keyword)

    $( '#search-keywords-input' ).val('')
}

function prevButtonClicked () {
    offset -= limit
    getImagesByKeyword(keyword)
}

function nextButtonClicked () {
    offset += limit
    getImagesByKeyword(keyword)
}

$(document).ready(function() {

    $('.navigate-to-playground').click(function () {
        $(location).attr('href', getBaseUrl());
    });

    $('.navigate-to-search').click(function () {
        $(location).attr('href', getBaseUrl() + 'search.html');
    });

    $( '#search-button' ).click(searchButtonClicked)
    $( '#search-prev-button' ).click(prevButtonClicked)
    $( '#search-next-button' ).click(nextButtonClicked)

    // $( '.search-result-image' ).click(function () {
    //     console.log('product_name : ' + $(this).attr('product_name')
    //                 + '\ncate : ' + $(this).attr('cate')
    //                 + '\ntags : ' + $(this).attr('tags'))
    // })

    let keywords = ['티셔츠','t_shirt','티셔츠','t-shirts','tshirts','tee','반팔티','반팔','긴팔','sleeveless','나시티','민소매티','슬리브리스티','Tank','Tee','Henley','Jersey',
        '크롭탑','crop_top','크롭탑','crop_top','croptop','크롭티','crop','배꼽티','브라','브래지어','bra','brassiere','bralette','브라렛','앞후크','노와이어브라',
        '블라우스','blouse','블라우스','blouse','bl','Blouse',
        '셔츠','shirt','셔츠','남방','shirts','nb','Button-Down','Flannel',
        '스웨터','sweater','니트','스웨터','knit','nt','Turtleneck','Sweater',
        '스웨트셔츠','sweatshirt','맨투맨','mantoman','mtm','sweatshirt','후드티','hood','후드T','Hoodie','Poncho',
        '자켓','jaket','자켓','jaket','jk','점퍼','jumper','jp','가디건','cardigan','cd','조끼','베스트','vest','후드집업','Anorak','Bomber','Jacket','Jersey','blazer','Cardigan',
        '코트','coat','코트','coat', 'ct', '롱패딩', 'long패딩','Parka','Peacoat','Coat',
        '팬츠','pants','pants','팬츠','바지','슬랙스','slacks','레깅스','leggings','pt','Chinos','Capris','chinos','culottes','Gauchos','Jodhpurs','joggers','leggins','sweatpants',
        '청바지','jeans','jean','청바지','워싱진','데님진','스키니진','블랙진','화이트진','데님팬츠','데님바지','제깅스','jeggings','jeans',
        '반바지','shorts','반바지','쇼츠','shorts','숏팬츠','핫팬츠','팬티','panty','panties','속바지','이너팬츠','트렁크','하프팬츠','쇼트팬츠','cutoffs','shorts','sweatshorts','trunks',
        '치마','skirt','치마','skirt','스커트','sk','치마바지','스커트팬츠','skirtpants','skirt',
        '드레스','dress','dress','드레스','슬립','가운','slip','gown','원피스','ops','onepiece','기모노','sarong','Caftan','Cape','Dress','Kaftan','Nightdress','Robe','Romper','Shirtdress','Sundress','kimono',
        '점프슈트','jumpsuit','점프수트','점프슈트','바디수트','바디슈트','bodysuit','jumpsuit','멜빵바지','멜빵팬츠','Jumpsuit']
    for (let i=0; i<keywords.length; i++) {
        $('#search_keywords').append('<option value="' + keywords[i] + '">')
    }
})