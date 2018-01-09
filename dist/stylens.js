function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#detecting-preview')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
$(document).ready(function(){

    $('.recent-item').click(function(){
        var path = $(this).find('img').attr('src');
        $('.detecting-preview-img').attr('src', path);
    });

});