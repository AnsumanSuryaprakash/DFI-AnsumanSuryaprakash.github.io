$(document).ready(function(e) {
	var flag = 0;
//$('#page1 .videoElement').mediaelementplayer();
	//$('.videoElement').mediaelementplayer();
	/*$("#page1 .compContainer").on ("show",function(){
		if (flag > 0)
			$('#page1 .videoElement').mediaelementplayer();
		flag ++;
	});*/
	
	/*$("#pagev1 .closeScreen").hammer().on("tap",function(event){
		closePage(event);
	});*/
	var myPlayer = videojs("page2Video");
    var pauseAndDisplayLogo = function(){
	 	$('#page2Video .vjs-big-play-button').fadeIn();
	};

    var playAndHideLogo = function(){
	 	$('#page2Video .vjs-big-play-button').fadeOut();
	};

	// myPlayer.on("pause", pauseAndDisplayLogo);
	// myPlayer.on("play", playAndHideLogo);
});