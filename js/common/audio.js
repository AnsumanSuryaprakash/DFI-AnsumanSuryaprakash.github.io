
//global variables
var globalAudioPlayerCreated = false ;
var globalAudioPlaying = false ;
var globalAudioIcon;
var globalAudioTemplate;
var globalAudioShowPlayer;
// JavaScript Document
function playGameAudio(src){
    if (globalAudioPlaying)
        stopAndHideAudio(event);
   /* var audio = new Audio();
    currentGameAudio = audio;
    gameAudio.push(audio);
    // gameAudio.pause();
    // gameAudio.currentTime = 0;
    audio.src = "sounds/common/jeopardy/"+src;
    audio.load();
    audio.play();*/

	var audioSource = "sounds/common/jeopardy/"+src;
	globalAudioIcon = "";
	globalAudioSource = "sounds/common/jeopardy/"+src;
	globalAudioTemplate = "";
	globalAudioShowPlayer = false;
	activateAudio();

}
function activateAudio(event)
{
	if (globalAudioPlaying){
		stopAndHideAudio();
	}else{
		//var newAudio = globalAudioIcon.attr('audioSource');
		var newAudio;
		if (globalAudioSource != undefined)
			if (globalAudioSource != "")
				newAudio = globalAudioSource;
			else
				newAudio = globalAudioIcon.attr('audioSource');
		else
			newAudio = globalAudioIcon.attr('audioSource');
		var defaultAudioPlayer = $('#defaultaudioPlayer');
		var player = defaultAudioPlayer.get(0);
		var audioPlayerContainer = $("#audioPlayerContainer");
		var audioPlayerBoxWrapper = $('#audioPlayerBoxWrapper');
		var closeAudio = $('#close-audio');
		var defaultaudioPlayerSource = $('#defaultaudioPlayerSource');
		var audioPlayer;
		var audioPlayerBarPlayed;
		var duration;
		var audioplayerTime; 
		
		defaultaudioPlayerSource.attr('src',newAudio).detach().appendTo(player);
		player.load();
		
		if (globalAudioShowPlayer){
			/*if($(globalAudioIcon).hasClass("audioIconPopUp")){
				audioPlayerBoxWrapper.css("background-image","url(images/audioBublePopUp.png)");
				audioPlayerBoxWrapper.css('left',5 );
				audioPlayerBoxWrapper.css('top',globalAudioIcon.parent().parent().parent().parent().position().top - 80);
				audioPlayerBoxWrapper.fadeIn('600');
			}else if($(globalAudioIcon).hasClass("audioTab")){
				audioPlayerBoxWrapper.css("background-image","url(images/audioBuble.png)");
				audioPlayerBoxWrapper.css('left',5 );
				audioPlayerBoxWrapper.css('top',globalAudioIcon.position().top + 15);
				audioPlayerBoxWrapper.fadeIn('600');
			}else{
				audioPlayerBoxWrapper.css("background-image","url(images/audioBuble.png)");
				audioPlayerBoxWrapper.css('left',5 );
				audioPlayerBoxWrapper.css('top',globalAudioIcon.position().top - 40);
				audioPlayerBoxWrapper.fadeIn('600');
			}*/
			audioPlayerContainer.slideDown("slow");
		}else{
			if(globalAudioIcon!=""){
				globalAudioIcon.removeClass("audio-element-play-" + globalAudioTemplate);
				globalAudioIcon.addClass("audio-element-pause-" + globalAudioTemplate);
			}
		}
		
		if(!globalAudioPlayerCreated) {
			defaultAudioPlayer.audioPlayer();
			closeAudio.hammer().on("tap", function(event){ 
				stopAndHideAudio(event) ;  
			});
			globalAudioPlayerCreated = true ;
		}
			
		player = $("#defaultaudioPlayer").get(0);
		// player.oncanplaythrough = player.play();
		player.addEventListener("loadedmetadata", function(){
			player.play();
		});
		// player.play();
		
		audioPlayer = $(".audioplayer");
		audioPlayer.removeClass("audioplayer-stopped");
		audioPlayer.addClass("audioplayer-playing");

		audioPlayerBarPlayed = $('.audioplayer-bar-played');		
		audioPlayerBarPlayed.css('width','0%');
	
		player.startTime = 0 ; 
		duration = player.duration / 60;
		player.volume = 1;
		
		audioplayerTime = $('.audioplayer-time.audioplayer-time-duration');
		audioplayerTime.text(duration);
	
		globalAudioPlaying = true ;
	}
};

function stopAndHideAudio(event) 
{	
	var target;
	if (event != undefined)
		target = $(event.target);
	var audioPlayer = $(".audioplayer");
	var audioPlayerPlayPause = $('.audioplayer-playpause');
	var defaultAudioPlayer = $('#defaultaudioPlayer');
	var audioPlayerBoxWrapper = $('#audioPlayerBoxWrapper');
	var audioPlayerContainer = $("#audioPlayerContainer");
	
	if (!globalAudioShowPlayer){
		if(globalAudioIcon!=""){
			globalAudioIcon.removeClass("audio-element-pause-" + globalAudioTemplate);
			globalAudioIcon.addClass("audio-element-play-" + globalAudioTemplate);
		}
	}
	audioPlayer.get(0).className = 'audioplayer audioplayer-stopped' ;
	audioPlayerPlayPause.attr('title','Play').find('a').text('Play');
	globalAudioPlaying = false ;

	defaultAudioPlayer.get(0).pause();
	//audioPlayerBoxWrapper.hide();
	if (target == undefined)
		audioPlayerContainer.slideUp("slow");
	else if (target.hasClass("hideAudio"))
			audioPlayerContainer.slideUp("slow");
		
	globalAudioIcon = undefined;
	globalAudioTemplate = undefined;
	globalAudioShowPlayer = true;
	$(".audioText").removeClass("audioHighlight");
	// $(".audioText").css("background", "white");
}


