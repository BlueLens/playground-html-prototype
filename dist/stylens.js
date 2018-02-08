// function readURL(input){
//     if (input.files && input.files[0]){
//         var reader = new FileReader();
//         reader.onload = function(e){
//             $('.detecting-preview-img').attr('src', e.target.result);
//         };
//         reader.readAsDataURL(input.files[0]);
//     }
// }

// let StyleApi = require('stylelens-sdk-js')
//
// window.getObjectsWithUserFile = function (file) {

// }
//
// window.readURL = function(input) {
//     if (input.files && input.files[0]){
//         var reader = new FileReader();
//         reader.onload = function(e){
//             $('.detecting-preview-img').attr('src', e.target.result);
//         };
//         reader.readAsDataURL(input.files[0]);
//
//         this.getObjectsWithUserFile()
//     }
// }

function getBaseUrl() {
    var re = new RegExp(/^.*\//);
    return re.exec(window.location.href);
}

/* added dragMoveListener() by rano */
function dragMoveListener (event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

$(document).ready(function() {

    $('.navigate-to-playground').click(function() {
        $(location).attr('href', getBaseUrl());
    });

    $('.navigate-to-search').click(function() {
        $(location).attr('href', getBaseUrl() + 'search.html');
    });

    $('.navigate-to-image-box').click(function() {
        $(location).attr('href', getBaseUrl() + 'image_box.html');
    });


    $('#input-image').on("change", function () {
        readInputFile($(this))
    })

    $('.recent-item').click(function() {
        $('.recent-item').removeClass('is-selected');
        $(this).addClass('is-selected');
        var path = $(this).find('img').attr('src');
        $('.detecting-preview-img').attr('src', path);
    });

    /*
        이미지 로드가 끝난 후에, 이미지의 가로 세로 크기를 구해서
        movable layer의 영역을 한정시킬 parent layer크기를 고친다.
    */
    $('.detecting-preview-img').one('load', function() {
        var detectingWrapW = $(this).outerWidth();
        var detectingWrapH = $(this).outerHeight();
        $('.detecting-wrap').css({
            'width': detectingWrapW,
            'height': detectingWrapH
        });
    }).each(function() {
        if(this.complete) $('.detecting-preview-img').load();
    });
    
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
    
    /*
        Attribute에서 닯은 퍼센트가 50이 넘어가면 class 부여하기
    */
    $('.bar-item').each(function() {
        if($(this).attr('aria-valuenow') > 50) {
            $(this).parent('div').parent('li').addClass('is-similar');
        }
    });

    /* for Tagging Resut area */
    interact('.detecting-square')
      .draggable({
        onmove: window.dragMoveListener,
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: { width: 40, height: 40 },
        },

        margin: 10,

        inertia: true,
      })
      .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        /*
            text 대체 취소
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        */
      });

});