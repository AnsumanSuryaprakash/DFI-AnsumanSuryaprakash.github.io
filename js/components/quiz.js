/*
	Quiz 1.2
	
	Author: Wissam Hobeika

	Copyright 2015, Dataflow International
	Website: http://www.dataflowinternational.com

	Released on 01/06/2015
*/
var quiz = (function(id, pageName, parameters) {
	var _this = this;
	_this.containerID = id;
	_this.containerJS = document.getElementById(_this.containerID);
	_this.containerJS.className += _this.containerJS.className ? ' quiz' : 'quiz';

    // if (parameters == undefined){
    //     var componentData = $.grep(globalArrComponentsData,function(n,k){
    //         return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "QUIZ"
    //     })
    //     parameters = componentData[0].ComponentParameters;
    // }


    $.fn.defaults = {
		"quizType" : "CC", // CC, QF, QP
		"explanation": true,
		"review":false,
		"componentData": [
	        {
	            "type": "component",
	            "id": "page6_q1",
	            "multipleChoice": {
		            "multipleChoiceType": "radio",
		            "componentData": [
		                {
		                    "question": "Descriptive writing is used in many subjects. However, some topics require descriptive writing more than others. For which of these topics would you mainly use descriptive writing?",
		                    "type": "text",
		                    "possibleAnswers": [
		                        "An analysis of the stock market crash",
								"An examination of the causes of Word War I",
								"The glass and steel skyscrapers of New York",
								"How to change a tire on your bike"
		                    ],
		                    "correctAnswers": [
		                        3
		                    ]
		                }
		            ],
		            "direction": "LTR",
		            "listStyle": "list-nothing",
		            "gridLayout": false,
		            "template": "adec",
		            "feedback": {
		                "feedbackType": "nothing",
		                "revealAnswers": true,
		                "buttons": [
		                    {
		                        "button": "check",
		                        "text": "Submit Answer"
		                    },
		                    {
			                    "button": "tryAgain",
			                    "text": "Try Again"
			                }
		                ],
		                "numberOfAttempts": 2,
		                "feedbackMessages": {
		                    "correctMessage": "That’s correct. Look at the explanation for each option to understand why this is the correct answer.",
		                    "incorrectMessage": "That’s not correct. This is the correct answer. Look at the explanation for each option to understand why this is the correct answer.",
		                    "attemptsMessages": "That’s not correct. Try again."
		                }
		            },
		            "fullscreen": false,
		            "componentPageName": "",
		            "mainQuestion":"",
		            "mainQuestionAudio": "sounds/page2/instruction.mp3"
	            },
	            "correctExplanatory":"For answer option A, you might include some description, but most of the writing for this topic will provide reasons for the crash.<br/>For answer option B, most of the writing will be explaining or analyzing the causes, not describing them.<br/>For answer option D, you might briefly describe the tire and the bike, but most of the writing will explain the process.<br/>For answer option C, you would mainly use descriptive writing to show what the skyscrapers of New York are like.",
	            "incorrectExplanatory":"For answer option A, you might include some description, but most of the writing for this topic will provide reasons for the crash.<br/>For answer option B, most of the writing will be explaining or analyzing the causes, not describing them.<br/>For answer option D, you might briefly describe the tire and the bike, but most of the writing will explain the process.<br/>For answer option C, you would mainly use descriptive writing to show what the skyscrapers of New York are like.",
	        },
	        {
	            "type": "component",
	            "id": "page6_q2",
	            "multipleChoice": {
		            "multipleChoiceType": "radio",
		            "componentData": [
		                {
		                    "question": "For which of these topics would you mainly use descriptive writing?",
		                    "type": "text",
		                    "possibleAnswers": [
		                        "The benefits of eating eggs",
								"How to cook an omelet",
								"Breakfast at Grandma’s house",
								"An introduction to French cooking"
		                    ],
		                    "correctAnswers": [
		                        3
		                    ]
		                }
		            ],
		            "direction": "LTR",
		            "listStyle": "list-nothing",
		            "gridLayout": false,
		            "template": "adec",
		            "feedback": {
		                "feedbackType": "nothing",
		                "revealAnswers": true,
		                "buttons": [
		                    {
		                        "button": "check",
		                        "text": "Submit Answer"
		                    },
		                    {
			                    "button": "tryAgain",
			                    "text": "Try Again"
			                }
		                ],
		                "numberOfAttempts": 2,
		                "feedbackMessages": {
		                    "correctMessage": "Yes, that’s it!",
		                    "incorrectMessage": "No. I’m actually at (B, 5)!",
		                    "attemptsMessages": "No, that’s not it. Can you check again?"
		                }
		            },
		            "fullscreen": false,
		            "componentPageName": "",
		            "mainQuestion":"",
		            "mainQuestionAudio": "sounds/page2/instruction.mp3"
	            },
	            "correctExplanatory":"For answer option A, you might include some description, but most of the writing for this topic will provide reasons for eating eggs.<br/>For answer option B, you might briefly describe the omelet, but most of the writing will will explain the process.<br/>For answer option D, you might briefly describe French meals, but most of the writing will require explanation.<br/>For answer option C, you would most likely describe the breakfast that Grandma cooks for you, using plenty of sensory detail.",
	            "incorrectExplanatory":"For answer option A, you might include some description, but most of the writing for this topic will provide reasons for eating eggs.<br/>For answer option B, you might briefly describe the omelet, but most of the writing will will explain the process.<br/>For answer option D, you might briefly describe French meals, but most of the writing will require explanation.<br/>For answer option C, you would most likely describe the breakfast that Grandma cooks for you, using plenty of sensory detail.",
	        }
	    ],
	    "leftImages": [
	        {
	            "thumb": "images/page6/RUW_L1_M2_SB_011_PHO_001_sml.jpg",
	            "full": "images/page6/RUW_L1_M2_SB_011_PHO_001_fls.jpg",
	            "caption": "test"
	        },
	        {
	            "thumb": "images/page6/RUW_L1_M2_SB_011_PHO_001_sml.jpg",
	            "full": "images/page6/RUW_L1_M2_SB_011_PHO_001_fls.jpg",
	            "caption": ""
	        },
	        {
	            "thumb": "images/page6/RUW_L1_M2_SB_011_PHO_001_sml.jpg",
	            "full": "images/page6/RUW_L1_M2_SB_011_PHO_001_fls.jpg",
	            "caption": ""
	        },
	        {
	            "thumb": "images/page6/RUW_L1_M2_SB_011_PHO_001_sml.jpg",
	            "full": "images/page6/RUW_L1_M2_SB_011_PHO_001_fls.jpg",
	            "caption": "test2"
	        }
	    ]
	};

	var params 		= 	$.extend({}, $.fn.defaults, parameters);
	_this.quizType 	= 	params.quizType;
	_this.componentData = params.componentData;
	_this.leftImages = params.leftImages;
	_this.explanation = params.explanation;
	_this.review = params.review;
	_this.passage = params.passage;
	_this.showBackButton = false;

	var leftQuizImages, quizWrapper, questionNumber = 1, questionsLength, questions = [], answers = [], questionIndex = 0, resultsShown = false;

	Question = window.Question = function(options) {
		this._id = options.id;
		this._type = options.type;
		this._questionNumber = options.questionNumber;
		this._parentContainer = options.parent;
		this._componentData = options.componentData;
		this._quizTitle = "Quiz";
		this._mc = null;
		this._generate();
		this._drawQuestion();
	}

	Question.prototype = {
		VERSION: '0.1.0',
		_generate: function(){
			this.quizHeader = document.createElement("div");
			this.quizHeader.className = "quizHeader"; 

			this.quizTitle = document.createElement("div");
			this.quizTitle.className = "quizTitle";
			this.quizTitle.innerHTML = this._quizTitle;

			this.quizHeader.appendChild(this.quizTitle);

			if(this._componentData.multipleChoice.mainQuestionAudio != ""){
				this.quizAudio = document.createElement("img");
				this.quizAudio.className = "audioIcon audioIconPopUp";
				this.quizAudio.src = "images/highlightQuizAudioIcon.png";
				this.quizAudio.setAttribute("audiosource",this._componentData.multipleChoice.mainQuestionAudio);
				this.quizHeader.appendChild(this.quizAudio);
			}

			this.currentQuestion = document.createElement("div");
			this.currentQuestion.className = "questionNumber";
			this.currentQuestion.innerHTML = "Question "+this._questionNumber+"/"+questionsLength;
			
			this.quizHeader.appendChild(this.currentQuestion);

			this.multipleChoiceComp = document.createElement("div");
			this.multipleChoiceComp.id = "mc_"+this._componentData.id;
			this.multipleChoiceComp.className = "quizMC";

			this._parentContainer.className += "quizFullWidth";
			this._parentContainer.appendChild(this.quizHeader);
			this._parentContainer.appendChild(this.multipleChoiceComp);
			
			if(!_this.review){
				this._componentData.multipleChoice.checkAnswersCallBack = function (result, attempt, contentData) {
					// if(_this.componentData[questionIndex].multipleChoice.feedback.hiddenButtons)
					if($('#'+_this.componentData[questionIndex].id+' .multipleChoiceSelector').hasClass('feedbackInactive'))
						ProcessSetValue('component',$('#pagesContainer .currentPageName').attr('id'),_this.componentData[questionIndex].id,1,1, result ? 'correct': 'wrong', contentData, "Quiz");
					if(result == true){
						result = "Correct";
					}if(result == false){
						result = "Incorrect";
					}

					this.answerQuestion = searchByQuestionNumber(questionNumber, answers);
					if(this.answerQuestion){
						this.answerQuestion["answer"] = result;
					}else{
						answers.push({
							"questionNumber":questionNumber, 
							"answer":result
						});
					}

					if(_this.explanation){
						if((result == "Correct") || ((result == "Incorrect") && (attempt == true))){
							$(event.target).parent().find(".explanationButton").show();
							if(_this.showBackButton){
								$(event.target).parent().find(".backToResultsButton").show();
							}else{
								$(event.target).parent().find(".backToResultsButton").hide();
							}
						}
					}
					
					// if(result == "Incorrect"){
					// 	setTimeout(750, function(){
					// 		$("#"+_this.containerID).find(".feedbackContainer").find(".tryAgainBtn").trigger("tap");
					// 	});
					// }
				}
			}else{
				
				this._componentData.multipleChoice.checkAnswersCallBack = function (result, attempt, contentData) {
					// if(_this.componentData[questionIndex].multipleChoice.feedback.buttons.length < 1)
					if($('#'+_this.componentData[questionIndex].id+' .multipleChoiceSelector').hasClass('feedbackInactive'))
						ProcessSetValue('component',$('#pagesContainer .currentPageName').attr('id'),_this.componentData[questionIndex].id,1,1, result ? 'correct': 'wrong', contentData, 'Quiz');
					if(result == true){
						result = "Correct";
					}if(result == false){
						result = "Incorrect";
					}

					answers[questionIndex]["questionNumber"] = questionIndex+1; 
					answers[questionIndex]["answer"] = result;
					if(questionIndex<questions.length-1){
						questionIndex++;
					}
					if(_this.explanation){
						if((result == "Correct") || ((result == "Incorrect") && (attempt == true))){
							// $(event.target).parent().find(".explanationButton").show();
							$(event.target).parent().parent().parent().parent().find(".explanationButton").show();
							$(event.target).parent().parent().parent().parent().find(".backToResultsButton").show();
						}
					}
					
				}
			}

			return this;
		},
		_drawQuestion: function(){
			this._mc = new multipleChoice(this.multipleChoiceComp.id, pageName, this._componentData.multipleChoice);
			this._mc.questionNumber = this._questionNumber;
			
			this._mc.triggerSubmit = function(){
				this.feedbackComponent.submitAnswers();
				this.feedbackComponent.hideButtons();
				/*if(_this.showBackButton){
					$("#"+this.multipleChoiceComp.id).find(".backToResultsButton").show();
				}else{
					$("#"+this.multipleChoiceComp.id).find(".backToResultsButton").hide();
				}*/
			}
			this._mc.revealBackButton = function(){
				$("#"+pageName).find(".backToResultsButton").show();
			}
			if(_this.explanation){
				this.explanationButton = document.createElement("div");
				this.explanationButton.className = "checkBtn explanationButton";
				this.explanationButton.innerHTML = "Explanation";
				this.explanationButton.style.display = "none";
				this.explanationButton.setAttribute("questionNumber", this._questionNumber);
				$(this.explanationButton).hammer().off('tap').on('tap', function(){
					showExplanation();
				});
				$(this.multipleChoiceComp).find(".feedbackContainer").append(this.explanationButton);
			}
		
			this.backToResultsButton = document.createElement("div");
			this.backToResultsButton.className = "checkBtn backToResultsButton";
			this.backToResultsButton.innerHTML = "Back to Results";
			this.backToResultsButton.style.display = "none";
			this.backToResultsButton.setAttribute("questionNumber", this._questionNumber);
			//$(this.backToResultsButton).on('click', function(){
			$(this.backToResultsButton).hammer().on('tap', function(){
				quizWrapper.pageSwiper.swipeTo(quizWrapper.pageSwiper.slides.length-1);
				questionNumber = quizWrapper.pageSwiper.slides.length;
				_this.slideNextCallBack();
			});
			$(this.multipleChoiceComp).find(".feedbackContainer").append(this.backToResultsButton);
			
			if(_this.review){
				this._mc.feedbackComponent.hideButtons();
			}
		}
	}

	Question.create = function(options) {
        return new Question(options);
    }

	_this.init = function(){
		
		switch(_this.quizType){
			case "CC":

				quizWrapper = new slidingElements(_this.containerID, pageName, {
					componentData : _this.componentData,
					simulateTouch : true,
					withPagination: false,
					withArrows    : true,
					slideChangeCallBack: function(){
						_this.slideChangeCallBack();
					}
				});

				quizWrapper.pageSwiper.container.className += " quizCC";
				_this.initCC();

				break;
			case "QF":
				_this.componentData.push({
					"type":"component",
					"id": pageName+"_quizQReview"
				});

				quizWrapper = new slidingElements(_this.containerID, pageName, {
					componentData : _this.componentData,
					simulateTouch : true,
					withPagination: false,
					withArrows    : true,
					slideChangeCallBack: function(){
						_this.slideChangeCallBack();
					},
					slideNext: function(){
						_this.slideNextCallBack();
					},
					slidePrev: function(){
						_this.slidePrevCallBack();
					}
				});

				if(_this.leftImages){
					leftQuizImages = _this.generateLeftImages(_this.leftImages);
					_this.containerJS.insertBefore(leftQuizImages, _this.containerJS.firstChild);
					// Fix Photoswipe Issue
					$(leftQuizImages).find("a.img").photoSwipe();
					quizWrapper.pageSwiper.container.style.width = "70%";
					enableDraggingOnItem(".leftImagesQuiz");
				}
				quizWrapper.pageSwiper.container.className += " quizQ";
				_this.initQF();
				break;
			case "QP":
				_this.componentData.push({
					"type":"component",
					"id": pageName+"_quizPReview"
				});
				quizWrapper = new slidingElements(_this.containerID, pageName, {
					componentData : _this.componentData,
					simulateTouch : true,
					withPagination: false,
					withArrows    : true,
					slideChangeCallBack: function(){
						_this.slideChangeCallBack();
					},
					slideNext: function(){
						_this.slideNextCallBack();
					},
					slidePrev: function(){
						_this.slidePrevCallBack();
					}
				});

				if(_this.passage != null){
					quizWrapper.pageSwiper.container.className += " quizQ quizQPswiper";
					quizWrapper.pageSwiper.container.style.width = "45%";
					quizWrapper.pageSwiper.container.style.float = "left";
					quizWrapper.pageSwiper.container.style.position = "absolute";

					var passageExcerpt = document.createElement("div");
					passageExcerpt.id = "passage_"+pageName;
					passageExcerpt.className = "quizPassage quizQPpassage";
					_this.containerJS.appendChild(passageExcerpt);
					
					// var quizPassage = $("#"+passageExcerpt.id).passage(_this.passage);
					var quizPassage =  new passage(passageExcerpt.id, pageName, _this.passage);
					passageExcerpt.className += " quizPassage quizQPpassage";
					_this.initQFP();
				}else{
					quizWrapper.pageSwiper.container.className += " quizQ quizQPRswiper";
					_this.initQFPR();
				}
				break;
		}
		if (typeof MathJax !== 'undefined') 
  			MathJax.Hub.Queue(["Typeset",MathJax.Hub],pageName);
	}

	_this.initCC = function(){
		for(var c=0;c<_this.componentData.length;c++){
			var leftPanel = document.createElement("div");
			leftPanel.className = "leftPanel";

			var panelTitle = document.createElement("div");
			panelTitle.className = "panelTitle";
			panelTitle.innerHTML = _this.componentData[c].leftPanel.title;

			var panelAudio = document.createElement("img");
			panelAudio.className = "audioIcon audioIconPopUp";
			panelAudio.src = "images/highlightQuizAudioIcon.png";
			panelAudio.setAttribute("audiosource",_this.componentData[c].leftPanel.audio);

			var panelQuestion = document.createElement("div");
			panelQuestion.className = "panelQuestion";
			panelQuestion.innerHTML = _this.componentData[c].leftPanel.question;

			var panelTabContainer = document.createElement("div");
			panelTabContainer.className = "panelTabContainer";
			panelTabContainer.id = "tab-container";

			var ulTabHeaders = document.createElement("ul");
			ulTabHeaders.className = "ccTabHeaders";

			var hintTabHeader = document.createElement("li");
			hintTabHeader.className = "tab ccFirstTitle";

			var hintTabHeaderLink = document.createElement("a");
			hintTabHeaderLink.setAttribute("href", "#tab-hint");
			hintTabHeaderLink.innerHTML = "Hint";

			var answerTabHeader = document.createElement("li");
			answerTabHeader.className = "tab ccSecondTitle";

			var answerTabHeaderLink = document.createElement("a");
			answerTabHeaderLink.setAttribute("href", "#tab-answer");
			answerTabHeaderLink.innerHTML = "Answer";

			var tabContent = document.createElement("div");
			tabContent.className = "ccTabContent";

			var hintTabContent = document.createElement("div");
			hintTabContent.id = "tab-hint";
			hintTabContent.className = "ccFirstContent"; 
			// hintTabContent.style.display = "none";
			hintTabContent.innerHTML =  _this.componentData[c].leftPanel.hint;

			var answerTabContent = document.createElement("div");
			answerTabContent.id = "tab-answer";
			// answerTabContent.style.display = "none";
			answerTabContent.className = "ccSecondContent"; 
			answerTabContent.innerHTML =  _this.componentData[c].leftPanel.answer;
			
			hintTabHeader.appendChild(hintTabHeaderLink);
			answerTabHeader.appendChild(answerTabHeaderLink);
			ulTabHeaders.appendChild(hintTabHeader);
			ulTabHeaders.appendChild(answerTabHeader);
			tabContent.appendChild(hintTabContent);
			tabContent.appendChild(answerTabContent);
			panelTabContainer.appendChild(ulTabHeaders);
			panelTabContainer.appendChild(tabContent);
			leftPanel.appendChild(panelTitle);
			leftPanel.appendChild(panelAudio);
			leftPanel.appendChild(panelQuestion);
			leftPanel.appendChild(panelTabContainer);

			var rightPassage = document.createElement("div");
			rightPassage.id = "passage_"+_this.componentData[c].id;
			rightPassage.className = "quizPassage";

			$('#'+_this.componentData[c].id).addClass("cc");
			$('#'+_this.componentData[c].id).append(leftPanel);
			$('#'+_this.componentData[c].id).append(rightPassage);
			
			// $("#"+rightPassage.id).passage(_this.componentData[c].passage);
			var goPassage =  new passage(rightPassage.id, pageName, _this.componentData[c].passage);
			rightPassage.className += " quizPassage";

			$('#'+_this.componentData[c].id).find("#tab-container").easytabs({
				updateHash:false,
				animate:true,
				transitionIn:"slideDown"
			});
			$('#'+_this.componentData[c].id+" #tab-container").find("li").removeClass("active");
			$('#'+_this.componentData[c].id+" #tab-container").find("a").removeClass("active");
			$('#'+_this.componentData[c].id+" #tab-hint").css("display","none");
			$('#'+_this.componentData[c].id+" #tab-answer").css("display","none");
			$('#'+_this.componentData[c].id+" .ccFirstTitle").css("background-color", "rgb(82,37,204)");
			$('#'+_this.componentData[c].id+" .ccSecondTitle").css("background-color", "rgb(82,37,204)");
			//$('#'+_this.componentData[c].id+" .ccFirstTitle")[0].addEventListener("click", function(){
			$($('#'+_this.componentData[c].id+" .ccFirstTitle")[0]).hammer().on("tap", function(){
				$(this.parentElement.parentElement.parentElement.nextSibling).find(".markCC").css("background-color", "rgb(172,163,204)");
			});
		}
		setTimeout(function(){
			quizWrapper.pageSwiper.reInit();
			quizWrapper.pageSwiper.resizeFix();
		}, 750);
	};
	
	_this.initQF = function(){
		
		questionsLength = _this.componentData.length-1; 
		for(var q=0;q<questionsLength;q++){
			var qst = Question.create({
	            parent : document.getElementById(_this.componentData[q].id),
	            type : "quizQ",
	            id : _this.componentData[q].id,
	            questionNumber: q+1,
	            componentData:_this.componentData[q]
	        });

	        questions.push(qst);
		}

		setTimeout(function(){
			quizWrapper.pageSwiper.reInit();
			quizWrapper.pageSwiper.resizeFix();
		}, 750);

		if(_this.explanation){
			createExplanation();
		}
	}

	_this.initQFP = function(){
		
		questionsLength = _this.componentData.length-1; 
		for(var q=0;q<questionsLength;q++){
			var qst = Question.create({
	            parent : document.getElementById(_this.componentData[q].id),
	            type : "quizQ",
	            id : _this.componentData[q].id,
	            questionNumber: q+1,
	            componentData:_this.componentData[q]
	        });

	        questions.push(qst);
		}

		setTimeout(function(){
			quizWrapper.pageSwiper.reInit();
			quizWrapper.pageSwiper.resizeFix();
		}, 750);

		if(_this.explanation){
			createExplanation();
		}
	}

	_this.initQFPR = function(){
		
		questionsLength = _this.componentData.length-1; 
		for(var q=0;q<questionsLength;q++){
			$('#'+_this.componentData[q].id).addClass("quizReview");
			var questionDiv = document.createElement("div");
			questionDiv.className += "questionDiv ";
			$('#'+_this.componentData[q].id).append(questionDiv);

			var qst = Question.create({
	            parent : questionDiv,
	            type : "quizQ",
	            id : _this.componentData[q].id+"_qst",
	            questionNumber: q+1,
	            componentData:_this.componentData[q]
	        });

	        questions.push(qst);

	        var passageExcerpt = document.createElement("div");
			passageExcerpt.id = "passage_"+pageName+"_"+(q+1);
			passageExcerpt.className = "quizPassage quizQPpassage";
			$('#'+_this.componentData[q].id).append(passageExcerpt);
			
			// var quizPassage = $("#"+passageExcerpt.id).passage(_this.componentData[q].passage);
			var quizPassage =  new passage(passageExcerpt.id, pageName, _this.componentData[q].passage);
			passageExcerpt.className += " quizPassage quizQPpassage";

			if(_this.explanation){
				createExplanation();
			}
		}

		setTimeout(function(){
			quizWrapper.pageSwiper.reInit();
			quizWrapper.pageSwiper.resizeFix();
		}, 750);
	}

	_this.slideChangeCallBack = function(){
		if (globalAudioPlaying) 
		{
			stopAndHideAudio();
		}
		if(_this.explanation){
			hideExplanation();
		}
	}

	_this.slideNextCallBack = function(){
		if(_this.explanation){
			hideExplanation();
		}
		var answerQuestion = searchByQuestionNumber(questionNumber, answers);
		if(!answerQuestion){
			answers.push({
				"questionNumber":questionNumber, 
				"answer":"Unanswered"
			});
		}
		if(quizWrapper.pageSwiper.activeIndex == _this.componentData.length-1){
			if(!_this.review){
				_this.generateResults(quizWrapper.pageSwiper.activeIndex);
			}else{
				if(($('#'+_this.componentData[quizWrapper.pageSwiper.activeIndex].id).find(".submitQuiz").length == 0) && (!resultsShown)){
					resultsShown = true;
					$('#'+_this.componentData[quizWrapper.pageSwiper.activeIndex].id).addClass("quizFullWidth");
					var submitQuiz = document.createElement("div");
					submitQuiz.className = "quizResults";

					var submitButton = document.createElement("div");
					submitButton.className = "checkBtn submitButton";
					submitButton.innerHTML = "Submit Answers";
					$(submitButton).hammer().off('tap').on('tap', function(){
						_this.generateResults(quizWrapper.pageSwiper.activeIndex);
					});
					submitQuiz.appendChild(submitButton);
					$('#'+_this.componentData[quizWrapper.pageSwiper.activeIndex].id).append(submitQuiz);
				}
			}
		}

		if((quizWrapper.pageSwiper.activeIndex < _this.componentData.length) && (questionNumber < _this.componentData.length)){
			questionNumber++;
		}
	}

	_this.slidePrevCallBack = function(){
		if(_this.explanation){
			hideExplanation();
		}
		if(questionNumber>0){
			questionNumber--;
		}
	}

	_this.generateResults = function(index){
		if(_this.review){
			for(var q=0;q<questions.length;q++){
				questions[q]._mc.triggerSubmit();
			}
		}
		_this.showBackButton = true;
		for(var q=0;q<questions.length;q++){
			questions[q]._mc.revealBackButton();
		}
		$('#'+_this.componentData[index].id).empty();

		var quizHeader = document.createElement("div");
		quizHeader.className = "quizHeader"; 

		var quizTitle = document.createElement("div");
		quizTitle.className = "quizResultsTitle";
		quizTitle.innerHTML = "Quiz Results";
		quizHeader.appendChild(quizTitle);
		
		var resultsDiv = document.createElement("div");
		resultsDiv.className = "quizResults";

		var table = document.createElement("table");
		var tHead = document.createElement("thead");
		var tHeadRow = document.createElement("tr");
		var tHeadQuestion = document.createElement("td");
		tHeadQuestion.innerHTML = "Question";
		var tHeadResult = document.createElement("td");
		tHeadResult.innerHTML = "Result";
		
		var tFoot = document.createElement("tfoot");
		var tFootRow = document.createElement("tr");
		var tFootQuestion = document.createElement("td");
		tFootQuestion.innerHTML = "Total";
		var tFootResult = document.createElement("td");

		var tBody = document.createElement("tbody");
		var correctAnswers = 0;

		tHeadRow.appendChild(tHeadQuestion);
		tHeadRow.appendChild(tHeadResult);
		tHead.appendChild(tHeadRow);
		tFootRow.appendChild(tFootQuestion);
		tFootRow.appendChild(tFootResult);
		tFoot.appendChild(tFootRow);
		table.appendChild(tHead);
		table.appendChild(tFoot);
		table.appendChild(tBody);

		for(var q=0; q<_this.componentData.length-1;q++){
			var questionRow = document.createElement("tr");
			var questionQuestion = document.createElement("td");
			questionQuestion.innerHTML = "Question "+answers[q].questionNumber;
			questionQuestion.setAttribute("data-question", answers[q].questionNumber);
			//$(questionQuestion).on("click", function(){
			$(questionQuestion).hammer().on("tap", function(){
				quizWrapper.pageSwiper.swipeTo(Number($(this).attr("data-question"))-1);
				questionNumber = Number($(this).attr("data-question"));
			});
			var questionResult = document.createElement("td");
			questionResult.innerHTML = answers[q].answer;
			if(answers[q].answer === "Correct"){
				correctAnswers++;
			}
			questionRow.appendChild(questionQuestion);
			questionRow.appendChild(questionResult);
			tBody.appendChild(questionRow);
		}

		tFootResult.innerHTML = correctAnswers+" / "+questions.length;

		$('#'+_this.componentData[index].id).addClass("quizFullWidth");
		resultsDiv.appendChild(table);
		$('#'+_this.componentData[index].id).append(quizHeader);
		$('#'+_this.componentData[index].id).append(resultsDiv);
	}

	_this.generateLeftImages = function(obj){
		
		var leftImagesContainer = document.createElement("div");
		leftImagesContainer.className="leftImagesQuiz";
		

		for(var i=0;i<obj.length;i++){
			var fig = document.createElement("figure");

			var hyperlink = document.createElement("a");
			hyperlink.setAttribute("href", obj[i].full);
			hyperlink.setAttribute("class", "img");

			var thumb = document.createElement("img");
			thumb.setAttribute("src", obj[i].thumb);
			thumb.setAttribute("alt", "");

			hyperlink.appendChild(thumb);
			fig.appendChild(hyperlink);

			if(obj[i].caption){
				var figcaption = document.createElement("figcaption");
				figcaption.innerHTML = obj[i].caption;
				fig.appendChild(figcaption);
			}
			leftImagesContainer.appendChild(fig);
		}
		return leftImagesContainer;
	}

	_this.resizeQuiz = function(){
		quizWrapper.pageSwiper.reInit();
		quizWrapper.pageSwiper.resizeFix();
	}

	function showExplanation(){
		var status = answers[questionNumber-1].answer;
		
		if(_this.quizType == "QP"){
			if(_this.passage == undefined){
				var passageNumber = $(event.target).attr("questionNumber");
				$("#passage_"+pageName+"_"+passageNumber).find(".passageWrapper").css({height:"60%", overflowY:"auto"});
				$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").css({height:"40%", bottom:"0px"});
				$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").find(".content").css({overflowY: "auto",height:"160px",maxHeight: "160px"});
				if(status == "Correct"){
					$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").show();
					$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].correctExplanatory);
				}if((status == "Incorrect") || (status == "Unanswered")){
					$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").show();
					$("#passage_"+pageName+"_"+passageNumber).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].incorrectExplanatory);
				}
			}else{
				$("#passage_"+pageName).find(".passageWrapper").css({height:"60%", overflowY:"auto"});
				if(status == "Correct"){
					$("#"+_this.containerID).find(".explanationPanel").show();
					$("#"+_this.containerID).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].correctExplanatory);
				}if((status == "Incorrect") || (status == "Unanswered")){
					$("#"+_this.containerID).find(".explanationPanel").show();
					$("#"+_this.containerID).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].incorrectExplanatory);
				}
				$("#"+_this.containerID).find(".explanationPanel").css({height:"40%", bottom:"0px"});
				$("#"+_this.containerID).find(".explanationPanel").find(".content").css({overflowY: "auto",height:"160px",maxHeight: "160px"});
			}
		}else{
			if(status == "Correct"){
				$("#"+_this.containerID).find(".explanationPanel").show();
				$("#"+_this.containerID).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].correctExplanatory);
			}if((status == "Incorrect") || (status == "Unanswered")){
				$("#"+_this.containerID).find(".explanationPanel").show();
				$("#"+_this.containerID).find(".explanationPanel").find(".content").html(_this.componentData[questionNumber-1].incorrectExplanatory);
			}
		}
	}

	function hideExplanation(){
		if(_this.quizType == "QP"){
			// if(_this.review){
			if($("#passage_"+pageName+"_"+questionNumber).length > 0){
				$("#passage_"+pageName+"_"+questionNumber).find(".passageWrapper").css({height:"100%", overflowY:"auto"});
				$("#passage_"+pageName+"_"+questionNumber).find(".explanationPanel").css({height:"0px", bottom:"-20px"});
				// $("#"+_this.containerID).find(".explanationPanel").find(".content").css({overflowY: "auto",height:"200px",maxHeight: "200px"});
			}else{
				$("#passage_"+pageName).find(".passageWrapper").css({height:"100%", overflowY:"auto"});
				$("#"+_this.containerID).find(".explanationPanel").css({height:"0px", bottom:"-20px"});
				// $("#"+_this.containerID).find(".explanationPanel").find(".content").css({overflowY: "auto",height:"200px",maxHeight: "200px"});
			}
		}else{
			var obj = $("#"+_this.containerID).find(".explanationPanel");
			obj.hide();
		}
	}

	function createExplanation(){
		var explanationPanel = document.createElement("div");
		explanationPanel.className = "explanationPanel";
		explanationPanel.style.display = "none";

		var closePanel = document.createElement("img");
		closePanel.className = "closePanel";
		closePanel.src = "images/glossaryCloseIcon.png";

		$(closePanel).hammer().on("tap",function(){
			if(_this.quizType == "QP"){
				var obj = $(event.target).parent().parent();
				obj.find(".passageWrapper").css({height:"100%", overflowY:"auto"});
				obj.find(".explanationPanel").css({height:"0px", bottom:"-20px"});
			}else{
				hideExplanation();
			}
			event.preventDefault();
		});

		var popUpImg = document.createElement("div");
		popUpImg.className = "arrow_box";

		var panelHeader = document.createElement("div");
		panelHeader.className = "panelHeader";

		var panelTitle = document.createElement("div");
		panelTitle.className = "title";
		panelTitle.innerHTML = "Explanation";

		var panelContent = document.createElement("div");
		panelContent.className = "content";
		panelContent.style.clear = "both";

		panelHeader.appendChild(panelTitle);

		explanationPanel.appendChild(closePanel);
		explanationPanel.appendChild(popUpImg);
		explanationPanel.appendChild(panelHeader);
		explanationPanel.appendChild(panelContent);

		if(_this.quizType == "QP"){
			if(_this.passage == undefined){
				for(var q=1;q<questions.length+1;q++){
					$(explanationPanel).css({bottom:"-20px !important", height:"0px !important"});
					$("#passage_"+pageName+"_"+q).append(explanationPanel);
					// $("#passage_"+pageName+"_"+q).find(".passageWrapper").css({height:"60%", overflowY:"auto"});
					// $(explanationPanel).find(".content").css({overflowY: "auto",maxHeight: "200px"});
				}
			}else{
				$(explanationPanel).css({bottom:"-20px !important", height:"0px !important"});
				$("#passage_"+pageName).append(explanationPanel);
				// $("#passage_"+pageName).find(".passageWrapper").css({height:"60%", overflowY:"auto"});
				// $(explanationPanel).find(".content").css({overflowY: "auto",maxHeight: "200px"});
			}
		}else{
			_this.containerJS.appendChild(explanationPanel);
		}
	}

	function closeExplanationPanel() {
		var _this = event.target.parentElement;
		// _this.style.display = "none";
		$(_this).hide();
	}

	function searchByQuestionNumber(nameKey, myArray){
		for (var i=0; i < myArray.length; i++) {
			if (myArray[i].questionNumber === nameKey) {
				return myArray[i];
			}
		}
	}
	
	_this.init();
});