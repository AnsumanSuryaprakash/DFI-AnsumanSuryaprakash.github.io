/*
Passage 1.3

Author: Wissam Hobeika

Copyright 2015, Dataflow International
Website: http://www.dataflow.com.lb

Released on 03/23/2015
*/
var passage = (function (id, pageName, parameters) {
    var _this = this;
    _this.containerID = id;
    _this.containerJS = document.getElementById(_this.containerID);
    _this.containerJS.setAttribute("class", "passage");
    var selector = $(_this.containerJS);
    // if (parameters == undefined){
    //     var componentData = $.grep(globalArrComponentsData,function(n,k){
    //         return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "textConversation"
    //     })
    //     parameters = componentData[0].ComponentParameters;
    // }
    $.fn.defaults = {
        "tabs" : null,
        "tabData": null,
        "type"      : "withPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "leftImages":null,
        "instruction":null,
        "instructionAudio":null,
        "paragraphs": [
        {"audio":"", "desc":"<title><strong>Green Meadows Guide Dog Training</strong>"},
        {"audio":"sounds/page10/RUR_L1_M2_SB_009_A002.mp3", "desc":"Green Meadows Guide Dog Training is a guide dog training charity run entirely by volunteers. Established in 1975, we train between 10 and 15 guide dogs each year for blind or visually impaired people. Many different breeds of dogs are trained to become guide dogs in Green Meadows, but the most popular breeds include Golden Retrievers, Labradors, and German Shepherds."},
        {"audio":"sounds/page10/RUR_L1_M2_SB_009_A003.mp3", "desc":"Our puppies are fostered by volunteer foster families who raise the puppies for nearly a year. Fostering makes sure the dogs are comfortable around people and well <glossary>socialized</glossary>. Once the dogs are old enough, they return to Green Meadows to begin their training with <glossary>qualified</glossary> guide dog instructors. Training takes 1 – 2 years. The dog learns to avoid obstacles and ignore <glossary>distractions</glossary>. Finally, Green Meadows takes great care to match each dog to its owner based on <glossary>personality</glossary>. We work hard to make sure guide dogs and their human partners will have long and happy partnerships."},
        {"audio":"sounds/page10/RUR_L1_M2_SB_009_A004.mp3", "desc":"When it is time for a guide dog to <glossary>retire</glossary>, we help find new homes for old guide dogs. We value the work of our guide dogs. We hope to be able to provide guide dog training services for our local area for a long time to come."}
        ],
        "popupText" : [],
        "supportingText" :[],
        "glossary" : [
        {"title":"socialized", "audio":"sounds/page10/RUR_L1_M2_SB_009_A005.mp3", "desc":"<strong>so•cial•ized</strong>  verb: able to be around people <br/><br>Fostering is important to make sure guide dog puppies are <strong>socialized</strong>, or able to be around people."},
        {"title":"qualified","audio":"sounds/page10/RUR_L1_M2_SB_009_A006.mp3", "desc":"<strong>qual•i•fied</strong> adjective: having the required skills and training <br/><br>After fostering, guide dogs begin training with <strong>qualified</strong> volunteer trainers who have the required skills for teaching the dogs."},
        {"title":"distractions","audio":"sounds/page10/RUR_L1_M2_SB_009_A007.mp3","desc":"<strong>dis•trac•tions</strong> noun: things that distract or direct away one’s attention<br/><br>Guide dogs learn to ignore <strong>distractions</strong> like cats or loud noises as part of their training."},
        {"title":"personality", "audio":"sounds/page10/RUR_L1_M2_SB_009_A008.mp3", "desc":"<strong>per•son•al•i•ty</strong> noun: the unique character of an individual<br/><br>Once a guide dog has finished its training, it is matched to its new owner based on their <strong>personalities.</strong>"},
        {"title":"retire", "audio":"sounds/page10/RUR_L1_M2_SB_009_A009.mp3", "desc":"<strong>re•tire</strong> verb: stop working<br/><br>Guide dogs <strong>retire</strong> when they become too old to work any longer."}
        ],
        "promptType": 1,
        "popUpCheck" :[],
        "withImages": false,
        "type2Form" : false,
        "withAudio"     : true, 
    }

    _this.params = $.extend({}, $.fn.defaults, parameters);

    /*------------------------------ params -----------------------------*/

    _this.type  = _this.params.type;
    _this.leftImages = _this.params.leftImages;
    _this.instruction = _this.params.instruction;
    _this.instructionAudio = _this.params.instructionAudio;
    _this.withAudio = _this.params.withAudio;
    _this.paragraphs = _this.params.paragraphs;
    _this.popupText = _this.params.popupText;
    _this.supportingText = _this.params.supportingText;
    _this.glossary = _this.params.glossary;
    _this.promptType = _this.params.promptType;
    _this.tabs = _this.params.tabs;
    _this.tabData = _this.params.tabData;
    _this.popUpCheck = _this.params.popUpCheck;
    _this.withImages = _this.params.withImages;
    _this.type2Form = _this.params.type2Form;

    /*------------------------------ end params -----------------------------*/

    var passages = [], currentPassage = 0, psg, passageWrapper, passageInstruction;
    
    passageExcerpt = window.passageExcerpt = function(options) {
        this._id = options.id;
        this._parentContainer  = options.parent;
        this._type             = options.type;
        this._leftImages       = options.leftImages;
        this._instruction      = options.instruction;
        this._instructionAudio = options.instructionAudio;
        this._withAudio        = options.withAudio;
        this._paragraphs       = options.paragraphs;
        this._popupText        = options.popupText;
        this._supportingText   = options.supportingText;
        this._glossary         = options.glossary;
        this._promptType       = options.promptType;
        this._tabs             = options.tabs;
        this._tabData              = options.tabData;
        this._popUpCheck       = options.popUpCheck;
        this._withImages       = options.withImages;
        this._type2Form        = options.type2Form;
        this._marks = 0;
        this._discussion = false;
        this._questions = 0;
        this._glossaries = 0;
        this._popUpPosition = 0;
        this._onMark = 0;
        this._onGlossary = 0;
        this._currentMark;
        this._addedMarks = [];
        this._topicNumber;
        this._indexStart;
        this._indexStop;
        this._currentSelector;
        this._timer = null;
        this._generate();
    }

    passageExcerpt.prototype = {
        VERSION: '0.1.1',
        _generate: function(){
            var passageContainer = document.createElement("div");
            passageContainer.className = "passageContainer";
            if(_this.tabs != null){
                passageContainer.style.width = "100%";
            }else{
                passageContainer.style.width = "68%";
            }
            passageContainer.style.height = "100%";
            passageContainer.style.left = "0px";
            
            if(this._leftImages){
                passageContainer.style.width = "68%";
                passageContainer.style.left = "0px";
                var leftImages = document.createElement("div");
                leftImages.className = "leftImagesPassage";
                leftImages.id = pageName + "leftImages";

                for(var i=0; i<this._leftImages.length;i++){
                    var fig=document.createElement("figure");

                    var hyperlink=document.createElement("a");
                    hyperlink.setAttribute("href", this._leftImages[i].fullscreen);
                    hyperlink.setAttribute("data-index", i);
                    hyperlink.setAttribute("class", "img");

                    var thumb=document.createElement("img");
                    thumb.setAttribute("src", this._leftImages[i].thumb);
                    thumb.setAttribute("alt", this._leftImages[i].caption);

                    hyperlink.appendChild(thumb);
                    fig.appendChild(hyperlink);

                    if(this._leftImages[i].caption != ""){
                        var figCaption = document.createElement("figCaption");
                        figCaption.innerHTML = this._leftImages[i].caption;
                        fig.appendChild(figCaption);
                    }
                    leftImages.appendChild(fig);
                }
                this._parentContainer.appendChild(leftImages);
                //$(".leftImagesPassage a.img").photoSwipe();
                $("#" + _this.containerID + " .leftImagesPassage a.img").photoSwipe();
            }else{
                if((_this.tabs == null) && (this._type != "exploreType1") && (this._type != "exploreType2")){
                    passageContainer.style.left = "30%";
                }
                if((this._type == "withoutPrompts") && (!this._leftImages)){
                    passageContainer.style.width = "99%";
                    passageContainer.style.left = "0px";
                }
            }
            
            
                        
            if(this._id){
                passageContainer.id = this._id;
            }

            if(this._instruction != null){
                passageInstruction = document.createElement("p");
                passageInstruction.className = "instructionText";
                if(this._instructionAudio != ""){
                    this._instruction = "<img src='images/audio-icon.png' audiosource='"+this._instructionAudio+"' class='audioIcon audioOutsidePassage'/><span class='audioText'>" + this._instruction+"</span>";  
                }
                passageInstruction.innerHTML = this._instruction+'<div class="instructionHr"></div>';
                passageContainer.appendChild(passageInstruction);
            }

            passageWrapper = document.createElement("div");
            passageWrapper.className = "passageWrapper "+this._type;

            passageContainer.appendChild(passageWrapper);
            this._parentContainer.appendChild(passageContainer);

            this._buildPassage(passageWrapper);
            if(_this.containerJS.querySelector(".leftPanel") == null){
                this._buildPanel();
            }else{
                this._leftPanel = _this.containerJS.querySelector(".leftPanel");
                this._panelHeader = _this.containerJS.querySelector(".panelHeader");
                this._closePanel = _this.containerJS.querySelector(".closePanel");
                this._panelTitle = _this.containerJS.querySelector(".title");
                this._panelIcon = _this.containerJS.querySelector(".audioIconPopUp");
                this._panelContent = _this.containerJS.querySelector(".content");
                this._panelBottomIcon = _this.containerJS.querySelector(".bottomIcon");
                this._panelQuestion = _this.containerJS.querySelector(".panelQuestion");
                this._panelTabContainer = _this.containerJS.querySelector(".panelTabContainer");
                this._hintTabHeader = _this.containerJS.querySelector(".ccFirstTitle");
                this._answerTabHeader = _this.containerJS.querySelector(".ccSecondTitle");
                this._hintTabContent = _this.containerJS.querySelector(".ccFirstContent");
                this._answerTabContent = _this.containerJS.querySelector(".ccSecondContent");
            }
            this._timer = setInterval(function(){
                if(passages.length>1){
                    passages[currentPassage]._resizePassage();
                }else{
                    psg._resizePassage();
                }
            }, 1000);
            enableDraggingOnItem(".leftImagesPassage");
            enableDraggingOnItem(".passageContainer");
            enableDraggingOnItem(".passageWrapper");
            enableDraggingOnItem(".explanationPanel .content");
            enableDraggingOnItem(".leftPanel .content");
            enableDraggingOnItem(".leftPanel .ccTabContent");
            return this;
        },
        _resizePassage: function(){
            clearInterval(this._timer);
            if(passageInstruction){
                passageWrapper.style.height = passageWrapper.parentElement.offsetHeight - passageInstruction.offsetHeight - 41 +"px";
            }
        },
        _buildPanel: function(){
            this._leftPanel = document.createElement("div");
            this._leftPanel.className = "leftPanel";
            this._leftPanel.style.display = "none";

            this._closePanel = document.createElement("img");
            this._closePanel.className = "closePanel";
            $(this._closePanel).hammer().on("tap", closeLeftPanel);

            this.popUpImg = document.createElement("div");
            this.popUpImg.className = "arrow_box";

            this._panelHeader = document.createElement("div");
            this._panelHeader.className = "panelHeader";

            this._panelTitle = document.createElement("div");
            this._panelTitle.className = "title";

            this._panelIcon = document.createElement("img");
            this._panelIcon.className = "audioIconPopUp";
            this._panelIcon.setAttribute("audiosource", this._audio);

            $(this._panelIcon).hammer().on("tap", playAudio);

            this.panelAudioIcon = document.createElement("div");
            this.panelAudioIcon.className = "icon";

            // standard panel
            this._panelContent = document.createElement("div");
            this._panelContent.className = "content";
            this._panelContent.style.clear = "both";

            this._panelBottomIcon = document.createElement("img");
            this._panelBottomIcon.className = "bottomIcon";

            this._panelHeader.appendChild(this._panelTitle);
            this.panelAudioIcon.appendChild(this._panelIcon);
            this._panelHeader.appendChild(this.panelAudioIcon);
            this._panelHeader.appendChild(this._closePanel);
            
            this._leftPanel.appendChild(this.popUpImg);
            this._leftPanel.appendChild(this._panelHeader);
            this._leftPanel.appendChild(this._panelContent);
            this._leftPanel.appendChild(this._panelBottomIcon);
            

            // tabbed panel
            this._panelQuestion = document.createElement("div");
            this._panelQuestion.className = "panelQuestion";
            this._panelQuestion.innerHTML = this._question;

            this._panelTabContainer = document.createElement("div");
            this._panelTabContainer.className = "panelTabContainer";
            this._panelTabContainer.id = "tab-container";

            this._ulTabHeaders = document.createElement("ul");
            this._ulTabHeaders.className = "ccTabHeaders";

            this._hintTabHeader = document.createElement("li");
            this._hintTabHeader.className = "tab ccFirstTitle";

            this._hintTabHeaderLink = document.createElement("a");
            this._hintTabHeaderLink.setAttribute("href", "#tab-hint");
            this._hintTabHeaderLink.innerHTML = "Hint";

            this._answerTabHeader = document.createElement("li");
            this._answerTabHeader.className = "tab ccSecondTitle";

            this._answerTabHeaderLink = document.createElement("a");
            this._answerTabHeaderLink.setAttribute("href", "#tab-answer");
            this._answerTabHeaderLink.innerHTML = "Answer";

            this._tabContent = document.createElement("div");
            this._tabContent.className = "ccTabContent";

            this._hintTabContent = document.createElement("div");
            this._hintTabContent.id = "tab-hint";
            this._hintTabContent.className = "ccFirstContent"; 
            this._hintTabContent.innerHTML =  this._hint;

            this._answerTabContent = document.createElement("div");
            this._answerTabContent.id = "tab-answer";
            this._answerTabContent.className = "ccSecondContent"; 
            this._answerTabContent.innerHTML =  this._answer;
            
            this._hintTabHeader.appendChild(this._hintTabHeaderLink);
            this._answerTabHeader.appendChild(this._answerTabHeaderLink);
            this._ulTabHeaders.appendChild(this._hintTabHeader);
            this._ulTabHeaders.appendChild(this._answerTabHeader);
            this._tabContent.appendChild(this._hintTabContent);
            this._tabContent.appendChild(this._answerTabContent);
            this._panelTabContainer.appendChild(this._ulTabHeaders);
            this._panelTabContainer.appendChild(this._tabContent);

            this._leftPanel.appendChild(this._panelQuestion);
            this._leftPanel.appendChild(this._panelTabContainer);
            
            _this.containerJS.appendChild(this._leftPanel);
        },
        _showPanel: function(event, title, backColor, titleColor, audio, audioIcon, content, closeIcon, bottomIcon, question, hint, answer){
            /*
            position panel next to clicked element - needs more work
            var panelTop = event.currentTarget.offsetTop - this._leftPanel.offsetHeight / 2 + 5;
            if(panelTop < 80){
                panelTop = 80;
            }else if(panelTop > 400){
                panelTop = 300;
            }*/
            // fixed position
            this._leftPanel.style.top = "80px";
            this._leftPanel.style.backgroundColor = backColor;
            this._leftPanel.style.borderLeftColor =  backColor;
            this._panelHeader.style.display = "block";
            
            if(title){
                this._panelTitle.style.display = "block";
                this._panelTitle.innerHTML = title;
                this._panelTitle.style.backgroundColor = titleColor;
            }else{
                this._panelTitle.style.display = "none";
            }

            this._closePanel.src = closeIcon;

            if(audio){
                this._panelIcon.style.display = "block";
                this._panelIcon.setAttribute("audiosource", audio);
                this._panelIcon.src = audioIcon;
            }else{
                this._panelIcon.style.display = "none";
            }
            
            if(bottomIcon){
                this._panelBottomIcon.style.display = "block";
                this._panelBottomIcon.src = bottomIcon;
            }else{
                this._panelBottomIcon.style.display = "none";
            }

            if(content){
                this._panelContent.style.display = "block";
                this._panelContent.innerHTML = content;
                this._panelQuestion.style.display = "none";
                this._panelTabContainer.style.display = "none";
            }
            if(question){
                this._panelQuestion.style.display = "block";
                this._panelQuestion.style.marginBottom = "10px";
                this._panelQuestion.innerHTML = question;
                this._panelContent.style.display = "none";
                if(hint || answer){
                    this._panelTabContainer.style.display = "block";
                    if(hint){
                        this._hintTabHeader.style.backgroundColor = titleColor;
                        this._hintTabContent.style.display = "block";
                        this._hintTabContent.innerHTML = hint;  
                    }else{
                        this._hintTabContent.style.display = "none";
                    }
                    if(answer){
                        this._answerTabHeader.style.backgroundColor = titleColor;
                        this._answerTabContent.style.display = "block";
                        this._answerTabContent.innerHTML = answer;
                    }else{
                        this._answerTabContent.style.display = "none";
                    }
                    
                    $("#"+this._panelTabContainer.id).easytabs({
                        updateHash:false,
                        animate:true,
                        transitionIn:"slideDown"
                    });
                    $("#"+this._panelTabContainer.id).find("li").removeClass("active");
                    $("#"+this._panelTabContainer.id).find("a").removeClass("active");
                    $("#"+this._panelTabContainer.id).find("#tab-hint").css("display","none");
                    $("#"+this._panelTabContainer.id).find("#tab-answer").css("display","none"); 
                    $("#"+this._panelTabContainer.id).find(".ccFirstTitle").css("background-color", $(event.currentTarget).css("background-color"));
                    $("#"+this._panelTabContainer.id).find(".ccSecondTitle").css("background-color", $(event.currentTarget).css("background-color"));
                }else{
                    this._panelHeader.style.display = "none";
                    this._panelQuestion.style.marginBottom = "0px";
                    this._panelTabContainer.style.display = "none";
                }
                if((hint == null) && (answer == null)){
                    if(_this.type2Form == false){
                        this._panelTitle.style.display = "block";
                        this._panelTitle.innerHTML = "Think About It";
                        this._panelTitle.style.backgroundColor = titleColor;
                    }
                    this._panelHeader.style.display = "block";
                }
            }

            $(this._leftPanel).show();
        },
        _buildPassage:function(selector) {
            var bulletNumber = 1, indexStart = 0, indexStop = this._paragraphs.length;
            
            for (var p = indexStart; p < indexStop; p++) {

                var paragraph = document.createElement("p");
                if(this._discussion){
                    if (this._paragraphs[p].desc.indexOf("<discussion>") == -1) {
                        this._questions = this._questions +1;
                        this._paragraphs[p].desc = this._questions +". "+ this._paragraphs[p].desc;
                    }else{
                        this._discussion = false;
                    }
                }
                if (this._paragraphs[p].desc.indexOf("<title>") != -1) {
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace("<title>", "");
                    paragraph.className = "passageTitle";
                }
                if (this._paragraphs[p].desc.indexOf("<subTitle>") != -1) {
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace("<subTitle>", "");
                    paragraph.className = "passageSubTitle";
                }
                if (this._paragraphs[p].desc.indexOf("<discussion>") != -1) {
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace("<discussion>", "");
                    paragraph.className = "passageDiscussionTitle";
                    this._discussion = true;
                    this._questions = 0;
                }

                if (this._paragraphs[p].desc.toString().match(/<mark>/g) != null) {
                    this._marks = this._marks + this._paragraphs[p].desc.toString().match(/<mark>/g).length;
                }
                var newIndex1 = 0;
                for (var m = this._onMark; m < this._marks; m++) {
                    
                    var txt = this._paragraphs[p].desc;
                    var index1 = txt.indexOf("<mark>", newIndex1);
                    var index2 = index1 + 6;
                    
                    if(this._promptType == "numbered") {
                        // this._paragraphs[p].desc = this._paragraphs[p].desc.replace(this._paragraphs[p].desc.substring(index1, index2), "<span class='number highlight" + bulletNumber + "' data-item='"+m+"'>" + bulletNumber + "</span><mark>");
                        this._paragraphs[p].desc = this._paragraphs[p].desc.replaceBetween(index1, index2, "<span class='number highlight" + bulletNumber + "' data-item='"+m+"'>" + bulletNumber + "</span><mark>");
                        newIndex1 = this._paragraphs[p].desc.indexOf("<mark>", index2) + 6;
                    }else{
                        this._paragraphs[p].desc = this._paragraphs[p].desc.replace(this._paragraphs[p].desc.substring(index1, index2), "<mark class='highlight" + Number(m + 1) + "'>");
                    }
                    this._onMark = this._marks;
                    bulletNumber++;
                }

                if (this._paragraphs[p].desc.toString().match(/<glossary>/g) != null) {
                    this._glossaries = this._glossaries + this._paragraphs[p].desc.toString().match(/<glossary>/g).length;
                }

                for(var g = this._onGlossary; g < this._glossaries; g++) {
                    var txt = this._paragraphs[p].desc;
                    var index1 = txt.indexOf("<glossary>");
                    var index2 = index1 + 10;
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace(this._paragraphs[p].desc.substring(index1, index2), "<span class='glossaryMark'>");
                    txt = this._paragraphs[p].desc;
                    var index3 = txt.indexOf("</glossary>");
                    var index4 = index3 + 11;
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace(this._paragraphs[p].desc.substring(index3, index4), "</span>");

                    this._onGlossary = this._glossaries;
                }

                if (this._paragraphs[p].desc.indexOf("<mark number>") != -1) {
                    this._paragraphs[p].desc = this._paragraphs[p].desc.replace("<mark number>", "<img src='images/vocabularyIcon.png' alt='' class='leftIcon' target='vocabularyMark' /><mark class='vocabularyMark'>");
                }

                this._paragraphs[p].desc = this._checkPopUPText(this._paragraphs[p].desc);
                // this._paragraphs[p].desc = this._paragraphs[p].desc.replace("<mark_" ,"<mark ");
                

                /*this._paragraphs[p].desc = this._checkComprehension(this._paragraphs[p].desc);
                this._paragraphs[p].desc = this._checkUnderstanding(this._paragraphs[p].desc);
                this._paragraphs[p].desc = this._checkVocabulary(this._paragraphs[p].desc);
                this._paragraphs[p].desc = this._checkThinkScience(this._paragraphs[p].desc);
                this._paragraphs[p].desc = this._checkThinkAboutIt(this._paragraphs[p].desc);*/

                if(this._paragraphs[p].audio != "") {
                    paragraph.innerHTML = "<img src='images/audio-icon.png' class='audioIcon audio-icon' audioSource=" + this._paragraphs[p].audio + " alt='' /><span class='audioText'>" + this._paragraphs[p].desc + "</span>";
                }else {
                    paragraph.innerHTML = this._paragraphs[p].desc;
                }

                if(this._paragraphs[p].topic == true) {
                    paragraph.innerHTML = this._paragraphs[p].desc.substring(0, this._paragraphs[p].desc.indexOf("<topicText>"));
                    paragraph.id = _this.containerID + "_topic";
                    paragraph.className += "exploreTopic noIndent";
                    topicNumber = p;
                }
                if(this._type == "withoutPrompts"){
                    // paragraph.style.marginLeft = "auto";
                    paragraph.style.textIndent = "0px";
                }
                selector.appendChild(paragraph);
                
                if ((this._type == "exploreType2") && (p == this._paragraphs.length - 1)) {
                    var supportingTextDiv = document.createElement("ul");
                    supportingTextDiv.id = _this.containerID + "_supportingText";
                    selector.appendChild(supportingTextDiv);
                    if(_this.containerJS.querySelector(".leftImagesPassage") == null){
                        var leftImages = document.createElement("div");
                        leftImages.className = "leftImagesPassage";
                        leftImages.id = pageName + "leftImages";
                        _this.containerJS.insertBefore(leftImages, selector.parentElement);
                        // $(".leftImagesPassage a.img").photoSwipe();
                    }
                }
            }
            
            $("#"+id +" .glossaryMark").hammer().on("tap",this._showGlossary);
            $("#"+id +" .leftIcon").hammer().on("tap",this._showLeftPanel);
            $("#"+id +" span.number").hammer().on("tap",this._showLeftPanel);
            if(this._type == "exploreType2"){
                $("#"+id +" mark").hammer().on("tap",this._showLeftPanel);
            }
            $("#" + _this.containerID + " .audioIcon").hammer().on("tap",playAudio);                            
            // $(window).trigger('resize');
            // if(psg){
                if(passages.length>1){
                    passages[currentPassage]._resizePassage();
                }else{
                    this._resizePassage();
                }
            // }
        },
        _showGlossary: function(event) {
            // $("#leftPanel").find("#tab-container").css("display","none");
            var obj;
            if(passages.length>1){
                obj = passages[currentPassage];
            }else{
                obj = psg;
            }

            if (globalAudioPlaying) 
            {
                stopAndHideAudio();
            }
            obj._removeGlossaryHighlights();
            obj._removeMarkHighlights();
            
            var term, title = "Glossary", backColor = null, titleColor = null, audio = null, audioIcon = null, content = null, closeIcon = null, bottomIcon = null;
            term = event.currentTarget.innerHTML;
            for (var g = 0; g < obj._glossary.length; g++) {
                if (term == obj._glossary[g].title) {
                    content = obj._glossary[g].desc;
                    if(obj._glossary[g].audio != ""){
                        audio = obj._glossary[g].audio;
                    }
                }
            }

            $(event.currentTarget).addClass("glossaryMarkON");

            audioIcon = "images/glossaryAudioIcon.png";
            backColor = increase_brightness(getHexBackgroundColor($(event.currentTarget).css("background-color")), 70);
            titleColor = $(event.currentTarget).css("background-color");
            closeIcon = "images/glossaryCloseIcon.png";
            obj._showPanel(event, title, backColor, titleColor, audio, audioIcon, content, closeIcon, bottomIcon);
        },
        _showLeftPanel: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var obj;
            if(passages.length>1){
                obj = passages[currentPassage];
            }else{
                obj = psg;
            }
            if (event.target.classList.contains("glossaryMarkON") == false) {
                obj._removeGlossaryHighlights();
            }
            if (globalAudioPlaying) 
            {
                stopAndHideAudio();
            }
            var showPanel = true, title = null, backColor = null, titleColor = null, audio = null, audioIcon = null, content = null, closeIcon = null, bottomIcon = null, question = null, hint = null, answer = null;
            switch (obj._type) {
                case "withPromptsCC":
                    var itemNumber = $(event.currentTarget).attr("class").substring($(event.currentTarget).attr("class").indexOf("highlight") + 9, $(event.currentTarget).attr("class").length);
                    var itemData = $(event.currentTarget).data("item");
                    obj._removeMarkHighlights();
                    var selectedMark = $(event.currentTarget).next("mark");
                    // var selectedMark = $(event.currentTarget).parent().find("mark:nth-of-type("+Number(itemNumber)+")");
                    selectedMark.css("background-color", increase_brightness(getHexBackgroundColor($(event.currentTarget).css("background-color")), 70));
                    // $("#leftPanel").hide();
                    // $("#leftPanelCC").show();

                    audioIcon = "images/highlight"+itemNumber+"AudioIcon.png";
                    // $(".audioIconPopUp").hammer().on("tap", playAudio);

                    backColor = increase_brightness(getHexBackgroundColor($(event.currentTarget).css("background-color")), 70);
                    // $("#leftPanelCC").css("border-color", $(event.currentTarget).css("background-color"));


                    titleColor = $(event.currentTarget).css("background-color");
                    //$("#leftPanel").find("hr").css("border-color", obj.css("background-color"));
                    closeIcon = "images/highlight"+itemNumber+"CloseIcon.png";
                    // $("#leftPanel").find(".closePanel").css("background-color", obj.css("background-color"));
                    
                    title = "Comprehension Check";
                    
                    question = obj._popUpCheck[itemData].question;
                    // $("#leftPanelCC").find(".ccQuestion")[0].innerHTML = popUpCheck[itemData].question;
                    // content = obj._popUpCheck[itemData].question;

                    if(obj._popUpCheck[itemData].questionAudio != ""){
                        audio = obj._popUpCheck[itemData].questionAudio;
                    }
                    
                    // $("#leftPanelCC").find(".bottomIcon")[0].style.visibility = "hidden";

                    // $("#leftPanelCC").find(".ccFirstContent")[0].innerHTML = popUpCheck[itemData].hint;
                    // $("#leftPanelCC").find(".ccSecondContent")[0].innerHTML = popUpCheck[itemData].answer;
                    hint = obj._popUpCheck[itemData].hint;
                    answer = obj._popUpCheck[itemData].answer;
                    /*$("#tab-container").easytabs({
                        updateHash:false,
                        animate:true,
                        transitionIn:"slideDown"
                    });
                    $("#tab-container").find("li").removeClass("active");
                    $("#tab-container").find("a").removeClass("active");
                    $("#tab-hint").css("display","none");
                    $("#tab-answer").css("display","none"); 
                    $(".ccFirstTitle").css("background-color", $(event.currentTarget).css("background-color"));
                    $(".ccSecondTitle").css("background-color", $(event.currentTarget).css("background-color"));        */          

                    break;
                case "withPrompts":
                    obj._removeMarkHighlights();
                    var selectedMark, pos;
                    switch ($(event.currentTarget)[0].getAttribute("target")) {
                        case "vocabularyMark":
                            selectedMark = $(event.currentTarget).next("#"+pageName +" .vocabularyMark");
                            selectedMark.addClass("highlight_vocabulary");
                            var itemPos = Number(selectedMark[0].classList[1].substring(selectedMark[0].classList[1].indexOf("_")+1, selectedMark[0].classList[1].length));
                            pos = itemPos;
                            audioIcon = "images/vocabularyAudioIcon.png";
                            backColor = increase_brightness(getHexBackgroundColor(selectedMark.css("background-color")), 70);
                            titleColor = selectedMark.css("background-color");
                            closeIcon = "images/vocabularyCloseIcon.png";
                            if(pos != undefined){
                                title = obj._popupText[pos].title;
                                if(obj._popupText[pos].audio != ""){
                                    audio = obj._popupText[pos].audio
                                }
                                bottomIcon = "images/vocabLargeIcon.png";
                                content = obj._popupText[pos].desc;
                            }
                            break;
                        case "thinkAboutItMark":
                            selectedMark = $(event.currentTarget).next("#"+pageName +" .thinkAboutItMark");
                            var itemPos = Number(selectedMark[0].classList[1].substring(selectedMark[0].classList[1].indexOf("_")+1, selectedMark[0].classList[1].length));
                            pos = itemPos;
                            selectedMark.addClass("highlight_thinkAboutIt");
                            audioIcon = "images/thinkAboutItAudioIcon.png";
                            backColor = increase_brightness(getHexBackgroundColor(selectedMark.css("background-color")), 70);
                            titleColor = selectedMark.css("background-color");
                            closeIcon = "images/thinkAboutItCloseIcon.png";
                            if(pos != undefined){
                                title = obj._popupText[pos].title;
                                if(obj._popupText[pos].audio != ""){
                                    audio = obj._popupText[pos].audio;
                                }
                                bottomIcon = "images/thinkAboutItLargeIcon.png";
                                content = obj._popupText[pos].desc;
                            }
                            break;
                        case "thinkScienceMark":
                            selectedMark = $(event.currentTarget).next("#"+pageName +" .thinkScienceMark");
                            //selectedMark.addClass("highlight2");
                            // var tempArr = [];
                            // for(var p=0;p<obj._popupText.length;p++){
                            //  if(obj._popupText[p].title == "Think About It"){
                            //      tempArr.push(selectedMark);
                            //  }
                            // }
                            var itemPos = Number(selectedMark[0].classList[1].substring(selectedMark[0].classList[1].indexOf("_")+1, selectedMark[0].classList[1].length));
                            pos = itemPos;

                            selectedMark.addClass("highlight_thinkScience");
                            // $("#leftPanel").css("border-color", selectedMark.css("background-color"));
                            audioIcon = "images/thinkAboutItAudioIcon.png";
                            // $(".audioIconPopUp").hammer().on("tap", playAudio);

                            // $("#leftPanel").find(".content").css("max-height", 250);
                            // $("#leftPanel").find(".content").css("overflow-y", "auto");
                            // $("#leftPanel").find("#tab-answer").css("max-height", 200);
                            // $("#leftPanel").find("#tab-answer").css("overflow-y", "auto");

                            backColor = increase_brightness(getHexBackgroundColor(selectedMark.css("background-color")), 70);

                            titleColor = selectedMark.css("background-color");
                            //                        $("#leftPanel").find("hr").css("border-color", selectedMark.css("background-color"));
                            closeIcon = "images/thinkAboutItCloseIcon.png";
                            // $("#leftPanel").find(".closePanel").css("background-color", selectedMark.css("background-color"));
                            // $("#leftPanel").find("#tab-container").css("display","none");    
                            if(pos != undefined){
                                title = obj._popupText[pos].title;
                                if(obj._popupText[pos].audio != ""){
                                    audio = obj._popupText[pos].audio;
                                }


                                // $("#leftPanel").find(".bottomIcon")[0].style.visibility = "visible";
                                bottomIcon = "images/thinkScienceLargeIcon.png";
                                content = obj._popupText[pos].desc;

                                // $("#leftPanel").find("#tab-container").css("display","block");   
                                // $("#leftPanel").find(".ccFirstContent")[0].innerHTML = obj._popupText[pos].answer;

                                /*$("#tab-container").easytabs({
                                    updateHash:false,
                                    animate:true,
                                    transitionIn:"slideDown"
                                });
                                $("#tab-container").find("li").removeClass("active");
                                $("#tab-container").find("a").removeClass("active");
                                $("#tab-hint").css("display","none");
                                $("#tab-answer").css("display","none"); 
                                $(".ccFirstTitle").css("background-color", "#29abe2");*/
                            }


                            break;  
                        case "comprehensionMark":
                            selectedMark = $(event.currentTarget).next("#"+pageName +" .comprehensionMark");
                            selectedMark.addClass("highlight_comprehension");
                            var itemPos = Number(selectedMark[0].classList[1].substring(selectedMark[0].classList[1].indexOf("_")+1, selectedMark[0].classList[1].length));
                            pos = itemPos;
                            audioIcon = "images/comprehensionAudioIcon.png";
                            backColor = increase_brightness(getHexBackgroundColor(selectedMark.css("background-color")), 70);
                            titleColor = selectedMark.css("background-color");
                            closeIcon = "images/comprehensionCloseIcon.png";
                            if(pos != undefined){
                                title = obj._popupText[pos].title;
                                if(obj._popupText[pos].audio != ""){
                                    audio = obj._popupText[pos].audio;
                                }
                                bottomIcon = "images/comprehensionLargeIcon.png";
                                content = obj._popupText[pos].desc;
                            }
                            break;
                    }
                    break;
                case "exploreType1":
                    // $("#leftPanelCC").hide();
                    // $("#leftPanel").show();
                    // $("#leftPanel").find("#tab-container").css("display","none");
                    var obj;
                    if(passages.length>1){
                        obj = passages[currentPassage];
                    }else{
                        obj = psg;
                    }
                    if ($(event.currentTarget).attr("class").length > 0) {

                        obj._addedMarks.push($(event.currentTarget));

                        var itemNumber = $(event.currentTarget).attr("class").substring($(event.currentTarget).attr("class").indexOf("highlight") + 9, $(event.currentTarget).attr("class").length);

                        audioIcon = "images/highlight" + itemNumber + "AudioIcon.png";
                        // $(".audioIconPopUp").hammer().on("tap", playAudio);

                        // $("#leftPanel").css("border-color", $(event.currentTarget).css("background-color"));
                        backColor = increase_brightness(getHexBackgroundColor($(event.currentTarget).css("background-color")), 70);
                        closeIcon = "images/highlight" + itemNumber + "CloseIcon.png";
                        titleColor = $(event.currentTarget).css("background-color");
                        //                $("#leftPanel").find("hr").css("border-color", $(event.currentTarget).css("background-color"));
                        // $("#leftPanel").find(".closePanel").css("background-color", $(event.currentTarget).css("background-color"));
                        title = _this.popupText[itemNumber - 1].title;
                        if(_this.popupText[itemNumber - 1].audio != ""){
                            audio = _this.popupText[itemNumber - 1].audio;
                        }

                        content = _this.popupText[itemNumber - 1].desc;
                        $(event.currentTarget).removeClass("highlight" + itemNumber);
                        $(event.currentTarget).addClass("highlight" + itemNumber + "-dim dim");
                    }else{
                        // $("#leftPanel").hide();
                        closeLeftPanel();
                    }
                    break;
                case "exploreType2":
                    if(_this.type2Form == 1){
                        for (var i = 1; i <=_this.supportingText.length; i++) {
                            $("#"+_this.containerID +" mark.dim").removeClass("highlight"+i+"-dim");
                        };
                        $("#"+_this.containerID +" mark.dim").removeClass("dim");
                    }else{
                        showPanel = false;
                    }
                    if ($(event.currentTarget).attr("class").length > 0 && !$(event.currentTarget).hasClass("dim")) {
                        var itemNumber = $(event.currentTarget).attr("class").substring($(event.currentTarget).attr("class").indexOf("highlight") + 9, $(event.currentTarget).attr("class").length);
                        //         if(_this.type2Form == 1){
                        //          for (var i = 1; i <=_this.supportingText.length; i++) {
                                    //  $("#"+_this.containerID +" mark.dim").removeClass("highlight"+i+"-dim");
                                    // };
                                    // $("#"+_this.containerID +" mark.dim").removeClass("dim");
                        //         }
                        if(_this.type2Form == 1){
                            backColor = increase_brightness(getHexBackgroundColor($(event.currentTarget).css("background-color")), 40);
                            // $("#leftPanelCC").css("border-color", $(event.currentTarget).css("background-color"));
                            closeIcon = "images/highlight"+itemNumber+"CloseIcon.png";
                        }
                        if (!$(event.currentTarget).hasClass("dim")) {
                        // if (addedMarks.length < _this.supportingText.length) {
                            if(_this.withAudio){
                                if(_this.supportingText[itemNumber - 1].audio != ""){
                                    $(event.currentTarget).attr("audioSource", _this.supportingText[itemNumber - 1].audio);
                                    if (globalAudioPlaying) 
                                    {
                                        stopAndHideAudio(event);
                                    }
                                    globalAudioIcon = $(event.currentTarget);
                                    globalAudioTemplate = "listening";
                                    globalAudioShowPlayer = true;
                                    activateAudio();
                                }
                            }

                            var li = document.createElement("li");
                            var desc = _this.supportingText[itemNumber - 1].desc;

                            if(desc.match(/<mark>/g) != null){
                                var desclength = desc.match(/<mark>/g).length;
                                for(var d=0;d<desclength;d++){
                                    desc = desc.replace("<mark>", "<mark class='highlight"+itemNumber+"-dim'>");
                                }
                            }
                            
                            li.innerHTML = desc;
                            if (_this.type2Form == 2){
                                $("#"+_this.containerID + "_supportingText").append(li);
                                /*if(currentSelector.selector){
                                    $("#" + currentSelector[0].id + "__this.supportingText").append(li);
                                }else{
                                    $("#" + currentSelector.id + "__this.supportingText").append(li);
                                }*/
                            }else{
                                question = desc;
                            }
                            // var page = _this.containerID.substring(0, _this.containerID.indexOf("_"));

                            if(_this.supportingText[itemNumber - 1].img != ""){
                                var leftImages = $("#"+pageName+" .leftImagesPassage");
                                var fig = document.createElement("figure");
                                fig.id = pageName+"figure"+itemNumber;
                                var img = document.createElement("img");
                                img.src = _this.supportingText[itemNumber - 1].img;
                                //img.className = "supportingImage";
                                //$("#"+_this.containerID+"_supportingImages").append(img);
                                fig.appendChild(img);
                                // fixed leftImages addition of images for swiper
                                leftImages.append(fig);

                                // $("#"+_this.containerID).parent().find(".leftImages")[0].appendChild(fig);
                                // var figureToShow = $("#"+selector[0]+" #figure"+_this.supportingText)
                                // $("#"+_this.containerID).parent().find("#figure"+_this.supportingText[itemNumber-1].img).show();
                                
                                // $("#"+_this.containerID).parent().find("#figure"+_this.supportingText[itemNumber-1].img).appendTo(leftImages).show();
                            }

                            // $(event.currentTarget).removeClass("highlight" + itemNumber);
                            $(event.currentTarget).addClass("highlight" + itemNumber + "-dim dim");

                            obj._addedMarks.push(itemNumber);

                            if (obj._addedMarks.length == _this.supportingText.length) {
                                if($("#" + _this.containerID + "_topic")[0] != undefined){
                                    $("#" + _this.containerID + "_topic")[0].innerHTML = '<img src="images/audio-icon.png" class="audioIcon audio-icon" audioSource="' + _this.paragraphs[topicNumber].audio + '" alt="" />' + _this.paragraphs[topicNumber].desc;
                                    if(_this.withAudio){
                                        $("#" + _this.containerID + "_topic .audioIcon").hammer().on("tap",playAudio);  
                                    }
                                }
                                if(_this.withAudio){
                                    var theAudio = $('audio');
                                    theAudio = theAudio.get(0);
                                }
                            }
                            // }
                        }
                    }
                    break;
            }
            if(showPanel){
                obj._showPanel(event, title, backColor, titleColor, audio, audioIcon, content, closeIcon, bottomIcon, question, hint, answer);
            }
        },
        _checkPopUPText: function (desc){
            var popUpType;
            var popUpTypeArr = ["comprehension", "understanding", "vocabulary", "thinkScience", "thinkAboutIt"];
            while(desc.indexOf("<mark ") != -1){
                var firstIndex = desc.indexOf("<mark ")+6;
                var lastIndex = firstIndex + desc.substring(firstIndex).indexOf(">");
                popUpType = desc.substring(firstIndex, lastIndex);
                if(popUpTypeArr.indexOf(popUpType) != -1){
                    if(desc.indexOf("<mark "+popUpType+">") != -1) {
                        desc = desc.replace("<mark "+popUpType+">", "<img src='images/"+popUpType+"Icon.png' alt='' class='leftIcon' target='"+popUpType+"Mark' /><mark_class='"+popUpType+"Mark popUpPosition_"+this._popUpPosition+"'>");
                        this._popUpPosition++;
                    }
                }else{
                    break;
                }
            }
            desc = desc.replace(/<mark_/g, "<mark ")

            return desc;
        },
        _checkComprehension: function(desc){
            if (desc.indexOf("<mark comprehension>") != -1) {
                desc = desc.replace("<mark comprehension>", "<img src='images/comprehensionIcon.png' alt='' class='leftIcon' target='comprehensionMark' /><mark class='comprehensionMark popUpPosition_"+this._popUpPosition+"'>");
                this._popUpPosition++;
            }
            if (desc.indexOf("<mark comprehension>") != -1) {
                checkComprehension(desc);
            }else{
                return desc;
            }
        },
        _checkUnderstanding: function(desc){
            if (desc.indexOf("<mark understanding>") != -1) {
                desc = desc.replace("<mark understanding>", "<img src='images/comprehensionIcon.png' alt='' class='leftIcon' target='comprehensionMark' /><mark class='comprehensionMark popUpPosition_"+this._popUpPosition+"'>");
                this._popUpPosition++;
            }
            if (desc.indexOf("<mark understanding>") != -1) {
                checkUnderstanding(desc);
            }else{
                return desc;
            }
        },
        _checkVocabulary: function(desc){
            if (desc.indexOf("<mark vocabulary>") != -1) {
                desc = desc.replace("<mark vocabulary>", "<img src='images/vocabularyIcon.png' alt='' class='leftIcon' target='vocabularyMark' /><mark class='vocabularyMark popUpPosition_"+this._popUpPosition+"'>");
                this._popUpPosition++;
            }
            if (desc.indexOf("<mark vocabulary>") != -1) {
                checkVocabulary(desc);
            }else{
                return desc;
            }
        },
        _checkThinkScience: function(desc){
            if (desc.indexOf("<mark thinkScience>") != -1) {
                desc = desc.replace("<mark thinkScience>", "<img src='images/thinkScienceIcon.png' alt='' class='leftIcon' target='thinkScienceMark' /><mark class='thinkScienceMark popUpPosition_"+this._popUpPosition+"'>");
                this._popUpPosition++;
            }
            if (desc.indexOf("<mark thinkScience>") != -1) {
                checkThinkScience(desc);
            }else{
                return desc;
            }
        },
        _checkThinkAboutIt: function(desc){
            if (desc.indexOf("<mark thinkAboutIt>") != -1) {
                desc = desc.replace("<mark thinkAboutIt>", "<img src='images/thinkIcon.png' alt='' class='leftIcon' target='thinkAboutItMark' /><mark class='thinkAboutItMark popUpPosition_"+this._popUpPosition+"'>");
                this._popUpPosition++;
            }
            if (desc.indexOf("<mark thinkAboutIt>") != -1) {
                checkThinkAboutIt(desc);
            }else{
                return desc;
            }
        },
        _removeGlossaryHighlights: function(event) {
            $("#" + id + " span").removeClass("glossaryMarkON");
            if (globalAudioPlaying) 
            {
                stopAndHideAudio();
            }
        },
        _removeMarkHighlights: function(event) {
            if (globalAudioPlaying) 
            {
                stopAndHideAudio();
            }
            //            for (var m = 1; m < 8; m++) {
            //$("mark").removeClass("highlight*");
            //     
            $("#" + id + " mark").css("background-color", "transparent");
            $("#" + id + " mark").removeClass(makeRemoveClassHandler(/^highlight/));
            
            /*if(currentSelector.selector){
                $("#" + currentSelector[0].id + " mark").css("background-color", "transparent");
                $("#" + currentSelector[0].id + " mark").removeClass(makeRemoveClassHandler(/^highlight/));
            }else{
                $("#" + currentSelector.id + " mark").css("background-color", "transparent");
                $("#" + currentSelector.id + " mark").removeClass(makeRemoveClassHandler(/^highlight/));
            }*/
        }
    }

    passageExcerpt.create = function(options) {
        return new passageExcerpt(options);
    }

    function playAudio(event) {
        if ($(event.currentTarget).hasClass("audioIcon")) {
            var obj;
            if(passages.length>1){
                obj = passages[currentPassage];
            }else{
                obj = psg;
            }
            if ((_this.type == "withPrompts") || (_this.type == "withPromptsCC")) {
                //removeGlossaryHighlights();
                obj._removeMarkHighlights();
            }
            // $("#leftPanel").hide();
            $(obj._leftPanel).hide();
            obj._removeGlossaryHighlights();
        }
        if (globalAudioPlaying) 
        {
            stopAndHideAudio(event);
        }
        globalAudioIcon = $(event.currentTarget);
        globalAudioTemplate = "listening";
        globalAudioShowPlayer = true;
        activateAudio();
    }

    function makeRemoveClassHandler(regex) {
        return function(index, classes) {
            return classes.split(/\s+/).filter(function(el) {
                return regex.test(el);
            }).join(' ');
        }
    }

    function closeLeftPanel(event) {
        var obj;
        if(passages.length>1){
            obj = passages[currentPassage];
        }else{
            obj = psg;
        }
        obj._removeGlossaryHighlights();
        if ((obj._type == "withPrompts") || (obj._type == "withPromptsCC")) {
            obj._removeMarkHighlights();
        }
        if (globalAudioPlaying) 
        {
            stopAndHideAudio();
        }
        // $("#leftPanelCC").hide();
        $(obj._leftPanel).hide();
        if (obj._type == "exploreType2" && obj._type2Form == 1) {
            for (var i = 1; i <=obj._supportingText.length; i++) {
                $("#"+_this.containerID +" mark.dim").removeClass("highlight"+i+"-dim");
            };
            $("#"+_this.containerID +" mark.dim").removeClass("dim");
        }
    }

    function increase_brightness(hex, percent) {
        // strip the leading # if it's there
        hex = hex.replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if (hex.length == 3) {
            hex = hex.replace(/(.)/g, '$1$1');
        }

        var r = parseInt(hex.substr(0, 2), 16), 
        g = parseInt(hex.substr(2, 2), 16), 
        b = parseInt(hex.substr(4, 2), 16);

        return '#' + 
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) + 
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) + 
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
    }

    function getHexBackgroundColor(color) {
        var rgb = color;
        if (!rgb) {
            return '#FFFFFF'; //default color
        }
        var hex_rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        if (hex_rgb) {
            return "#" + hex(hex_rgb[1]) + hex(hex_rgb[2]) + hex(hex_rgb[3]);
        } else {
            return rgb; //ie8 returns background-color in hex format then it will make compatible, you can improve it checking if format is in hexadecimal
        }
    }

    function init(){
        if(_this.tabs != null){
            if(_this.leftImages){
                var leftImages = document.createElement("div");
                leftImages.className = "leftImagesPassage";
                leftImages.id = pageName + "leftImages";

                for(var i=0; i<_this.leftImages.length;i++){
                    var fig=document.createElement("figure");

                    var hyperlink=document.createElement("a");
                    hyperlink.setAttribute("href", _this.leftImages[i].fullscreen);
                    hyperlink.setAttribute("data-index", i);
                    hyperlink.setAttribute("class", "img");

                    var thumb=document.createElement("img");
                    thumb.setAttribute("src", _this.leftImages[i].thumb);
                    thumb.setAttribute("alt", _this.leftImages[i].caption);

                    hyperlink.appendChild(thumb);
                    fig.appendChild(hyperlink);

                    if(_this.leftImages[i].caption != ""){
                        // _this.leftImages[i].caption = _this.leftImages[i].caption;
                        var figCaption = document.createElement("figCaption");
                        figCaption.innerHTML = _this.leftImages[i].caption;
                        fig.appendChild(figCaption);
                    }
                    leftImages.appendChild(fig);
                }
                _this.containerJS.appendChild(leftImages);
                //$(".leftImagesPassage a.img").photoSwipe();
                $("#" + _this.containerID + " .leftImagesPassage a.img").photoSwipe();
            }

            var readingTab = document.createElement("div");
            readingTab.id = _this.containerID+"_readingTab";
            readingTab.className = "readingTab";
            var ulTab  = document.createElement("ul");
            ulTab.className = "tabHeaders";

            var divTab = document.createElement("div");
            divTab.className = "ccTabContents";

            _this.containerJS.appendChild(readingTab);
            for (var u = 0; u < _this.tabs.length; u++) {
                var tabbedPassage = passageExcerpt.create({
                    parent : divTab,
                    type : _this.tabData[u].type,
                    id : "tab"+u,
                    leftImages     : _this.tabData[u].leftImages,
                    instruction    : _this.tabData[u].instruction,
                    instructionAudio : _this.tabData[u].instructionAudio,
                    withAudio          : _this.tabData[u].withAudio,
                    paragraphs     : _this.tabData[u].paragraphs,
                    popupText          : _this.tabData[u].popupText,
                    supportingText   : _this.tabData[u].supportingText,
                    glossary           : _this.tabData[u].glossary,
                    promptType     : _this.tabData[u].promptType,
                    tabs               : _this.tabData[u].tabs,
                    tabData            : _this.tabData[u].tabData,
                    popUpCheck     : _this.tabData[u].popUpCheck,
                    withImages     : _this.tabData[u].withImages,
                    type2Form          : _this.tabData[u].type2Form
                });
                passages.push(tabbedPassage);
                // divTab.appendChild(passageContainer);
                
                var tabTitle = document.createElement("li");
                tabTitle.className = "divtab";
                tabTitle.innerHTML = "<a href='#tab"+u+"'>"+_this.tabs[u]+"</a>";
                ulTab.appendChild(tabTitle);
                readingTab.appendChild(ulTab);
                readingTab.appendChild(divTab);
            }
            $("#"+_this.containerID+"_readingTab").easytabs({
                updateHash:false,
                animate:true,
                transitionIn:"slideDown"
            });
            $("#"+_this.containerID+"_readingTab").bind('easytabs:before', function(event, $clicked, $targetPanel, settings) {
                closeLeftPanel();
            });
            $("#"+_this.containerID+"_readingTab").bind('easytabs:after', function(event, $clicked, $targetPanel, settings) {
                currentPassage = $targetPanel.index();
            });
        }else{
            psg = passageExcerpt.create({
                id: _this.containerID+"_Excerpt",
                parent : _this.containerJS,
                type : _this.type,
                leftImages     : _this.leftImages,
                instruction    : _this.instruction,
                instructionAudio : _this.instructionAudio,
                withAudio          : _this.withAudio,
                paragraphs     : _this.paragraphs,
                popupText          : _this.popupText,
                supportingText   : _this.supportingText,
                glossary           : _this.glossary,
                promptType     : _this.promptType,
                tabs               : _this.tabs,
                tabData            : _this.tabData,
                popUpCheck     : _this.popUpCheck,
                withImages     : _this.withImages,
                type2Form          : _this.type2Form
            });
        }
        if (typeof MathJax !== 'undefined') 
            MathJax.Hub.Queue(["Typeset",MathJax.Hub],pageName);
    }

    init();
});