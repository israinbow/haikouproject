$(function () {
    $(".menu_list li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        
        var val=$(this).text();
        var showPart;
        switch(val){
            case "关于系统":
                showPart = "aboutSys";
                break;
            case "关于使用":
                showPart = "aboutSys";
                break;
            case "操作指南":
                showPart = "aboutSys";
                break;
            case "运行环境":
                showPart = "operateEnvironment";
                break;
            case "系统功能":
                showPart = "sysFunc";
                break;
        }
        $("." + showPart).css("display", "block");
        $("." + showPart).siblings().css("display", "none");
    });
});

