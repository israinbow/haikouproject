$(function () {
    loadpage();
})

$("#datetime12").click(function () {
    var dropDownMenu = $(".dropDownMenu_hour");
    dropDownMenu.slideToggle("slow");
})

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}
