$(function () {
    $("#div-Navigation label").click(function () {
        var id = this.id;
       window.location.href = id + ".aspx";
        //alert(id);
    });
});