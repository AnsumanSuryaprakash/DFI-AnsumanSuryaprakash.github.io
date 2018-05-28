$(document).ready(function(e) {
	var flag = 0;
	var myPlayer = videojs("page9Video");
    var pauseAndDisplayLogo = function(){
	 	$('#page9Video .vjs-big-play-button').fadeIn();
	};

    var playAndHideLogo = function(){
	 	$('#page9Video .vjs-big-play-button').fadeOut();
	};

	// myPlayer.on("pause", pauseAndDisplayLogo);
	// myPlayer.on("play", playAndHideLogo);
});