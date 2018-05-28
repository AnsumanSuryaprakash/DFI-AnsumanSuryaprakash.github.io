/*
	Sliding Elements 2.6
	Content swiper with support for components, galleries and different media such as videos, audio and Edge animation.

	Authors: Darine Tamer, Wissam Hobeika

	Copyright 2015, Dataflow International
	Website: http://www.dataflow.com.lb

	Released on 19/11/2014
*/
var slidingElements = (function(id, pageName, parameters){
	var _this 			= 	this;
	var container 	= 	$('#'+id).addClass('slidingElements');
	// if (parameters == undefined){
 //        var componentData = $.grep(globalArrComponentsData,function(n,k){
 //            return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "slidingElements"
 //        });
 //        parameters = componentData[0].ComponentParameters;
 //    }
	$.fn.defaults = {
    	withPagination 	: 	false,
    	withArrows		: 	false,
    	initialSlide 	: 	0,
    	direction 		: 	'LTR',
   		withPhotoswipe 	: 	false,	
    	isLooped 		: 	false,
    	isAutoplayed 		: 	false,
    	autoplaySpeed 	: 	500,
    	componentData 	: 	[],
    	// isGallery 		: 	false,
    	// withAudio 		: 	false,
    	fullscreen 		: 	false,
    	isThumbnail 		: 	false,
    	withRubric 		: 	false,
    	fullScreenHeight 	: 	'93%',
    	insideLms 		: 	false,
    	template 		: 	templateType.Tatweer,
    	thumbnailType 	: 	fullscreen_thumbnailTypeEnum.Button,
		thumbnailData 	: 	"",
		slideSpeed 		: 	500,
		withRubric 		: 	false,
		fullScreenHeight: 	'93%',
		simulateTouch 	: 	false,
		resetToInitialSlide: false,
		slideChangeCallBack : function(){},
		slideNext : function(){},
		slidePrev : function(){},
		swiperCreatedCallback : function(){}
   	};

    var params 			= 	$.extend({}, $.fn.defaults, parameters);
	var withPagination 	= 	params.withPagination;
	var withArrows 		= 	params.withArrows;
	var direction 		= 	params.direction;

	var withPhotoswipe 	= 	params.withPhotoswipe;
	var isLooped 		= 	params.isLooped;
	var isAutoplayed	= 	params.isAutoplayed;
	var autoplaySpeed 	= 	params.autoplaySpeed;
	var slideSpeed 		= 	params.slideSpeed;

	var componentData 	= 	params.componentData;
	_this.autoplayStarted;
	// isGallery 	= 	params.isGallery;

	// withAudio 	= 	params.withAudio;

	var fullscreen 		= 	params.fullscreen;
	var isThumbnail 	= 	params.isThumbnail;
	var thumbnailType 	= 	params.thumbnailType;
	var thumbnailData 	= 	params.thumbnailData;
	var withRubric 		= 	params.withRubric;
	var fullScreenHeight=	params.fullScreenHeight;
	var template 		= 	params.template;
	var componentPageName = 	params.componentPageName;
	var simulateTouch 	= 	params.simulateTouch;
	var resetToInitialSlide 	= 	params.resetToInitialSlide;
	var slideChangeCallBack = params.slideChangeCallBack;
	var slideNext = params.slideNext;
	var slidePrev = params.slidePrev;
	var swiperCreatedCallback = params.swiperCreatedCallback;
	var initialSlide 	=	direction=='RTL' ? componentData.length-1 : 0;
	var swiperAudio 	= 	new Audio();
	container.append(swiperAudio);
	var pagePhotoswipe;
	if(withPhotoswipe)
		container.addClass('photoSwipeContainer');
	else
		container.addClass('normalSwiper');

	_this.insideLms = _this.insideLms;

	var animationArray = new Array(), animationPlaying = false;
	_this.animationAudio;
	_this.resetSwipe = false;

	_this.init = function(){
		var swiperContainer = $('<div>').addClass('swiper-container '+id+'Swiper').appendTo(container);
		container.addClass('rowspan_5_ActivityType');
		var swiperWrapper 	= $('<div>').addClass('swiper-wrapper').appendTo(swiperContainer);
		var sliderContent = new Array();
		for(var i=0; i<componentData.length;i++){
			var swiperSlide = $('<div>').addClass('swiper-slide');
			// .appendTo(swiperWrapper);
			var type = componentData[i].type;
			if(type == "gallery"){
				var textPosition = componentData[i].textPosition;
				var textRatio = componentData[i].textRatio;
				var slideContent = $('<div>').attr('id', componentData[i].galleryId).addClass('swiperGallery').addClass('swiperGallery-' + textPosition).addClass('swiperGallery-' + textRatio).appendTo(swiperSlide);
				
				if(componentData[i].galleryText != ""){
					var imageDiv = $('<div>').addClass('galleryImageContainer').appendTo(slideContent);
				}else{
					var imageDiv = $('<div>').addClass('galleryImageContainer').attr("style","height:100% !important;").appendTo(slideContent);
				}
				if(componentData[i].galleryImage){
					var galleryImage = $('<img>').attr('src', componentData[i].galleryImage).appendTo(imageDiv);
				}
				if(componentData[i].galleryVideo){
					var galleryVideo = $('<video>').attr('id',componentData[i].galleryId+"_video").attr('class','videoElement video-js').attr('controls', true).attr('preload','none');
					if(componentData[i].videoLoop){
						galleryVideo.attr('data-from',componentData[i].videoLoop[0]);
						galleryVideo.attr('data-to',componentData[i].videoLoop[1]);
					}
					galleryVideo.appendTo(imageDiv);
					var galleryVideoSrc = $('<source>').attr('src', componentData[i].galleryVideo).attr('type','video/mp4').appendTo(galleryVideo);
				}

				// added by wix for Rise2 ##+'_'+i+'_'##
				if(componentData[i].galleryText != ""){
				var galleryText = $('<div>').attr('id', id+'_'+i+'_'+'galleryText').addClass('galleryText').html(componentData[i].galleryText).appendTo(slideContent);
				}
				if (textPosition == 'left' || textPosition == 'right')
					switch(textRatio){
						case 'oneThird':
							galleryText.css("width","30%");
							imageDiv.css("width","70%");
						break;
						case 'half':
							galleryText.css("width","50%");
							imageDiv.css("width","50%");
						break;
						case 'twoThirds':
							galleryText.css("width","70%");
							imageDiv.css("width","30%");
						break;
					}
				withPhotoswipe = false;
			}else if(type == "animation"){
				var slideContent = $('<div>').attr('id', id+"_animation_"+i).attr('data-index', i).attr('stage', componentData[i].stage).addClass(componentData[i].stage+" swiperAnimation").appendTo(swiperSlide);
				AdobeEdge.bootstrapCallback(function(compId) {
					var comp = AdobeEdge.getComposition(compId).getStage();
					animationArray.push({stage: compId[0], method: comp});
				});
				withPhotoswipe = false;
			}else if(type == "component"){
				if(componentData[i].withRubric)
					var slideRubric = $('<div>').addClass('rubricItem').attr('id', componentData[i].rubricId).appendTo(swiperSlide);
				var slideContent = $('<div>').attr('id', componentData[i].id).appendTo(swiperSlide);
				withPhotoswipe = false;
			}else if(type == 'html'){
				var divId = componentData[i].id;
				var htmlElement = $('<div>').attr('id',divId);
				htmlElement.appendTo(swiperSlide);
			}else if(withPhotoswipe){
				swiperSlide.addClass('alignCenter');
				var photoswipeFullImage = $('<a>').attr('href', componentData[i].fullImage).addClass('img').appendTo(swiperSlide);
				var photoswipeSmallImage = $('<img>').attr('src', componentData[i].smallImage).addClass('photoswipeSmallImage').attr('alt', '').appendTo(photoswipeFullImage);
			}
			sliderContent[i] = swiperSlide;
		}
		if(direction == "RTL"){
			sliderContent.reverse();
			componentData.reverse();
		}
		for(var j=0; j<sliderContent.length; j++)
			sliderContent[j].appendTo(swiperWrapper);
		if(withArrows){
			var leftArrow = $('<div>').addClass('swiperPrevBtn').appendTo(swiperContainer);
			var rightArrow = $('<div>').addClass('swiperNextBtn').appendTo(swiperContainer);
			if(!isLooped){
				if(initialSlide == 0){
					leftArrow.addClass('swiperPrevBtnDis');
					rightArrow.addClass('swiperNextBtnEna');
				}else if(initialSlide == componentData.length-1){
					leftArrow.addClass('swiperPrevBtnEna');
					rightArrow.addClass('swiperNextBtnDis');
				}else{
					leftArrow.addClass('swiperPrevBtnEna');
					rightArrow.addClass('swiperNextBtnEna');
				}
			}else{
				leftArrow.addClass('swiperPrevBtnEna');
				rightArrow.addClass('swiperNextBtnEna');
			}
		}
		if(withPagination){
			var swiperPagination = $('<div>').addClass(id+'Pagination pagePagination swiper'+template).appendTo(swiperContainer);
			for(var j = 0; j<componentData.length; j++){
				var swiperPaginationSwitch = $('<span>').addClass('swiper-pagination-switch').appendTo(swiperPagination);
			}
			swiperPagination.find('.swiper-pagination-switch')[initialSlide].className+=' swiper-active-switch swiper-activeslide-switch';
		}
		// resizeDiv(componentPageName);
		_this.pageSwiper = $('.'+id+'Swiper').swiper({
			loop 			: isLooped,
			disableAutoResize 	: true,
			initialSlide 		: initialSlide,
			keyboardControl 	: false,
			mousewheelControl 	: false,
			freeMode 		: false,
			simulateTouch 	: simulateTouch,
			autoplay 		: isAutoplayed,
			speed 			: slideSpeed,
			pagination 		: withPagination ?'.'+id+"Pagination" : "",
			onSwiperCreated 	: function(pageSwiper){
				if(withArrows){
					$('#' + id + ' .swiperNextBtn').hammer().off('tap').on("tap", function() {
						$(this).css('pointer-events', 'none');
						_this.pageSwiper.swipeNext();
						$(this).css('pointer-events', 'all');
				    });
				    $('#' + id + ' .swiperPrevBtn').hammer().off('tap').on("tap", function() {
						$(this).css('pointer-events', 'none');
				  		_this.pageSwiper.swipePrev();
						$(this).css('pointer-events', 'all');
				    });
				}
				if(withPagination){
					$('#' + id + ' .swiper-pagination-switch').hammer().off('tap').on("tap", function(){
						_this.pageSwiper.swipeTo($(this).index());
					});
				}
			    $(window).on("resizeEnd", function() {
					_this.pageSwiper.resizeFix();
				});
				$("#" + id).on("show", function() {
					if (_this.pageSwiper != undefined){
						_this.pageSwiper.reInit();
						_this.pageSwiper.resizeFix();	
					}
				});
				$("#" + id).on("hide", function() {
					if (_this.pageSwiper != undefined){
						_this.pageSwiper.reInit();
						_this.pageSwiper.resizeFix();	
					}
				});
				/*=================FOR RISE project=====================*/
				setTimeout(function(){
					_this.pageSwiper.reInit();
					_this.pageSwiper.resizeFix();
				}, 850);
				swiperCreatedCallback();
				/*=======================================================*/
			},
			onSlidePrev:function(pageSwiper){
				slidePrev();
			},
			onSlideNext:function(pageSwiper){
				slideNext();
			},
			onSlideChangeStart 	: function(pageSwiper){
				var currentIndex = _this.pageSwiper.activeIndex;
				var previousIndex = _this.pageSwiper.previousIndex;
				var swiperLength = _this.pageSwiper.slides.length;
				var swiperNextBtn = $('#'+id+' .swiperNextBtn');
				var swiperPrevBtn = $('#'+id+' .swiperPrevBtn');
				if(withArrows && !isLooped){
					if (currentIndex == swiperLength - 1) {
						swiperNextBtn.removeClass("swiperNextBtnEna");
						swiperNextBtn.addClass("swiperNextBtnDis");
						swiperPrevBtn.removeClass("swiperPrevBtnDis");
						swiperPrevBtn.addClass("swiperPrevBtnEna");
					}
					else if (currentIndex == 0) {
						swiperNextBtn.removeClass("swiperNextBtnDis");
						swiperNextBtn.addClass("swiperNextBtnEna");
						swiperPrevBtn.removeClass("swiperPrevBtnEna");
						swiperPrevBtn.addClass("swiperPrevBtnDis");
					}
					else if(currentIndex >= 1 && currentIndex <= swiperLength-2){
						swiperNextBtn.removeClass("swiperNextBtnDis");
						swiperNextBtn.addClass("swiperNextBtnEna");
						swiperPrevBtn.removeClass("swiperPrevBtnDis");
						swiperPrevBtn.addClass("swiperPrevBtnEna");
					}
				}
				$('#'+componentPageName).find('audio').each(function(){
					if(!this.paused){
						this.currentTime = 0;
						this.pause();
					}
				});
				if(animationPlaying){
					var previousSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (previousIndex+1) + ")");
					var previousStage = previousSlide.find('.swiperAnimation').attr('stage');
					var previousAnimation = $.grep(animationArray,function(n,i){
						return n.stage == previousStage
					});
		    		var comp = previousAnimation[0].method;
		    		comp.stop(0);
		    		previousSlide.find('audio').each(function(){
		    			if(!this.paused){
			 				this.currentTime = 0;
			 				this.pause();
			 			}
		    		});
		    		animationPlaying = false;
		    	}
				swiperAudio.pause();
				if(_this.resetSwipe == false){
				   	if(componentData[currentIndex] != undefined){//Fady
						if(typeof(componentData[currentIndex].withAudio) != 'undefined'){
							if(componentData[currentIndex].withAudio == true){
								swiperAudio.src = componentData[currentIndex].audio;
								swiperAudio.load();
								swiperAudio.addEventListener("loadedmetadata", function(){
									swiperAudio.play();
								});
							}
						}else if(componentData[currentIndex].type == "animation"){
							var currentSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (currentIndex+1) + ")");
							var currentStage = currentSlide.find('.swiperAnimation').attr('stage');
							var currentAnimation = $.grep(animationArray,function(n,i){
								return n.stage == currentStage
							});
				    		var comp = currentAnimation[0].method;
							// var comp = animationArray[currentIndex];
							comp.play(0);
							currentSlide.find('audio').each(function(){
								this.play();
							});
							animationPlaying = true;
						}
					}
				}else{
					_this.resetSwipe = false;
				}
				slideChangeCallBack();
			}
		});

		if(withPhotoswipe){
			pagePhotoswipe = $('.'+id+'Swiper a.img').photoSwipe({
				enableDrag 						: true,
				preventSlideshow				: false,
				twoSlides						: false,
				captionAndToolbarHide			: false,
				captionAndToolbarFlipPosition	: true,
				
				autoStartSlideshow 				: isAutoplayed,
				slideSpeed 						: isAutoplayed ? 500 : 300,
				getToolbar: function(){
					return '<div class="ps-toolbar-close"></div>';
				}
			});
		}
		if(fullscreen){
			var fsItem = new fullScreenComponent(id, slidingElements, {
				isThumbnail			: 	isThumbnail,
				thumbnailType		:	thumbnailType,
				thumbnailData		:	thumbnailData,
				template			:	template,
				withRubric			:   withRubric,
				fullScreenHeight	: 	fullScreenHeight,
				e7Swiper	 		:   true
			});
		}
	};

	_this.init();

	_this.play = function(){
		var currentIndex = _this.pageSwiper.activeIndex;
		if(componentData[currentIndex] != undefined){//Fady
			if(typeof(componentData[currentIndex].withAudio) != 'undefined'){
				if(componentData[currentIndex].withAudio == true){
					swiperAudio.src = componentData[currentIndex].audio;
					swiperAudio.load();
					swiperAudio.addEventListener("loadedmetadata", function(){
						swiperAudio.play();
					});
				}
			}else if(componentData[currentIndex].type == "animation"){
				var currentSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (currentIndex+1) + ")");
				var currentStage = currentSlide.find('.swiperAnimation').attr('stage');
				var currentAnimation = $.grep(animationArray,function(n,i){
					return n.stage == currentStage
				});
	    			var comp = currentAnimation[0].method;
				// var comp = animationArray[currentIndex];
				comp.play(0);
				currentSlide.find('audio').each(function(){
					this.play();
				});
				animationPlaying = true;
			}
		}
	}

	_this.pause = function(){
		var currentIndex = _this.pageSwiper.activeIndex;
		if(animationPlaying){
			var currentSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (currentIndex+1) + ")");
			var currentStage = currentSlide.find('.swiperAnimation').attr('stage');
			var currentAnimation = $.grep(animationArray,function(n,i){
				return n.stage == currentStage
			});
    			var comp = currentAnimation[0].method;
    			comp.stop();
	    		currentSlide.find('audio').each(function(){
	    			if(!this.paused){
		 				this.pause();
		 				_this.animationAudio = this;
		 			}
	    		});
    		}else{
    			swiperAudio.pause();
    		}

	}

	_this.resume = function(){
		var currentIndex = _this.pageSwiper.activeIndex;
		if(animationPlaying){
			var currentSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (currentIndex+1) + ")");
			var currentStage = currentSlide.find('.swiperAnimation').attr('stage');
			var currentAnimation = $.grep(animationArray,function(n,i){
				return n.stage == currentStage
			});
	    		var comp = currentAnimation[0].method;
	    		comp.play();
	    		_this.animationAudio.play();
	    	}else{
	    		if(!swiperAudio.ended)
	    			swiperAudio.play();
	    	}
	}

	_this.stop = function(){
		var currentIndex = _this.pageSwiper.activeIndex;
		if(animationPlaying){
			var currentSlide = $("#"+id+" .swiper-slide:nth-of-type("+ (currentIndex+1) + ")");
			var currentStage = currentSlide.find('.swiperAnimation').attr('stage');
			var currentAnimation = $.grep(animationArray,function(n,i){
				return n.stage == currentStage
			});
	    		var comp = currentAnimation[0].method;
	    		comp.stop(0);
	    		currentSlide.find('audio').each(function(){
	    			if(!this.paused){
		 				this.currentTime = 0;
		 				this.pause();
		 			}
	    		});
	    		animationPlaying = false;
	    	}
		swiperAudio.pause();
		if(resetToInitialSlide){
			_this.resetSwipe = true;
			_this.pageSwiper.swipeTo(initialSlide);
		}
	}
});