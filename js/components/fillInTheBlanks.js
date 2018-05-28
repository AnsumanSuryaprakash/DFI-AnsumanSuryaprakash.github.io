/*
	Fill in the Blank 2.8
	Input field and textarea component with multiple layouts and feedback.

	Author: Darine Tamer

	Copyright 2014, Dataflow International
	Website: http://www.dataflow.com.lb

	Released on 10/12/2014
*/
var fillInTheBlanks = (function(id, pageName, parameters){
	var _this 		= 	this;
	var container 	= 	$('#'+id).addClass('fillInTheBlanksComponent');
	container.attr('data-checked', false);

	if (parameters == undefined){
		var componentData = $.grep(globalArrComponentsData,function(n,k){
			return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "fillInTheBlanks"
		});
		parameters = componentData[0].ComponentParameters;
	}

	var questionsWrapper = $("<div>").appendTo(container);
	questionsWrapper.addClass("fillInTheBlanksQuestionsWrapper");

	$.fn.defaults = {
		componentType	: 	fillInTheBlanksType.Sentence,
		inputFieldType 	: 	fillInTheBlanksInputType.Input,
		caseSensitive 	: 	false,
		listStyle 		: 	'list-nothing',
		listStartItem 	: 	0,
		tableColumns 	: 	1,
		tableRows 		: 	1,
		topHeaderData 	: 	[],
		leftHeaderData	: 	[],
		maxCharacterLength 	: 	20,
		textareaHeight 	: 	2,
		columns 		: 	2,
		rows 			: 	2,
		wordPool 		: 	[],
		withQuestionBorder	: 	false,
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
				attemptsAnswerLine: []
			},
			numberOfAttempts: 0,
			revealAnswers: true,
			chat:{
				autoSlide: false,
				autoSlideSpeed: 2000,
			}
		},
		fullscreen 		: 	false,
		isThumbnail 	: 	false,
		thumbnailType 	: 	fullscreen_thumbnailTypeEnum.Button,
		thumbnailData 	: 	"",
		withRubric 		: 	false,
		fullScreenHeight	: 	"93%",
		template 		: 	templateType.InteractiveActivities,
		insideLms 		: 	false,
		insideSwiper 	: 	false,
		direction		: 	"LTR",
		checkAnswersCallBack: 	function(){},
		myTest : {
			Key:"fady",
			value:1
		},
		mainQuestion: "",
		mainQuestionAudio	: 	""
	}

	var params 			= 	$.extend({}, $.fn.defaults, parameters);
	params.feedback		= 	$.extend({}, $.fn.defaults.feedback, parameters.feedback);
	params.feedback.feedbackMessages = $.extend({}, $.fn.defaults.feedback.feedbackMessages, parameters.feedback.feedbackMessages);
	var checkAnswersCallBack 	= 	params.checkAnswersCallBack;
	var wordPool 			= 	params.wordPool;
	var mainQuestion 		= 	params.mainQuestion;
	var mainQuestionAudio 	= 	params.mainQuestionAudio;

	var componentData 		= 	params.componentData;//top header, left header, content, image if free, answers
	var freeModeImage 		= 	params.freeModeImage;
	var topHeaderData 		= 	params.topHeaderData;
	var leftHeaderData 		= 	params.leftHeaderData;
	var columns 			= 	params.columns;
	var tableTopQuestion 		= 	params.tableTopQuestion;
	var rows 			= 	params.rows;
	var withQuestionBorder 	= 	params.withQuestionBorder;

	var componentType 		= 	params.componentType;//simple, table, sentence, free, under image, next to image
	var inputFieldType 		= 	params.inputFieldType;
	var maxCharacterLength	= 	params.maxCharacterLength;
	var caseSensitive 		= 	params.caseSensitive;
	var listStyle 			= 	params.listStyle;
	var listStartItem 		= 	params.listStartItem;
	var textareaHeight 		= 	params.textareaHeight;

	//Feedback
	var feedbackType 		= 	params.feedback.feedbackType;
	var feedbackButtons		= 	params.feedback.buttons;
	var numberOfAttempts 	= 	params.feedback.numberOfAttempts;
	var feedbackMessages 	= 	params.feedback.feedbackMessages;
	var revealAnswers 		=	(params.feedback.revealAnswers == "false" || params.feedback.revealAnswers == false) ? false : true;
	var chat 			= 	params.feedback.chat;
	var attemptsAnswerLine 	= 	params.feedback.feedbackMessages.attemptsAnswerLine;

	var imageModeDefaultLayout= 	params.imageModeDefaultLayout;

	var fullscreen 			= 	params.fullscreen;
	var isThumbnail 		= 	params.isThumbnail;
	var thumbnailType 		= 	params.thumbnailType;
	var thumbnailData 		= 	params.thumbnailData;
	var withRubric 		= 	params.withRubric;
	var fullScreenHeight 		=	params.fullScreenHeight;
	var template 			= 	params.template;
	var insideSwiper 		= 	params.insideSwiper;
	
	var insideLms 			= 	params.insideLms;
	var componentPageName 	= 	params.componentPageName;
	var direction 			= 	params.direction;

	var token 				= 	"@_@";
	var fillInTheBlanksComponentAudio = new Audio();
	var correctAnswersArr 	= 	new Array();
	var mainQuestionDiv;

	container.addClass('fillInTheBlanksComponent'+direction);

	var arabicAlpha = ['?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.', '?.'];
	var wordPoolContainer;
	_this.attempt = 0;

	function fillInTheBlanksPlayAudio(){
		fillInTheBlanksComponentAudio.play();
		fillInTheBlanksComponentAudio.removeEventListener('canplay', fillInTheBlanksPlayAudio);
		fillInTheBlanksComponentAudio.addEventListener('ended', fillInTheBlanksAudioEnd);
	}
	function fillInTheBlanksAudioEnd(){
		$('#'+id+' .globalAudioIcon').removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
		fillInTheBlanksComponentAudio.removeEventListener('ended', fillInTheBlanksAudioEnd)
	}

	_this.init = function(){
		if(wordPool.length>0){
			container.addClass('withWordPool');
			wordPoolContainer = $('<ul>').attr('id', id+'wordPool').addClass('fillInTheBlanksWordPool');
			for(var d=0; d<wordPool.length; d++){
				var word = $('<li>').html(wordPool[d]).addClass('fillInTheBlanksWordPoolItem ').appendTo(wordPoolContainer);
			}
		}
		if(typeof(mainQuestion)!=undefined && mainQuestion != ""){
			container.addClass('fillInTheBlanksComponentInstruction');
			questionsWrapper.addClass('componentContentWrapper');
			mainQuestionDiv = $('<div>').addClass('componentInstructionalTextWrapper');
			var mainQuestionContainer = $('<div>').addClass('mainQuestionTextWrapper').html(mainQuestion).appendTo(mainQuestionDiv);
			if(typeof(mainQuestionAudio)!=undefined && mainQuestionAudio != ""){
				var audioImageWrapper = $('<div>').addClass('globalAudioIconContainer');
				var audioImage = $('<div>').addClass('globalAudioIcon globalAudioIconPlay').appendTo(audioImageWrapper);
				mainQuestionDiv.prepend(audioImageWrapper);
				fillInTheBlanksComponentAudio = $('<audio>').addClass('fillInTheBlanksComponentAudio').attr('src', mainQuestionAudio).appendTo(container);
				fillInTheBlanksComponentAudio.load();
				audioImage.hammer().off('tap').on('tap', function(){
					var audioIcon = $(this);
					fillInTheBlanksComponentAudio = container.find('.fillInTheBlanksComponentAudio')[0];
					if(audioIcon.hasClass('globalAudioIconPlay')){
						fillInTheBlanksComponentAudio.addEventListener('canplay', fillInTheBlanksPlayAudio());
						audioIcon.removeClass('globalAudioIconPlay').addClass('globalAudioIconPause');
					}else{
						fillInTheBlanksComponentAudio.pause();
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
		if(componentType == 'simple'){
			if(typeof(mainQuestion)!=undefined && mainQuestion != ""){
				if(wordPool.length > 0){
					wordPoolContainer.appendTo(mainQuestionDiv);
					resizeComponent(id);
				}
			}else{
				if(wordPool.length > 0){
					container.addClass('fillInTheBlanksComponentInstruction');
					questionsWrapper.addClass('componentContentWrapper');
					wordPoolContainer.addClass('componentInstructionalTextWrapper');
					container.prepend(wordPoolContainer);
				}
				resizeComponent(id);
				$(window).on("resizeEnd",function(){
					resizeComponent(id);
				});
			}
		}
		switch(componentType){
			case 'simple':
			initSimpleMode();
			feedbackType = 'nothing';
			buttons = {};
			break;
			case 'sentence':
			initSentenceMode();
			break;
			case 'table':
			initTableMode();
			break;
			case 'free':
			initFreeMode();
			break;
			case 'imageHorizontal':
			case 'imageVertical':
			initImageMode();
			break;
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
				componentType: 'fillInTheBlanks',
				revealAnswers: revealAnswers
			});
		}else{
			container.addClass("noFeedback");
		}
		if(fullscreen){
			var fsItem = new fullScreenComponent(id, fillInTheBlanks, {
				isThumbnail		: 	isThumbnail,
				thumbnailType	:	thumbnailType,
				thumbnailData	:	thumbnailData,
				template		:	template,
				withRubric		:   	withRubric,
				fullScreenHeight	: 	fullScreenHeight,
				insideSwiper 		:  	insideSwiper
			});
		}
		$('#'+id+' input').hammer().off('tap').on('tap', function(){
			$(this).removeClass('fillInTheBlanksCorrectAnswer fillInTheBlanksIncorrectAnswer');
		});
		$('#'+id+' textarea').hammer().off('tap').on('tap', function(){
			$(this).removeClass('fillInTheBlanksCorrectAnswer fillInTheBlanksIncorrectAnswer');
		});
	}
	function initSimpleMode(){
		container.addClass('fillInTheBlanksSimple');
		var textArea = $('<textarea>').attr('type', 'text').attr('onblur','textArea_onBlur();').addClass('fillInTheBlanksSimpleTextarea').appendTo(questionsWrapper);
		if(typeof(componentData) != "undefined"){
			if(componentData.length >0 ){
				if(typeof(componentData[0].defaultValue) != undefined && componentData[0].defaultValue != null){
					textArea.attr('placeholder', componentData[0].defaultValue);
				}
			}
		}
	}

	function initSentenceMode(){
		container.addClass('fillInTheBlanksSentence');
		if(listStyle == "list-numeric" || listStyle == "list-alpha-lower" || listStyle == "list-alpha-upper" || listStyle == "list-roman-upper" || listStyle == "list-roman-lower" || listStyle == "arabic-alpha")
			var questionList = $('<ol>').addClass('fillInTheBlanksList fillInTheBlanks'+listStyle).appendTo(questionsWrapper);
		else
			var questionList = $('<ul>').addClass('fillInTheBlanksList fillInTheBlanks'+listStyle).appendTo(questionsWrapper);
		if(wordPool.length>0){
			var wordPoolWrapper = $('<li>').appendTo(questionList);
			wordPoolContainer.appendTo(wordPoolWrapper);
		}
		for(var i=0; i<componentData.length; i++){
			var questionTokens = componentData[i].question.split(token);
			var question = $('<li>').attr('id', id+'_question_'+(i+1)).addClass('fillInTheBlanksQuestion').appendTo(questionList);
			if(withQuestionBorder){
				question.addClass('withQuestionBorder');
			}
			if(listStartItem!=0){
				question.css('counter-reset', listStyle+'Counter '+(listStartItem-1+i));
			}
			var span = $('<span>').attr('data-letter', arabicAlpha[i]).addClass('fillInTheBlanksFirstSpan').html(questionTokens[0]).appendTo(question);
			for(var j=1; j<questionTokens.length; j++){
				if(inputFieldType == 'input'){
					container.addClass('fillInTheBlanksSentenceInput');
					var input = $('<input>').attr('type', 'text').attr('onblur','inputText_onBlur();').attr('question', i+1).attr('index', j).attr('id', id+'_question_'+(i+1)+'_input_'+(j+1)).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('size', maxCharacterLength).attr('autocapitalize', 'off').attr('autocorrect', 'off').attr('onKeyPress', 'return onKeyChangeEvent(event)').addClass('fillInTheBlanksInputText').appendTo(question);
				}else{
					var textarea = $('<textarea>').attr('type', 'text').attr('onblur','textArea_onBlur();').attr('question', i+1).attr('index', j).attr('id', id+'_question_'+(i+1)+'_input_'+(j+1)).attr('rows', textareaHeight).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('autocapitalize', 'off').attr('onKeyPress', 'return onKeyChangeEvent(event)').attr('autocorrect', 'off').addClass('fillInTheBlanksTextArea').appendTo(question);
				}
				if(typeof(componentData[i].correctAnswers) != 'undefined'){
					correctAnswersArr.push(componentData[i].correctAnswers[j-1]);
				}
				if(questionTokens[j].length !=0)
					var finalSpan = $('<span>').html(questionTokens[j]).appendTo(question);
			}
		}
	}

	function initFreeMode(){
		container.addClass('fillInTheBlanksFreeMode');
		if(wordPool.length>0){
			var wordPoolWrapper = $('<div>').appendTo(container);
			wordPoolContainer.appendTo(wordPoolWrapper);
		}
		var mainContainer = $('<div>').attr('id', id+'MainContainer').addClass('fillInTheBlanksMainContainer').appendTo(questionsWrapper);
		var backgroundImage = new Image();
		backgroundImage.src = freeModeImage;
		backgroundImage.onload = function(){
			mainContainer.css('width', backgroundImage.width).css('height', backgroundImage.height).css('background-image', 'url("'+freeModeImage+'")');
		}
		for(var i=0; i<componentData.length; i++){
			var input = $('<input>').attr('type', 'text').attr('onblur','inputText_onBlur();').attr('id', id+'_field_'+(i+1)).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('autocapitalize', 'off').attr('autocorrect', 'off').attr('onKeyPress', 'return onKeyChangeEvent(event)').addClass('fillInTheBlanksFreeModeInput').css('width', componentData[i].width).css('height', componentData[i].height).css('top', componentData[i].top).css('left', componentData[i].left).appendTo(mainContainer);
			if(typeof(componentData[i].correctAnswers) != 'undefined'){
				for(var j = 0; j <componentData[i].correctAnswers.length; j++){
					correctAnswersArr.push(componentData[i].correctAnswers[j]);
				}
			}
			if(typeof(componentData[i].defaultValue) != undefined && componentData[i].defaultValue != null){
				if(componentData[i].defaultValue.length !=0){
					input.attr('placeholder', componentData[i].defaultValue);
				}
			}
		}
	}

	function initTableMode(){
		container.addClass('fillInTheBlanksTableMode');
		if(wordPool.length>0){
			var wordPoolWrapper = $('<div>').appendTo(questionsWrapper);
			wordPoolWrapper.addClass("fillInTheBlanksWordPool");
			wordPoolContainer.appendTo(wordPoolWrapper);
		}
		if(typeof(tableTopQuestion)!= undefined && tableTopQuestion != ""){
			var tableTopQuestionText = $('<di>').addClass('fillInTheBlanksTableModeQuestion').html(tableTopQuestion).appendTo(questionsWrapper);
		}
		var tableContainer = $('<div>').addClass('fillInTheBlanksMainTableContainer').appendTo(questionsWrapper);
		var table = $('<table>').attr('id', id+'Table').addClass('fillInTheBlanksTable').appendTo(tableContainer);
		var topHeader = $('<tr>').addClass('fillInTheBlanksTopHeader fillInTheBlanksHeaderItem textColor_'+template).appendTo(table);
		var width;
		if(columns >= topHeaderData.length && leftHeaderData.length > 0 && topHeaderData.length > 0){
			var topLeftCell = $('<td>').addClass('fillInTheBlanksTableTopLeftCell fillInTheBlanksHeaderItem textColor_'+template+' border2px border-'+template).appendTo(topHeader);
		}
		for(var i = 0; i<topHeaderData.length; i++){
			var cell = $('<td>').addClass('fillInTheBlanksTableTopHeader fillInTheBlanksHeaderItem textColor_'+template+' border2px border-'+template).html(topHeaderData[i]).appendTo(topHeader);
		}
		var offsetCol = topHeaderData.length - columns;
		var cellCount = 0;
		for(var j = 0; j<rows; j++){
			var row = $('<tr>').addClass('fillInTheBlanksTableRow').appendTo(table);
			if(leftHeaderData.length > 0){
				var cell = $('<td>').addClass('fillInTheBlanksTableLeftHeader fillInTheBlanksHeaderItem textColor_'+template+' border2px border-'+template).html(leftHeaderData[j]).appendTo(row);
			}
			for(var k = 0; k<topHeaderData.length - offsetCol; k++){
				var cell = $('<td>').addClass('fillInTheBlanksTableCell border2px border-'+template).attr('id', id+'_row_'+(j+1)+'_cell_'+(k+1)).appendTo(row);
				var questionTokens = componentData[cellCount].cellData.split(token);
				var span = $('<span>').addClass('fillInTheBlanksTableFirstSpan').html(questionTokens[0]).appendTo(cell);
				var inputCount = 0;
				for(var x=1; x<questionTokens.length; x++){
					if(inputFieldType == 'input'){
						var input = $('<input>').attr('type', 'text').attr('onblur','inputText_onBlur();').attr('id', id+'_input_'+(cellCount+1)).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('onKeyPress', 'return onKeyChangeEvent(event)').attr('autocapitalize', 'off').attr('autocorrect', 'off').attr('data-index', inputCount).attr('data-cell', cellCount).addClass('fillInTheBlanksInputText').appendTo(cell);
						inputCount++;
						if(typeof(componentData[cellCount].correctAnswers) != 'undefined'){
							correctAnswersArr.push(componentData[cellCount].correctAnswers[x-1]);
						}
						if(typeof(componentData[cellCount].defaultValue) != 'undefined'){
							input.attr('placeholder', componentData[cellCount].defaultValue);
						}
					}else{
						var textarea = $('<textarea>').attr('type', 'text').attr('onblur','textArea_onBlur();').attr('id', id+'_input_'+(cellCount+1)).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('onKeyPress', 'return onKeyChangeEvent(event)').attr('autocapitalize', 'off').attr('data-index', inputCount).attr('data-cell', cellCount).attr('autocorrect', 'off').addClass('fillInTheBlanksTextArea').appendTo(cell);
						inputCount++;
						if(typeof(componentData[cellCount].correctAnswers) != 'undefined'){
							correctAnswersArr.push(componentData[cellCount].correctAnswers[x-1]);
						}
						if(typeof(componentData[cellCount].defaultValue) != 'undefined'){
							textarea.attr('placeholder', componentData[cellCount].defaultValue);
						}
					}
					if(questionTokens[x].length !=0)
						var finalSpan = $('<span>').html(questionTokens[x]).appendTo(cell);
				}
				cellCount++;
			}
		}
	}

	function initImageMode(){
		container.addClass('fillInTheBlanksImageMode fillInTheBlanks'+componentType);
		if(wordPool.length>0){
			var wordPoolWrapper = $('<div>').appendTo(questionsWrapper);
			wordPoolWrapper.addClass("fillInTheBlanksWordPoolContainer");
			wordPoolContainer.appendTo(wordPoolWrapper);
		}
		var dataContainer = $('<div>').addClass('fillInTheBlanksMediaContainer').appendTo(questionsWrapper);
		for(var i = 0; i<componentData.length; i++){
			var question = $('<div>').addClass('fillInTheBlanksMediaQuestion').appendTo(dataContainer);
			var image = $('<img>').attr('src', componentData[i].image).addClass('fillInTheBlanksImage imgShadow').appendTo(question);
			var questionTokens = componentData[i].question.split(token);
			var question = $('<div>').attr('id', id+'_question_'+(i+1)).addClass('fillInTheBlanksQuestion').appendTo(dataContainer);
			if(withQuestionBorder){
				question.addClass('withQuestionBorder');
			}
			var span = $('<span>').attr('data-letter', arabicAlpha[i]).addClass('fillInTheBlanksFirstSpan').html(questionTokens[0]).appendTo(question);
			for(var j=1; j<questionTokens.length; j++){
				if(inputFieldType == 'input'){
					container.addClass('fillInTheBlanksSentenceInput');
					var input = $('<input>').attr('type', 'text').attr('onblur','inputText_onBlur();').attr('question', i+1).attr('index', j).attr('id', id+'_question_'+(i+1)+'_input_'+(j+1)).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('size', maxCharacterLength).attr('autocapitalize', 'off').attr('autocorrect', 'off').attr('onKeyPress', 'return onKeyChangeEvent(event)').addClass('fillInTheBlanksInputText').appendTo(question);
				}else{
					var textarea = $('<textarea>').attr('type', 'text').attr('onblur','textArea_onBlur();').attr('question', i+1).attr('index', j).attr('id', id+'_question_'+(i+1)+'_input_'+(j+1)).attr('rows', textareaHeight).attr('type', 'text').attr('onKeyUp', 'return onKeyChangeEvent(event)').attr('autocapitalize', 'off').attr('onKeyPress', 'return onKeyChangeEvent(event)').attr('autocorrect', 'off').addClass('fillInTheBlanksTextArea').appendTo(question);
				}
				if(typeof(componentData[i].correctAnswers) != 'undefined'){
					correctAnswersArr.push(componentData[i].correctAnswers[j-1]);
				}
				if(questionTokens[j].length !=0)
					var finalSpan = $('<span>').html(questionTokens[j]).appendTo(question);
			}
		}
	}

	_this.checkAnswers = function(){
		var inputFields;
		container.attr('data-checked', true);
		var allCorrect = false;

		if(inputFieldType == 'input')
			inputFields = container.find('input');
		else
			inputFields = container.find('textarea');
		var answerCount = 0;
		for(var i = 0; i<correctAnswersArr.length; i++){
			var answer;
			if(!caseSensitive){
				for(var j=0; j<correctAnswersArr[i].length; j++)
					correctAnswersArr[i][j] = correctAnswersArr[i][j].toLowerCase();
				answer = inputFields[i].value.toLowerCase();
			}else{
				inputFields[i].value;
			}
			if(correctAnswersArr[i].indexOf(answer) != -1){
				inputFields[i].className += ' fillInTheBlanksCorrectAnswer';
				answerCount++;
			}else{
				inputFields[i].className += ' fillInTheBlanksIncorrectAnswer';
			}
		}
		if(answerCount == correctAnswersArr.length){
			allCorrect = true;
		}
		var answerLine = "";
		if(feedbackType == 'chat'){
			var answerLineInstance = "";
			if(typeof(attemptsAnswerLine) == 'string'){
				answerLineInstance = attemptsAnswerLine;
			}else{
				answerLineInstance = attemptsAnswerLine[_this.attempt];
			}
			var answeLineTokens = answerLineInstance.split(token);
			answerLine = answeLineTokens[0];
			for(var i = 0; i<answeLineTokens.length-1; i++){
				answerLine+= inputFields[i].value+answeLineTokens[i+1];
			}
		}
		_this.attempt++;
		var contentData = "Content Data: ";
		var inputSelect = container.find(inputFieldType);
		for(var i = 0; i < inputSelect.length; i++){
			var answer = inputSelect[i].value;
			if(answer.length == 0)
				answer = "Field Empty";
			if(i!=inputSelect.length-1)
				contentData+= "Answer "+(i+1)+" - "+answer+"; ";
			else
				contentData+= "Answer "+(i+1)+" - "+answer+".";
		}
		checkAnswersCallBack(allCorrect);
		return([allCorrect, answerLine, contentData]);
	}

	_this.resetAnswers = function(){
		var inputFields;
		container.attr('data-checked', false);
		if(inputFieldType == 'input')
			inputFields = container.find('input');
		else
			inputFields = container.find('textarea');
		for(var i=0; i<inputFields.length; i++){
			$(inputFields[i]).removeClass('fillInTheBlanksCorrectAnswer fillInTheBlanksIncorrectAnswer');
			inputFields[i].value = '';
		}
	}
	_this.revealAnswers = function(){
		var allInputs = $('#'+id+" "+inputFieldType);
		allInputs.removeClass('fillInTheBlanksIncorrectAnswer').addClass('fillInTheBlanksCorrectAnswer');
		if(componentType == 'sentence' || componentType == "imageVertical" || componentType == 'imageHorizontal'){
			for(var i = 0; i<allInputs.length; i++){
				allInputs[i].value = "";
				allInputs[i].value = componentData[parseInt($(allInputs[i]).attr('question'))-1].correctAnswers[parseInt($(allInputs[i]).attr('index'))-1][0];
			}
		}else if(componentType == 'table'){
			for(var i = 0; i<allInputs.length; i++){
				var index = parseInt(allInputs[i].getAttribute('data-index'));
				var cell = parseInt(allInputs[i].getAttribute('data-cell'));
				allInputs[i].value = componentData[cell].correctAnswers[index][0]
			}
		}else{
			for(var i = 0; i<componentData.length; i++){
				allInputs[i].value = "";
				allInputs[i].value = componentData[i].correctAnswers[0][0];
			}
		}
	}
	_this.blockComponent = function(){
		var inputFields;
		if(inputFieldType == 'input')
			inputFields = container.find('input');
		else
			inputFields = container.find('textarea');
		inputFields.prop('disabled', true);
		$('#'+id+' input').hammer().off('tap');
		$('#'+id+' textarea').hammer().off('tap');
	}
	_this.unblockComponent = function(){
		var inputFields;
		if(inputFieldType == 'input')
			inputFields = container.find('input');
		else
			inputFields = container.find('textarea');
		inputFields.prop('disabled', false);
		$('#'+id+' input').hammer().off('tap').on('tap', function(){
			$(this).removeClass('fillInTheBlanksCorrectAnswer fillInTheBlanksIncorrectAnswer');
		});
		$('#'+id+' textarea').hammer().off('tap').on('tap', function(){
			$(this).removeClass('fillInTheBlanksCorrectAnswer fillInTheBlanksIncorrectAnswer');
		});
	}
	_this.saveData = function(){
		var inputs = container.find(inputFieldType);
		var arr = [];
		var answers = new Array();
		var obj = {};
		for(var i = 0; i < inputs.length; i++){
			var answer = inputs[i].value;
			var inputId = inputs[i].id;
			if(answer != 0)
				arr.push({InputId: inputId, Answer: answer});
		}
		if(typeof(componentPageName) == 'undefined')
			componentPageName = globalArrAllPages[parseInt($(pagesContainer.swiper.activeSlide()).attr('data-index'))];
		if(arr.length > 0){
			var componentObject = {
				"pageName": componentPageName,
				"componentId": id, 
				"componentType": "fillInTheBlanks",
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
				var answer = $("#" + objectData[i].InputId);
				answer[0].value = objectData[i].Answer;
			}

			if (arrFiltered[0].componentChecked == true || arrFiltered[0].componentChecked == "true"){
				$('#' + id).attr("data-checked", "true");
				_this.checkAnswers();	
			}
		}
	}

	_this.init();
});

function onKeyChangeEvent(event){
	var srcElement = $(event.srcElement);
	// remove all highlight classes over source element
	srcElement.removeClass('fillInTheBlanksCorrectAnswer').removeClass('fillInTheBlanksIncorrectAnswer');
	return true;
}