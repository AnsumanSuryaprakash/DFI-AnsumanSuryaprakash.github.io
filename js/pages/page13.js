$(document).ready(function(e) {
    var flag = 0;
    var myPlayer = videojs("page13Video");
    var pauseAndDisplayLogo = function(){
        $('#page13Video .vjs-big-play-button').fadeIn();
    };

    var playAndHideLogo = function(){
        $('#page13Video .vjs-big-play-button').fadeOut();
    };
});