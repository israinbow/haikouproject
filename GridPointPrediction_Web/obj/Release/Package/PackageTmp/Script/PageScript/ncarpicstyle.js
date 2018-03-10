var area;
var leftType = "twoTemp";
var URL = "http://10.153.96.157:84/Data/Fog/NCAR/";
var areaPic = "d04"; //图片显示的区域 d04为深圳 d02为广东
var hourPic = "02"; //20为检验的图片
var range = "RAIN"; //天气要素
var  typeRH = ""; //湿度类型
var picTest = 0;
var picNum = 0;
var dir = "";//时间
        $(function () {
            var date = new Date();
            date.addDays(-6);
            $("#datestart").val(date.format("yyyy-MM-dd"));
            dir = date.format("yyyyMMdd");
            doload();
            $(".meanil label").click(function () {
                var id = this.id;
                leftType = id;
                $(".meanil label").removeAttr("style");
                $("#" + id).css("background", "#bdbd09");
                if (id == "humit") {
                    $("#hDiv").css("display", "block");
                    $("#timeDiv").css("width", "380px");
                }
                else {
                    $("#timeDiv").css("width", "300px");
                    $("#hDiv").css("display", "none");
                }
                if (id == "humit" || id == "temptest" || id == "windforecast" || id == "humitTest") {
                    $(".maxPicture").css("display", "block");
                    $(".minPicture").css("display", "none");
                }
                else {
                    $(".minPicture").css("display", "block");
                    $(".maxPicture").css("display", "none");
                }
                doload();
            })
        });


        

        updatepicture = function (value) {
            if (value == "update") {
                dir = $("#datestart").val().replace(/-/g, "");
                $("#update").removeClass();
                $("#nowdate").removeClass();
                $("#update").addClass("button");
                $("#nowdate").addClass("buttonof");
            }
            if (value == "now") {
                var date = new Date();
                $("#datestart").val(date.format("yyyy-MM-dd"));
                dir = date.format("yyyyMMdd");
                $("#update").removeClass();
                $("#nowdate").removeClass();
                $("#update").addClass("buttonof");
                $("#nowdate").addClass("button");
            }
            doload();
        }
        $(function () {
            $(".Area label").click(function () {
                area = this.id;
                if (area == "shenzhen") {
                    areaPic = "d04";
                    $("#guangdong").removeClass();
                    $("#shenzhen").removeClass();
                    $("#shenzhen").addClass("button");
                   $("#guangdong").addClass("buttonof");
                }
                else if (area == "guangdong") {
                    areaPic = "d02";
                    $("#guangdong").removeClass();
                    $("#shenzhen").removeClass();
                    $("#guangdong").addClass("button");
                    $("#shenzhen").addClass("buttonof");
                }
            })
            doload();
        })
        function doload() {
            var contidion = false;
            var url = URL + range + "/" + dir + "/" + range + "_" + picTest + "_" + areaPic + "_" + typeRH + dir + hourPic + "_" + picNum + ".png";
            switch (leftType) {
                case "humit":
                    contidion = true;
                    break;
                case "temptest":
                    contidion = true;
                    break;
                case "windforecast":
                    contidion = true;
                    break;
                case "humitTest":
                    contidion = true;
                    break;

            }
            if (contidion) {//24             
                for (var i = 1; i <= 16; i++) {
                    var flag;
                    if(i<10){ flag="0"+i;}
                    else{ flag=i;}
                    document.getElementById("Pic"+flag).src=url;
                }
            }
            else {//16
                for (var i = 1; i <= 24; i++) {
                    var flag;
                    if (i < 10) { flag = "0" + i; }
                    else { flag = i; }
                    document.getElementById("Image" + flag).src = url;
                }
            }
        }