
var url = "//10.153.97.31/Data/DropZonePrediction/4872HTPRain/";
var time;
var dt

var id = new Array("img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8");
var imgs = new Array("51", "54", "57", "60", "63", "66", "69", "72");
$(function () {
    var date = new Date();    
    $("#datestart").val(date.format("yyyy-MM-dd"));
    $("#newtime").css("background", "red");

    $("#rain").css("background", "red");
    $("#rain").css("border", "1px solid #fff");

    $("#newtime").css("border", "1px solid #fff");
    var time = date.format("yyyy-MM-dd");
    var days = time.split('-')[2];
    var dy = parseInt(days) - 2;
    var dd = time.split('-')[0] + time.split('-')[1] + dy;
    

    for (var i = 0; i < 8; i++) {
      
        $("#" + id[i]).attr("src", url + dd + "/dt_4872HTPRain_Prediction_" + dd + "2000_" + imgs[i] + ".png");
    }

})
function updatePic(value) {
    switch (value)
    {
        case "up":
            time = $("#datestart").val();
            $("#update").css("background", "red");
            $("#update").css("border", "1px solid #fff");
            $("#newtime").css("background", "");
            $("#newtime").css("border", "");
            break;
        case "now":
            var date = new Date();
            time = date.format("yyyy-MM-dd");
            $("#datestart").val(date.format("yyyy-MM-dd"));
            $("#update").css("background", "");
            $("#update").css("border", "");
            $("#newtime").css("background", "red");
            $("#newtime").css("border", "1px solid #fff");

            break;
    }

 
    var days = time.split('-')[2];
    var dy = parseInt(days) - 2;
    var dd = time.split('-')[0] + time.split('-')[1] + dy;


    for (var i = 0; i < 8; i++) {

        $("#" + id[i]).attr("src", url + dd + "/dt_4872HTPRain_Prediction_" + dd + "2000_" + imgs[i] + ".png");
    }
}