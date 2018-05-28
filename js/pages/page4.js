$(document).ready(function(e) {
	var flag = 0;
	var myPlayer = videojs("page4Video");
    var pauseAndDisplayLogo = function(){
	 	$('#page4Video .vjs-big-play-button').fadeIn();
	};

    var playAndHideLogo = function(){
	 	$('#page4Video .vjs-big-play-button').fadeOut();
	};

	// myPlayer.on("pause", pauseAndDisplayLogo);
	// myPlayer.on("play", playAndHideLogo);
});