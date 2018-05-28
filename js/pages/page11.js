$(document).ready(function(e) {
	var flag = 0;
	var myPlayer = videojs("page11Video");
    var pauseAndDisplayLogo = function(){
	 	$('#page11Video .vjs-big-play-button').fadeIn();
	};

    var playAndHideLogo = function(){
	 	$('#page11Video .vjs-big-play-button').fadeOut();
	};
});