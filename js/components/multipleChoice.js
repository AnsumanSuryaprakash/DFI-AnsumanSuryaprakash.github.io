/*
	Multiple Choice 3.0
	Multiple answer single and multiple choice component with multiple layouts.

	Author: Darine Tamer, Wissam Hobeika

	Copyright 2015, Dataflow International
	Website: http://www.dataflow.com.lb

	Released on 01/09/2015
*/
var multipleChoice = (function(id, pageName, parameters){
	var _this = this;
	var container = $('#'+id).addClass('multipleChoiceSelector');
	container.attr('data-checked', false);
	_this.container = container;
	if(parameters == undefined){
		var componentData = $.grep(globalArrComponentsData,function(n,k){
			return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "multipleChoice"
		});
		parameters = componentData[0].ComponentParameters;
	}

	$.fn.defaults = {
		listStartItem 	: 	0,
		fullscreen 		: 	false,
		listStyle 		: 	'list-nothing',
		isThumbnail 	: 	false,
		thumbnailType 	: 	fullscreen_thumbnailTypeEnum.Button,
		thumbnailData 	: 	"",
		gridLayout 		:  	false,
		withRubric 		: 	false,
		fullScreenHeight: 	"93%",
		template 		: 	templateType.InteractiveActivities,
		direction 		: 	'LTR',
		insideSwiper 	: 	false,
		feedback 		: 	{
			feedbackType: 'nothing',
			buttons: [
				{
					button:'check', text: 'Check Your Answer'
				},
				{
					button:'reset', text: 'Reset Your Answer'
				}
			],
			feedbackMessages: {
				correctMessage: 'correct',
				incorrectMessage: 'incorrect',
				attemptsMessages: 'try again',
				attemptsAnswerLine: ''
			},
			feedbackAudios:{
            	incorrectAttemptAudio: "",
	            lastAttemptAudio: "",
	            correctAudio: ""
            },
			numberOfAttempts: 0,
			revealAnswers: true,
			keepWrongAnswers: false,
			blockComponent:true,
			chat:{
				autoSlide: false,
				autoSlideSpeed: 2000,
			}
		},
		checkAnswersCallBack: function(){},
		mainQuestion: "",
		mainQuestionAudio	: 	""
   	 }

    	var params 			= $.extend({}, $.fn.defaults, parameters);
    	params.feedback		= $.extend({}, $.fn.defaults.feedback, parameters.feedback);
	params.feedback.feedbackMessages = $.extend({}, $.fn.defaults.feedback.feedbackMessages, parameters.feedback.feedbackMessages);
	var checkAnswersCallBack 	= params.checkAnswersCallBack;
	var multipleChoiceType	= params.multipleChoiceType;
	var componentData 		= params.componentData;
	var listStyle 			= params.listStyle;
	var listStartItem 		= params.listStartItem;
	var gridLayout 		= params.gridLayout;
	var template 			= params.template;
	var direction 			= params.direction;
	var fullscreen 			= params.fullscreen;
	var isThumbnail 		= params.isThumbnail;
	var thumbnailType 		= params.thumbnailType;
	var thumbnailData 		= params.thumbnailData;
	var withRubric 		= params.withRubric;
	var fullScreenHeight 		= params.fullScreenHeight;
	var insideSwiper 		= params.insideSwiper;
	var expandableRubric 		= params.expandableRubric;
	var mainQuestion 		= params.mainQuestion;
	var mainQuestionAudio 	= params.mainQuestionAudio;
	var componentPageName 	= params.componentPageName;

	//Feedback
	var feedbackType 		= params.feedback.feedbackType;
	var feedbackButtons		= params.feedback.buttons;
	var numberOfAttempts 	= params.feedback.numberOfAttempts;
	var feedbackMessages 	= params.feedback.feedbackMessages;
	var feedbackAudios 	= params.feedback.feedbackAudios;
	var revealAnswers 		= (params.feedback.revealAnswers == "false" || params.feedback.revealAnswers == false) ? false : true;
	var keepWrongAnswers 	= params.feedback.keepWrongAnswers;
	var blockComponent = params.feedback.blockComponent;
	var chat 			= params.feedback.chat;
	var attemptsAnswerLine 	= params.feedback.feedbackMessages.attemptsAnswerLine;
	var token 			= "@_@";
	var numericTrueFalse;
	_this.attempt = 0;
	if (numberOfAttempts == 1){
		_this.attemptsReached = true;
	}else{
		_this.attemptsReached = false;	
	}
	

	if(multipleChoiceType == 'numbers'){
	 	numericTrueFalse = true;
	 	multipleChoiceType = 'trueFalse'
	 }else{
	 	numericTrueFalse = false;
	 }

	_this.insideLms 		= params.insideLms;

	var multipleChoiceAudio = new Audio();
	container.append(multipleChoiceAudio);
	var multipleChoiceComponentAudio = new Audio();
	var mainQuestionDiv;

	var arabicAlpha = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن'];
	container.addClass('multipleChoice_'+template+' multipleChoice_'+multipleChoiceType);
	if(numericTrueFalse){
		container.addClass('numericTrueFalse');
	}
	if(gridLayout){
		container.addClass('gridLayout');
	}
	mediaCount = $.grep(componentData,function(n,k){
		return n.type == 'audio'  || n.type == 'image' || n.type == 'video';
	});
	var withMedia;
	if(mediaCount.length > 0){
		container.addClass('withMedia');
		withMedia = true;
	}
	function multipleChoicePlayAudioInstruction(){
		multipleChoiceComponentAudio.play();
		multipleChoiceComponentAudio.removeEventListener('canplay', multipleChoicePlayAudioInstruction);
	}

	_this.init = function(){
		var possibleAnswers = new Array();
		var multipleChoiceContainer;
		if(listStyle == "list-numeric" || listStyle == "list-alpha-lower" || listStyle == "list-alpha-upper" || listStyle == "list-roman-upper" || listStyle == "list-roman-lower" || listStyle == "arabic-alpha" || listStyle == "arabic-numeric")
			multipleChoiceContainer = $('<ol>').addClass('multipleChoiceMainContainer multipleChoice'+listStyle).appendTo(container);
		else
			multipleChoiceContainer = $('<ul>').addClass('multipleChoiceMainContainer multipleChoice'+listStyle).appendTo(container);
		if(typeof(mainQuestion)!=undefined && mainQuestion != ""){
			container.addClass('multipleChoiceComponentInstruction');
			multipleChoiceContainer.addClass('componentContentWrapper');
			mainQuestionDiv = $('<div>').addClass('componentInstructionalTextWrapper').html(mainQuestion);
			if(typeof(mainQuestionAudio)!=undefined && mainQuestionAudio != ""){
				var audioImage = $('<span>').addClass('globalAudioIcon globalAudioIconPlay');
				mainQuestionDiv.prepend(audioImage);
				multipleChoiceComponentAudio = $('<audio>').addClass('multipleChoiceComponentAudio').attr('src', mainQuestionAudio).appendTo(container);
				multipleChoiceComponentAudio.load();
				audioImage.hammer().off('tap').on('tap', function(){
					var audioIcon = $(this);
					multipleChoiceComponentAudio = container.find('.multipleChoiceComponentAudio')[0];
					if(audioIcon.hasClass('globalAudioIconPlay')){
						multipleChoiceComponentAudio.addEventListener('canplay', multipleChoicePlayAudioInstruction());
						audioIcon.removeClass('globalAudioIconPlay').addClass('globalAudioIconPause');
					}else{
						multipleChoiceComponentAudio.pause();
						audioIcon.removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
					}
				});
			}
			container.prepend(mainQuestionDiv);
			resizeComponent(id);
			$(window).on("resizeEnd",function(){
				resizeComponent(id);
			});
		}
		for(var i=0; i<componentData.length; i++){
			var inputType;
			var questionSet = $('<li>').attr('id', id+'_question_'+ (i+1)).attr('data-letter', arabicAlpha[i]).addClass('multipleChoiceQuestionSet '+multipleChoiceType).appendTo(multipleChoiceContainer);
			if(componentData[i].question!=null && typeof(componentData[i].question)!=undefined)
				var questionText = $('<div>').addClass('multipleChoiceQuestion').html(componentData[i].question).appendTo(questionSet);
			if(listStartItem!=0){
				questionText.css('counter-reset', listStyle+'Counter '+(listStartItem-1+i));
			}
			possibleAnswersContainer = $('<div>').addClass('answersContainer').appendTo(questionSet);
			switch(multipleChoiceType){
				case "radio":
				case "trueFalse":
				default:
					inputType = 'radio';
				break;
				case "checkBox":
					inputType = 'checkbox';
				break;
			}
			for(var j = 0; j<componentData[i].possibleAnswers.length; j++){
				var answer = $('<div>').addClass('multipleChoiceAnswer multipleChoiceAnswer_'+multipleChoiceType).attr('name', id+"_question_"+(i+1)).attr('id', id+"_question_"+(i+1)+"_answer_"+(j+1)).appendTo(possibleAnswersContainer);
				var inputSelectLabel;
				if(multipleChoiceType != "trueFalse")
					inputSelectLabel = $('<label>').addClass('multipleChoiceAnswerSelectLabel').attr('for', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_input').appendTo(answer);
				var input = $('<input>').addClass('multipleChoiceAnswerInput').attr('name', id+"_question_"+(i+1)).attr('id', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_input').attr('type', inputType).attr('value', (j+1));
				if(withMedia){
					var inputBox = $('<div>').addClass('multipleChoiceInputWrapper '+template).appendTo(answer);
					input.appendTo(inputBox);
				}else{
					input.appendTo(answer);
				}
					if(inputType == 'radio'){
						answer.hammer().off('tap').on('tap', function(){
							var $this = $(this);
							$('#' + $this.attr('name') + ' .multipleChoiceAnswer').removeClass('selected').removeClass("multipleChoiceCorrect").removeClass("multipleChoiceIncorrect");
							$this.toggleClass('selected');
							if($this.find('input').prop('checked') == true)
								$this.find('input').prop('checked', false);
							else
								$this.find('input').prop('checked', true);
							if(multipleChoiceType == 'trueFalse'){
								$('#' + $this.attr('name') + ' .multipleChoiceAnswer label').removeClass(template);
								$this.find('label').addClass(template);
							}
						});
					}else{
						answer.hammer().off('tap').on('tap', function(){
							var $this = $(this);
							$this.removeClass("multipleChoiceIncorrect");
							$this.removeClass("multipleChoiceCorrect");
							$this.toggleClass('selected');
						});
					}
				var label;
				if(withMedia){
					possibleAnswersContainer.addClass('multipleChoiceMedia');
					answer.addClass('border-'+template);
					label = $('<label>').addClass('multipleChoiceAnswerLabel').attr('id', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_label').attr('for', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_input').appendTo(answer);
					if(typeof(componentData[i].answerHeaders) != undefined && componentData[i].Headers != null && componentData[i].answerHeaders.length != 0){
						var header = $('<div>').addClass('multipleChoiceMediaContainerHeader').html(componentData[i].answerHeaders[j]).appendTo(label);
					}else{
						label.addClass('multipleChoiceAnswerLabelNoHeader');
					}
					if(componentData[i].type == 'image'){
						var image = $('<img>').addClass('multipleChoiceMediaContainerImage').attr('src', componentData[i].possibleAnswers[j]).appendTo(label)
					}
					else if(componentData[i].type == 'audio'){
						var audioIcon = $('<div>').addClass('multipleChoiceAudioIcon audio-element-play-'+template).attr('audioSrc', componentData[i].possibleAnswers[j]).appendTo(label);
						audioIcon.hammer().off('tap').on('tap', function(){
							if(multipleChoiceAudio.paused == false){
								multipleChoiceAudio.pause();
							}
							if(!$(this).hasClass('audio-element-pause-'+template)){
								container.find('.audio-element-pause-'+template).removeClass('audio-element-pause-'+template);
								$(this).addClass('audio-element-pause-'+template);
								var audioSource = $(this).attr('audioSrc');
								multipleChoicePlayAudio(audioSource);
							}else{
								$(this).removeClass('audio-element-pause-'+template);
							}
						});
					}else if(componentData[i].type == 'video'){
						var video = $('<video>').addClass('multipleChoiceVideo').attr('controls', true).appendTo(label);
						var source = $('<source>').attr('src', componentData[i].possibleAnswers[j]).attr('type', "video/mp4").appendTo(video);
					}
					inputSelectLabel.appendTo(answer);
				}else{
					label = $('<label>').addClass('multipleChoiceAnswerLabel').attr('id', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_label').attr('for', id+"_question_"+(i+1)+"_answer_"+(j+1)+'_input').html(componentData[i].possibleAnswers[j]).appendTo(answer);
				}
			}
		}
		if(feedbackButtons.length != 0){
			_this.feedbackComponent = new feedbackComponent(id, _this, {
				feedbackType: feedbackType,
				buttons: feedbackButtons,
				numberOfAttempts: numberOfAttempts,
				feedbackMessages: feedbackMessages,
				chat: chat,
				direction: direction,
				template: template,
				componentPageName: componentPageName,
				componentType: 'multipleChoice',
				revealAnswers: revealAnswers,
				keepWrongAnswers: keepWrongAnswers,
				blockComponent:blockComponent,
				feedbackAudios: feedbackAudios
			});
		}else{
			container.addClass("noFeedback");
		}
		if(fullscreen){
			var fsItem = new fullScreenComponent(id, multipleChoice, {
				isThumbnail			: 	isThumbnail,
				thumbnailType		:	thumbnailType,
				thumbnailData		:	thumbnailData,
				template			:	template,
				withRubric			:   withRubric,
				fullScreenHeight	: 	fullScreenHeight,
				insideSwiper	 	:   insideSwiper
			});
		}
	}

	function multipleChoicePlayAudio(src){
		multipleChoiceAudio.src = src;
		multipleChoiceAudio.load();
		multipleChoiceAudio.addEventListener("canplay", multiplechoiceaudioplay);
	}
	var multiplechoiceaudioplay = function(){
		multipleChoiceAudio.play();
		multipleChoiceAudio.removeEventListener('canplay', multiplechoiceaudioplay);
		multipleChoiceAudio.addEventListener('ended', multiplechoiceaudioiconchange);
	}
	var multiplechoiceaudioiconchange = function(){
		container.find('.audio-element-pause-'+template).removeClass('audio-element-pause-'+template);
		multipleChoiceAudio.removeEventListener('ended', multiplechoiceaudioiconchange);
	}
	_this.setAttempts = function(attempsNumber){
		if(numberOfAttempts > 1){
			numberOfAttempts = numberOfAttempts-1;
		}
		if(attempsNumber == numberOfAttempts){
			_this.attemptsReached = true;	
		}else{
			_this.attemptsReached = false;
		}
		
	}
	_this.checkAnswers = function(){
		container.attr('data-checked', true);
		var feedbackCorrect = true, allCorrect = false;
		$('#'+id+' .multipleChoiceAnswer:not(.selected)').removeClass('multipleChoiceIncorrect multipleChoiceCorrect');
		if(withMedia){
			$('.multipleChoiceInputWrapper').removeClass('multipleChoiceIncorrect multipleChoiceCorrect');
			$('#'+id+' .multipleChoiceAnswer:not(.selected)').removeClass('correctAnswer incorrectAnswer');
		}
		if(multipleChoiceType == "radio" || multipleChoiceType == "trueFalse"){
			var answerCount = 0;
			for(var i= 0; i<=componentData.length; i++){
				var question = $('#'+id+' .multipleChoiceQuestionSet:nth-of-type('+ (i+1) + ')');
				var selected = question.find('input:checked');
				if(multipleChoiceType == "trueFalse"){
					selected.parent().removeClass('selected');
					selected.parent().find('label').removeClass(template);
				}
				if(selected.length != 0){
					if(selected[0].value == componentData[i].correctAnswers[0]){
						selected.parent().addClass('multipleChoiceCorrect');
						if(withMedia){
							selected.parent().parent().addClass('correctAnswer');
						}
						answerCount++;
					}else{
						selected.parent().addClass('multipleChoiceIncorrect');
						selected.parent().parent().addClass('incorrectAnswer');
					}
				}
			}
			if(answerCount == componentData.length)
				allCorrect = true;
			else
				allCorrect = false;
		}else{
			var checkCount = 0, totalCount = 0;
			for(var i= 0; i<=componentData.length; i++){
				checkCount = 0;
				var question = $('#'+id+' .multipleChoiceQuestionSet:nth-of-type('+ (i+1) + ')');
				var selected = question.find('input:checked');
				if(selected.length != 0){
					for(var j = 0; j<selected.length; j++){
						if(componentData[i].correctAnswers.indexOf(parseInt(selected[j].value)) != -1){
							$(selected[j]).parent().addClass('multipleChoiceCorrect');
							$(selected[j]).parent().parent().addClass('correctAnswer');
							checkCount++;
						}
						else{
							$(selected[j]).parent().addClass('multipleChoiceIncorrect');
							$(selected[j]).parent().parent().addClass('incorrectAnswer');
							feedbackCorrect = false;
						}
					}
					if(checkCount == componentData[i].correctAnswers.length && feedbackCorrect == true)
						totalCount++;
				}
			}
			if(totalCount == componentData.length)
				allCorrect = true;
			else
				allCorrect = false;
		}
		container.attr('data-answer', allCorrect);
		var inputs = $('#'+id+' input');
		var answers = $('#'+id+' .multipleChoiceAnswer');
		var answerLine = "";
		if(feedbackType == 'chat'){
			var answerLineInstance = "";
			if(typeof(attemptsAnswerLine) == 'string'){
				answerLineInstance = attemptsAnswerLine;
			}else{
				answerLineInstance = attemptsAnswerLine[_this.attempt];
			}
			var answerLineTokens = answerLineInstance.split(token);
			answerLine = answerLineTokens[0];
			var inputs = container.find("input:checked");
			for(var i = 0; i<inputs.length; i++){
				answerLine += $(inputs[i]).parent().find(".multipleChoiceAnswerLabel").html() + ((answerLineTokens[i+1] != undefined) ? answerLineTokens[i+1] : "");
			}
		}
		var contentData = "Content Data: ";
		var questions = container.find("li");
		for(var i = 0; i < questions.length; i++){
			contentData += "Question "+ (i+1) + " - [";
			var selected = questions.find('.multipleChoiceAnswer.selected');
			for(var j = 0; j<selected.length; j++){
				var answer = $(selected[j]).find('.multipleChoiceAnswerLabel').html();
				var correct = $(selected[j]).hasClass('multipleChoiceCorrect') ? true : false;
				contentData += answer;
				if(j!=selected.length-1)
					contentData+=', ';
			}
			if(selected.length < 1){
				contentData += 'Empty';
			}
			if(i==selected.length-1)
				contentData+=']; ';
			else
				contentData+= '].';
		}
		checkAnswersCallBack(allCorrect, _this.attemptsReached, contentData);
		return([allCorrect, answerLine, contentData]);
	}

	_this.resetAnswers = function(){
		container.attr('data-checked', false);
		$('#'+id+' .multipleChoiceAnswer').removeClass('multipleChoiceIncorrect multipleChoiceCorrect correctAnswer incorrectAnswer selected');
		if(multipleChoiceType == 'trueFalse'){
			$('#'+id+' .multipleChoiceAnswerLabel').removeClass(template);
		}
		$('#'+id+' .multipleChoiceInputWrapper').removeClass('multipleChoiceIncorrect multipleChoiceCorrect');
		$('#'+id+' .multipleChoiceAnswer input:checked').each(function(){
			this.checked = false;
		});
	}
	_this.revealAnswers = function(){
		if(multipleChoiceType == 'checkBox'){
			if(!keepWrongAnswers){
				_this.resetAnswers();
			}
			for (var i = 0; i < componentData.length; i++) {
				for(var j = 0; j < componentData[i].correctAnswers.length; j++){
					$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers[j] + ' input').prop('checked', true);
					$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers[j]).addClass('selected multipleChoiceCorrect correctAnswer');
				}
			};
		}else if(multipleChoiceType == 'radio'){
			if(!keepWrongAnswers){
				_this.resetAnswers();
			}
			for(var i = 0; i<componentData.length; i++){
				$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers + ' input').prop('checked', true);
				$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers).addClass('selected multipleChoiceCorrect correctAnswer');
			}
		}else if(multipleChoiceType == 'trueFalse'){
			for(var i = 0; i<componentData.length; i++){
				var checkedRadio = $('#'+id+'_question_'+ (i+1) + ' input:checked');
				if(checkedRadio.length == 0 || componentData[i].possibleAnswers.length > 2){
					if(!keepWrongAnswers){
						$('#'+id+' .multipleChoiceAnswer.multipleChoiceAnswer_trueFalse').removeClass("multipleChoiceIncorrect");
					}
					$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers + ' input').prop('checked', true);
					$('#'+id+'_question_'+ (i+1) + '_answer_'+ componentData[i].correctAnswers).addClass('multipleChoiceCorrect correctAnswer');
				}
			}
		}
	}
	_this.saveData = function(){
		var questions = container.find("li");
		var arr = [];
		var obj = {};
		for(var i = 0; i < questions.length; i++){
			var answers = $("#" + questions[i].id + " input.multipleChoiceAnswerInput");
			for (var j = 0; j < answers.length; j++){
				var answer = answers[j];
				var answerChecked = answers[j].checked;
				if (answerChecked)
					arr.push({QuestionNumber: i, AnswerId: answer.id});
			}
		}
		if(typeof(componentPageName) == 'undefined')
			componentPageName = globalArrAllPages[parseInt($(pagesContainer.swiper.activeSlide()).attr('data-index'))];
		if(arr.length > 0){
			var componentObject = {
				"pageName": componentPageName,
				"componentId": id, 
				"componentType": "multipleChoice-" + multipleChoiceType,
				"componentChecked": $('#' + id).attr("data-checked"),
				"data": JSON.stringify(arr)
			};
	    	savePageData(componentObject);
			
	    	globalArrPagesData = $.grep(globalArrPagesData,function(n,k){
				return n.pageName != componentPageName || n.componentId != id;
			});
			globalArrPagesData.push(componentObject);
		}
	}
	_this.dispatchData = function(){
		if(typeof(componentPageName) == 'undefined')
			componentPageName = globalArrAllPages[parseInt($(pagesContainer.swiper.activeSlide()).attr('data-index'))];
		var arrFiltered = $.grep(globalArrPagesData,function(n,k){
			return n.pageName == componentPageName && n.componentId == id;
		});

		if (arrFiltered.length > 0){
			var objectData = arrFiltered[0].data;
			if (typeof (objectData) == "string"){
				objectData = JSON.parse(objectData);
			}
			for(var i = 0; i < objectData.length; i++){
				var answer = $("#" + objectData[i].AnswerId);
				answer.prop('checked', true);
				if(arrFiltered[0].componentType.indexOf('trueFalse') != -1){
					answer.parent().addClass('selected');
					answer.parent().find('label').addClass(template);
				}
			}

			if (arrFiltered[0].componentChecked == true || arrFiltered[0].componentChecked == "true"){
				$('#' + id).attr("data-checked", "true");
				_this.checkAnswers();	
			}
		}
		if(getPagesData(id) == true){
			if(revealAnswers)
				_this.revealAnswers();
		}
	}
	_this.blockComponent = function(){
		var inputFields;	
		inputFields = container.find('input');
		inputFields.prop('disabled', true);
		var answers = $('#'+id+' .multipleChoiceAnswer');
		answers.addClass('disabled');
	}
	_this.unblockComponent = function(){
		var inputFields;
		inputFields = container.find('input');
		inputFields.prop('disabled', false);
		var answers = $('#'+id+' .multipleChoiceAnswer');
		answers.removeClass('disabled');
	}

	_this.init();
});