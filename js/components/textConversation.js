/*
    Text Conversation 1.0
    The Text template is a simulated text message, twitter, or other social media exchange that allows the student to see and hear a conversation between two or more fictitious people.

    Author: Wissam Hobeika

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 10/12/2014
    */
    var textConversation = (function (id, pageName, parameters) {
        var _this = this;
        _this.containerID = id;
        _this.containerJS = document.getElementById(_this.containerID);
        _this.containerJS.setAttribute("class", "textConversation");
        // if (parameters == undefined){
        //     var componentData = $.grep(globalArrComponentsData,function(n,k){
        //         return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "textConversation"
        //     })
        //     parameters = componentData[0].ComponentParameters;
        // }

        $.fn.defaults = {
            instruction : "Leroy and Mike are high school friends living in rural Massachusetts. Leroy likes to travel, but Mike has rarely left his home state. Listen to Leroy and Mike’s conversation as they discuss a visit to Willis Tower. Click the prompt button to read and hear each part of the conversation.  If you don’t understand an underlined word, click to see what it means.",
            instructionAudio: "sounds/page2/instruction.mp3",
            avatars     :   [
            {
                "name":"Leroy",
                "image":"images/page4/RUR_L2_M3_001_PHO_001.jpg",
                "id":"leroyb",
                "messageColor":["#FFFFFF","#000000"]
            },
            {
                "name":"Mike",
                "image":"images/page4/RUR_L2_M3_001_PHO_002.jpg",
                "id":"miket",
                "messageColor":["#C7EEC7","#77D977"]
            }
            ],
            messages    :   [
            {
                "id":"leroyb", 
                "message":"Hey, Mike! Guess where I was this weekend!",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : []
            },
            {
                "id":"miket", 
                "message":"Where?",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : []
            },
            {
                "id":"leroyb", 
                "message":"We went to Chicago!",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : []
            },
            {
                "id":"miket", 
                "message":"Cool!",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : []
            },
            {
                "id":"leroyb", 
                "message":"<mark comprehension>Yes, it was cool!</mark> And very windy!",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : [
                {title:"Comprehension",audio:"", desc:"Notice the word play here. When Mike says 'cool', he means impressive or exciting. Cool can also mean trendy or stylish. And it can mean unfriendly or neutral. However, Leroy is using the word in the more literal sense. He says that Chicago was cool because it was very cold.<br/>Did you know that Chicago is also known as the Windy City?"}
                ]
            },
            {
                "id":"miket", 
                "message":"Ha ha! :D",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[],
                "popupText" : []
            },
            {
                "id":"leroyb", 
                "message":"We went to the Willis Tower. It's <glossary>enormous</glossary>!",
                "audio":"sounds/page2/instruction.mp3",
                "glossary":[{title:"enormous", audio:"sounds/page2/instruction.mp3", desc:"<strong>enormous </strong>noun: adjective: of very large size.<br><br>I felt tiny when I stood beside the <strong>enormous</strong> tree."}],
                "popupText" : []
            }
            ]
        };

        _this.params = $.extend({}, $.fn.defaults, parameters);

        /*------------------------------ params -----------------------------*/

        _this.instruction = _this.params.instruction;
        _this.instructionAudio = _this.params.instructionAudio;
        _this.avatars = _this.params.avatars;
        _this.messages = _this.params.messages;

        /*---------------------------- end params ---------------------------*/

        var allmessages = [], currentMessage = 0, textWrapper, sendButton, messageDirection = null, messagesColors = [["#FFFFFF","#CCCCCC"],["#C7EEC7","#77D977"],["#CAADF5","#9673CB"]];

        Message = window.Message = function(options) {
            this._name = options.name;
            this._image = options.image;
            this._id = options.id;
            this._message = options.message;
            this._audio = options.audio;
            this._glossary = options.glossary;
            this._popupText = options.popupText;
            this._messageColor = options.messageColor;
            this._direction = options.direction;
            this.messageBackground = null;
            this._parentContainer = options.parent;
            this._elementWrapper = null;
            this._bottomPanel = null;
            this._panelTitle = null;
            this._panelContent = null;
            this._panelIcon = null;
            this._generate();
        }

        Message.prototype = {
            VERSION: '0.1.0',

            _generate : function () {
                this._elementWrapper = document.createElement("div");
                this._elementWrapper.className = "elementWrapper";
                this._elementWrapper.style.direction = this._direction;
                this._elementWrapper.id = "element"+currentMessage;
                this._elementWrapper.setAttribute("dir",this._direction);

                this.directionWrapper = document.createElement("div");
                this.directionWrapper.className = "directionWrapper";
                this.directionWrapper.style.direction = this._direction;
                this.directionWrapper.style.display = "none";
                this.directionWrapper.setAttribute("dir",this._direction);

                this.avatarWrapper = document.createElement("div");
                this.avatarWrapper.className = "avatarWrapper";

                this.avatarFigure = document.createElement("figure");
                this.avatarFigure.className = "avatarFigure";

                this.avatarImage = document.createElement("img");
                this.avatarImage.className = "avatarImage";
                if(this._image == ""){
                    this._image = "images/avatar.png";
                }
                this.avatarImage.src = this._image;

                this.avatarID = document.createElement("div");
                this.avatarID.className = "avatarID";
                this.avatarID.innerHTML = "@"+this._id;

                this.svgWrapper = document.createElement("div");
                this.svgWrapper.className = "svgWrapper";

                this.messageWrapper = document.createElement("div");
                this.messageWrapper.className = "messageWrapper";

                if(this._audio != ""){
                    this.messageAudio = document.createElement("img");
                    this.messageAudio.className = "audioIcon audioInTextConversation";
                    this.messageAudio.src="images/audio-icon.png";
                    this.messageAudio.setAttribute("audiosource",this._audio);
                    this.messageAudio.style.opacity = 0;
                    $(this.messageAudio).hammer().on("tap", playAudio);
                    this.messageWrapper.appendChild(this.messageAudio);
                }

                this.messageText = document.createElement("div");
                this.messageText.className = "messageText";

                this.messageText.style.opacity = 0;


                this._bottomPanel = document.createElement("div");
                this._bottomPanel.className = "bottomPanel";
                this._bottomPanel.style.visibility = "hidden";

                this._closePanel = document.createElement("img");
                this._closePanel.className = "closePanel";

                this.popUpImg = document.createElement("div");
                this.popUpImg.className = "arrow_box";

                this.panelHeader = document.createElement("div");
                this.panelHeader.className = "panelHeader";

                this._panelTitle = document.createElement("div");
                this._panelTitle.className = "title";
                this._panelTitle.innerHTML = "Test";

                this._panelIcon = document.createElement("img");
                this._panelIcon.className = "audioIconPopUp";
                this._panelIcon.setAttribute("audiosource", this._audio);

                $(this._panelIcon).hammer().on("tap", playAudio);

                this.panelAudioIcon = document.createElement("div");
                this.panelAudioIcon.className = "icon";

                this._panelContent = document.createElement("div");
                this._panelContent.className = "content";
                this._panelContent.style.clear = "both";

                this.panelHeader.appendChild(this._panelTitle);
                this.panelAudioIcon.appendChild(this._panelIcon);
                this.panelHeader.appendChild(this.panelAudioIcon);

                this._bottomPanel.appendChild(this._closePanel);
                this._bottomPanel.appendChild(this.popUpImg);
                this._bottomPanel.appendChild(this.panelHeader);
                this._bottomPanel.appendChild(this._panelContent);



                this.typingText = document.createElement("div");
                this.typingText.innerHTML = "typing...";
                this.typingText.className = "typingText";

                checkGlossary(this);

                this.avatarFigure.appendChild(this.avatarImage);
                this.avatarWrapper.appendChild(this.avatarFigure);
                this.avatarWrapper.appendChild(this.avatarID);


                this.messageWrapper.appendChild(this.messageText);

                this.messageWrapper.appendChild(this.typingText);
                this.directionWrapper.appendChild(this.avatarWrapper);
                this.directionWrapper.appendChild(this.svgWrapper);
                this.directionWrapper.appendChild(this.messageWrapper);

                this._elementWrapper.appendChild(this.directionWrapper);
                this._elementWrapper.appendChild(this._bottomPanel);

                this._parentContainer.appendChild(this._elementWrapper);
                return this; 
            },

            _getMessageBackground : function(){
                var w = this.messageWrapper.offsetWidth +10;
                var h = this.messageWrapper.offsetHeight;
                this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                this._svg.setAttribute('width', w+"px");
                this._svg.setAttribute('height', h+"px");
                this._svg.setAttribute('viewBox', "0 0 "+w+" "+h);
                this._svg.setAttribute('enable-background', "new 0 0 "+w+" "+h);
                this._svg.setAttribute('xml:space', "preserve");

                this.def = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

                this.linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                this.linearGradient.setAttribute('id', 'gradientColor_'+currentMessage);
                this.linearGradient.setAttribute('gradientUnits', 'userSpaceOnUse');

                this.def.appendChild(this.linearGradient);

                var firstColor = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                firstColor.setAttribute('offset', '0');
                firstColor.setAttribute('style', 'stop-color:'+this._messageColor[0]);

                var secondColor = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                secondColor.setAttribute('offset', '1');
                secondColor.setAttribute('style', 'stop-color:'+this._messageColor[1]);

                this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                this.rect.setAttribute('fill', 'url(#gradientColor_'+currentMessage+')');
                this.rect.setAttribute('fill-rule', 'evenodd');
                this.rect.setAttribute('clip-rule', 'evenodd');

                this.rect.setAttribute('y',  '0');
                this.rect.setAttribute('width',  w - 37);
                this.rect.setAttribute('height',  70);

                //rightPath Width 16px, leftPath Width 23px
                this.rightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this.rightPath.setAttribute('fill', 'url(#gradientColor_'+currentMessage+')');
                this.rightPath.setAttribute('fill-rule', 'evenodd');
                this.rightPath.setAttribute('clip-rule', 'evenodd');
                var rightPathX = w;
                var leftPathX = 25;


                this.leftPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this.leftPath.setAttribute('fill', 'url(#gradientColor_'+currentMessage+')');
                this.leftPath.setAttribute('fill-rule', 'evenodd');
                this.leftPath.setAttribute('clip-rule', 'evenodd');

                var heightPercentage = (h / 70) + (0.04 * (h /70));

                this.rect.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                if(this._direction == "ltr"){
                    this.rect.setAttribute('x',  '23');
                    this.rightPath.setAttribute('d', 'm'+rightPathX+' 54.601h-0.187c-0.946 8.443 -5.767 12.665 -14.459 12.665v-67.25c9.764 0 14.646 5.343 14.646 16.028v38.55700000000001z');
                    this.rightPath.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                    this.leftPath.setAttribute('d', 'm'+leftPathX+' 67.26599999999999c-8.667 0 -13.474 -4.222 -14.421 -12.665h-0.187v-32.168h-7.472l7.491 -7.472c0.322 -9.963 5.186 -14.945 14.59 -14.945v67.25z');
                    this.leftPath.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                    this.linearGradient.setAttribute("gradientTransform", "rotate(90)");
                }else{
                    leftPathX = 25 - w;
                    rightPathX = 0;

                    this.rect.setAttribute('x',  '14');
                    this.rightPath.setAttribute('d', 'm'+rightPathX+' 54.601h-0.187c-0.946 8.443 -5.767 12.665 -14.459 12.665v-67.25c9.764 0 14.646 5.343 14.646 16.028v38.55700000000001z');
                    this.rightPath.setAttribute("transform", "matrix(-1 0 0 "+heightPercentage+" 0 0)");

                    this.leftPath.setAttribute('d', 'm'+leftPathX+' 67.26599999999999c-8.667 0 -13.474 -4.222 -14.421 -12.665h-0.187v-32.168h-7.472l7.491 -7.472c0.322 -9.963 5.186 -14.945 14.59 -14.945v67.25z');
                    this.leftPath.setAttribute("transform", "matrix(-1 0 0 "+heightPercentage+" 0 0)");
                    this.linearGradient.setAttribute("gradientTransform", "rotate(90)");
                }

                this.def.appendChild(this.linearGradient);
                this.linearGradient.appendChild(firstColor);
                this.linearGradient.appendChild(secondColor);
                this._svg.appendChild(this.def);
                this._svg.appendChild(this.rect);
                this._svg.appendChild(this.leftPath);
                this._svg.appendChild(this.rightPath);
                this.svgWrapper.appendChild(this._svg);
                this._elementWrapper.setAttribute('style', 'direction:'+this._elementWrapper.style.direction + ';min-height:'+(h+60)+'px;');
                textWrapper.scrollTop = textWrapper.scrollHeight;
                this.messageWrapper.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
                if(this.messageWrapper.querySelector(".typingText") != null){
                    this.messageWrapper.removeChild(this.typingText);
                }
                this.messageText.style.opacity = 1;
                if(this.messageAudio){
                    this.messageAudio.style.opacity = 1;
                }
                if(currentMessage < _this.messages.length-1){
                    sendButton.setAttribute("enabled", "true");
                }
            },

            _resizeMessageBackground : function(){
                if(this.messageWrapper.offsetWidth != 0){
                    var w = this.messageWrapper.offsetWidth +10;
                    var h = this.messageWrapper.offsetHeight;

                    this._svg.setAttribute('width', w+"px");
                    this._svg.setAttribute('height', h+"px");
                    this._svg.setAttribute('viewBox', "0 0 "+w+" "+h);
                    this._svg.setAttribute('enable-background', "new 0 0 "+w+" "+h);

                    this.rect.setAttribute('width',  w - 37);
                    this.rect.setAttribute('height',  70);


                    var rightPathX = w;
                    var leftPathX = 25;

                    var heightPercentage = (h / 70) + (0.04 * (h /70));

                    this.rect.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                    if(this._direction == "ltr"){
                        this.rect.setAttribute('x',  '23');
                        this.rightPath.setAttribute('d', 'm'+rightPathX+' 54.601h-0.187c-0.946 8.443 -5.767 12.665 -14.459 12.665v-67.25c9.764 0 14.646 5.343 14.646 16.028v38.55700000000001z');
                        this.rightPath.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                        this.leftPath.setAttribute('d', 'm'+leftPathX+' 67.26599999999999c-8.667 0 -13.474 -4.222 -14.421 -12.665h-0.187v-32.168h-7.472l7.491 -7.472c0.322 -9.963 5.186 -14.945 14.59 -14.945v67.25z');
                        this.leftPath.setAttribute("transform", "matrix(1 0 0 "+heightPercentage+" 0 0)");
                        this.linearGradient.setAttribute("gradientTransform", "rotate(90)");
                    }else{
                        leftPathX = 25 - w;
                        rightPathX = 0;

                        this.rect.setAttribute('x',  '14');
                        this.rightPath.setAttribute('d', 'm'+rightPathX+' 54.601h-0.187c-0.946 8.443 -5.767 12.665 -14.459 12.665v-67.25c9.764 0 14.646 5.343 14.646 16.028v38.55700000000001z');
                        this.rightPath.setAttribute("transform", "matrix(-1 0 0 "+heightPercentage+" 0 0)");

                        this.leftPath.setAttribute('d', 'm'+leftPathX+' 67.26599999999999c-8.667 0 -13.474 -4.222 -14.421 -12.665h-0.187v-32.168h-7.472l7.491 -7.472c0.322 -9.963 5.186 -14.945 14.59 -14.945v67.25z');
                        this.leftPath.setAttribute("transform", "matrix(-1 0 0 "+heightPercentage+" 0 0)");
                        this.linearGradient.setAttribute("gradientTransform", "rotate(90)");
                    }

                    if(this._bottomPanel.style.visibility == "visible"){
                        h = h + this._bottomPanel.offsetHeight;
                    }
                    this._elementWrapper.setAttribute('style', 'direction:'+this._elementWrapper.style.direction + ';min-height:'+(h+50)+'px;');
                    textWrapper.scrollTop = textWrapper.scrollHeight;
                    if(this.messageWrapper.querySelector(".typingText") != null){
                        this.messageWrapper.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.3)";
                        this.messageWrapper.removeChild(this.typingText);
                    }
                }
            }
        }

        Message.create = function(options) {
            return new Message(options);
        }

        function getCurrentDirection (){
            switch (messageDirection){
                case "ltr":
                messageDirection = "rtl";
                break;
                case "rtl":
                messageDirection = "ltr";
                break;
                case null:
                messageDirection = "ltr";
                break;
            }
            return messageDirection;
        }

        function playAudio(event) {
            if (globalAudioPlaying) 
            {
                stopAndHideAudio(event);
            }
            globalAudioIcon = $(event.currentTarget);
            globalAudioTemplate = "listening";
            globalAudioShowPlayer = true;
            activateAudio();
        }

        function checkGlossary(that){
            var msg = that._message;
            if (msg.indexOf("<glossary>") != -1) {
                msg = msg.replace("<glossary>", "<span class='mark_glossary'>");
            }
            if (msg.indexOf("</glossary>") != -1) {
                msg = msg.replace("</glossary>", "</span>");
            }
            that._message = msg;
            if (msg.indexOf("<glossary>") != -1) {
                checkGlossary(that);
            }else{
                checkComprehension(that);
            }
        }

        function checkComprehension(that){
            var msg = that._message;
            if (msg.indexOf("<mark comprehension>") != -1) {
                msg = msg.replace("<mark comprehension>", "<mark class='mark_comprehension'>");
            }
            that._message = msg;
            if (msg.indexOf("<mark comprehension>") != -1) {
                checkComprehension(that);
            }else{
                that.messageText.innerHTML = msg;
            }
        }

        function showBottomPanel(that, title){
            var _this = that;
            if (globalAudioPlaying){
                stopAndHideAudio();
            }
            if(title == "Comprehension"){
                for(var p=0;p < _this._popupText.length;p++){
                    if(_this._popupText[p].title == title){

                        _this._panelTitle.innerHTML = _this._popupText[p].title;
                        _this._panelContent.innerHTML = _this._popupText[p].desc;
                        // _this._panelIcon.setAttribute("audiosource", _this._popupText[p].audio);
                        _this._panelIcon.style.display = "none";

                        _this._closePanel.src = "images/comprehensionCloseIcon.png";
                        // _this._panelIcon.src = "images/comprehensionAudioIcon.png";

                        _this.popUpImg.className = "arrow_box comprehensionArrow";
                        _this.popUpImg.style.background = increase_brightness("#a523d0", 70);
                        _this._bottomPanel.style.backgroundColor = increase_brightness("#a523d0", 70);
                        _this._panelTitle.style.backgroundColor = "#a523d0";

                        _this._bottomPanel.style.visibility = "visible";
                        _this._bottomPanel.style.display = "block";
                    }    
                }
            }else{
                for(var g=0;g < _this._glossary.length;g++){
                    if(_this._glossary[g].title == title){
                        _this._panelTitle.innerHTML = "Glossary";
                        _this._panelContent.innerHTML = _this._glossary[g].desc;
                        _this._panelIcon.setAttribute("audiosource", _this._glossary[g].audio);
                        _this._panelIcon.style.display = "none";
                        _this._closePanel.src = "images/glossaryCloseIcon.png";
                        _this._panelIcon.src = "images/glossaryAudioIcon.png";

                        _this.popUpImg.className = "arrow_box glossaryArrow";
                        _this.popUpImg.style.background = increase_brightness("#ff9000", 70);
                        _this._bottomPanel.style.backgroundColor = increase_brightness("#ff9000", 70);
                        _this._panelTitle.style.backgroundColor = "#ff9000";


                        _this._bottomPanel.style.visibility = "visible";
                        _this._bottomPanel.style.display = "block";
                    }    
                }
            }
            var h = _this.directionWrapper.offsetHeight + _this._bottomPanel.offsetHeight;
            _this._elementWrapper.setAttribute('style', 'direction:'+_this._elementWrapper.style.direction + ';min-height:'+h+'px;');
            textWrapper.scrollTop = textWrapper.scrollTop + _this._bottomPanel.offsetHeight;
        }

        function closeBottomPanel(that) {
            var _this = that;
            var h = _this._elementWrapper.offsetHeight - _this._bottomPanel.offsetHeight;
            _this._bottomPanel.style.visibility = "hidden";
            _this._bottomPanel.style.display = "none";
            _this._elementWrapper.setAttribute('style', 'direction:'+_this._elementWrapper.style.direction + ';min-height:'+h+'px;');
        }

        function resizeMessages(){
            for(var m = 0; m<allmessages.length;m++){
                if(allmessages[m]._svg){
                    allmessages[m]._resizeMessageBackground();
                }
            }
        }

        function showNextMessage(){
            var msg = Message.create({
                parent : textWrapper,
                name : _this.messages[currentMessage].name,
                image : _this.messages[currentMessage].image,
                id : _this.messages[currentMessage].id,
                message : _this.messages[currentMessage].message,
                audio : _this.messages[currentMessage].audio,
                glossary : _this.messages[currentMessage].glossary,
                popupText : _this.messages[currentMessage].popupText,
                messageColor : _this.messages[currentMessage].messageColor,
                direction : _this.messages[currentMessage].direction
            });

            allmessages.push(msg);

            textWrapper.scrollTop = textWrapper.scrollHeight;

            $(msg.messageText).find(".mark_comprehension").hammer().on("tap", function(){
                showBottomPanel(msg, "Comprehension");
            });

            $(msg.messageText).find(".mark_glossary").hammer().on("tap", function(){
                showBottomPanel(msg, this.textContent);
            });

            $(msg._closePanel).hammer().on("tap",function(){
                closeBottomPanel(msg);
            });

            refreshDom(msg._elementWrapper.id);

            sendButton.setAttribute("enabled", "false");
            setTimeout(function(){
                msg._getMessageBackground();
            }, 1500);
        }

        function refreshDom(elementId){
        	var $elementId = $("#" + elementId);
        	var $directionWrapper = $elementId.find(".directionWrapper");
        	var directionWrapper = $directionWrapper[0];
        	if ($elementId.length > 0){
	        	directionWrapper.innerHeight;
	        	$directionWrapper.hide();
	        	directionWrapper.innerHeight;
	        	setTimeout(function(){
	        		directionWrapper.innerHeight;	
	        		$directionWrapper.show();
	        		directionWrapper.innerHeight;	
	        	},100);
	        	 	
        	}
        }

        function searchByID(nameKey, myArray){
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].id === nameKey) {
                    return myArray[i];
                }
            }
        }
        function setAvatarDirections(){
            for(var a=0; a<_this.avatars.length;a++){
                _this.avatars[a].direction = getCurrentDirection();
            }
        }
        function parseMessages(){
            for(var m=0; m<_this.messages.length;m++){
                var avatar = searchByID(_this.messages[m].id, _this.avatars);
                _this.messages[m].name = avatar.name;
                _this.messages[m].image = avatar.image;
                _this.messages[m].messageColor = avatar.messageColor;
                _this.messages[m].direction = avatar.direction;
            }
            showNextMessage();
        }

        _this.init = function (){
            if(_this.instruction != ""){
                var instructionText = document.createElement("div");
                instructionText.className = "instructionText";
                if(_this.instructionAudio != ""){
                    var instructionAudio = document.createElement("img");
                    instructionAudio.src = "images/audio-icon.png";
                    instructionAudio.setAttribute("audiosource",_this.instructionAudio);
                    instructionAudio.className = "audioIcon audioInTextConversation";
                }
                instructionText.appendChild(instructionAudio);
                instructionText.innerHTML = instructionText.innerHTML + "<span class='audioText'>"+_this.instruction+"</span>";
                _this.containerJS.appendChild(instructionText);
            }
            textWrapper = document.createElement("div");
            textWrapper.className = "textWrapper";
            _this.containerJS.appendChild(textWrapper);
            enableDraggingOnItem("textWrapper");





            var sendButtonWrapper = document.createElement("div");
            sendButtonWrapper.className = "sendButtonWrapper";
            _this.containerJS.appendChild(sendButtonWrapper);

            sendButton = document.createElement("div");
            sendButton.className = "sendButton";
            sendButton.innerHTML = "Send";
            sendButtonWrapper.appendChild(sendButton);

            $(sendButton).hammer().on("tap",function(){
                if(this.getAttribute("enabled") == "true"){
                    if(currentMessage < _this.messages.length-1){
                        currentMessage++;
                        showNextMessage();
                    }else{
                        sendButton.setAttribute("enabled", "false");
                    }
                }
            });

            currentMessage = 0;
            setAvatarDirections();
            parseMessages();
            $(window).on("resize", function() {
                resizeMessages();
            });
        }

        _this.init();
    });