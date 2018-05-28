$(document).ready(function(e) {
	var flag = 0;
	var myPlayer = videojs("page7Video");
    var pauseAndDisplayLogo = function(){
	 	$('#page7Video .vjs-big-play-button').fadeIn();
	};

    var playAndHideLogo = function(){
	 	$('#page7Video .vjs-big-play-button').fadeOut();
	};

	// myPlayer.on("pause", pauseAndDisplayLogo);
	// myPlayer.on("play", playAndHideLogo);
});