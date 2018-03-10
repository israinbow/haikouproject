/// <reference path="../jquery-1.11.3/jquery.min.js" />

//tabs自动轮换
//function timer(i) {
//    interval = setInterval(function () {
//        $("#docTabs li:eq(" + i + ") a").tab('show');
//        i++;
//        if (i > 2)
//            i = 0;
//    }
//, 5000);
//    return interval;
//}
//$(function () {
//    var i = 0;
//    interval = timer(i);
//    //当鼠标悬停在列表区域时暂停轮换
//    $(".tab-pane").mouseover(function () {
//        clearInterval(interval);
//    });
//    //鼠标移开时继续轮换
//    $(".tab-pane").mouseout(function () {
//        timer(i);
//    });
//});

$(function () {
    $('#booksfilter a').each(function (i) {

        $(this).click(function () {
            $(this).addClass('cur');
            $(this).parent().siblings().find('a').removeClass('cur');
            $('.booklist').eq(i).show();
            $('.booklist').eq(i).siblings().hide();
        })

    });

});