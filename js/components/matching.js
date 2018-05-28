/*
    Matching 2.9
    Match elements  components with feedback and multiple layouts, supports text, images, audio and video.

    Author: Ramzi Komati, Wissam Hobeika

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 09/01/2015
*/

const MatchingType = {
    TEXT   : 'data-type-text',
    IMAGE  : 'data-type-image',
    PICTURE: 'data-type-image',
    SOUND  : 'data-type-audio',
    AUDIO  : 'data-type-audio',
    VIDEO  : 'data-type-video'
};

const MatchingOrientation = {
    HORIZONTAL : 'horizontal',
    VERTICAL   : 'vertical'
};

// # This section should be removed once Feedback.js is implemented
const FeedbackType = {
    CORRECT: 0,
    WRONG: 1,
    TRY_AGAIN: 2,
    REVEAL_ANSWER: 3
};
// ^ End of section

var matching = function(selector, pageName, param)
{
    // Set to true if the document will be ready when the component is initiated.
    // This constant should be set to false when debuging the component.
    const DOCUMENT_WILL_BE_READY = true;

    // # These constants should be removed once Feedback.js is implemented
    const FEEDBACK__CorrectColor  = '#02A80B';
    const FEEDBACK__WrongColor    = '#D10000';
    /*const FEEDBACK__CheckAnswer   = 'Check Your Answers';
    const FEEDBACK__ResetAnswer   = 'Reset Your Answers';*/
    // ^ End of section

    const DATA_ITEM__Inset        = 0.5; // The inset between each matching-data-item (in percentage).
    const DATA_ITEM__AlphaStart   = 65;  // This is the unicode of the letter A.
    const DATA_ITEM__NumericStart = 1;   // The first number to start from.

    // jsPlumb configuration
    const PLUMB__AnchorOffset      = 20;
    const PLUMB__DefaultColor      = '#CCC';
    const PLUMB__DefaultMediaColor = '#FFF';

    var PLUMB__SourceOptions,
        PLUMB__TargetOptions;

    //var FEEDBACK__AnswersChecked = false;

    // Store object ID and endpoint
    var sourceDataItem = new Object(),
        targetDataItem = new Object(),
        connectionsHashTable = new Object();

    // Parameter variables
    var textDirection,
        orientation,
        sourceType,
        sourceRatio,
        sourceData,
        sourceMinWidth,
        sourceMinHeight,
        sourceMaxWidth,
        sourceMaxHeight,
        sourceStartAt,
        sourceEndAt,
        targetType,
        targetRatio,
        targetData,
        targetMinWidth,
        targetMinHeight,
        targetMaxWidth,
        targetMaxHeight,
        targetStartAt,
        targetEndAt,
        correctAnswers,
        numberOfAttempts,
        template,
        /*feedbackMode,
        wrongMessages,
        correctMessage,
        revealedMessage,
        submitCaption,
        resetCaption,*/
        mainQuestion,
        mainQuestionAudio,
        showHeader,
        textDirection,
        componentPageName,
        checkAnswersCallBack;

    // Other variables
    var _current_object = this,
        _current_selector = "#" + selector,
        _current_selector_id;

    //var $feedbackContainer,
    var $sourceDataItemContainer;

    var highlightColor = '#FFF';
        //counter_attempts = 0;

    _current_object.attempt = 0;

    // Initialize component
    var init = function(pageName, parameters)
    {
        if (parameters == undefined){
            var componentData = $.grep(globalArrComponentsData,function(n,k){
                return n.PageName == pageName && n.ComponentId == selector && n.ComponentType == "matching"
            })
            parameters = componentData[0].ComponentParameters;
        }

        // Apply default parameters
        $.fn.defaults = {
            direction: 'ltr',        // (String) Set the default text direction of the component. ('ltr' or 'rtl')

            orientation:                 // (ENUM MatchingOrientation) Set the orientation of the matching component.
                MatchingOrientation.HORIZONTAL,
            componentData:{
                    source:
                    {
                        type: MatchingType.TEXT, // (ENUM MatchingType) Set the matching type. (Text, Image, Audio or Video)
                        ratio: 0.5,              // (Decimal) Set the ratio of the source container (source.ratio + target.ratio should equal to 1)
                        data: new Array(),       // (Array of Strings | Array of Objects{name, value}) Add the data list (source.data.length should be equal o target.data.length)
                                                 //     Array of Strings contain the data of each item.
                                                 //     Array of Objects contain the header (name) and data (value) of each item.
         
                        minWidth : -1,           // (Integer) Set image minimum width. (set to -1 to disable resize restriction)
                        minHeight: -1,           // (Integer) Set image minimum height. (set to -1 to disable resize restriction)
                        maxWidth : -1,           // (Integer) Set image maximum width. (set to -1 to disable resize restriction)
                        maxHeight: -1,           // (Integer) Set image maximum height. (set to -1 to disable resize restriction)
                 
                        startAt: 0,              // (Integer) Start a video or audio at a specific duration in seconds.
                        endAt: -1                // (Integer) End a video or audio at after a specific duration in seconds. (set to -1 for maximum length)
                    },

                    target:
                    {
                        type: MatchingType.TEXT, // (ENUM MatchingType) Set the matching type. (Text, Image, Audio or Video)
                        ratio: 0.5,              // (Decimal) Set the ratio of the target container (source.ratio + target.ratio should equal to 1)
                        data: new Array(),       // (Array of Strings | Array of Objects{name, value}) Add the data list (source.data.length should be equal o target.data.length)
                                                 //     Array of Strings contain the data of each item.
                                                 //     Array of Objects contain the header (name) and data (value) of each item.

                        minWidth : -1,           // (Integer) Set image minimum width.  (set to -1 to disable resize restriction)
                        minHeight: -1,           // (Integer) Set image minimum height.
                        maxWidth : -1,           // (Integer) Set image maximum width.
                        maxHeight: -1,           // (Integer) Set image maximum height.
                    
                        startAt: 0,              // (Integer) Start a video or audio at a specific duration in seconds.
                        endAt: -1                // (Integer) End a video or audio at after a specific duration in seconds. (set to -1 for maximum length)
                    },

                correctAnswers:              // [2D Array of Integers] Set the correct answers depending on source.data and target.data
                [
                    new Array()
                ],
            },

            template:                    // (ENUM templateType) Set the template design of the component
                templateType.Intro,

            /*feedback:
            {
                mode:                    // (ENUM feedback_mode) Use feedback_mode enum to display the proper feedback to the user
                    feedback_mode.True,
            
                numberOfAttempts: 0,     // (Integer) The number of error allowed before revealing correct answers, 0 = infinity.

                attemptsMessages: null,     // (Array of String | String) Return a feedback message after each incorrect attempt, 
                                         //     Array of strings will return different feedback message on each incorrect attempt. 
                                         //     String will return the same feedback message on each incorrect attempt.
                                         //     Empty array, empty string or null will return no feedback message on incorrect attempts.
                
                correctMessage: null,    // (String) Return a feedback message on the correct attemp,
                                         //     Empty string or null will return no feedback message on the correct attempt.

                incorrectMessage: null,   // (String) Return a feedback message when the answers are revealed,
                                         //     Empty string or null will return no feedback message when revealing answers.

                checkAnswersText:           // (String) Change the feedback submit button caption.
                    'Check Your Answer',

                resetAnswersText: 'Reset',    // (String) Change the feedback reset button caption.
                revealAnswers: true
            },*/
            feedback        :   {
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
                chat:{
                    autoSlide: false,
                    autoSlideSpeed: 2000,
                }
            },
            mainQuestion: "",
            mainQuestionAudio   :   "",
            showHeader: true,        // (Boolean) If true, a header will be displayed on each item
            direction: 'LTR',    // (String) Assign the component text direction
            componentPageName: 'index',        // (String) The page name where the component resides
            checkAnswersCallBack: function(){},
        }

        var param           =   $.extend({}, $.fn.defaults, parameters);
    param.feedback      =   $.extend({}, $.fn.defaults.feedback, parameters.feedback);
    param.feedback.feedbackMessages = $.extend({}, $.fn.defaults.feedback.feedbackMessages, parameters.feedback.feedbackMessages);

        // Grab the correct parameters
        textDirection    = param.direction;
        mainQuestion    = param.mainQuestion;
        mainQuestionAudio = param.mainQuestionAudio;
        orientation      = param.orientation;
        sourceType       = param.componentData.source.type;
        sourceRatio      = param.componentData.source.ratio;
        sourceData       = param.componentData.source.data;
        sourceMinWidth   = param.componentData.source.minWidth;
        sourceMinHeight  = param.componentData.source.minHeight;
        sourceMaxWidth   = param.componentData.source.maxWidth;
        sourceMaxHeight  = param.componentData.source.maxHeight;
        sourceStartAt    = param.componentData.source.startAt;
        sourceEndAt      = param.componentData.source.endAt;
        targetType       = param.componentData.target.type;
        targetRatio      = param.componentData.target.ratio;
        targetData       = param.componentData.target.data;
        targetMinWidth   = param.componentData.target.minWidth;
        targetMinHeight  = param.componentData.target.minHeight;
        targetMaxWidth   = param.componentData.target.maxWidth;
        targetMaxHeight  = param.componentData.target.maxHeight;
        targetStartAt    = param.componentData.target.startAt;
        targetEndAt      = param.componentData.target.endAt;
        correctAnswers   = param.componentData.correctAnswers;
        template         = param.template;
        /*feedbackMode     = param.feedback.mode;
        numberOfAttempts = param.feedback.numberOfAttempts;
        wrongMessages    = param.feedback.attemptsMessages;
        correctMessage   = param.feedback.correctMessage;
        revealedMessage  = param.feedback.incorrectMessage;
        revealAnswers    = (param.feedback.revealAnswers == "false" || param.feedback.revealAnswers == false) ? false : true;
        submitCaption    = typeof(param.feedback.checkAnswersText) == 'undefined'? 'Check Your Answer' : param.feedback.checkAnswersText;
        resetCaption     = typeof(param.feedback.resetAnswersText) == 'undefined'? 'Reset Your Answer' : param.feedback.resetAnswersText;*/

        //Feedback
        feedbackType        =   param.feedback.feedbackType;
        feedbackButtons     =   param.feedback.buttons;
        numberOfAttempts    =   param.feedback.numberOfAttempts;
        feedbackMessages    =   param.feedback.feedbackMessages;
        feedbackAudios    =   param.feedback.feedbackAudios;
        revealAnswers       =   (param.feedback.revealAnswers == "false" || param.feedback.revealAnswers == false) ? false : true;
        chat                =   param.feedback.chat;
        attemptsAnswerLine  =   param.feedback.feedbackMessages.attemptsAnswerLine;

        showHeader       = param.showHeader;
        componentPageName         = param.componentPageName;
        checkAnswersCallBack = param.checkAnswersCallBack;


        //Used so the contentWrapper take the correct height in order for jsPlumb to draw the correct endpoints
        resizeDiv(componentPageName);

        if(DOCUMENT_WILL_BE_READY)
        {
            component_onReady();
        }
        else
        {
            $(document).ready(function()
            {
                component_onReady();
            });
        }

        function component_onReady() {
            // Get the template color
            var $temp_element = $('<div></div>')
                .addClass(template)
                .appendTo($(_current_selector));

            highlightColor = $temp_element.css('background-color');

            $temp_element.remove();


            $(_current_selector).addClass("matchingContainer_" + template);

            // Get the main container ID
            _current_selector_id = $(_current_selector)[0].id;

            if(feedbackButtons.length != 0){
                _current_object.feedbackComponent = new feedbackComponent(selector, _current_object, {
                    feedbackType: feedbackType,
                    buttons: feedbackButtons,
                    numberOfAttempts: numberOfAttempts,
                    feedbackMessages: feedbackMessages,
                    chat: chat,
                    direction: textDirection,
                    template: template,
                    componentPageName: componentPageName,
                    componentType: 'matching',
                    revealAnswers: revealAnswers,
                    feedbackAudios: feedbackAudios
                });
            }else{
                $container.addClass("noFeedback");
            }
            // Draw the component
            drawElements(_current_selector);
        }
    };

    function matchingPlayAudio(){
    matchingComponentAudio.play();
    matchingComponentAudio.removeEventListener('canplay', matchingPlayAudio);
    matchingComponentAudio.addEventListener('ended', matchingAudioEnd);
    }
        function matchingAudioEnd(){
        $(_current_selector + ' .globalAudioIcon').removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
        matchingComponentAudio.removeEventListener('ended', matchingAudioEnd);
    }

    // Draw elements and add event listeners
    var drawElements = function(selector)
    {
        var $this = $(selector);
        
        var PLUMB__DataItemCss;

        var $container,
            $freeze,
            $sourceContainer,
            $targetContainer,
            $sourceDataList,
            $targetDataList;
           // $btnCheckAnswer,
            //$btnResetAnswer;

        //var $feedback_container;

        // Draw the div that will block the user from interacting with the component
        $freeze = $('<div></div>')
            .addClass('matching-component-blocked')
            .appendTo($this);
            
        // Draw the container
        $container = $('<div></div>')
            .addClass('matching-component ' + orientation)
            .appendTo($this);
            var mainQuestionDiv;
            if(typeof(mainQuestion)!=undefined && mainQuestion != ""){
        $container.addClass('componentContentWrapper');
        mainQuestionDiv = $('<div>').addClass('componentInstructionalTextWrapper');
        var mainQuestionContainer = $('<div>').addClass('mainQuestionTextWrapper').html(mainQuestion).appendTo(mainQuestionDiv);
        if(typeof(mainQuestionAudio)!=undefined && mainQuestionAudio != ""){
            var audioImageWrapper = $('<div>').addClass('globalAudioIconContainer');
            var audioImage = $('<div>').addClass('globalAudioIcon globalAudioIconPlay').appendTo(audioImageWrapper);
            mainQuestionDiv.prepend(audioImageWrapper);
            matchingComponentAudio = $('<audio>').addClass('matchingComponentAudio').attr('src', mainQuestionAudio).appendTo($container);
            matchingComponentAudio.load();
            audioImage.hammer().off('tap').on('tap', function(){
                var audioIcon = $(this);
                matchingComponentAudio = $container.find('.matchingComponentAudio')[0];
                if(audioIcon.hasClass('globalAudioIconPlay')){
                    matchingComponentAudio.addEventListener('canplay', matchingPlayAudio());
                    audioIcon.removeClass('globalAudioIconPlay').addClass('globalAudioIconPause');
                }else{
                    matchingComponentAudio.pause();
                    audioIcon.removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
                }
            });
        }
        $this.prepend(mainQuestionDiv);
        resizeComponent(_current_selector_id);
    }

        switch(orientation)
        {
            case MatchingOrientation.HORIZONTAL:

                PLUMB__SourceOptions = {
                    //tolerance     : "touch",
                    anchor        : [0.5, 1, 0, 1, 0, PLUMB__AnchorOffset],
                    //anchor        : [0.5, 0.5, 0, 1, 0, 95],
                    maxConnections: 1,
                    isSource      : true,
                    isTarget      : true,
                    reattach      : true,
                    endpoint      : ["Dot", {radius: 10}],
                    connector     : "Straight",
                    connectorStyle: 
                    { 
                        strokeStyle: highlightColor,
                        lineWidth: 5
                    },
                    paintStyle:
                    { 
                        fillStyle: PLUMB__DefaultColor
                    }
                };

                PLUMB__TargetOptions = {
                    //tolerance     : "touch",
                    anchor        : [0.5, 0, 0, 1, 0, -PLUMB__AnchorOffset],
                    //anchor        : [0.5, 0, 1, 0, 0, -30],
                    maxConnections: 1,
                    isSource      : true,
                    isTarget      : true,
                    reattach      : true,
                    endpoint      : ["Dot", {radius: 10}],
                    connector     : "Straight",
                    connectorStyle:
                    { 
                        strokeStyle: highlightColor,
                        lineWidth: 5
                    },
                    paintStyle: 
                    { 
                        fillStyle: PLUMB__DefaultColor
                    }
                };

                PLUMB__DataItemCss = function(itemIndex, itemsLength)
                {
                    if(itemIndex == 0)
                    {
                        return {
                            /*'padding'      : '0',
                            'padding-right': (DATA_ITEM__Inset / 2) + '%',*/
                            /*'width'        : (Math.floor((100 / itemsLength - DATA_ITEM__Inset / 2) * 100) / 100) + '%'*/
                            'width'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                    else if(itemIndex == itemsLength - 1)
                    {
                        return {
                            /*'padding'     : '0',
                            'padding-left': (DATA_ITEM__Inset / 2) + '%',*/
                            /*'width'       : (Math.floor((100 / itemsLength - DATA_ITEM__Inset / 2) * 100) / 100) + '%'*/
                            'width'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                    else
                    {
                        return {
                            /*'padding': '0 ' + (DATA_ITEM__Inset / 2) + '%',*/
                            /*'width'  : (Math.floor((100 / itemsLength - DATA_ITEM__Inset) * 100) / 100) + '%'*/
                            'width'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                };

                break;

            case MatchingOrientation.VERTICAL:

                PLUMB__SourceOptions = {
                    tolerance     : "touch",
                    anchor        : [1, 0.5, 0, 1, PLUMB__AnchorOffset, 0],
                    maxConnections: 1,
                    isSource      : true,
                    isTarget      : false,
                    reattach      : true,
                    endpoint      : ["Dot", {radius: 10}],
                    connector     : "Straight",
                    connectorStyle: 
                    { 
                        strokeStyle: highlightColor, 
                        lineWidth: 5 
                    },
                    paintStyle: 
                    { 
                        fillStyle: PLUMB__DefaultColor
                    },
                    connectionsDetachable: false 
                };

                PLUMB__TargetOptions = {
                    tolerance     : "touch",
                    anchor        : [0, 0.5, 0, 1, -PLUMB__AnchorOffset, 0],
                    maxConnections: 1,
                    isSource      : false,
                    isTarget      : true,
                    reattach      : true,
                    endpoint      : ["Dot", {radius: 10}],
                    connector     : "Straight",
                    connectorStyle: 
                    {
                        strokeStyle: highlightColor,
                        lineWidth: 5
                    },
                    paintStyle:
                    {
                        fillStyle: PLUMB__DefaultColor
                    }
                };

                PLUMB__DataItemCss = function(itemIndex, itemsLength)
                {
                    if(itemIndex == 0)
                    {
                        return {
                            /*'padding'       : '0',
                            'padding-bottom': (DATA_ITEM__Inset / 2) + '%',*/
                            //'height'        : (Math.floor((100 / itemsLength - DATA_ITEM__Inset / 2) * 100) / 100) + '%',
                            //'height'        : (Math.floor((100 / itemsLength - DATA_ITEM__Inset) * 100) / 100) + '%',
                            'height'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                    else if(itemIndex == itemsLength - 1)
                    {
                        return {
                            /*'padding'     : '0',
                            'padding-top' : (DATA_ITEM__Inset / 2) + '%',*/
                            //'height'      : (Math.floor((100 / itemsLength - DATA_ITEM__Inset / 2) * 100) / 100) + '%',
                            //'height'        : (Math.floor((100 / itemsLength - DATA_ITEM__Inset) * 100) / 100) + '%',
                            'height'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                    else
                    {
                        return {
                            //'padding': (DATA_ITEM__Inset / 2) + '% 0',
                            //'height' : (Math.floor((100 / itemsLength - DATA_ITEM__Inset) * 100) / 100) + '%',
                            'height'        : (Math.floor((100 / itemsLength) * 100) / 100 - 1) + '%',
                        };
                    }
                };

                break;
        }

        // --- Draw the source data container ------------------------------------------------------

        $sourceContainer = $('<div></div>')
            .addClass('matching-source-container')
            .addClass(orientation)
            .addClass(sourceType)
            .appendTo($container);

        /*$sourceDataList = $('<div></div>')
            .addClass('matching-data-list')
            .addClass(sourceType)
            .appendTo($sourceContainer);*/

        for(var dataItem_index = 0, dataItem_index$length = sourceData.length; dataItem_index < dataItem_index$length; dataItem_index++)
        {
            var $dataItem = $('<div></div>')
                .attr('id', $this[0].id + '__matching-data-item-' + dataItem_index)
                .attr("data-index",dataItem_index)
                .addClass('matching-data-item source-matching-data-item')
                .css(PLUMB__DataItemCss(dataItem_index, dataItem_index$length)).css('float', 'left');

            if(orientation == MatchingOrientation.VERTICAL)
            {
                $dataItem.css('width', sourceRatio * 80 + '%');
            }

            sourceDataItem[$this[0].id + '__matching-data-item-' + dataItem_index] = 
            {
                //selector: $dataItem.appendTo($sourceDataList),
                selector: $dataItem.appendTo($sourceContainer),
                endpoint: null
            };

            $sourceDataItemContainer = $('<div></div>')
                .addClass('matching-data-container')
                .addClass('not-selected')
                .addClass('border-' + template)
                .attr('data-index', dataItem_index)
                .appendTo(sourceDataItem[$this[0].id + '__matching-data-item-' + dataItem_index].selector);

            // Draw item header
            if(typeof sourceData[dataItem_index].name === 'undefined')
            {
                if(showHeader)
                {
                    $('<div>' + String.fromCharCode(DATA_ITEM__AlphaStart + dataItem_index) + '</div>')
                        .addClass('matching-item-header')
                        .addClass(template)
                        .appendTo($sourceDataItemContainer);
                    $sourceDataItemContainer.addClass('withHeader');
                }
            }
            else if(sourceData[dataItem_index].name != '')
            {
                $('<div>' + sourceData[dataItem_index].name + '</div>')
                    .addClass('matching-item-header')
                    .addClass(template)
                    .appendTo($sourceDataItemContainer);
                $sourceDataItemContainer.addClass('withHeader');
            }

            // Draw item content
            var $content;
            if(typeof sourceData[dataItem_index].value === 'undefined')
            {
                switch(sourceType)
                {
                    case MatchingType.TEXT:

                        // Draw the text items
                        $content = $('<div>' + sourceData[dataItem_index] + '</div>')
                            .addClass('matching-item-content')
                            .appendTo($sourceDataItemContainer);
                        break;

                    case MatchingType.IMAGE:

                        // Draw the image items
                        $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .appendTo($sourceDataItemContainer);

                        var $img = $('<img>')
                            .attr('src', sourceData[dataItem_index]);

                        $sourceDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        // if(sourceMinWidth != -1)  $img.css('min-width', sourceMinWidth + 'px');
                        // if(sourceMinHeight != -1) $img.css('min-height', sourceMinHeight + 'px');
                        // if(sourceMaxWidth != -1)  $img.css('max-width', sourceMaxWidth + 'px');
                        // if(sourceMaxHeight != -1) $img.css('max-height', sourceMaxHeight + 'px');
                        $img.css('max-width', $img.width);
                        $img.css('max-height', $img.height);

                        $img.appendTo($content);
                        break;

                    case MatchingType.AUDIO:

                        // Make sure that jsAudio is loaded
                        if(typeof jsAudio === 'undefined')
                        {
                            throw new Error('Can\'t run matching.js: Audio.js is not imported.');
                        }
                        
                        // Draw the audio items
                        $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .css('display', 'table')
                            .appendTo($sourceDataItemContainer);

                        var $audioContainer = $('<div></div>')
                            .addClass('matching-audio-container')
                            .appendTo($content);

                        $sourceDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        $('<div></div>')
                            .attr('id', 'audio-' + dataItem_index)
                            .addClass('matching-audio-icon')
                            .appendTo($audioContainer);
                      
                        new audio(sourceData[dataItem_index], '.matching-component #audio-' + dataItem_index, false);
                        
                        break;

                    case MatchingType.VIDEO:

                        /* Not Applicable Yet */
                        throw new Error('Video is not supported yet!');
                        break;
                }
            }
            else
            {
                switch(sourceType)
                {
                    case MatchingType.TEXT:

                        // Draw the text items
                        $content = $('<div>' + sourceData[dataItem_index].value + '</div>')
                            .addClass('matching-item-content')
                            .appendTo($sourceDataItemContainer);
                        break;

                    case MatchingType.IMAGE:

                        // Draw the image items
                        $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .appendTo($sourceDataItemContainer);

                        var $img = $('<img>')
                            .attr('src', sourceData[dataItem_index].value);

                        $sourceDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        // if(sourceMinWidth != -1)  $img.css('min-width', sourceMinWidth + 'px');
                        // if(sourceMinHeight != -1) $img.css('min-height', sourceMinHeight + 'px');
                        // if(sourceMaxWidth != -1)  $img.css('max-width', sourceMaxWidth + 'px');
                        // if(sourceMaxHeight != -1) $img.css('max-height', sourceMaxHeight + 'px');
                        $img.css('max-width', $img.width);
                        $img.css('max-height', $img.height);

                        $img.appendTo($content);
                        break;

                    case MatchingType.AUDIO:

                        // Make sure that jsAudio is loaded
                        if(typeof jsAudio === 'undefined')
                        {
                            throw new Error('Can\'t run matching.js: Audio.js is not imported.');
                        }

                        // Draw the audio items
                        $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .css('display', 'table')
                            .appendTo($sourceDataItemContainer);

                        var $audioContainer = $('<div></div>')
                            .addClass('matching-audio-container')
                            .appendTo($content);

                        $sourceDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        $('<div></div>')
                            .attr('id', 'audio-' + dataItem_index)
                            .addClass('matching-audio-icon')
                            .appendTo($audioContainer);
                      
                        new audio(sourceData[dataItem_index].value, '.matching-component #audio-' + dataItem_index, false);
                        
                        break;

                    case MatchingType.VIDEO:

                        /* Not Applicable Yet */
                        throw new Error('Video is not supported yet!');
                        break;
                }
            }
            // Calculate max height
            /*if (sourceDataItemContainer_ < $itemContent.width())
            {
                sourceDataItemContainer_width =  $itemContent.width();
            }*/

            // Assign an endpoint for each matching-data-item    
            //sourceDataItem[$this[0].id + '__matching-data-item-' + dataItem_index].endpoint = jsPlumb.addEndpoint($('#' + $this[0].id + '__matching-data-item-' + dataItem_index + " .matching-data-container")[0], PLUMB__SourceOptions);
            sourceDataItem[$this[0].id + '__matching-data-item-' + dataItem_index].endpoint = jsPlumb.addEndpoint($this[0].id + '__matching-data-item-' + dataItem_index, PLUMB__SourceOptions);
        }

        // --- Draw the target data container ------------------------------------------------------

        $targetContainer = $('<div></div>')
            .addClass('matching-target-container')
            .addClass(orientation)
            .addClass(targetType)
            .appendTo($container);

        /*$targetDataList = $('<div></div>')
            .addClass('matching-data-list')
            .addClass(targetType)
            .appendTo($targetContainer);*/

        for(var dataItem_index = 0, dataItem_index$length = targetData.length; dataItem_index < dataItem_index$length; dataItem_index++)
        {
            var $dataItem = $('<div></div>')
                .attr('id', $this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString())
                .attr("data-index",dataItem_index$length + dataItem_index)
                .addClass('matching-data-item target-matching-data-item')
                .css(PLUMB__DataItemCss(dataItem_index, dataItem_index$length));
                //.css(PLUMB__DataItemCss(dataItem_index, dataItem_index$length)).css('float', 'left').css('position', 'relative').css('top', '20%');

            if(orientation == MatchingOrientation.VERTICAL)
            {
                $dataItem.css('width', targetRatio * 80 + '%');
            }

            targetDataItem[$this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString()] = 
            {
                //selector: $dataItem.appendTo($targetDataList),
                selector: $dataItem.appendTo($targetContainer),
                endpoint: null
            };

            var $targetDataItemContainer = $('<div></div>')
                .addClass('matching-data-container')
                .addClass('not-selected')
                .addClass('border-' + template)
                .attr('data-index', dataItem_index)
                .appendTo(targetDataItem[$this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString()].selector);

            if(typeof targetData[dataItem_index].name === 'undefined')
            {
                if(showHeader)
                {
                    $('<div>' + (DATA_ITEM__NumericStart + dataItem_index) + '</div>')
                        .addClass('matching-item-header')
                        .addClass(template)
                        .appendTo($targetDataItemContainer);
                    $targetDataItemContainer.addClass('withHeader');
                }
            }
            else if(targetData[dataItem_index].name != '')
            {
                $('<div>' + targetData[dataItem_index].name + '</div>')
                    .addClass('matching-item-header')
                    .addClass(template)
                    .appendTo($targetDataItemContainer);
                $targetDataItemContainer.addClass('withHeader');
            }

            if(typeof targetData[dataItem_index].value === 'undefined')
            {
                switch(targetType)
                {
                    case MatchingType.TEXT:

                        // Draw the text items
                        $('<div>' + targetData[dataItem_index] + '</div>')
                            .addClass('matching-item-content')
                            .appendTo($targetDataItemContainer);
                        break;

                    case MatchingType.IMAGE:

                        // Draw the image items
                        var $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .appendTo($targetDataItemContainer);

                        var $img = $('<img>')
                            .attr('src', targetData[dataItem_index]);

                        $targetDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        // if(targetMinWidth != -1)  $img.css('min-width', targetMinWidth + 'px');
                        // if(targetMinHeight != -1) $img.css('min-height', targetMinHeight + 'px');
                        // if(targetMaxWidth != -1)  $img.css('max-width', targetMaxWidth + 'px');
                        // if(targetMaxHeight != -1) $img.css('max-height', targetMaxHeight + 'px');
                        $img.css('max-width', $img.width);
                        $img.css('max-height', $img.height);

                        $img.appendTo($content);
                        break;

                    case MatchingType.AUDIO:

                        // Make sure that jsAudio is loaded
                        if(typeof jsAudio === 'undefined')
                        {
                            throw new Error('Can\'t run matching.js: Audio.js is not imported.');
                        }

                        // Draw the audio items
                        var $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .css('display', 'table')
                            .appendTo($targetDataItemContainer);

                        var $audioContainer = $('<div></div>')
                            .addClass('matching-audio-container')
                            .appendTo($content);

                        $targetDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        $('<div></div>')
                            .attr('id', 'audio-' + dataItem_index)
                            .addClass('matching-audio-icon')
                            .appendTo($audioContainer);
                      
                        var audio = new audio(targetData[dataItem_index], '.matching-component #audio-' + dataItem_index, false);
                        audio.hide();
                        
                        break;

                    case MatchingType.VIDEO:

                        /* Not Applicable Yet */
                        throw new Error('Video is not supported yet!');
                        break;
                }
            }
            else
            {
                switch(targetType)
                {
                    case MatchingType.TEXT:

                        // Draw the text items
                        $('<div>' + targetData[dataItem_index].value + '</div>')
                            .addClass('matching-item-content')
                            .appendTo($targetDataItemContainer);
                        break;

                    case MatchingType.IMAGE:

                        // Draw the image items
                        var $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .appendTo($targetDataItemContainer);

                        var $img = $('<img>')
                            .attr('src', targetData[dataItem_index].value);

                        $targetDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        // if(targetMinWidth != -1)  $img.css('min-width', targetMinWidth + 'px');
                        // if(targetMinHeight != -1) $img.css('min-height', targetMinHeight + 'px');
                        // if(targetMaxWidth != -1)  $img.css('max-width', targetMaxWidth + 'px');
                        // if(targetMaxHeight != -1) $img.css('max-height', targetMaxHeight + 'px');

                        $img.css('max-width', $img.width);
                        $img.css('max-height', $img.height);

                        $img.appendTo($content);
                        break;

                    case MatchingType.AUDIO:

                        // Make sure that jsAudio is loaded
                        if(typeof jsAudio === 'undefined')
                        {
                            throw new Error('Can\'t run matching.js: Audio.js is not imported.');
                        }

                        // Draw the audio items
                        var $content = $('<div></div>')
                            .addClass('matching-item-content')
                            .css('display', 'table')
                            .appendTo($targetDataItemContainer);

                        var $audioContainer = $('<div></div>')
                            .addClass('matching-audio-container')
                            .appendTo($content);

                        $targetDataItemContainer
                            .css('background', 'none')
                            .css('background-color', PLUMB__DefaultMediaColor);

                        $('<div></div>')
                            .attr('id', 'audio-' + dataItem_index)
                            .addClass('matching-audio-icon')
                            .appendTo($audioContainer);
                      
                        var audio = new audio(targetData[dataItem_index].value, '.matching-component #audio-' + dataItem_index, false);
                        audio.hide();
                        
                        break;

                    case MatchingType.VIDEO:

                        /* Not Applicable Yet */
                        throw new Error('Video is not supported yet!');
                        break;
                }
            }

            // Assign an endpoint for each matching-data-item
            //targetDataItem[$this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString()].endpoint = jsPlumb.addEndpoint($('#' + $this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString() + " .matching-data-container")[0], PLUMB__TargetOptions);
            targetDataItem[$this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString()].endpoint = jsPlumb.addEndpoint($this[0].id + '__matching-data-item-' + (dataItem_index$length + dataItem_index).toString(), PLUMB__TargetOptions);
        }

        // --- Add Events to data items ------------------------------------------------------------

        var itemSelected = null,
            previousItemSelected = null;

        // Event listener to source items
        //$('#' + $this[0].id + ' .matching-component .matching-source-container > .matching-data-list > .matching-data-item').hammer().on('tap', function()
        $('#' + $this[0].id + ' .matching-component .matching-source-container > .matching-data-item').hammer().on('tap', function()
        {
            var $_this = $(this);
            var connections = jsPlumb.getConnections($this[0].id);
            
            // Toggle the items
            //$('#' + $this[0].id + ' .matching-component .matching-data-list > .matching-data-item > .matching-data-container')
            $('#' + $this[0].id + ' .matching-component .matching-data-item > .matching-data-container')
                .addClass('not-selected')
                .removeClass('selected');

            $_this.children()
                .addClass('selected')
                .removeClass('not-selected');

            // If a connection has already been created, remove that connection
            $.each(connections, function(index, connection)
            {
                var currentEndpoint = sourceDataItem[$_this[0].id].endpoint.id;
                if(connection.endpoints[0].id == currentEndpoint || connection.endpoints[1].id == currentEndpoint)
                {
                    jsPlumb.detach(connection);

                    connection.endpoints[0].setPaintStyle({fillStyle: PLUMB__DefaultColor});
                    connection.endpoints[1].setPaintStyle({fillStyle: PLUMB__DefaultColor});

                    $('#' + $_this[0].id + ' > .matching-data-container')
                        .removeClass('correct')
                        .removeClass('wrong')
                        .removeClass('matched');

                    $('#' + connectionsHashTable[$_this[0].id] + ' > .matching-data-container')
                        .removeClass('correct')
                        .removeClass('wrong')
                        .removeClass('matched');

                    delete connectionsHashTable[connectionsHashTable[$_this[0].id]];
                    delete connectionsHashTable[$_this[0].id];
                }
            });

            // No item has been previously selected
            if(itemSelected === null)
            {
                itemSelected = $_this[0].id;
                sourceDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});
            }

            // The item selected is the item previously selected
            else if(itemSelected == $_this[0].id)
            {
                sourceDataItem[itemSelected].endpoint.setPaintStyle({fillStyle: PLUMB__DefaultColor});
                itemSelected = null;

                // Unselect the item
                $_this.children()
                    .removeClass('selected')
                    .addClass('not-selected');
            }
            else if(typeof targetDataItem[itemSelected] === 'undefined')
            {
                itemSelected = $_this[0].id;
                sourceDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});
            }
            else if(typeof sourceDataItem[$_this[0].id] === 'undefined')
            {
                itemSelected = null;
            }
            else
            {
                sourceDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});

                jsPlumb.connect({ 
                    source: sourceDataItem[$_this[0].id].endpoint, 
                    target: targetDataItem[itemSelected].endpoint,
                    scope: $this[0].id
                });

                $('#' + itemSelected + ' > .matching-data-container').addClass('matched');
                $('#' + $_this[0].id + ' > .matching-data-container').addClass('matched');

                connectionsHashTable[itemSelected] = $_this[0].id;
                connectionsHashTable[$_this[0].id] = itemSelected;

                itemSelected = null;
                previousItemSelected = null;
            }

            // Reset item to original state if selected
            if($('#' + itemSelected + ' > .matching-data-container').hasClass('correct') || $('#' + itemSelected + ' > .matching-data-container').hasClass('wrong'))
            {
                $('#' + $_this[0].id + ' > .matching-data-container')
                    .removeClass('correct')
                    .removeClass('wrong');

                $('#' + connectionsHashTable[$_this[0].id] + ' > .matching-data-container')
                    .removeClass('correct')
                    .removeClass('wrong');
            }

            if(previousItemSelected !== null)
            {
                sourceDataItem[previousItemSelected].endpoint.setPaintStyle({fillStyle: PLUMB__DefaultColor});
            }

            previousItemSelected = itemSelected;

            //FEEDBACK__AnswersChecked = false;
        });

        // Event listener to target items
        //$('#' + $this[0].id + ' .matching-component .matching-target-container > .matching-data-list > .matching-data-item').hammer().on('tap', function()
        $('#' + $this[0].id + ' .matching-component .matching-target-container > .matching-data-item').hammer().on('tap', function()
        {
            var $_this = $(this);
            var connections = jsPlumb.getConnections($this[0].id);
            
            // Toggle the items
            //$('#' + $this[0].id + ' .matching-component .matching-data-list > .matching-data-item > .matching-data-container')
            $('#' + $this[0].id + ' .matching-component .matching-data-item > .matching-data-container')
                .addClass('not-selected')
                .removeClass('selected');

            $_this.children().addClass('selected').removeClass('not-selected');

            // If a connection has already been created, remove that connection
            $.each(connections, function(index, connection)
            {
                var currentEndpoint = targetDataItem[$_this[0].id].endpoint.id;
                if(connection.endpoints[0].id == currentEndpoint || connection.endpoints[1].id == currentEndpoint)
                {
                    jsPlumb.detach(connection);
                    connection.endpoints[0].setPaintStyle({fillStyle: PLUMB__DefaultColor});
                    connection.endpoints[1].setPaintStyle({fillStyle: PLUMB__DefaultColor});

                    $('#' + $_this[0].id + ' > .matching-data-container')
                        .removeClass('correct')
                        .removeClass('wrong')
                        .removeClass('matched');

                    $('#' + connectionsHashTable[$_this[0].id] + ' > .matching-data-container')
                        .removeClass('correct')
                        .removeClass('wrong')
                        .removeClass('matched');

                    delete connectionsHashTable[connectionsHashTable[$_this[0].id]];
                    delete connectionsHashTable[$_this[0].id];
                }
            });

            // No item has been previously selected
            if(itemSelected === null)
            {
                itemSelected = $_this[0].id;
                targetDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});
            }

            // The item selected is the item previously selected
            else if(itemSelected == $_this[0].id)
            {
                targetDataItem[itemSelected].endpoint.setPaintStyle({fillStyle: PLUMB__DefaultColor});
                itemSelected = null;
                
                // Unselect the item
                $_this.children()
                    .removeClass('selected')
                    .addClass('not-selected');
            }

            //
            else if(typeof sourceDataItem[itemSelected] === 'undefined')
            {
                itemSelected = $_this[0].id;
                targetDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});
            }

            //
            else if(typeof targetDataItem[$_this[0].id] === 'undefined')
            {
                itemSelected = null;
            }

            // Establish a connection
            else
            {
                targetDataItem[$_this[0].id].endpoint.setPaintStyle({fillStyle: highlightColor});

                jsPlumb.connect({
                    source: sourceDataItem[itemSelected].endpoint, 
                    target: targetDataItem[$_this[0].id].endpoint,
                    scope: $this[0].id
                });

                $('#' + itemSelected + ' > .matching-data-container').addClass('matched');
                $('#' + $_this[0].id + ' > .matching-data-container').addClass('matched');

                connectionsHashTable[itemSelected] = $_this[0].id;
                connectionsHashTable[$_this[0].id] = itemSelected;

                itemSelected = null;
                previousItemSelected = null;
            }

            // Reset item to original state if selected
            if($('#' + itemSelected + ' > .matching-data-container').hasClass('correct') || $('#' + itemSelected + ' > .matching-data-container').hasClass('wrong'))
            {
                $('#' + $_this[0].id + ' > .matching-data-container')
                    .removeClass('correct')
                    .removeClass('wrong');

                $('#' + connectionsHashTable[$_this[0].id] + ' > .matching-data-container')
                    .removeClass('correct')
                    .removeClass('wrong');
            }

            if(previousItemSelected !== null)
            {
                targetDataItem[previousItemSelected].endpoint.setPaintStyle({fillStyle: PLUMB__DefaultColor});
            }

            previousItemSelected = itemSelected;

            //FEEDBACK__AnswersChecked = false;
        });

        // --- Add Feedback ------------------------------------------------------------------------
        /*if(feedbackMode != feedback_mode.False)
        {
            $feedbackContainer = $('<div></div>')    
                .addClass('feedbackContainer')
                .appendTo($this);
        }

        displayFeedback();*/

        // --- Repaint jsPlumbs --------------------------------------------------------------------
        // For some unknown reason, the jsPlumb's endpoints are misplaced when the div contain an
        // image. It seems that images are loaded after the document is ready...
        /*setTimeout(function()
        {
            jsPlumb.repaintEverything();
        }, 100);
        setInterval(function()
        {
            jsPlumb.repaintEverything();
        }, 1000);*/
    };

    // Display the proper feedback interactions
   /*var displayFeedback = function()
    {
        $feedbackContainer.empty();

        switch(feedbackMode)
        {
            // Display check your answer 
            case feedback_mode.CheckOnly:

                $btnCheckAnswer = $('<button>')
                    .attr('id', 'matching-check-answer')
                    .addClass('btn-check-answer checkBtn checkBtn_' + template)
                    .text(submitCaption) 
                    .appendTo($feedbackContainer);

                $('#' + _current_selector_id + ' #matching-check-answer').hammer().on('tap', _current_object.checkAnswers);

                break;

            // Display reset your answer
            case feedback_mode.ResetOnly:
            case feedback_mode.ResetOnlyWithConfirmation:

                $btnResetAnswer = $('<button>')
                    .attr('id', 'matching-reset-answer')
                    .addClass('btn-reset-answer feedbackReloadButton resetBtn_' + template)
                    .text(resetCaption) 
                    .appendTo($feedbackContainer);

                $('#' + _current_selector_id + ' #matching-reset-answer').hammer().on('tap', _current_object.resetAnswers);

                break;

            // Display both check & reset your answers
            case feedback_mode.True:
            case feedback_mode.TrueWithConfirmation:

                $btnCheckAnswer = $('<button>')
                    .attr('id', 'matching-check-answer')
                    .addClass('btn-check-answer checkBtn checkBtn_' + template)
                    .text(submitCaption)
                    .appendTo($feedbackContainer);

                $btnResetAnswer = $('<button>')
                    .attr('id', 'matching-reset-answer')
                    .addClass('btn-reset-answer feedbackReloadButton resetBtn_' + template)
                    .text(resetCaption) 
                    .appendTo($feedbackContainer);

                $('#' + _current_selector_id + ' #matching-check-answer').hammer().on('tap', _current_object.checkAnswers);
                $('#' + _current_selector_id + ' #matching-reset-answer').hammer().on('tap', _current_object.resetAnswers);

                break;
        }
    };*/

    // Display the feedback message box
    /*var displayFeedbackMessage = function(msg, feedbackType)
    {                                                
        if((correctMessage != '' && correctMessage != "" && correctMessage != null && typeof(correctMessage)!='undefined') && (revealedMessage != '' && revealedMessage != "" && revealedMessage != null && typeof(revealedMessage)!='undefined')){
            $feedbackContainer.empty()

            var $feedbackButton = $('<div></div>');

            switch(feedbackType)
            {
                case FeedbackType.CORRECT:

                    $feedbackButton.addClass('feebackCorrectIcon');

                    var $feedbackMessageContainer = $('<div></div>')
                        .addClass('correctFeedbackBanner')
                        .appendTo($feedbackContainer);
                    
                    break;

                case FeedbackType.TRY_AGAIN:

                    $feedbackButton.addClass('feebackIncorrectIcon');

                    var $feedbackMessageContainer = $('<div></div>')
                        .addClass('incorrectFeedbackBanner')
                        .appendTo($feedbackContainer);

                    if (numberOfAttempts > 1){
                        var $reloadButton = $('<div></div>')
                        .addClass('feedbackReloadButton')
                        .appendTo($feedbackMessageContainer);

                        $reloadButton.hammer().on('tap', function()
                        {
                            _current_object.unblock();
                            displayFeedback();
                        });    
                    }

                    break;

                case FeedbackType.WRONG:
                case FeedbackType.REVEAL_ANSWER:

                    $feedbackButton.addClass('feebackIncorrectIcon');

                    var $feedbackMessageContainer = $('<div></div>')
                        .addClass('incorrectFeedbackBanner')
                        .appendTo($feedbackContainer);
                    break;
            }

            $feedbackButton.appendTo($feedbackMessageContainer);

            $('<p>' + msg + '</p>')
                .addClass('feedback-message')
                .appendTo($feedbackMessageContainer);
            }else{
                _current_object.unblock();
            }
    };*/

    // Repaint the component...
    this.repaint = function()
    {
        jsPlumb.repaintEverything();
    };

    // Check and highlight the correct and wrong answers...
    this.checkAnswers = function()
    {
        var correctConnections = new Object(),
            atLeastOneWrongAnswer = true,
            correctAnswersCount = 0,
            allCorrect = false;

        // Block the component when displaying feedback
        //_current_object.block();

        // Detect and mark all the correct answers
        /*for(var i = 0, correctAnswers$length = correctAnswers.length; i < correctAnswers$length; i++)
        {
            var connections;
            try
            {
                connections = jsPlumb.getConnections({
                    source: $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0])[0].id, 
                    target: $('#' + _current_selector_id + '__matching-data-item-' + (correctAnswers[i][1] + correctAnswers$length))[0].id, 
                    scope : _current_selector_id
                });

                if(typeof connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] !== 'undefined')
                {
                    if(connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] == _current_selector_id + '__matching-data-item-' + (correctAnswers[i][1] + correctAnswers$length))
                    {
                        $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ' .matching-data-container').addClass('correct');
                        $('#' + connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] + ' .matching-data-container').addClass('correct');
                    }
                    else
                    {
                        $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ' .matching-data-container').addClass('wrong');
                        $('#' + connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] + ' .matching-data-container').addClass('wrong')
                    }
                }
            }
            catch(e)
            {
                throw new Error('(matching.js): Invalid Parameter, correctAnswers are not defined properly.')
            }

            if(connections.length == 0)
            {
                atLeastOneWrongAnswer = true;
                correctConnections[connections[0].id] = connections[0];

                connections[0].setPaintStyle({strokeStyle: FEEDBACK__WrongColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                connections[0].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                connections[0].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
            }
            else
            {
                correctConnections[connections[0].id] = connections[0];

                connections[0].setPaintStyle({strokeStyle: FEEDBACK__CorrectColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                connections[0].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                connections[0].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
            }
        }*/
        var connections = jsPlumb.getConnections(_current_selector_id);
        for(var i = 0, connections$length = connections.length; i < connections$length; i++)
        {
            var validConnection;
            //var sourceId = $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ".source-matching-data-item").attr("id");
            //var targetId = $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][1] + ".target-matching-data-item").attr("id");
            var sourceId = document.getElementById(connections[i].endpoints[0].elementId);
            var targetId = document.getElementById(connections[i].endpoints[1].elementId);
            var sourceIndex = sourceId.getAttribute("data-index");
            var targetIndex = targetId.getAttribute("data-index");
            try
            {
               /* validConnection = jsPlumb.getConnections({
                    source: (sourceId == undefined) ? "noId" : sourceId, 
                    target: (targetId == undefined) ? "noId" : targetId, 
                    scope : _current_selector_id
                });

                if (validConnection.length == 0){
                    sourceId = $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][1] + ".source-matching-data-item").attr("id");
                    targetId = $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ".target-matching-data-item").attr("id");
                    validConnection = jsPlumb.getConnections({
                        source: (sourceId == undefined) ? "noId" : sourceId, 
                        target: (targetId == undefined) ? "noId" : targetId, 
                        scope : _current_selector_id
                    });                    
                }*/

                var validConnection = $.grep(correctAnswers,function(item,index){
                    return (sourceIndex == item[0] || sourceIndex == item[1]) && (targetIndex == item[0] || targetIndex == item[1])
                });

                if(validConnection.length == 0){
                    atLeastOneWrongAnswer = true;
                    connections[i].setPaintStyle({strokeStyle: FEEDBACK__WrongColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                    connections[i].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                    connections[i].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                    $('#' + _current_selector_id + ' #' + connections[i].endpoints[0].elementId + ' .matching-data-container').addClass('wrong');
                    $('#' + _current_selector_id + ' #' + connections[i].endpoints[1].elementId + ' .matching-data-container').addClass('wrong');
                }else{
                    connections[i].setPaintStyle({strokeStyle: FEEDBACK__CorrectColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                    connections[i].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                    connections[i].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                    $('#' + _current_selector_id + ' #' + connections[i].endpoints[0].elementId + ' .matching-data-container').addClass('correct');
                    $('#' + _current_selector_id + ' #' + connections[i].endpoints[1].elementId + ' .matching-data-container').addClass('correct');
                    correctAnswersCount++;
                }

                /*if(typeof connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] !== 'undefined')
                {
                    if(connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] == _current_selector_id + '__matching-data-item-' + (correctAnswers[i][1] + connections$length))
                    {
                        $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ' .matching-data-container').addClass('correct');
                        $('#' + connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] + ' .matching-data-container').addClass('correct');
                    }
                    else
                    {
                        $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ' .matching-data-container').addClass('wrong');
                        $('#' + connectionsHashTable[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]] + ' .matching-data-container').addClass('wrong')
                    }
                }*/
            }
            catch(e)
            {
                throw new Error('(matching.js): Invalid Parameter, correctAnswers are not defined properly.')
            }

           /* if(connections.length == 0)
            {
                atLeastOneWrongAnswer = true;
                correctConnections[connections[0].id] = connections[0];

                connections[0].setPaintStyle({strokeStyle: FEEDBACK__WrongColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                connections[0].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                connections[0].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
            }
            else
            {
                correctConnections[connections[0].id] = connections[0];

                connections[0].setPaintStyle({strokeStyle: FEEDBACK__CorrectColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                connections[0].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                connections[0].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
            }*/
        }

        // Check error attemtps
        if(atLeastOneWrongAnswer)
        {
            /*if(typeof wrongMessages === 'string')
            {
                displayFeedbackMessage(wrongMessages, FeedbackType.WRONG);
            }*/

           /*if(numberOfAttempts > 0) // If numberOfAttempts = 0 than no restriction is applicable on checkAnswers() event 
            {
                counter_attempts++;
                if(counter_attempts < numberOfAttempts || numberOfAttempts == 1)
                {
                    // An error has been detected, here are the results of what the user has answered.
                    // Mark all the incorrect answers
                    var connections = jsPlumb.getConnections(_current_selector_id);
                    for(var i = 0; i < connections.length; i++)
                    {
                        if(typeof correctConnections[connections[i].id] === 'undefined')
                        {
                            connections[i].setPaintStyle({strokeStyle: FEEDBACK__WrongColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                            connections[i].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                            connections[i].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                        }
                    }

                    if(wrongMessages instanceof Array)
                    {
                        if(wrongMessages.length != 0)
                        {
                            displayFeedbackMessage(wrongMessages[counter_attempts >= wrongMessages.length - 1 ? wrongMessages.length - 1 : counter_attempts-1], FeedbackType.TRY_AGAIN);
                        }
                    }
                }
                else
                {
                    // The user has exceeded the maximum allowed time to check his answers. The
                    // user is not more allowed to check his answers, all the correct answers
                    // are revealed.
                    //if (revealAnswers){
                    //_current_object.revealAnswers();
                    //}
                    $feedbackContainer.empty();
                    displayFeedbackMessage(revealedMessage, FeedbackType.REVEAL_ANSWER)
                    _current_object.block();
                }
            }
            else
            {
                var connections = jsPlumb.getConnections(_current_selector_id);
                for(var i = 0; i < connections.length; i++)
                {
                    if(typeof correctConnections[connections[i].id] === 'undefined')
                    {
                        connections[i].setPaintStyle({strokeStyle: FEEDBACK__WrongColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth});
                        connections[i].endpoints[0].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                        connections[i].endpoints[1].setPaintStyle({fillStyle: FEEDBACK__WrongColor});
                    }
                }
            }*/
            //ProcessSetValue(pageName,_current_selector_id,counter_attempts,numberOfAttempts,'wrong');
        }

        // All the answers are correct
        else
        {
           /* ProcessSetValue(pageName,_current_selector_id,counter_attempts+1,numberOfAttempts,'correct');
            if(typeof correctMessage !== 'undefined' && (correctMessage !== null && correctMessage != '' && correctMessage != ""))
            {
                displayFeedbackMessage(correctMessage, FeedbackType.CORRECT);
            }else{
                $feedbackContainer.empty();
            }
            _current_object.block();*/
        }

        //FEEDBACK__AnswersChecked = true;
        
        if (correctAnswersCount == correctAnswers.length)
            allCorrect = true;
        else
            allCorrect = false;

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
                answerLine += $(inputs[i]).parent().find(".matchingAnswerLabel").html() + ((answerLineTokens[i+1] != undefined) ? answeLineTokens[i+1] : "");
            }
        }
        checkAnswersCallBack(allCorrect);
        return([allCorrect, answerLine]);
    };

    //
    this.resetAnswers = function()
    {
        /*if(feedbackMode == feedback_mode.ResetOnlyWithConfirmation || feedbackMode == feedback_mode.TrueWithConfirmation){
            var $resetContainer = $('#resetContainer'),
                $yesReset = $('#confirmReset #yesReset'),
                $noReset = $('#confirmReset #noReset')
            
            $resetContainer.fadeIn();

            $('#confirmReset')[0].className = 'animateDown ' + template;

            $yesReset.hammer().off('tap').on('tap', function()
            {
                $('#confirmReset')[0].className = 'animateDown ' + template;
                $resetContainer.fadeOut();
                $yesReset.hammer().off('tap');
                $noReset.hammer().off('tap');

                var componentObject = {
                    pageName: pageName,
                    componentId: $(_current_selector)[0].id, 
                    componentType: "matching"
                };

                clearPageData(componentObject);

                _current_object.resetComponent();
                removeResetListeners();
                $yesReset.hammer().off('tap');
            });

            $noReset.hammer().off('tap').on('tap', function()
            {
                $('#confirmReset')[0].className ='animateDown '+template;
                $resetContainer.fadeOut();
                $yesReset.hammer().off('tap');
                $noReset.hammer().off('tap');

                $('#confirmReset')[0].className = 'animateDown ' + template;
                $('#resetContainer').fadeOut();
                $('#confirmReset #noReset').hammer().off('tap');
                $('#confirmReset #yesReset').hammer().off('tap');
            });
        }else{
            _current_object.resetComponent();
        }*/

        var componentObject = {
            componentPageName: componentPageName,
            componentId: $(_current_selector)[0].id, 
            componentType: "matching"
        };

        clearPageData(componentObject);
        _current_object.resetComponent();
    };

    // Discard the user's input answers and reveal the correct answers...
    this.revealAnswers = function()
    {
        // Reset component
        _current_object.resetComponent();
        
        // Create connections
        try
        {
            for(var i = 0; i < correctAnswers.length; i++)
            {
                var sourceEndpoint = sourceDataItem[_current_selector_id + '__matching-data-item-' + correctAnswers[i][0]].endpoint,
                    targetEndpoint = targetDataItem[_current_selector_id + '__matching-data-item-' + correctAnswers[i][1]].endpoint;

                /*var sourceEndpoint = $("#" + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0]).attr("id"),
                targetEndpoint = $("#" + _current_selector_id + '__matching-data-item-' + correctAnswers[i][1]).attr("id");*/
                
                sourceEndpoint.setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                targetEndpoint.setPaintStyle({fillStyle: FEEDBACK__CorrectColor});

                var connection = jsPlumb.connect({
                    source: sourceEndpoint,
                    target: targetEndpoint,
                    paintStyle: {strokeStyle: FEEDBACK__CorrectColor, lineWidth: PLUMB__SourceOptions.connectorStyle.lineWidth},
                    scope: _current_selector_id
                });

                connection.endpoints[0].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});
                connection.endpoints[1].setPaintStyle({fillStyle: FEEDBACK__CorrectColor});

                $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][0] + ' .matching-data-container').addClass('correct');
                $('#' + _current_selector_id + '__matching-data-item-' + correctAnswers[i][1] + ' .matching-data-container').addClass('correct');
            }
        }
        catch(e)
        {
            throw new Error('(matching.js): Invalid Parameter, correctAnswers are not defined properly.');
        }

        // Check answers
        //_current_object.checkAnswers();

        // Block component
        //_current_object.block();
    };

    // Block the user interaction with the component...
    this.blockComponent = function()
    {
        $(_current_selector).find('.matching-component-blocked').css('display', 'block');
        /// $('.matching-data-item').hammer().off('tap');
    };

    // Unblock the user interaction with the component...
    this.unblockComponent = function()
    {
        $(_current_selector).find('.matching-component-blocked').css('display', 'none');
    };

    // Erase all the answers from the component...
    this.resetComponent = function()
    {
        var allConnections = jsPlumb.getConnections($(_current_selector)[0].id);

        $.each(allConnections, function(index, item)
        {
            item.endpoints[0].setPaintStyle({fillStyle: PLUMB__DefaultColor});
            item.endpoints[1].setPaintStyle({fillStyle: PLUMB__DefaultColor});
            jsPlumb.detach(item);
        });

        //$(_current_selector + ' .matching-component .matching-data-list > .matching-data-item > .matching-data-container')
        $(_current_selector + ' .matching-component > .matching-data-item > .matching-data-container')
            .addClass('not-selected')
            .removeClass('selected');

        //FEEDBACK__AnswersChecked = false;
    };

    // Re-initialize the component from scratch
    this.reinit = function()
    {
        console.log('Nothing happened!');
    };

    // Save the data to the app...
    this.saveData = function()
    {
        // --- Create the component object to save data --------------------------------------------
        var allConnections = jsPlumb.getConnections($(_current_selector)[0].id);

        var componentObject = 
        {
            componentPageName        : componentPageName,
            componentId     : $(_current_selector)[0].id,
            componentType   : "matching",
            componentChecked: FEEDBACK__AnswersChecked,
            data:
            {
                connections: new Array(),
                sourceDataCount: sourceData.length
            }
        };

        for(var i = 0; i < allConnections.length; i++)
        {
            var connection = allConnections[i],
                sourceEndpoint = null,
                targetEndpoint = null;

            for(var j = 0; j < connection.endpoints.length; j++)
            {
                var endpoint = connection.endpoints[j];

                if(endpoint.isSource)
                {
                    sourceEndpoint = endpoint;
                }

                if(endpoint.isTarget)
                {
                    targetEndpoint = endpoint;
                }

                if(sourceEndpoint !== null && targetEndpoint !== null)
                {
                    if(typeof $('#' + sourceEndpoint.elementId).attr('data-index') === 'undefined')
                    {
                        componentObject.data.connections.push(
                        {
                            sourceEndpoint: parseInt($('#' + sourceEndpoint.elementId + ' .matching-data-container').attr('data-index')),
                            targetEndpoint: parseInt($('#' + targetEndpoint.elementId + ' .matching-data-container').attr('data-index'))
                        });
                    }
                    else
                    {
                        componentObject.data.connections.push(
                        {
                            sourceEndpoint: parseInt($('#' + sourceEndpoint.elementId).attr('data-index')),
                            targetEndpoint: parseInt($('#' + targetEndpoint.elementId).attr('data-index'))
                        });
                    }
                }
            }
        }

        // --- Save the component object -----------------------------------------------------------
        globalArrPagesData = $.grep(globalArrPagesData, function(n, k)
        {
            return n.componentId != _current_selector_id;
        });


        globalArrPagesData.push(componentObject);

        componentObject.data = JSON.stringify(componentObject.data);
        savePageData(componentObject);
    };

    // Get data from the app and dispatch them into the component...
    this.dispatchData = function()
    {
        // --- Load the data to the component ------------------------------------------------------
        _current_object.resetComponent();

        var currentSlideId = pagesContainer.swiper.activeSlide().id;
        
        var arrFiltered = $.grep(globalArrPagesData, function(n,k)
        {
            return n.componentId == $(_current_selector)[0].id;
        });

        if (arrFiltered.length > 0)
        {
            var componentData = arrFiltered[0].data;

            if (typeof componentData === "string")
            {
                componentData = JSON.parse(componentData);
            }

            for(var i = 0; i < componentData.connections.length; i++)
            {
                var sourceEndpoints = sourceDataItem[arrFiltered[0].componentId + '__matching-data-item-' + (componentData.connections[i].sourceEndpoint)].endpoint
                    targetEndpoints = targetDataItem[arrFiltered[0].componentId + '__matching-data-item-' + (componentData.connections[i].targetEndpoint + componentData.sourceDataCount)].endpoint

                sourceEndpoints.setPaintStyle({fillStyle: highlightColor});
                targetEndpoints.setPaintStyle({fillStyle: highlightColor});

                jsPlumb.connect({ 
                    source : sourceEndpoints, 
                    target : targetEndpoints,
                    scope : arrFiltered[0].componentId
                });
            }

            if(arrFiltered[0].componentChecked)
            {
                _current_object.checkAnswers();
            }
        }
    };

    this.play = function(){
        jsPlumb.repaintEverything();
    };

    this.setAttempts = function(){

    };

    $(window).on('resize', function() 
    {
        $(_current_selector).css("visibility","hidden");
    });

    $(window).on('resizeEnd', function() 
    {
        jsPlumb.repaintEverything();
        $(_current_selector).css("visibility","visible");
        if(typeof(mainQuestion)!=undefined && mainQuestion != ""){
           resizeComponent(_current_selector_id);
        }
    });

    $(_current_selector).on("show",function(){
        jsPlumb.repaintEverything();
    })

    // Check if jsPlumb is loaded
    if(typeof jsPlumb === 'undefined')
    {
        throw new Error('Can\'t run matching.js: jsPlumb is not imported.');
    }
    else
    {
        // Configure jsPlumb
        //jsPlumb = jsPlumb.getInstance();
        jsPlumb.importDefaults({
            ConnectionsDetachable: false,
            ReattachConnections  : true
        });

        // Initialize Mathching.js
        init(pageName, param);
    }
};