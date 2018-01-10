function readURL(input){
    if (input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('.detecting-preview-img').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function(){

    $('.recent-item').click(function(){
        $('.recent-item').removeClass('is-selected');
        $(this).addClass('is-selected');
        var path = $(this).find('img').attr('src');
        $('.detecting-preview-img').attr('src', path);
    });

    /*
        이미지 로드가 끝난 후에, 이미지의 가로 세로 크기를 구해서
        movable layer의 parents layer크기를 고친다.
    */
    $('.detecting-preview-img').one('load', function() {
        var detectingWrapW = $(this).outerWidth();
        var detectingWrapH = $(this).outerHeight();
        $('.detecting-wrap').css({
            'width': detectingWrapW,
            'height': detectingWrapH
        });
    }).each(function() {
        if(this.complete) $(this).load();
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
          min: { width: 100, height: 50 },
        },

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
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
      });

});