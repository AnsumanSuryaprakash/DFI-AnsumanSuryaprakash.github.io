/*
   Flashcards 2.1
    rotating clickable cards revealing content on each card.

    Author: Rami Sbaity

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 14/10/2014
*/
var flashCard = (function(id, parameters){
	var _this 				= this;
	_this.container 		= $('#'+id);

	$.fn.defaults = {
		tappable            :   true,
		startingSlide       :   1,
		componentData       :   "",
		template            :   "",
		fullscreen 			: 	false,
		isThumbnail 		: 	false,
		thumbnailType 		: 	fullscreen_thumbnailTypeEnum.Button,
		thumbnailData 		: 	"",
		withRubric 			: 	false,
		fullScreenHeight 	: 	"93%",
		textDirection       :   "LTR",
		audioFlip           :   false
		
    }
	
    _this.params 			= $.extend({}, $.fn.defaults, parameters);
	_this.startingSlide     = _this.params.startingSlide;
	_this.componentData     = _this.params.componentData;
	_this.template          = _this.params.template;	
	_this.tappable          = _this.params.tappable;		
	_this.textDirection     = _this.params.textDirection;
	_this.audioFlip         = _this.params.audioFlip;
	_this.audio = new Audio();
	
	var fullscreen 			= _this.params.fullscreen;
	var isThumbnail 		= _this.params.isThumbnail;
	var thumbnailType 		= _this.params.thumbnailType;
	var thumbnailData 		= _this.params.thumbnailData;
	var withRubric 			= _this.params.withRubric;
	var fullScreenHeight 	= _this.params.fullScreenHeight;

	var componentData       = new Array();		
	componentData           = _this.componentData;	
	var startingSlide       = _this.startingSlide;	
	var template            = _this.template;
	var tappable            = _this.tappable; 
	var textDirection       = _this.textDirection;
	var audioFlip           = _this.audioFlip;
	var flashCrdFront;
	var flashCrdBack;
	var frontType;
	var backType;	
	var deck;	
	var audio;	
	var audioFlipContent;
	
	_this.init = function(){
		var flashCrdContainer = $('<div>').addClass('flashCrdContainer').appendTo(_this.container);
		var flashCrdRightArrow = $('<div>').addClass('flashCrdRightArrow').appendTo(_this.container);
		var flashCrdLeftArrow = $('<div>').addClass('flashCrdLeftArrow').appendTo(_this.container);
		var flashCrdWrapper = $('<div>').addClass('flashCrdWrapper').appendTo(flashCrdContainer);
			for (var i = 0;i < componentData.length;i++){	
				var flashCrdSlider = $('<div>').addClass('flashCrdSlider flashCrdSlider'+i ).attr('data-index',i).appendTo(flashCrdWrapper);							
				switch(componentData[i].frontType){					
					case "text":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentFront flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdFront = $('<div>').addClass('flashCrdFront flashCrd').attr('data-index',i).html(componentData[i].flashCrdFront).appendTo(flashCrdContent);
						if(audioFlip){
							var flashCrdAudioFlipFront = $('<audio>').addClass('flashCrdAudioFlipFront').attr('data-index',i).attr('src',componentData[i].audioFlipContent).appendTo(flashCrdFront);		
						}						
					break;
					case "img":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentFront flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdImg = $('<div>').addClass('flashCrd flashCrdFront').attr('data-index',i).appendTo(flashCrdContent);			
						var flashCrdFront = $('<img>').addClass('flashCrdImgFront').attr('data-index',i).attr('src',componentData[i].flashCrdFront).html(componentData[i].flashCrdFront).appendTo(flashCrdImg);	
						if(audioFlip){
							var flashCrdAudioFlipFront = $('<audio>').addClass('flashCrdAudioFlipFront').attr('data-index',i).attr('src',componentData[i].audioFlipContent).appendTo(flashCrdFront);		
						}
					break;
					case "audio":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentFront flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdFront = $('<div>').addClass('flashCrdFront flashCrd').attr('data-index',i).appendTo(flashCrdContent);
						var flashCrdAudio = $('<div>').addClass('flashCrdAudio audio-element-play-'+template).attr('data-index',i).appendTo(flashCrdFront);
						var flashCrdAudioFront = $('<audio>').addClass('flashCrdAudioFront').attr('data-index',i).attr('src',componentData[i].flashCrdFront).html(componentData[i].flashCrdFront).appendTo(flashCrdAudio);		
						if(audioFlip){
							var flashCrdAudioFlipFront = $('<audio>').addClass('flashCrdAudioFlipFront').attr('data-index',i).attr('src',componentData[i].audioFlipContent).appendTo(flashCrdFront);			
						}	
					break;					
					case "textAudio":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentFront flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdFront = $('<div>').addClass('flashCrdFront flashCrd').attr('data-index',i).html(componentData[i].flashCrdFront).appendTo(flashCrdContent);						
						var flashCrdAudio = $('<div>').addClass('flashCrdAudio audio-element-play-'+template).attr('data-index',i).appendTo(flashCrdFront);
						var flashCrdAudioFront = $('<audio>').addClass('flashCrdAudioFront').attr('data-index',i).attr('src',componentData[i].audio).html(componentData[i].audio).appendTo(flashCrdAudio);
						if(audioFlip){
							var flashCrdAudioFlipFront = $('<audio>').addClass('flashCrdAudioFlipFront').attr('data-index',i).attr('src',componentData[i].audioFlipContent).appendTo(flashCrdFront);		
						}
					break;					
				}
				switch(componentData[i].backType){					
					case "text":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentBack flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdBack = $('<div>').addClass('flashCrdBack flashCrd').attr('data-index',i).html(componentData[i].flashCrdBack).appendTo(flashCrdContent);
					break;
					case "img":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentBack flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdImg = $('<div>').addClass('flashCrd flashCrdBack').attr('data-index',i).appendTo(flashCrdContent);			
						var flashCrdBack = $('<img>').addClass('flashCrdImgBack').attr('data-index',i).attr('src',componentData[i].flashCrdBack).html(componentData[i].flashCrdBack).appendTo(flashCrdImg);	
					break;
					case "audio":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentBack flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdBack = $('<div>').addClass('flashCrdBack flashCrd').attr('data-index',i).appendTo(flashCrdContent);
						var flashCrdAudio = $('<div>').addClass('flashCrdAudio audio-element-play-'+template).attr('data-index',i).appendTo(flashCrdBack);
						var flashCrdAudioBack = $('<audio>').addClass('flashCrdAudioBack').attr('data-index',i).attr('src',componentData[i].flashCrdBack).html(componentData[i].flashCrdBack).appendTo(flashCrdAudio);												
					break;					
					case "textAudio":						
						var flashCrdContent = $('<div>').addClass('flashCrdContentBack flashCrdContent flashCrdContent'+i ).attr('data-index',i).appendTo(flashCrdSlider);			
						var flashCrdBack = $('<div>').addClass('flashCrdBack flashCrd').attr('data-index',i).html(componentData[i].flashCrdBack).appendTo(flashCrdContent);						
						var flashCrdAudio = $('<div>').addClass('flashCrdAudio').attr('data-index',i).appendTo(flashCrdBack);
						var flashCrdAudioBack = $('<audio>').addClass('flashCrdAudioBack').attr('data-index',i).attr('src',componentData[i].audio).html(componentData[i].audio).appendTo(flashCrdAudio);		
					break;	
				}
			}						
			
		$('#'+id+' .flashCrdContentFront').addClass(template);
		$('#'+id+' .flashCrdContentBack').addClass('back-'+template);	
		
		if(fullscreen == true){
			$('#'+id).goFullScreen({
				isThumbnail: isThumbnail,
				thumbnailType: thumbnailType,
				thumbnailData: thumbnailData,
				withRubric: withRubric,
				fullScreenHeight:fullScreenHeight,
				template: template,
			});
		}		
		
	}
	
	function flipCard(){
		
		$('#'+id +' .flashCrdSlider').hammer().on('tap',function(){
			if(audioFlip){
				$('audio').trigger('pause');								
				_this.audio = $('.flashCrdContent',this).find('.flashCrdAudioFlipFront').trigger('play');					
				$('.flashCrdContent',this).find('.flashCrdAudioFlipFront').trigger('play');					
				$('.flashCrdAudio',this).removeClass('audio-element-pause-'+template);
				$('.flashCrdAudio',this).addClass('audio-element-play-'+template);							
			}
			if($(this).hasClass('bespoke-active')){								
				$(this).addClass('flipped').hammer().on('tap',function(){
					if(audioFlip){
						$('audio').trigger('pause');	
						_this.audio = $('.flashCrdContent',this).find('.flashCrdAudioFlipFront').trigger('play');
						$('.flashCrdContent',this).find('.flashCrdAudioFlipFront').trigger('play');
						$('.flashCrdAudio',this).removeClass('audio-element-pause-'+template);
						$('.flashCrdAudio',this).addClass('audio-element-play-'+template);							
					}
					if($(this).hasClass('flipped')){
						$(this).removeClass('flipped');		
						if(audioFlip){
							$('.flashCrdContent',this).find('.flashCrdAudioFlipFront').trigger('pause');																					
						}
					} else {
						$(this).addClass('flipped');																	

					}
				});
				return true;
			};			
		})
		$('#'+id +' .flashCrdSlider .flashCrdAudio').hammer().on('tap',function(e){
			e.stopPropagation();
			if($(this).hasClass('audio-element-play-'+template)){
				$(this).removeClass('audio-element-play-'+template);
				$(this).addClass('audio-element-pause-'+template);
				if(audioFlip){
					$('#'+id +' .flashCrdAudioFlipFront').trigger('pause');	
				}
				_this.audio = $('audio',this).get(0).play();
				$('audio',this).get(0).play();						
			}else{
				$(this).removeClass('audio-element-pause-'+template);
				$(this).addClass('audio-element-play-'+template);
				$('audio',this).get(0).pause();	
			}
		})

	}

	function initialize_FlashCard_slider(){
		deck = bespoke.from('#'+id+' .flashCrdWrapper');	
		for( var i = 1 ; i < startingSlide ; i++){
			deck.next(); 
		} 	
	}
	function disableArrow(){
		if($('.bespoke-active').attr('data-index') == 0){
			$('.flashCrdLeftArrow').addClass('disabled')
		}else{
			$('.flashCrdLeftArrow').removeClass('disabled')
		}
		if($('.bespoke-active').attr('data-index') == componentData.length-1){
			$('.flashCrdRightArrow').addClass('disabled')
		}else{
			$('.flashCrdRightArrow').removeClass('disabled')
		}			
	}
	
	_this.pause = function(){
		_this.audio.pause();
	}
	_this.play = function(){};

	_this.resume = function(){
		if(!_this.audio.ended && _this.audio.currentTime != 0)
			_this.audio.play();
	}
	_this.reset = function(){
		if(!_this.audio.paused)
			_this.audio.currentTime = 0;
		_this.audio.pause();
		deck.slide(0);
	}
	
	_this.init();	
	if(tappable){
		flipCard();
	}
	initialize_FlashCard_slider();
	disableArrow();

	var hammertimeLeft = Hammer(document.getElementById(id)).on("swipeleft", function(event) {
		deck.next(); 
		$('#'+id +' audio').trigger('pause');
		$('#'+id +' .flashCrdAudio',this).removeClass('audio-element-pause-'+template);
		$('#'+id +' .flashCrdAudio',this).addClass('audio-element-play-'+template);	
		disableArrow()	
	});
	var hammertimeRight = Hammer(document.getElementById(id)).on("swiperight", function(event) {
		deck.prev();
		$('#'+id +' audio').trigger('pause');
		$('#'+id +' .flashCrdAudio',this).removeClass('audio-element-pause-'+template);
		$('#'+id +' .flashCrdAudio',this).addClass('audio-element-play-'+template);			
		disableArrow()
	});	
	$('#'+id +' .flashCrdRightArrow').hammer().on('tap',function(){
		deck.next(); 
		$('#'+id +' audio').trigger('pause');
		$('#'+id +' .flashCrdAudio',this).removeClass('audio-element-pause-'+template);
		$('#'+id +' .flashCrdAudio',this).addClass('audio-element-play-'+template);				
		disableArrow()
	})
	$('#'+id +' .flashCrdLeftArrow').hammer().on('tap',function(){
		deck.prev(); 
		$('#'+id +' audio').trigger('pause');
		$('#'+id +' .flashCrdAudio',this).removeClass('audio-element-pause-'+template);
		$('#'+id +' .flashCrdAudio',this).addClass('audio-element-play-'+template);				
		disableArrow()
	})	
});