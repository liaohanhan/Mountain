$(document).ready(function () {
    change();
    function openNav() {
        document.getElementById("mySidenav").style.width = "15rem";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
    $("#open").click(function () {
        openNav();
    });
    $("#close").click(function () {
        closeNav();
    });
    $(window).resize(function () {
        change();
    });
    function change() {
        if (screen.width >= 1024) {
            document.getElementById("main").style.marginLeft = "250px";
            openNav();
        }
        else {
            document.getElementById("main").style.marginLeft = "0px";
            closeNav();
        }
    }
});