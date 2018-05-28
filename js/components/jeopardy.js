/*
    JEOPARDY 1.1
    Game that support multiple levels using multiple components, the questions are grouped by categories and points 

    Author: Wissam Hobeika

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 5/12/2014
*/
var jeopardy = (function (id, pageName, parameters) {
    var _this = this;
    _this.containerID = id;
    _this.containerJS = document.getElementById(_this.containerID);

    // if (parameters == undefined){
    //     var componentData = $.grep(globalArrComponentsData,function(n,k){
    //         return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "QUIZ"
    //     })
    //     parameters = componentData[0].ComponentParameters;
    // }

    $.fn.defaults = {
        gameTitle              : "Word Power",
        numberOfLevels         : 3,
        numberOfLives          : 3,
        timePerQuestion        : 60,
        pointsPerQuestion      : 10,
        passingRate            : 340,
        currentLevel           : 0,
        currentScore           : 0,
        waitingTime            : 2000
    };

    _this.params = $.extend({}, $.fn.defaults, parameters);

    /*------------------------------ params -----------------------------*/

    _this.gameTitle = _this.params.gameTitle;
    _this.numberOfLevels = _this.params.numberOfLevels;
    _this.numberOfLives = _this.params.numberOfLives;
    _this.timePerQuestion = _this.params.timePerQuestion;
    _this.pointsPerQuestion = _this.params.pointsPerQuestion;
    _this.passingRate = _this.params.passingRate;
    _this.currentScore = _this.params.currentScore;
    _this.currentLevel = _this.params.currentLevel;
    _this.waitingTime = _this.params.waitingTime;

    /*---------------------------- end params ---------------------------*/

    var transformPrefix, game, jeopardyWrapper, gameGrid, gameMenu, gameQuestion, gameQuestionContent, gameOver, topBar, progressBar, questionsWrapperSlidingElements, circle, counter, questionTime = _this.timePerQuestion, questionTimer, questionID,timer, questionNumber, levelsArray = [], levelsScore = [], currentLevelScore = 0, totalQuestionsNumber = 0, headerValue = "home";
    
    function pad2(number) {
        return (number < 10 ? '0' : '') + number
    }

    function GetVendorPrefix(arrayOfPrefixes) {
 
       var tmp = document.createElement("div");
       var result = "";
     
       for (var i = 0; i < arrayOfPrefixes.length; ++i) {
     
       if (typeof tmp.style[arrayOfPrefixes[i]] != 'undefined'){
          result = arrayOfPrefixes[i];
          break;
       }
       else {
          result = null;
       }
       
       }
     
       return result;
    }

    function Game(parent){
        this.parent = parent;
        this.title = _this.gameTitle;
        this.object = this.create();   
        this.parent.appendChild(this.object);
        this.mainScreen();
    }
    
    Game.prototype = {
        create : function () {
            jeopardyWrapper = document.createElement("div");
            jeopardyWrapper.className = "jeopardyWrapper";

            gameMenu = document.createElement("div");
            gameMenu.className = "gameMenu slide";

            gameGrid = document.createElement("div");
            gameGrid.className = "gameGrid slide";

            gameQuestion = document.createElement("div");
            gameQuestion.className = "gameQuestion slide";

            gameOver = document.createElement("div");
            gameOver.className = "gameOver slide";

            gameMenu.style[transformPrefix]  = "translateX(0px)";
            gameGrid.style[transformPrefix]  = "translateX(9000px)";
            gameQuestion.style[transformPrefix]  = "translateX(9000px)";
            gameOver.style[transformPrefix]  = "translateX(9000px)";

            jeopardyWrapper.appendChild(gameMenu);
            jeopardyWrapper.appendChild(gameGrid);
            jeopardyWrapper.appendChild(gameQuestion);
            jeopardyWrapper.appendChild(gameOver);
            
            return jeopardyWrapper; 
        },
        mainScreen : function (){
            var gameTitle = document.createElement("div");
            gameTitle.className = "gameTitle";

            var levelDiv = document.createElement("div");
            levelDiv.className = "levelDiv";
            
            var levelLabel = document.createElement("div");
            levelLabel.className = "levelLabel";
            levelLabel.innerHTML = "Level";
            levelDiv.appendChild(levelLabel);

            for(var l=0;l<_this.numberOfLevels;l++){
                var levelStatus;
                levelStatus = "";
                var levelButton = new Level({
                    number:l,
                    parent:levelDiv,
                    score: 0,
                    status: levelStatus
                });

                levelsArray.push(levelButton);
            }

            var timerDiv = document.createElement("div");
            timerDiv.className = "timerDiv";

            var timerLabel = document.createElement("label");
            timerLabel.className = "timerLabel";
            timerLabel.innerHTML = "Timer";

            
            var timerInput = document.createElement("input");
            timerInput.className = "timerSwitch";
            timerInput.type = "checkbox";
            timerInput.setAttribute("checked","true");

            var timerSwitch = document.createElement("div");
            timerSwitch.className = "switch";

            $(timerSwitch).hammer().on("tap", function(){
                var checked = $(this).parent().find(".timerSwitch").is(":checked"); // Returns true/false.
                $(this).parent().find(".timerSwitch").attr("checked", checked); // Sets true/false.
            });
            $(timerLabel).hammer().on("tap", function(){
                var checked = $(this).find(".timerSwitch").is(":checked"); // Returns true/false.
                $(this).find(".timerSwitch").attr("checked", checked); // Sets true/false.
            });
            timerLabel.appendChild(timerInput);
            timerLabel.appendChild(timerSwitch);

            timerDiv.appendChild(timerLabel);

            var playButton = document.createElement("div");
            playButton.className = "playButton";
            playButton.innerHTML = "Play";

            gameMenu.appendChild(gameTitle);
            gameMenu.appendChild(levelDiv);
            gameMenu.appendChild(timerDiv);
            gameMenu.appendChild(playButton);

            $(playButton).hammer().on("tap", function(event){
                if(_this.currentLevel > 0){
                    playGameAudio("PlayButton1.mp3");
                    initiateLevel(_this.currentLevel);
                }
            });
        }
    }

    function Level(opts){
        this.parent = opts.parent;
        this.number = opts.number + 1;
        this.score = opts.score;
        this.status = opts.status; // noAccess, complete, play
        this.object = this.create();
        this.parent.appendChild(this.object);
    }

    Level.prototype = {
        create : function (){
            this.levelWrapper = document.createElement("div");
            this.levelWrapper.className = "levelWrapper";
            this.levelWrapper.setAttribute("data-level",this.number);
            this.levelWrapper.number = this.number;
            this.levelWrapper.status = this.status;
            this.levelWrapper.innerHTML = this.number;

            var statusSymbol;
            switch(this.levelWrapper.status){
                case "noAccess":
                statusSymbol = "-";
                $(this.levelWrapper).addClass("levelNoAccess");
                break;
                case "complete":
                statusSymbol = "true";
                this.levelWrapper.className = this.levelWrapper.className + " levelComplete";
                $(this.levelWrapper).addClass("levelComplete");
                break;
                case "play":
                statusSymbol = ">";
                this.levelWrapper.className = this.levelWrapper.className + " playLevel";
                $(this.levelWrapper).addClass("levelCurrent");
                break;
            }

            $(this.levelWrapper).hammer().on("tap", function(e){
                currentLevelMenu = e.currentTarget;
                _this.currentLevel = e.currentTarget.number;
                $(e.currentTarget).parent().find(".levelCurrent").removeClass("levelCurrent");
                $(e.currentTarget).toggleClass("levelCurrent");
            });          
            return this.levelWrapper;
        },
        updateInfo : function(status){
            this.status = status;
            this.object.status = this.status;
            switch(this.status){
                case "noAccess":
                this.status = "-";
                this.score = 0;
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelComplete","");
                this.levelWrapper.className = this.levelWrapper.className.replace(" playLevel","");
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelCurrent","");
                $(this.levelWrapper).addClass("levelNoAccess");
                break;
                case "complete":
                this.status = "true";
                this.score = currentLevelScore;
                this.levelWrapper.className = this.levelWrapper.className + " levelComplete";
                this.levelWrapper.className = this.levelWrapper.className.replace(" playLevel","");
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelCurrent","");
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelNoAccess","");
                $(this.levelWrapper).addClass("levelComplete");
                break;
                case "play":
                this.status = ">";
                this.score = 0;
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelComplete","");
                this.levelWrapper.className = this.levelWrapper.className.replace(" levelNoAccess","");
                this.levelWrapper.className = this.levelWrapper.className + " playLevel";
                $(this.levelWrapper).addClass("levelCurrent");
                break;
            }
        }
    }

    function progressPanel(parent){
        this.parent = parent;
        this.object = this.create();
        this.parent.appendChild(this.object);
    }

    progressPanel.prototype = {
        create : function (){
            var progressWrapper = document.createElement("div");
            progressWrapper.className = "progressWrapper";

            var timeWrapper = document.createElement("div");
            timeWrapper.className = "timeWrapper";
            timeWrapper.id = "timerCounter";

            progressWrapper.appendChild(timeWrapper);
            
            return progressWrapper;
        },
        updateInfo : function(){
            
        }
    }

    function topPanel(parent){
        this.parent = parent;
        this.object = this.create();
        this.parent.appendChild(this.object);
    }

    topPanel.prototype = {
        create : function(){
            var topWrapper = document.createElement("div");
            topWrapper.className = "pageTopWrapper";

            this.commonHeader = document.createElement("div");
            this.commonHeader.className = "commonHeader";

            this.logo = document.createElement("img");
            this.logo.setAttribute("src","images/jeopardy/wordPowerSmall.png");
            this.logo.className = "topLogo";

            this.levelTitleDescription = document.createElement("div");
            this.levelTitleDescription.className = "levelTitleDescription";
            this.levelTitleDescription.innerHTML = "Level " + _this.currentLevel;

            this.questionPoint = document.createElement("div");
            this.questionPoint.className = "questionPoint";
            this.questionPoint.style.width = "0px";
            this.questionPoint.style.opacity = 0;
            this.questionPoint.innerHTML = _this.pointsPerQuestion + " Points";

            this.currentScoreWrapper = document.createElement("div");
            this.currentScoreWrapper.className = "currentScoreWrapper";

            var currentScoreLabel = document.createElement("label");
            currentScoreLabel.innerHTML = "Score";

            this.currentScore = document.createElement("div");
            this.currentScore.className = "currentScore";
            this.currentScore.innerHTML = _this.currentScore;

            this.currentScoreWrapper.appendChild(currentScoreLabel);
            this.currentScoreWrapper.appendChild(this.currentScore);

            this.goalWrapper = document.createElement("div");
            this.goalWrapper.className = "goalWrapper";

            var goalLabel = document.createElement("label");
            goalLabel.innerHTML = "Goal";

            var goalValue = document.createElement("div");
            goalValue.className = "goalValue";

            var goalText = document.createElement("div");
            goalText.className = "goalText";
            goalText.innerHTML = _this.passingRate;

            this.goalProgress = document.createElement("div");
            this.goalProgress.className = "goalProgress";

            this.goalWrapper.appendChild(goalLabel);
            this.goalWrapper.appendChild(goalValue);
            goalValue.appendChild(goalText);
            goalValue.appendChild(this.goalProgress);
    
            this.buttons = document.createElement("div");
            this.buttons.className = "buttons";

            this.homeBtn = document.createElement("img");
            this.homeBtn.setAttribute("src","images/jeopardy/homeBtn.png");
            this.homeBtn.className = "topButton";

            this.replayBtn = document.createElement("img");
            this.replayBtn.setAttribute("src","images/jeopardy/replayBtn.png");
            this.replayBtn.className = "topButton hidden";

            this.nextBtn = document.createElement("img");
            this.nextBtn.setAttribute("src","images/jeopardy/nextBtn.png");
            this.nextBtn.className = "topButton hidden";

            $(this.homeBtn).hammer().on("tap", function(){
                stopAndHideAudio();
                if(questionTimer){
                    questionTimer.stop();
                }
                gameMenu.style[transformPrefix] = "translateX(0px)";
                gameGrid.style[transformPrefix] = "translateX(9000px)";
                gameQuestion.style[transformPrefix] = "translateX(9000px)";
                gameOver.style[transformPrefix] = "translateX(9000px)";
                headerValue = "home";
                topBar.updateInfo();
            });

            $(this.replayBtn).hammer().on("tap", function(){
                stopAndHideAudio();
                initiateLevel(_this.currentLevel);
                headerValue = "grid";
                _this.currentScore = 0;
                currentLevelScore = 0;
                topBar.updateInfo();
            });

            $(this.nextBtn).hammer().on("tap", function(){
                stopAndHideAudio();
                goToNextLevel();
            });

            this.buttons.appendChild(this.homeBtn);
            this.buttons.appendChild(this.replayBtn);
            this.buttons.appendChild(this.nextBtn);
            this.commonHeader.appendChild(this.logo);
            this.commonHeader.appendChild(this.levelTitleDescription);
            topWrapper.appendChild(this.questionPoint);
            topWrapper.appendChild(this.commonHeader);
            topWrapper.appendChild(this.buttons);
            topWrapper.appendChild(this.goalWrapper);
            topWrapper.appendChild(this.currentScoreWrapper);

            return topWrapper;
        },
        updateInfo : function (){
            this.levelTitleDescription.innerHTML = "Level "+ _this.currentLevel;
            this.currentScore.innerHTML = currentLevelScore;
            this.goalProgress.style.width = (currentLevelScore * 100)/_this.passingRate + "%";
            this.questionPoint.innerHTML = _this.pointsPerQuestion + " Points";
            if(headerValue == "question"){
                this.goalWrapper.style.width = "0px";
                this.goalWrapper.style.opacity = 0;
                this.questionPoint.style.width = "300px";
                this.questionPoint.style.opacity = 1;
                this.replayBtn.style.display = "none";
                this.nextBtn.style.display = "none";
                this.commonHeader.style.width = "auto";
                this.commonHeader.style.opacity = "1";
                this.currentScoreWrapper.style.width = "auto";
                this.currentScoreWrapper.style.opacity = "1";
                this.buttons.style.display = "flex";
                this.buttons.style.left = "auto";
                this.buttons.style.marginLeft = "auto";
                this.buttons.style.position = "relative";
            }else if(headerValue == "congrats"){
                this.goalWrapper.style.width = "0px";
                this.goalWrapper.style.opacity = 0;
                this.questionPoint.style.width = "0px";
                this.questionPoint.style.opacity = 0;
                this.buttons.style.display = "flex";
                this.buttons.style.left = "50%";
                this.buttons.style.marginLeft = "-105px";
                this.buttons.style.position = "absolute";
                this.replayBtn.style.display = "block";
                if(_this.currentLevel == 3){
                    this.nextBtn.style.display = "none";
                }else{
                    this.nextBtn.style.display = "block";
                }
                this.commonHeader.style.width = "0px";
                this.commonHeader.style.opacity = "0";
                this.currentScoreWrapper.style.width = "0px";
                this.currentScoreWrapper.style.opacity = "0";
            }else if(headerValue == "grid"){
                this.goalWrapper.style.width = "200px";
                this.goalWrapper.style.opacity = 1;
                this.questionPoint.style.width = "0px";
                this.questionPoint.style.opacity = 0;
                this.replayBtn.style.display = "none";
                this.nextBtn.style.display = "none";
                this.commonHeader.style.width = "auto";
                this.commonHeader.style.opacity = "1";
                this.currentScoreWrapper.style.width = "auto";
                this.currentScoreWrapper.style.opacity = "1";
                this.buttons.style.display = "flex";
                this.buttons.style.left = "auto";
                this.buttons.style.marginLeft = "auto";
                this.buttons.style.position = "relative";
            }else if(headerValue == "over"){
                this.goalWrapper.style.width = "0px";
                this.goalWrapper.style.opacity = 0;
                this.questionPoint.style.width = "0px";
                this.questionPoint.style.opacity = 0;
                this.buttons.style.display = "flex";
                this.buttons.style.left = "50%";
                this.buttons.style.marginLeft = "-105px";
                this.buttons.style.position = "absolute";
                this.replayBtn.style.display = "block";
                this.nextBtn.style.display = "none";
                this.commonHeader.style.width = "0px";
                this.commonHeader.style.opacity = "0";
                this.currentScoreWrapper.style.width = "0px";
                this.currentScoreWrapper.style.opacity = "0";
            }else{
                this.goalWrapper.style.width = "0px";
                this.goalWrapper.style.opacity = 0;
                this.questionPoint.style.width = "0px";
                this.questionPoint.style.opacity = 0;
                this.replayBtn.style.display = "none";
                this.nextBtn.style.display = "none";
                this.commonHeader.style.width = "0px";
                this.commonHeader.style.opacity = "0";
                this.currentScoreWrapper.style.width = "0px";
                this.currentScoreWrapper.style.opacity = "0";
                this.buttons.style.display = "none";
                this.buttons.style.left = "auto";
                this.buttons.style.marginLeft = "auto";
                this.buttons.style.position = "relative"; 
            }
        }
    }

    function questionCountDown(){
        // questionTimer = this.start();
        // return questionTimer;
    }

    questionCountDown.prototype = {
        start : function(){
            timer = setInterval(function() {
                questionTime = questionTime - 1;

                circle.update(circle._value-1, 500);
                if(questionTime == 59){
                    playGameAudio("Countdown60.mp3");
                }
                if(questionTime == 29){
                    playGameAudio("Countdown30.mp3");
                    circle.updateColors(['transparent', '#EFB917']);
                    // circle.updateWidth(15);
                }
                if(questionTime == 14){
                    playGameAudio("Countdown15.mp3");
                    circle.updateColors(['transparent', '#FF0000'])
                    // circle.updateWidth(20);
                }
                if(questionTime == 0){
                    questionTimer.stop();
                    if(totalQuestionsNumber == 0){
                        stopGame();
                    }else{
                        $("#"+questionID).addClass("failed");
                        backToGrid();
                    }
                }
            }, 1000);
            return timer;
        },
        stop : function(){
            clearInterval(timer);
            topBar.updateInfo(); 
        }
    }

    function initiateLevel (levelNumber){
        totalQuestionsNumber = 0;
        switch(levelNumber){
            case 1:
                _this.timePerQuestion = 60;
                questionTime = _this.timePerQuestion;
                break;
            case 2:
                _this.timePerQuestion = 30;
                questionTime = _this.timePerQuestion;
                break;
            case 3:
                _this.timePerQuestion = 15;
                questionTime = _this.timePerQuestion;
                break;
        }
        headerValue = "grid";
        if(gameQuestion.childNodes.length == 0){
            topBar = new topPanel(jeopardyWrapper);    

            gameQuestionContent = document.createElement("div");
            gameQuestionContent.className = "gameQuestionContent";    
            gameQuestion.appendChild(gameQuestionContent);

            goToLevel(levelNumber);
        }else{
            
            currentLevelScore = 0;
            goToLevel(levelNumber);
            topBar.updateInfo();
            gameMenu.style[transformPrefix] = "translateX(-9000px)";
            gameGrid.style[transformPrefix] = "translateX(0px)";
            gameQuestion.style[transformPrefix] = "translateX(9000px)";
            gameOver.style[transformPrefix] = "translateX(9000px)";
            
        }
        
    }

    function levelCompleted(){
        if(questionTimer){
            questionTimer.stop();
        }
        playGameAudio("Congrats_medium.mp3");
        headerValue = "congrats";
        topBar.updateInfo(); 
        levelsArray[_this.currentLevel -1].updateInfo("complete");
        $(gameOver).empty();

        var contentWrapper = document.createElement("div");
        contentWrapper.className = "contentWrapper";

        var titleOver = document.createElement("div");
        titleOver.className = "titleOver";
        $('<img>').attr('src','images/jeopardy/wordPower.png').appendTo(titleOver);

        var congratsDiv = document.createElement("div");
        congratsDiv.className = "infoFinalDiv"; 

        var congratsDivData = document.createElement("div");
        congratsDivData.className = "congratsDivData";
        congratsDivData.innerHTML = "Congratulations! You have successfully completed Level " + _this.currentLevel+".";

        var fireworksDiv = document.createElement("img");
        fireworksDiv.className = "fireworks";
        fireworksDiv.src = "images/jeopardy/fireworks.png";

        var infoDiv = document.createElement("div");
        infoDiv.id = "finalScore";

        contentWrapper.appendChild(titleOver);
        contentWrapper.appendChild(congratsDiv);
        congratsDiv.appendChild(congratsDivData); 
        congratsDiv.appendChild(infoDiv);
        gameOver.appendChild(contentWrapper);

        gameMenu.style[transformPrefix] = "translateX(-9000px)";
        gameGrid.style[transformPrefix] = "translateX(-9000px)";
        gameQuestion.style[transformPrefix] = "translateX(-9000px)";
        gameOver.style[transformPrefix] = "translateX(0px)";

        Circles.create({
            id:         "finalScore",
            value:      _this.currentScore,
            radius:     80,
            maxValue:   340,
            width:      30,
            colors:     ['#164D6E', '#1F7991'],
            duration:       1000,
            styleText:    true,
            textClass:      'success-circles-text',
            text:       function(value){return "score <br/>"+pad2(value);}
        });
        infoDiv.appendChild(fireworksDiv);
    }

    function stopGame(){
        stopAndHideAudio();
        if(questionTimer){
            questionTimer.stop();
        }
        headerValue = "over";
        topBar.updateInfo();
        $(gameOver).empty();

        var contentWrapper = document.createElement("div");
        contentWrapper.className = "contentWrapper";

        var titleOver = document.createElement("div");
        titleOver.className = "titleOver";
        $('<img>').attr('src','images/jeopardy/wordPower.png').appendTo(titleOver);

        var congratsDiv = document.createElement("div");
        congratsDiv.className = "infoFinalDiv"; 

        var congratsDivData = document.createElement("div");
        congratsDivData.className = "congratsDivData";
        congratsDivData.innerHTML = "Good try! But you haven't scored enough points to complete Level "+ _this.currentLevel+".<br/>Replay the level or return to the Home screen.";

        var infoDiv = document.createElement("div");
        infoDiv.id = "finalFailScore";

        contentWrapper.appendChild(titleOver);
        contentWrapper.appendChild(congratsDiv);
        congratsDiv.appendChild(congratsDivData); 
        congratsDiv.appendChild(infoDiv);
        gameOver.appendChild(contentWrapper);

        gameMenu.style[transformPrefix] = "translateX(-9000px)";
        gameGrid.style[transformPrefix] = "translateX(-9000px)";
        gameQuestion.style[transformPrefix] = "translateX(-9000px)";
        gameOver.style[transformPrefix] = "translateX(0px)";

        Circles.create({
            id:         "finalFailScore",
            value:      _this.currentScore,
            radius:     80,
            maxValue:   480,
            width:      20,
            colors:     ['#164D6E', '#1F7991'],
            duration:       3000,
            styleText:    true,
            textClass:      'final-circles-text',
            text:       function(value){return "score <br/>"+pad2(value);}
        });
    }

    function goToNextLevel(){
        if(_this.currentLevel < _this.numberOfLevels){
            _this.currentLevel = _this.currentLevel + 1;
            initiateLevel(_this.currentLevel);
            topBar.updateInfo();
            
        }
    }

    function goToLevel(levelNumber){
        _this.currentScore = 0;
        _this.currentLevel = levelNumber;
        questionNumber = 1;
        
        var currentWrapper = gameGrid.querySelector(".categoriesWrapper");
        if(currentWrapper){
            currentWrapper.parentNode.removeChild(currentWrapper);
        }
        var currentPage = pagesContainer.swiper.activeIndex;
        if(currentPage == 0){
            currentPage = 1;
        }
        var questionBank = new getQuestionBank("data/" + pageName + "/level" + levelNumber + ".json");
        questionBank.done(function(data){
            generateCategories(data);
        });
    }

    function generateCategories(data){
        var categories = data.questionCategories;
        var points = data.questionPoints;
        var questions = data.questionBank;

        var categoriesWrapper = document.createElement("div");
        categoriesWrapper.className = "categoriesWrapper";

        for(var c=0;c<categories.length;c++){
            var categoryWrapper = document.createElement("ul");
            categoryWrapper.className = "categoryWrapper";
            categoryWrapper.id = _this.containerID + "_category_"+(c+1);

            var questionHeader = document.createElement("li");
            questionHeader.className = "questionHeader";
            questionHeader.textContent = categories[c];
            categoryWrapper.appendChild(questionHeader);
            for(var l=0; l<_this.numberOfLevels;l++){
                var questionButton = document.createElement("li");
                questionButton.className = "questionButton";
                questionButton.id = _this.containerID + "_category_"+(c+1)+"_question_"+(l+1);
                
                questionButton.category = categories[c];
                questionButton.textContent = points[l] +" Points";
                questionButton.points = points[l];
                $(questionButton).hammer().on("tap", function(){
                    if($(this).hasClass("disabled") == false){
                        questionID = this.id;
                        _this.pointsPerQuestion = this.points;
                        switch (_this.pointsPerQuestion) {
                            case 20:
                                playGameAudio("20Points_1.mp3");
                                break;
                            case 40:
                                playGameAudio("40Points_1.mp3");
                                break;
                            case 60:
                                playGameAudio("60Points_1.mp3");
                                break;
                        }
                        getQuestion(this.category, questions, this.id);
                        $(this).addClass("disabled");
                    }
                });
                categoryWrapper.appendChild(questionButton);
                totalQuestionsNumber = totalQuestionsNumber +1;
            }
            categoriesWrapper.appendChild(categoryWrapper);
        }
        gameGrid.appendChild(categoriesWrapper);
        gameMenu.style[transformPrefix] = "translateX(-9000px)";
        gameGrid.style[transformPrefix] = "translateX(0px)";
        gameQuestion.style[transformPrefix] = "translateX(9000px)";
        gameOver.style[transformPrefix] = "translateX(9000px)";
        headerValue = "grid";
    }

    function getQuestion(category, questionBank, questionId){
        var $questions = [];
        for(var q=0; q<questionBank.length;q++){
            if((questionBank[q].questionCategory == category) &&(questionBank[q].questionPoint == _this.pointsPerQuestion)){
                $questions.push(questionBank[q]);
            }
        }

        shuffle($questions);
        showQuestion($questions[0], questionId);
    }

    function showQuestion(question, questionId){
            if(questionTimer){
                questionTimer.stop();
            }
            var currentWrapper = gameQuestion.querySelector(".questionsWrapper");
            if(currentWrapper){
                currentWrapper.parentNode.removeChild(currentWrapper);
            }

            var questionsWrapper = document.createElement("div");
            questionsWrapper.className = "questionsWrapper";
            questionsWrapper.id = _this.containerID + "_level_" + _this.currentLevel;

            gameQuestionContent.appendChild(questionsWrapper);

            var levelQuestions = [];
            var question;

            question.type = "component";
            question.id = questionId+'_Jeopardy';
            
            question.opts.checkAnswersCallBack = function (result) {
                questionAnswered(result);
                if(result == true){
                    playGameAudio("Right1.mp3");
                    $("#"+questionID).addClass("passed");
                }else{
                    playGameAudio("Wrong1.mp3");
                    $("#"+questionID).addClass("failed");
                }
            }
            levelQuestions.push(question);

            questionsWrapperSlidingElements = new slidingElements(questionsWrapper.id, pageName, {
                componentData : levelQuestions,
                simulateTouch : false,
                withPagination: false,
                swiperCreatedCallback: function(){
                    initializeQuestions(question, questionId);
                }
            });
            questionsWrapperSlidingElements.pageSwiper.onSlideChangeStart = function(pageSwiper){
                questionTime = _this.timePerQuestion;
            }
            
            
            headerValue = "question";
            gameMenu.style[transformPrefix] = "translateX(-9000px)";
            gameGrid.style[transformPrefix] = "translateX(-9000px)";
            gameQuestion.style[transformPrefix] = "translateX(0px)";
            gameOver.style[transformPrefix] = "translateX(9000px)";
                
            var currentWrapper = gameQuestion.querySelector(".progressWrapper");
            if(currentWrapper){
                currentWrapper.parentNode.removeChild(currentWrapper);
            }
            if($(".timerSwitch").is(":checked")){
                questionTime = _this.timePerQuestion;
                questionTimer = new questionCountDown();       
                questionTimer.start();
                progressBar = new progressPanel(gameQuestionContent);
            }

            circle = Circles.create({
                id:         "timerCounter",
                value:      _this.timePerQuestion,
                radius:     80,
                maxValue:   _this.timePerQuestion,
                width:      10,
                colors:     ['transparent', '#4B253A'],
                text:       function(value){return "0:"+ pad2(questionTime);}
            });
            topBar.updateInfo();
            totalQuestionsNumber = totalQuestionsNumber -1;
    }
    
    function initializeQuestions(question, questionId){
        var currentQuestion;
        // for(var q=0; q<questions.length;q++){
            switch (question.questionType){
                case "fillInTheBlanks":
                    currentQuestion = new fillInTheBlanks(questionId+'_Jeopardy', pageName, question.opts);                
                    break;
                case "multipleChoice":
                    currentQuestion = new multipleChoice(questionId+'_Jeopardy', pageName, question.opts);
                    break;       
                case "matching":
                    currentQuestion = new matching(questionId+'_Jeopardy', pageName, question.opts);
                    break;  
                 case "dragAndDrop":
                    currentQuestion = new dragAndDrop(questionId+'_Jeopardy', pageName, question.opts);
                    break;  
                 case "comboBox":
                    currentQuestion = new comboBox(questionId+'_Jeopardy', pageName, question.opts);
                    break;    
                case "interactiveHotSpot":
                    currentQuestion = new interactiveHotSpot(questionId+'_Jeopardy', pageName, question.opts);
                    break;               
            }
            /*var nextBtn = document.createElement("button");
            nextBtn.innerHTML = "Next Question";
            nextBtn.style.zIndex = 9999;
            var prevBtn = document.createElement("button");
            prevBtn.innerHTML = "Previous Question";
            prevBtn.style.zIndex = 9999;
            nextBtn.onclick = function(){
                questionsWrapperSlidingElements.pageSwiper.swipeNext();
            };
            prevBtn.onclick = function(){
                // alert("next quetsion");
                questionsWrapperSlidingElements.pageSwiper.swipePrev();
            };

            $("#"+questions[q].id).parent().prepend(prevBtn);
            $("#"+questions[q].id).parent().prepend(nextBtn);*/
        // }
    }

    function questionAnswered(result){
        if(questionTimer){
            questionTimer.stop();
        }
        
        if((result == false) || (result == undefined)){
            // _this.currentLives = _this.currentLives -1;
        }else{
            _this.currentScore = _this.currentScore + _this.pointsPerQuestion;
            currentLevelScore = currentLevelScore + _this.pointsPerQuestion;
        }

        topBar.updateInfo();

        if(_this.currentScore >= _this.passingRate){
            setTimeout(levelCompleted, _this.waitingTime);
        }else{
            if(totalQuestionsNumber == 0){
                setTimeout(stopGame, _this.waitingTime);
            }else{
                setTimeout(backToGrid, _this.waitingTime);
            }
        }
        
    }

    function backToGrid(){
        stopAndHideAudio();
        gameMenu.style[transformPrefix] = "translateX(-9000px)";
        gameGrid.style[transformPrefix] = "translateX(0px)";
        gameQuestion.style[transformPrefix] = "translateX(9000px)";
        gameOver.style[transformPrefix] = "translateX(9000px)";
        headerValue = "grid";
        topBar.updateInfo();
    }

    function getQuestionBank (json) {
        var def = $.Deferred();

        var jqxhr = $.getJSON( json, function() {})
        .done(function(data) {
            var obj = data;
            var result = {};
            var questionBank = [];
            var questionCategories = [];
            var questionPoints = [];

            for(var q=0; q<obj.questions.length; q++){
                var questionType = Object(obj.questions[q].questionType).valueOf();
                var questionCategory = Object(obj.questions[q].questionCategory).valueOf();
                var questionPoint = Object(obj.questions[q].questionPoints).valueOf();
                questionBank.push({
                    questionType: questionType,
                    questionCategory: questionCategory,
                    questionPoint: questionPoint,
                    opts: obj.questions[q]
                });
                if(questionCategories.indexOf(questionCategory) == -1){
                    questionCategories.push(questionCategory);
                }
                 if(questionPoints.indexOf(questionPoint) == -1){
                    questionPoints.push(questionPoint);
                }
            }
            result.questionBank = questionBank;
            result.questionCategories = questionCategories;
            result.questionPoints = questionPoints;
            def.resolve(result);
        })
        .fail(function() {
            console.log( "error" );
        })
        // .always(function() {
        //     console.log( "complete" );
        // });
        return def;
    }

    function parseQuestion(obj){
        return obj;
    }
    
    _this.init = function (){
        transformPrefix = GetVendorPrefix(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]);
        game = new Game(_this.containerJS);
    }
    _this.init();
});