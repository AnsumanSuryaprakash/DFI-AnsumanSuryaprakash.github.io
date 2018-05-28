/*
    Feedback 1.2
    Feedback support for components

    Author: Darine Tamer

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 24/11/2014
*/
var feedbackComponent = (function(id, instance, parameters){
	var _this = this;
	var container = $('#'+id);

	$.fn.defaults = {
		feedbackType: 'nothing',
		buttons: [
			{
				button:'check', text: 'Check Your Answer'
			}
		],
		revealAnswers: true,
		keepWrongAnswers: false,
		blockComponent:true,
		numberOfAttempts: 2,
		feedbackMessages:{
			correctMessage: 'correct',
			incorrectMessage: 'incorrect',
			attemptsMessages: 'try again',
			attemptsAnswerLines: ''
		},
		feedbackAudios:{
			incorrectAttemptAudio: "",
            lastAttemptAudio: "",
            correctAudio: ""
		},
		chat:{
			autoSlide: true,
			autoSlideSpeed: 4500,
		},
		direction: 'LTR',
		template: 'tatweer',
		componentPageName: 'index',
		componentType: '',
	}

	var params = $.extend({}, $.fn.defaults, parameters);

	var feedbackType = params.feedbackType; //nothing / banner / chat
	var buttons = params.buttons; // check - reset - resetWithConfirm - tryAgain - next - reveal
	var revealAnswers = params.revealAnswers;
	var keepWrongAnswers = params.keepWrongAnswers;
	var blockComponent = params.blockComponent;
	var numberOfAttempts = params.numberOfAttempts;
	var correctMessage = params.feedbackMessages.correctMessage;
	var incorrectMessage = params.feedbackMessages.incorrectMessage;
	var attemptsMessages = params.feedbackMessages.attemptsMessages;
	var attemptsAnswerLine = params.feedbackMessages.attemptsAnswerLine;

	var incorrectAttemptAudio = params.feedbackAudios.incorrectAttemptAudio;
	var lastAttemptAudio = params.feedbackAudios.lastAttemptAudio;
	var correctAudio = params.feedbackAudios.correctAudio;
	var revealAudio = params.feedbackAudios.revealAudio;

	var direction = params.direction;
	var template = params.template;
	var componentPageName = params.componentPageName;
	var componentType = params.componentType; // **
	_this.componentName = "";
	switch(componentType){
		case "dragAndDrop":
			_this.componentName = "Drag and Drop";
			break;
		case "fillInTheBlanks":
			_this.componentName = "Fill in the Blank";
			break;
		case "multipleChoice":
			_this.componentName = "Multiple Choice";
			break;
		case "comboBox":
			_this.componentName = "Combo Box";
			break;
		case "matching":
			_this.componentName = "Matching";
			break;
	}

	//Ticker Variables
	var chatInstance = params.chat.chatInstance;
	var autoSlide = typeof(params.chat.autoSlide) == "undefined" ? true : params.chat.autoSlide;
	if(feedbackType != 'chat'){
		autoSlide = false;
	}
	var autoSlideSpeed = typeof(params.chat.autoSlideSpeed) == "undefined" ? 4500 : params.chat.autoSlideSpeed;


	var withNextButton;
	if(feedbackType == 'chat'){
		if(autoSlide == undefined || autoSlide)
			withNextButton = false;
		else
			withNextButton = true;
	}else{
		withNextButton = false;
	}

	var hasAttempts, correctFeedbackBanner, incorrectFeedbackBanner, finalFeedbackBanner, reloadButton, checkBtn, resetBtn, nextBtn, tryAgainBtn,revealBtn;
	var withReset = false;
	var isAutoRevealed = true;
	_this.recurrence = 0;

	if(numberOfAttempts > 0)
			hasAttempts = true;
		else
			hasAttempts = false;

	_this.init = function(){
		var feedbackContainer = $('<div>').attr('id', id+'FeedbackContainer').addClass('feedbackContainer feedbackContainer'+direction).appendTo(container);
		var atLeastOneButton = false;
		var checkButton = $.grep(buttons,function(n,k){
			return n.button == 'check';
		});
		if(checkButton.length > 0){
			atLeastOneButton = true;
			checkBtn = $('<div>').addClass('checkBtn checkBtn_'+template).attr('componentName', _this.componentName).attr('recurrence', 1).attr('numberOfAttempts', numberOfAttempts).attr('componentPageName', componentPageName).attr('containerID', id).html(checkButton[0].text).appendTo(feedbackContainer);
			checkBtn.hammer().off('tap').on('tap', function(){
				var x = instance.checkAnswers();
				attemptsAnswerLine = x[1];
				_this.displayFeedback(x[0]);
				var $this = $(this);
				var rec = parseInt($this.attr('recurrence'));
				ProcessSetValue('component',$('#pagesContainer .currentPageName').attr('id'),$this.attr('containerID'),rec,$this.attr('numberOfAttempts'), x[0] ? 'correct': 'wrong', x[2], $this.attr('componentName'));
				$this.attr('recurrence', rec+1);
			});
		}
// Added By Georges
		var revealButton = $.grep(buttons,function(n,k){
			return n.button == 'reveal';
		});
		if(revealButton.length > 0){
			isAutoRevealed = false;
			atLeastOneButton = true;
			revealBtn = $('<div>').addClass('revealBtn revealBtn_'+template).html(revealButton[0].text).appendTo(feedbackContainer);
			revealBtn.hammer().off('tap').on('tap', function(){
			var x = instance.revealAnswers();
			revealBtn.hide();
			if((revealAudio != "")&&(revealAudio != undefined)){
				playAudio(revealAudio);
			}
			});
		}
// END 

		var resetButton = $.grep(buttons,function(n,k){
			return n.button == 'reset' || n.button == 'resetWithConfirm';
		});
		if(resetButton.length > 0){
			atLeastOneButton = true;
			withReset = true;
			resetBtn = $('<div>').addClass('resetBtn resetBtn_'+template).html(resetButton[0].text).appendTo(feedbackContainer);
			resetBtn.hammer().off('tap').on('tap', function(){
				instance.unblockComponent();
				_this.resetAnswers();
			});
		}
		var nextButton = $.grep(buttons,function(n,k){
			return n.button == 'next';
		});
		if(nextButton.length > 0){
			atLeastOneButton = true;
			nextBtn = $('<div>').addClass('nextBtn nextBtn_'+template).css('display', 'none').html(nextButton[0].text).appendTo(feedbackContainer);
			nextBtn.hammer().off('tap').on('tap', function(){
				chatInstance.pageSwiper.pageSwiper.swipeNext();
				chatInstance.displayMessage('system', chatInstance.componentsMessages[chatInstance.pageSwiper.pageSwiper.activeIndex]);
				// nextBtn.hide();
			});
		}
		if(!atLeastOneButton){
			container.addClass("noFeedback");
			feedbackContainer.remove();
		}else{
			if(feedbackType == 'banner'){
				container.addClass('bannerFeedback');
				correctFeedbackBanner = $('<div>').addClass('correctFeedbackBanner').appendTo(feedbackContainer).css('display', 'none');
				var cfbText = $('<p>').html(correctMessage).appendTo(correctFeedbackBanner);
				var cfbTick = $('<div>').addClass('feebackCorrectIcon').appendTo(correctFeedbackBanner);
				if(numberOfAttempts != 1){
					incorrectFeedbackBanner = $('<div>').addClass('incorrectFeedbackBanner').appendTo(feedbackContainer).css('display', 'none');
					if(hasAttempts)
						reloadButton = $('<div>').addClass('feedbackReloadButton').appendTo(incorrectFeedbackBanner);
					var ifbText = $('<p>').appendTo(incorrectFeedbackBanner);
					if(typeof(attemptsMessages)=='string')
						ifbText.html(attemptsMessages);
					var ifbX = $('<div>').addClass('feebackIncorrectIcon').appendTo(incorrectFeedbackBanner);
				}
				finalFeedbackBanner = $('<div>').addClass('finalFeedbackBanner').appendTo(feedbackContainer).css('display', 'none');
				var ffbText = $('<p>').html(incorrectMessage).appendTo(finalFeedbackBanner);
				var ffbX = $('<div>').addClass('feebackIncorrectIcon').appendTo(finalFeedbackBanner);
			}else if(hasAttempts){
				var tryAgainButton = $.grep(buttons,function(n,k){
					return n.button == 'tryAgain';
				});
				if(tryAgainButton.length > 0){
					tryAgainBtn = $('<div>').addClass('tryAgainBtn tryAgainBtn_'+template).css('display', 'none').html(tryAgainButton[0].text).appendTo(feedbackContainer);
					tryAgainBtn.hammer().off('tap').on('tap', function(){
						tryAgainBtn.hide();
						$('#'+id+' .checkBtn').show();
						if(withReset)
							$('#'+id+' .resetBtn').show();
						instance.unblockComponent();
					});
				}
			}
		}
	}

	_this.displayFeedback = function(mode){ //true / false
		if(feedbackType == 'banner'){
			if(blockComponent){
				instance.blockComponent();
				checkBtn.hide();
			}
			
			if(withReset)
				resetBtn.hide();
			if(mode == true){
				//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'correct');
				if(correctAudio != ""){
					playAudio(correctAudio);
				}
				correctFeedbackBanner.fadeIn();
				if(withNextButton){
					nextBtn.show();
				}
			}else{
				//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'wrong');
				if(hasAttempts){
					_this.recurrence++;
					if(_this.recurrence == numberOfAttempts){
						if(lastAttemptAudio != ""){
							playAudio(lastAttemptAudio);
						}
						finalFeedbackBanner.fadeIn();
						if(revealAnswers){
							// added by georges
							if(isAutoRevealed){
								instance.revealAnswers();
								if((revealAudio != "")&&(revealAudio != undefined)){
										playAudio(revealAudio);
									}
								if (revealBtn != undefined){
									revealBtn.hide();
								}

							}else{
								revealBtn.show();
							}
						}
						// END
						if(withNextButton)
							nextBtn.show();
					}else{
						if(typeof(attemptsMessages) != 'string')
							if(incorrectAttemptAudio != ""){
								playAudio(incorrectAttemptAudio);
							}
							incorrectFeedbackBanner.find('p').html(attemptsMessages[_this.recurrence-1]);
						incorrectFeedbackBanner.fadeIn();
						reloadButton.hammer().off('tap').on('tap', function(){
							instance.unblockComponent();
							incorrectFeedbackBanner.hide();
							checkBtn.fadeIn();
							if(withReset)
								resetBtn.fadeIn();
						});
					}
				}else{
					if(lastAttemptAudio != ""){
						playAudio(lastAttemptAudio);
					}
					incorrectFeedbackBanner.fadeIn();
					reloadButton.hammer().off('tap').on('tap', function(){
						instance.unblockComponent();
						incorrectFeedbackBanner.hide();
						checkBtn.fadeIn();
						if(withReset)
							resetBtn.fadeIn();
					});
				}

			}
		}else if(feedbackType == 'chat'){
			var timeOut = chatInstance.answerDelay + 2000;
			if(blockComponent){
				instance.blockComponent();
			}
			chatInstance.displayMessage('student', attemptsAnswerLine);
			if(mode == true){
				//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'correct');
				checkBtn.hide();
				if(withReset)
					resetBtn.hide();
				setTimeout(function(){
					chatInstance.displayMessage('system', correctMessage, true);
				}, 2000);
				if(withNextButton){
					setTimeout(function(){
						nextBtn.show();
					}, timeOut);
				}
				if(autoSlide){
					if(chatInstance.pageSwiper.pageSwiper.activeIndex < chatInstance.pageSwiper.pageSwiper.slides.length -1){
						setTimeout(function(){
							chatInstance.pageSwiper.pageSwiper.swipeNext();
							chatInstance.displayMessage('system', chatInstance.componentsMessages[chatInstance.pageSwiper.pageSwiper.activeIndex]);
						}, autoSlideSpeed);
					}
				}
			}else{
				//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'wrong');
				if(hasAttempts){
					_this.recurrence++;
					if((blockComponent) && (_this.recurrence == numberOfAttempts)){
						instance.blockComponent();
					}
					if(_this.recurrence == numberOfAttempts){
						setTimeout(function(){
							chatInstance.displayMessage('system', incorrectMessage, false);
						}, 2000);
						if(revealAnswers){
							//  added by georges
							if(isAutoRevealed){
								instance.revealAnswers();
								if((revealAudio != "")&&(revealAudio != undefined)){
										playAudio(revealAudio);
									}
								if( revealBtn != undefined){
									revealBtn.hide();
								}
							}else{
								revealBtn.show();
							}
						}
						// END
						checkBtn.hide();
						
						if(withReset)
							resetBtn.hide();
						if(withNextButton){
							setTimeout(function(){
								nextBtn.show();
							}, timeOut);
						}
						if(autoSlide){
							if(chatInstance.pageSwiper.pageSwiper.activeIndex < chatInstance.pageSwiper.pageSwiper.slides.length -1){
								setTimeout(function(){
									chatInstance.pageSwiper.pageSwiper.swipeNext();
									chatInstance.displayMessage('system', chatInstance.componentsMessages[chatInstance.pageSwiper.pageSwiper.activeIndex]);
								}, autoSlideSpeed);
							}
						}
					}else{
						setTimeout(function(){
							if(typeof(attemptsMessages) != 'string')
								chatInstance.displayMessage('system', attemptsMessages[_this.recurrence-1], false);
							else
								chatInstance.displayMessage('system', attemptsMessages, false);
						}, 2000);
						if(blockComponent){
							checkBtn.hide();
						}
						if(withReset)
							resetBtn.hide();
						setTimeout(function(){
							tryAgainBtn.show();
						}, timeOut);
					}
				}else{
					setTimeout(function(){
						chatInstance.displayMessage('system', attemptsMessages, false);
					}, 2000);
				}
			}
		}else{
			if(hasAttempts){
				
				_this.recurrence++;
				if((blockComponent) || (_this.recurrence == numberOfAttempts)){
					instance.blockComponent();
				}
				if(mode == true){
					//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'correct');
					instance.blockComponent();
					if(correctAudio != ""){
						playAudio(correctAudio);
					}
					checkBtn.hide();
					if(withReset)
						resetBtn.hide();
					if(withNextButton){
						nextBtn.show();
					}
				}else{
					//ProcessSetValue(componentPageName,id,_this.recurrence,numberOfAttempts,'wrong');
					if(_this.recurrence == numberOfAttempts){
						if(lastAttemptAudio != ""){
							playAudio(lastAttemptAudio);
						}
						if(revealAnswers){
							// added by georges 
							if(isAutoRevealed){
								instance.revealAnswers();
								if((revealAudio != "")&&(revealAudio != undefined)){
										playAudio(revealAudio);
									}
								if(revealBtn != undefined){
									revealBtn.hide();
								}
								
							}else{
								revealBtn.show();
							}
						}
						// END
						checkBtn.hide();
						if(withReset)
							resetBtn.hide();
						if(withNextButton){
							nextBtn.show();
						}
					}else{
						if(incorrectAttemptAudio != ""){
							playAudio(incorrectAttemptAudio);
						}
						if(blockComponent){
							checkBtn.hide();
						}
						if(withReset)
							resetBtn.hide();
						if(tryAgainBtn)
							tryAgainBtn.show();
					}
				}
			}
		}
		instance.setAttempts(_this.recurrence);
	}

	_this.resetAnswers = function(){
		var confirm = $.grep(buttons,function(n,k){
			return n.button == 'resetWithConfirm';
		});
		if(confirm.length > 0){
			$('#resetContainer').fadeIn();
			$('#confirmReset')[0].className ='animateDown '+template;
			$('#confirmReset #yesReset').hammer().off('tap').on('tap', function(){
				if(typeof(componentPageName) == 'undefined')
					componentPageName = globalArrAllPages[parseInt($(pagesContainer.swiper.activeSlide()).attr('data-index'))];
				$('#confirmReset')[0].className -='animateDown '+template;
				$('#resetContainer').fadeOut();
				$('#confirmReset #yesReset').hammer().off('tap');
				$('#confirmReset #noReset').hammer().off('tap');
				instance.resetAnswers();
				globalArrPagesData = $.grep(globalArrPagesData,function(n,k){
					return n.pageName != componentPageName || n.componentId != id;
				});

				var componentObject = {
					"pageName": componentPageName,
					"componentId": id, 
					"componentType": componentType
				};

				clearPageData(componentObject);
			});
			$('#confirmReset #noReset').hammer().off('tap').on('tap', function(){
				$('#confirmReset')[0].className -='animateDown '+template;
				$('#resetContainer').fadeOut();
				$('#confirmReset #noReset').hammer().off('tap');
				$('#confirmReset #yesReset').hammer().off('tap');
			});
		}else{
			instance.resetAnswers();
		}
	}

	_this.submitAnswers = function(){
		// checkBtn.trigger("tap");
		// checkBtn.trigger("click");
		var x = instance.checkAnswers();
		if(x){
			attemptsAnswerLine = x[1];
			_this.displayFeedback(x[0]);
		}
	}
	_this.hideButtons = function(){
		checkBtn.hide();
		if(tryAgainBtn){
			tryAgainBtn.hide();
		}
		instance.container.addClass('feedbackInactive');
		// instance.blockComponent();
	}

	_this.init();
});