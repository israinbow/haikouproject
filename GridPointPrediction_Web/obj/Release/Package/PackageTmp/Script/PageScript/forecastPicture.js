    
        var dataTime = "6hour";
        var type = "duibi";
        var element = "rainValue";
        var wtemp = "highTemp";
        var ybsc="06";
        var URL = "http://10.153.96.173:8080/GridPic/";
        var Imagepath = new Array;
        var RainorTemp = "Rain";
        var ybscFile = "06h";
        var maxtemp = "MaxTemp";
        $(function () {
            var date = new Date();
            date.addDays(-8);
            $("#datestart").val(date.format("yyyy-MM-dd"));
            $(".eleType label").click(function () { 
                type = this.id;
                $("#duibi").removeClass();
                $("#jianyan").removeClass();
                $("#duibi").removeAttr("style");
                $("#jianyan").removeAttr("style");
                $("#jianyan").removeClass();
                $("#duibi").addClass("buttonof");
                $("#jianyan").addClass("buttonof");
                $("#" + type).css("background", "red");
                if (type == "jianyan") {
                    $(".temp").css("display", "none");
                    $("#6hour").css("display", "none");
                }
                else {
                    $("#6hour").css("display", "block");
                    $("#6hour").removeAttr("style");
                    if (element == "tempValue") {
                        $(".temp").css("display", "block");
                    }
                    else {
                        $(".temp").css("display", "none");
                    }
                }
            });
            if (element == "rainValue") {
                var file = $("#datestart").val().split('-')[0] + $("#datestart").val().split('-')[1] + $("#datestart").val().split('-')[2];
                if (dataTime == "6hour") {
                    Imagepath[0] = URL + "Rain/Reality/" + file + "/06h/" + file + "_" + ybsc + "h.png";
                    Imagepath[1] = URL + "Rain/Native/" + file + "/06h/" + file + "_" + ybsc + "h.png";
                    Imagepath[2] = URL + "Rain/Province/" + file + "/06h/" + file + "_" + ybsc + "h.png";
                    Imagepath[3] = URL + "Rain/Europe/" + file + "/06h/" + file + "_" + ybsc + "h.png";
                }
                else {
                    Imagepath[0] = URL + "Rain/Reality/" + file + "/24h/" + file + "_" + ybsc + "h.png";
                    Imagepath[1] = URL + "Rain/Native/" + file + "/24h/" + file + "_" + ybsc + "h.png";
                    Imagepath[2] = URL + "Rain/Province/" + file + "/24h/" + file + "_" + ybsc + "h.png";
                    Imagepath[3] = URL + "Rain/Europe/" + file + "/24h/" + file + "_" + ybsc + "h.png";
                }
                document.getElementById("shikuang").src = Imagepath[0];
                document.getElementById("bentai").src = Imagepath[1];
                document.getElementById("shengtai").src = Imagepath[2];
                document.getElementById("ouzhou").src = Imagepath[3];
            }
               
            if (element == "tempValue"){

            }
            $(".mainElement label").click(function () {
                element = this.id;
                $("#tempValue").removeClass();
                $("#rainValue").removeClass();
                $("#tempValue").removeAttr("style");
                $("#rainValue").removeAttr("style");
                $("#tempValue").addClass("buttonof");
                $("#rainValue").addClass("buttonof");
                $("#" + element).css("background", "red");
                if (element == "tempValue") {
                    $(".temp").css("display", "block");
                    RainorTemp = "Temp";
                    $("#shici").html("");
                    ybscFile = "24h";
                    ybsc = "24";
                    var html = "<option>24</option><option>48</option><option>72</option><option>96</option><option>120</option><option>144</option><option>168</option>";
                    $("#shici").append(html);
                    $("#6hour").css("display", "none");
                    $("#24hour").removeClass();
                    $("#24hour").addClass("button");
                    $("#6hour").removeClass();
                    $("#6hour").addClass("buttonof");
                }
                else {
                    $(".temp").css("display", "none");
                    RainorTemp = "Rain";
                    $("#6hour").css("display", "block");
                    $("#6hour").removeAttr("style");
                   
                }
                updatePic();
            })
            $(".time label").click(function () {
                dataTime = this.id;
                $("#6hour").removeClass();
                $("#24hour").removeClass();
                $("#6hour").removeAttr("style");
                $("#24hour").removeAttr("style");
                $("#6hour").addClass("buttonof");
                $("#24hour").addClass("buttonof");
                $("#" + dataTime).css("background", "red");
                $("#shici").html("");
                if (dataTime == "6hour") {
                    ybscFile = "06h";
                    ybsc = "06";
                    var html = "<option>06</option><option>12</option><option>18</option><option>24</option>";
                    $("#shici").append(html);
                }
                else if (dataTime == "24hour") {
                    ybscFile = "24h";
                    ybsc = "24";
                    var html = "<option>24</option><option>48</option><option>72</option><option>96</option><option>120</option><option>144</option><option>168</option>";
                    $("#shici").append(html);
                }
                updatePic();
            });
            $("#shici").change(function () {
                ybsc = $("#shici").val();
                updatePic();
            })

            $(".temp label").click(function () {
                wtemp = this.id;
                $("#highTemp").removeClass();
                $("#lowTemp").removeClass();
                $("#highTemp").removeAttr("style");
                $("#lowTemp").removeAttr("style");
                $("#highTemp").addClass("buttonof");
                $("#lowTemp").addClass("buttonof");
                $("#" + wtemp).css("background", "red");
                if (wtemp == "highTemp") {
                    maxtemp = "MaxTemp";
                }
                if (wtemp == "lowTemp") {
                    maxtemp = "MinTemp";
                }
                updatePic();
            });
        });

        updatePic = function (value) {
            if (value =="up" || value =="now") {
                $("#update").removeClass();
                $("#newtime").removeClass();
                switch (value) {
                    case "up":
                        $("#update").addClass("button");
                        $("#newtime").addClass("buttonof");
                        break;
                    case "now":
                        $("#update").addClass("buttonof");
                        $("#newtime").addClass("button");
                        var date = new Date();
                        $("#datestart").val(date.format("yyyy-MM-dd"));
                        break;
                }
            }
            var file = $("#datestart").val().split('-')[0] + $("#datestart").val().split('-')[1] + $("#datestart").val().split('-')[2];

          
            if (RainorTemp == "Rain") {
                Imagepath[0] = URL + RainorTemp + "/Reality/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[1] = URL + RainorTemp + "/Native/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[2] = URL + RainorTemp + "/Province/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[3] = URL + RainorTemp + "/Europe/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
            }
            else if(RainorTemp=="Temp"){
                Imagepath[0] = URL + RainorTemp+"/" +maxtemp+ "/Reality/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[1] = URL + RainorTemp +"/"+maxtemp+ "/Native/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[2] = URL + RainorTemp +"/"+maxtemp+ "/Province/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
                Imagepath[3] = URL + RainorTemp +"/"+maxtemp+ "/Europe/" + file + "/" + ybscFile + "/" + file + "_" + ybsc + "h.png";
            }
            document.getElementById("shikuang").src = Imagepath[0];
            document.getElementById("bentai").src = Imagepath[1];
            document.getElementById("shengtai").src = Imagepath[2];
            document.getElementById("ouzhou").src = Imagepath[3];

        }

