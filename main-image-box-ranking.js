let StyleApi = require('stylelens-sdk-js');

const TODO = 'todo'
const IN_PROGRESS = 'in_progress'
const DONE = 'done'

var member = [
    { name: 'player', categories: ['Dress'], score: 0 },
    { name: 'cj', categories: ['Anorak', 'Bomber', 'Jacket', 'Parka', 'Blazer', 'Peacoat', 'Coat', 'Robe', 'Romper'], score: 0 },
    { name: 'rano', categories: ['Tank', 'Henley', 'Jersey', 'Top'], score: 0 },
    { name: 'k', categories: ['Tee'], score: 0 },
    { name: 'lim', categories: ['Cardigan', 'Turtleneck', 'Sweater'], score: 0 },
    { name: 'lion', categories: ['Blouse'], score: 0 }
]
var cates;

let playground_api = new StyleApi.PlaygroundApi()
var API_QUEUE_STATUS = TODO
/******
 * APIs
 * *****/
function getImagesDatasetCategoryCountByCategory (category) {
    let source = 'deepfashion'
    var opts = {
        'category': category
    }
    playground_api.getImagesDatasetCategoriesCountsByCategory(source, opts, function (error, data, response) {
        if (API_QUEUE_STATUS != IN_PROGRESS) {
            return
        }

        if (error) {
            // console.error(error);

            setCategories(category, null, error)
        } else {
            // console.log('getImagesDatasetCategoriesCountsByCategory API called successfully.\n Returned data: ')
            // console.log(data)

            setCategories(category, data.data, null)
        }
    })
}

function retrieveCategoryCounts () {
    API_QUEUE_STATUS = IN_PROGRESS
    for (var [key, value] of cates) {
        value.status = IN_PROGRESS
        getImagesDatasetCategoryCountByCategory(key)
    }
}

function setCategories (category, data, error) {
    if (!error) {
        cates.set(category,
            {status:DONE, total_count: parseFloat(data.total_count), done_count: parseFloat(data.valid_count) + parseFloat(data.invalid_count)})
        checkStatus()
    } else {
        if (API_QUEUE_STATUS == IN_PROGRESS) {
            getImagesDatasetCategoryCountByCategory(category)
        }
        return
    }
}

function checkStatus () {
    console.log('Ranking: In progress...')
    for (var [key, value] of cates) {
        if (value.status != DONE) {
            return
        }
    }
    API_QUEUE_STATUS = DONE
    $('.ranking-loading').hide()
    calcRanking()
    console.log('Ranking: Done.')
}

function initData () {
    cates = new Map();

    cates.set('Dress', {status:TODO, total_count: 0, done_count: 0})

    cates.set('Anorak', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Bomber', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Jacket', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Parka', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Blazer', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Peacoat', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Coat', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Robe', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Romper', {status:TODO, total_count: 0, done_count: 0})

    cates.set('Tank', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Henley', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Jersey', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Top', {status:TODO, total_count: 0, done_count: 0})

    cates.set('Tee', {status:TODO, total_count: 0, done_count: 0})

    cates.set('Cardigan', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Turtleneck', {status:TODO, total_count: 0, done_count: 0})
    cates.set('Sweater', {status:TODO, total_count: 0, done_count: 0})

    cates.set('Blouse', {status:TODO, total_count: 0, done_count: 0})

}

function resetData () {
    $('.ranking-loading').show()

    for (let i=0; i<member.length; i++) {
        member[i].score = 0
    }

    for (var [key, value] of cates) {
        value.status = TODO
        value.total_count = 0
        value.done_count = 0
    }

    $('.ranking-area').empty()

    API_QUEUE_STATUS = TODO
}

function calcScore (done, tot) {
    var score = done / tot * 100
    return score
    // return score.toFixed(2)
}

function calcRanking () {
    for (let i=0; i<member.length; i++) {
        var tot_cnt = 0
        var done_cnt = 0
        for (let j=0; j<member[i].categories.length; j++) {
            done_cnt += cates.get(member[i].categories[j]).done_count
            tot_cnt += cates.get(member[i].categories[j]).total_count
        }
        member[i].score = calcScore(done_cnt, tot_cnt)
    }
    member.sort(function (a, b) {
        if (a.score > b.score) {
            return -1;
        }
        if (a.score < b.score) {
            return 1;
        }
        return 0;
    })
    drawRanking()
}

function drawRanking () {
    for (let i=0; i<member.length; i++) {
        if (i!=0) {
            $('.ranking-area').append('<li>' + member[i].name + ' : ' + member[i].score.toFixed(2) + '%</li>')
            continue
        }
        if (member[i].name == 'player') {
            $('.ranking-area').append('<li style="font-weight: bold; color: black;">🔥' + member[i].name + '🔥 : ' + member[i].score.toFixed(2) + '% ㅎㄷㄷ;; </li>')
        } else {
            $('.ranking-area').append('<li style="font-weight: bold; color: black;">🔥' + member[i].name + '🔥 : ' + member[i].score.toFixed(2) + '%</li>')
        }

    }
}

function refreshButtonClicked () {
    resetData()
    retrieveCategoryCounts()
}

$(document).ready(function() {
    initData()
    resetData()
    retrieveCategoryCounts()

    $( '.button-refresh' ).click(refreshButtonClicked)
})