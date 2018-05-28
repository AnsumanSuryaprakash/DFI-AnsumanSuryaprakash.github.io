 /*
    Drag and Drop 3.5
    draggable elements to be dropped in specific slots

    Author: Rami Sbaity, Wissam Hobeika

    Copyright 2014, Dataflow International
    Website: http://www.dataflow.com.lb

    Released on 01/09/2015
*/
var dragAndDrop = (function(id, pageName, parameters) {
    var _this = this;
    _this.container = $('#' + id).addClass('dragAndDropComp');
    _this.container.attr('data-checked', false);
    
    if (parameters == undefined) {
        var componentData = $.grep(globalArrComponentsData, function(n, k) {
            return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "dragAndDrop"
        });
        parameters = componentData[0].ComponentParameters;
    }
    
    var dndContainer = $('<div>').addClass('dndContainer').appendTo(_this.container);
    $.fn.defaults = {
        componentType: 'table',
        clone: false,
        direction: 'LTR',
        mainQuestionAudio: '',
        feedback: {
            feedbackType: 'nothing',
            buttons: [
                {
                    button: 'check',text: 'Check Your Answer'
                }, 
                {
                    button: 'reset',text: 'Reset Your Answer'
                }
            ],
            feedbackMessages: {
                correctMessage: 'correct',
                incorrectMessage: 'incorrect',
                attemptsMessages: 'try again',
                attemptsAnswerLine: [
                    "You are at co-ordinates  (@_@, @_@).", 
                    "Your co-ordinates are (@_@, @_@)."
                ]
            },
            feedbackAudios:{
                incorrectAttemptAudio: "",
                lastAttemptAudio: "",
                correctAudio: ""
            },
            numberOfAttempts: 0,
            revealAnswers: true,
            chat: {
                autoSlide: false,
                autoSlideSpeed: 2000,
            }
        },
        checkAnswersCallBack: function() {}
    }
    var params = $.extend({}, $.fn.defaults, parameters);
    params.feedback = $.extend({}, $.fn.defaults.feedback, parameters.feedback);
    params.feedback.feedbackMessages = $.extend({}, $.fn.defaults.feedback.feedbackMessages, parameters.feedback.feedbackMessages);
    var checkAnswersCallBack = params.checkAnswersCallBack;
    var componentType = params.componentType;
    var componentData = params.componentData;
    var header = params.header;
    var clone = params.clone;
    var properties = params.properties;
    var direction = params.direction;
    var freeLayout = params.freeLayout;
    var componentPageName = params.componentPageName;
    var template = params.template;
    var bannerFeedback;
    var feedbackType = params.feedback.feedbackType;
    var feedbackButtons = params.feedback.buttons;
    var numberOfAttempts = params.feedback.numberOfAttempts;
    var feedbackMessages = params.feedback.feedbackMessages;
    var feedbackAudios = params.feedback.feedbackAudios; 
    var revealAnswers = (params.feedback.revealAnswers == "false" || params.feedback.revealAnswers == false) ? false : true;
    var chat = params.feedback.chat;
    var mainQuestion = params.mainQuestion;
    var mainQuestionAudio = params.mainQuestionAudio;
    var attemptsAnswerLine = params.feedback.feedbackMessages.attemptsAnswerLine;
    var numberOfColumns = properties[0].numberOfColumns;
    var numberOfRows = properties[0].numberOfRows;
    var topHeaderData = header[0].topHeaderData;
    var htmlData = params.htmlData;
    var headersColor = header[0].headersColor;
    var columnsColor = properties[0].columnsColor;
    var droppablesProperties = properties[0].droppablesProperties == undefined ? [] : properties[0].droppablesProperties;

    if (topHeaderData != undefined) {
        if (topHeaderData.length > numberOfColumns) {
            numberOfColumns = topHeaderData.length;
        }
    }

    _this.attempt = 0;
    _this.audio = new Audio();
    
    _this.init = function() {
        resizeDiv(componentPageName);
        switch (componentType) {
            case 'table':
                if (direction == 'RTL') {
                    initTableRTL();
                } else {
                    initTable();
                }
                initComponentData();
                break;
            case 'ordering':
                initComponentData();
                _this.container.addClass('ordering');
                break;
            case 'free':
                initFreeLayout();
                initComponentData();
                dndContainer.addClass('free');
                break;
            case 'tableOrdering':
                if (direction == 'RTL') {
                    initTableRTL();
                    $('#' + id + ' .dndContainer').addClass('ar');
                } else {
                    initTable();
                }
                dndContainer.addClass('tableOrdering');
                initComponentData();
                break;
            case 'html':
                initHTMLMode();
                initComponentData();
                break;
        }
        if ($('#' + id + ' .dndCell.slot').length == 2) {
            numberOfAttempts = 1;
        }
        if (feedbackButtons.length != 0) {
            _this.feedbackComponent = new feedbackComponent(id, _this, {
                feedbackType: feedbackType,
                buttons: feedbackButtons,
                numberOfAttempts: numberOfAttempts,
                feedbackMessages: feedbackMessages,
                feedbackAudios: feedbackAudios,
                chat: chat,
                direction: direction,
                template: template,
                componentPageName: componentPageName,
                componentType: 'dragAndDrop',
                revealAnswers: revealAnswers
            });
        } else {
            _this.container.addClass("noFeedback");
        }
        dnd();
        
        if (typeof (mainQuestion) != undefined && mainQuestion != "") {
            _this.container.addClass('dndComponentInstruction');
            dndContainer.addClass('componentContentWrapper');
            mainQuestionDiv = $('<div>').addClass('componentInstructionalTextWrapper');
            var mainQuestionContainer = $('<div>').addClass('mainQuestionTextWrapper').html(mainQuestion).appendTo(mainQuestionDiv);
            if (typeof (mainQuestionAudio) != undefined && mainQuestionAudio != "") {
                var audioImageWrapper = $('<div>').addClass('globalAudioIconContainer');
                var audioImage = $('<div>').addClass('globalAudioIcon globalAudioIconPlay').appendTo(audioImageWrapper);
                mainQuestionDiv.prepend(audioImageWrapper);
                dndComponentAudio = $('<audio>').addClass('dndComponentAudio').attr('src', mainQuestionAudio).appendTo(_this.container);
                dndComponentAudio.load();
                audioImage.hammer().off('tap').on('tap', function() {
                    var audioIcon = $(this);
                    dndComponentAudio = _this.container.find('.dndComponentAudio')[0];
                    if (audioIcon.hasClass('globalAudioIconPlay')) {
                        dndComponentAudio.addEventListener('canplay', dndPlayAudio());
                        audioIcon.removeClass('globalAudioIconPlay').addClass('globalAudioIconPause');
                    } else {
                        dndComponentAudio.pause();
                        audioIcon.removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
                    }
                });
            }
            _this.container.prepend(mainQuestionDiv);
            resizeComponent(id);
            $(window).on("resizeEnd", function() {
                resizeComponent(id);
            });
        }
        var blockComponent = $('<div>').addClass('blockedComponent').appendTo(dndContainer);
    }
    
    function initHTMLMode(){
        dndContainer.addClass('htmlMode');
        var dndHTML = $('<div>').addClass('dndHTML dndDroppablesContainer').appendTo(dndContainer);
        var htmlDataSplit = htmlData.split("@_@");
        var strHTML = '';
        var index = -1;
        //htmlData = htmlData.replace(/@_@/g, "<div class='slot'><div class='innerSlot'></div></div>");
        htmlData = htmlData.replace(/@_@/g, function(a,b,c){
            index++;
            //return "<div class='slot' style='width: " + droppablesProperties[index].width +  "px; height: " + droppablesProperties[index].height + "px;' data-index=" + index + "><div class='innerSlot'></div></div>"; 
            var droppableWidth = droppablesProperties[index].width == undefined ? 110 : droppablesProperties[index].width;
            var droppableHeight = droppablesProperties[index].height == undefined ? 35 : droppablesProperties[index].height;
            var droppablesDefaultText = droppablesProperties[index].defaultText == undefined ? '' : "<div class='slotDefaultText'>" + droppablesProperties[index].defaultText + "</div>";
            return "<div class='slot' style='width: " + droppableWidth +  "px; height: " + droppableHeight + "px;' data-index=" + index + "><div class='innerSlot'>" + droppablesDefaultText + "</div></div>"; 
        });
        strHTML = htmlData;
        /*for(var i=0; i<htmlDataSplit.length; i++ ){
             // var textSpan = $("<div>").addClass("textSlot").html(sentenceDataSplit[i]);
             strHTML += htmlDataSplit[i];
             strHTML += " <div class='slot' data-index=" + i + "><div class='innerSlot'></div></div> ";
             // dndSentence.append(textSpan).append(droppableSpan);
        }*/
        dndHTML.html(strHTML);
    }

    function initTable() {
        dndContainer.addClass('table');
        var x = 1;
        var dndTable = $('<table>').addClass('dndTable dndDroppablesContainer').appendTo(dndContainer);
        var tdHeight = parseInt(100 / numberOfRows);
        if (header[0].withTopHeader && header[0].withSideHeader) {
            dndContainer.addClass('tableWithTopHeader').addClass('tableWithSideHeader');
            if (header[0].withCornerHeader || header[0].topHeaderData.length == 1) {
                var dndHead = $('<thead>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndHead);
                var dndCellCorner = $('<td>').appendTo(dndRow);
                for (i = 0; i < header[0].topHeaderData.length; i++) {
                    //var dndCell = $('<td>').addClass('slot dndCell dndCell' + i).html(header[0].topHeaderData[i]).attr('data-index', i).appendTo(dndRow);
                    var dndCell = $('<td>').addClass('dndCell dndCell' + i).html("<div class='dndHeaderDiv' style='background:" + headersColor[i] + "'><div>" + header[0].topHeaderData[i] + "</div></div>").attr('data-index', i).attr("style","background:-webkit-linear-gradient(left," + columnsColor[i] + "," + columnsColor[i] + ") no-repeat 0px 25px").appendTo(dndRow);
                }
                var dndBody = $('<tbody>').appendTo(dndTable);
                for (j = 0; j < header[0].sideHeaderData.length; j++) {
                    var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                    var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                    for (k = 1; k <= header[0].topHeaderData.length; k++) {
                        //var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).appendTo(dndRow);
                        var dndCell = $('<td>').addClass('dndCell dndCell' + k).attr('data-index', x).attr("style","height:" + tdHeight + "%; background:" + columnsColor[k-1]).appendTo(dndRow);
                        var dndCellDiv = $('<div>').addClass('slot dndCellDiv dndCellDiv' + k).attr('data-index', x).appendTo(dndCell);
                        x++;
                    }
                    $('#' + id + ' .dndRow' + j + ' .dndCell0').addClass("dndSideHeader").html(header[0].sideHeaderData[j]);
                }
            } else {
                var dndHead = $('<thead>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndHead);
                for (i = 0; i < header[0].topHeaderData.length; i++) {
                    var dndCell = $('<td>').addClass('dndCell dndCell' + i).html("<div class='dndHeaderDiv' style='background:" + headersColor[i] + "'><div>" + header[0].topHeaderData[i] + "</div></div>").attr('data-index', i).attr("style","background:-webkit-linear-gradient(left," + columnsColor[i] + "," + columnsColor[i] + ") no-repeat 0px 25px").appendTo(dndRow);
                }
                var dndBody = $('<tbody>').appendTo(dndTable);
                for (j = 0; j < header[0].sideHeaderData.length; j++) {
                    var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                    var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                    for (k = 1; k < header[0].topHeaderData.length; k++) {
                        //var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).appendTo(dndRow);
                        var dndCell = $('<td>').addClass('dndCell dndCell' + k).attr('data-index', x).attr("style","height:" + tdHeight + "%; background:" + columnsColor[k-1]).appendTo(dndRow);
                        var dndCellDiv = $('<div>').addClass('slot dndCellDiv dndCellDiv' + k).attr('data-index', x).appendTo(dndCell);
                        x++;
                    }
                    $('#' + id + ' .dndRow' + j + ' .dndCell0').html(header[0].sideHeaderData[j]);
                }
            }
            $('#' + id + ' thead .dndCell').removeClass('slot');
            $('#' + id + ' .dndCell0').removeClass('slot');
        } else if (header[0].withSideHeader) {
            dndContainer.addClass('tableWithSideHeader');
            var dndBody = $('<tbody>').appendTo(dndTable);
            for (j = 0; j < header[0].sideHeaderData.length; j++) {
                var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                for (k = 1; k < properties[0].numberOfColumns; k++) {
                    //var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).appendTo(dndRow);
                    var dndCell = $('<td>').addClass('dndCell dndCell' + k).attr('data-index', x).attr("style","height:" + tdHeight + "%; background:" + columnsColor[k-1]).appendTo(dndRow);
                    var dndCellDiv = $('<div>').addClass('slot dndCellDiv dndCellDiv' + k).attr('data-index', x).appendTo(dndCell);
                    x++;
                }
                $('#' + id + ' .dndRow' + j + ' .dndCell0').html(header[0].sideHeaderData[j]);
            }
            $('#' + id + ' .dndCell0').removeClass('slot');
        } else if (header[0].withTopHeader) {
            dndContainer.addClass('tableWithTopHeader');
            dndTable.addClass('top');
            var dndHead = $('<thead>').appendTo(dndTable);
            var dndRow = $('<tr>').appendTo(dndHead);
            for (i = 0; i < header[0].topHeaderData.length; i++) {
                var dndCell = $('<td>').addClass('dndCell dndCell' + i).html("<div class='dndHeaderDiv' style='background:" + headersColor[i] + "'><div>" + header[0].topHeaderData[i] + "</div></div>").attr('data-index', i).attr("style","background:-webkit-linear-gradient(left," + columnsColor[i] + "," + columnsColor[i] + ") no-repeat 0px 25px").appendTo(dndRow);
            }
            var dndBody = $('<tbody>').appendTo(dndTable);
            for (j = 0; j < properties[0].numberOfRows; j++) {
                var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                for (k = 0; k < header[0].topHeaderData.length; k++) {
                    //var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).appendTo(dndRow);
                    var dndCell = $('<td>').addClass('dndCell dndCell' + k).attr('data-index', x).attr("style","height:" + tdHeight + "%; background:" + columnsColor[k]).appendTo(dndRow);
                    var dndCellDiv = $('<div>').addClass('slot dndCellDiv dndCellDiv' + k).attr('data-index', x).appendTo(dndCell);
                    x++;
                }
            }
            if (header[0].withCounter) {
                var dndFoot = $('<tfoot>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndFoot);
                for (i = 0; i < header[0].topHeaderData.length; i++) {
                    var dndCell = $('<td>').addClass('dndCell dndCell' + i).attr('data-index', i).appendTo(dndRow);
                }
            }
        }else{
            var dndBody = $('<tbody>').appendTo(dndTable);
            for (j = 0; j < properties[0].numberOfRows; j++) {
                var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                for (k = 0; k < numberOfColumns; k++) {
                    //var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).appendTo(dndRow);
                    var dndCell = $('<td>').addClass('dndCell dndCell' + k).attr('data-index', x).attr("style","height:" + tdHeight + "%; background:" + columnsColor[k]).appendTo(dndRow);
                    var dndCellDiv = $('<div>').addClass('slot dndCellDiv dndCellDiv' + k).attr('data-index', x).appendTo(dndCell);
                    x++;
                }
            }
        }
    }
    
    function initTableRTL() {
        dndContainer.addClass('table');
        var x = 1;
        var dndTable = $('<table>').addClass('dndTable dndDroppablesContainer').appendTo(dndContainer);
        if (header[0].withTopHeader && header[0].withSideHeader) {
            if (header[0].withCornerHeader) {
                var dndHead = $('<thead>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndHead);
                for (i = header[0].topHeaderData.length - 1; i >= 0; i--) {
                    var dndCell = $('<td>').addClass('slot dndCell dndCell' + i).html(header[0].topHeaderData[i]).attr('data-index', i).appendTo(dndRow);
                }
                var dndCellCorner = $('<td>').appendTo(dndRow);
                var dndBody = $('<tbody>').appendTo(dndTable);
                for (j = 0; j < header[0].sideHeaderData.length; j++) {
                    var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                    for (k = header[0].topHeaderData.length; k > 0; k--) {
                        var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).prependTo(dndRow);
                        x++;
                    }
                    var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                    $('#' + id + ' .dndRow' + j + ' .dndCell0').html(header[0].sideHeaderData[j]);
                }
            } else {
                var dndHead = $('<thead>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndHead);
                for (i = header[0].topHeaderData.length - 1; i >= 0; i--) {
                    var dndCell = $('<td>').addClass('slot dndCell dndCell' + i).html(header[0].topHeaderData[i]).attr('data-index', i).appendTo(dndRow);
                }
                var dndBody = $('<tbody>').appendTo(dndTable);
                for (j = 0; j < header[0].sideHeaderData.length; j++) {
                    var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                    for (k = header[0].topHeaderData.length; k > 1; k--) {
                        var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).prependTo(dndRow);
                        x++;
                    }
                    var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                    $('#' + id + ' .dndRow' + j + ' .dndCell0').html(header[0].sideHeaderData[j]);
                }
            }
            $('#' + id + ' thead .dndCell').removeClass('slot');
            $('#' + id + ' .dndCell0').removeClass('slot');
        } else if (header[0].withSideHeader) {
            var dndBody = $('<tbody>').appendTo(dndTable);
            for (j = 0; j < header[0].sideHeaderData.length; j++) {
                var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                for (k = 1; k < properties[0].numberOfColumns; k++) {
                    var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).prependTo(dndRow);
                    x++;
                }
                var dndCell = $('<td>').addClass('slot dndCell dndCell0').attr('data-index', 0).appendTo(dndRow);
                $('#' + id + ' .dndRow' + j + ' .dndCell0').html(header[0].sideHeaderData[j]);
            }
            $('#' + id + ' .dndCell0').removeClass('slot');
        } else if (header[0].withTopHeader) {
            dndTable.addClass('top');
            var dndHead = $('<thead>').appendTo(dndTable);
            var dndRow = $('<tr>').appendTo(dndHead);
            for (i = header[0].topHeaderData.length - 1; i >= 0; i--) {
                var dndCell = $('<td>').addClass('dndCell dndCell' + i).html(header[0].topHeaderData[i]).attr('data-index', i).appendTo(dndRow);
            }
            var dndBody = $('<tbody>').appendTo(dndTable);
            for (j = 0; j < properties[0].numberOfRows; j++) {
                var dndRow = $('<tr>').addClass('dndRow dndRow' + j).attr('data-index', j).appendTo(dndBody);
                for (k = 0; k < header[0].topHeaderData.length; k++) {
                    var dndCell = $('<td>').addClass('slot dndCell dndCell' + k).attr('data-index', x).prependTo(dndRow);
                    x++;
                }
            }
            if (header[0].withCounter) {
                var dndFoot = $('<tfoot>').appendTo(dndTable);
                var dndRow = $('<tr>').appendTo(dndFoot);
                for (i = header[0].topHeaderData.length - 1; i >= 0; i--) {
                    var dndCell = $('<td>').addClass('dndCell dndCell' + i).html($('#' + id + ' .dndCell .dndDragContainer').length).attr('data-index', i).appendTo(dndRow);
                }
            }
        }
    }
    
    function initFreeLayout() {
        var dndFreeLayout = $('<div>').addClass('dndFreeLayout dndDroppablesContainer').appendTo($('#' + id + ' .dndContainer'));
        var dndFreeContainer = $('<div>').addClass('dndFreeContainer').appendTo(dndFreeLayout);
        var dndFreeLayoutImage = $('<img>').addClass('dndFreeLayoutImg').attr('src', freeLayout[0].backgroundImg).appendTo(dndFreeContainer);
        for (i = 0; i < freeLayout[0].freeLayoutData.length; i++) {
            var dndFreeLayoutData = $('<div>').addClass('dndFreeLayoutData slot').attr('data-index', i).appendTo(dndFreeContainer);
            $('#' + id + ' .dndFreeLayoutData.slot').eq(i).css('top', freeLayout[0].freeLayoutData[i].top + 'px');
            $('#' + id + ' .dndFreeLayoutData.slot').eq(i).css('left', freeLayout[0].freeLayoutData[i].left + 'px');
            $('#' + id + ' .dndFreeLayoutData.slot').eq(i).height(freeLayout[0].freeLayoutData[i].height);
            $('#' + id + ' .dndFreeLayoutData.slot').eq(i).width(freeLayout[0].freeLayoutData[i].width);
        }
    }
    
    function initComponentData() {
        var dndComponentData = $('<div>').addClass('dndComponentData').appendTo(dndContainer);
        var dndComponentDataList = $('<div>').addClass('dndComponentDataList slot').appendTo(dndComponentData);
        var dnddragcontainerdiv = $('<div>').addClass("dndDragContainerData").appendTo(dndComponentDataList);
        var type = componentData.type;
        var data = componentData.data;
        var correctAnswers = componentData.correctAnswers;
        if (type == "html"){
            dndComponentData.addClass("htmlDraggables");
            var splitData = data.split("@_@");
            var backgroundColor = componentData.backgroundColor;
            for (var i=0; i<splitData.length; i++){
                var dndDragContainer = $('<div>').addClass('dndDragContainer dndDragHTML').attr("style","background-color:" + backgroundColor[i]).appendTo(dnddragcontainerdiv);
                dndDragContainer.attr('data-index', correctAnswers[i]);
                dndDragContainer.attr('data-uniqueIndex', i);
                var dndDrag = $('<div>').addClass('dndDrag').attr('data-index', i).html(splitData[i]).appendTo(dndDragContainer);
            }
        }else{
            for (var i = 0; i < data.length; i++) {
                switch (data[i].type) {
                    case 'text':
                        var dndDragContainer = $('<div>').addClass('dndDragContainer').appendTo(dnddragcontainerdiv);
                        dndDragContainer.attr('data-index', data[i].correctAnswer);
                        dndDragContainer.attr('data-uniqueIndex', i);
                        var dndDrag = $('<div>').addClass('dndDrag').attr('data-index', i).html(data[i].content).appendTo(dndDragContainer);
                        break;
                    case 'img':
                        dndContainer.addClass('img');
                        var dndDragContainer = $('<div>').addClass('dndDragContainer').appendTo(dnddragcontainerdiv);
                        dndDragContainer.attr('data-index', data[i].correctAnswer);
                        dndDragContainer.attr('data-uniqueIndex', i);
                        var dndDragContainer = $('<img>').addClass('dndDrag').attr('src', data[i].content).attr('data-index', i).html(data[i].content).appendTo(dndDragContainer);
                        break;
                }
            }
        }
    }
    
    function dragSize() {
        // var questionHeight = $('#'+id+' .dndQuestion').outerHeight();
        // $('#'+id+' .dndContainer').css('top', questionHeight + 'px');
        if (typeof (header) != "undefined" && header.length != 0) {
            if (header[0].withSideHeader) {
                $('#' + id + ' .dndCell.slot').width($('#' + id + ' .dndTable').width() / header[0].sideHeaderData.length);
            } else {
                $('#' + id + ' .dndCell.slot').width($('#' + id + ' .dndTable').width() / properties[0].numberOfColumns);
            }
        }
    /*if(header[0].withSideHeader){
            if(header[0].withCounter){
                $('tbody .dndRow').height(($('.dndTable').height() - $('thead').height() - $('tfoot').height())/header[0].sideHeaderData.length );
            }else{
                $('tbody .dndRow').height(($('.dndTable').height() - $('thead').height())/header[0].sideHeaderData.length );
            }
        }else{
            if(header[0].withCounter){
                $('tbody .dndRow').height(($('.dndTable').height() - $('thead').height() - $('tfoot').height())/properties[0].numberOfRows );
            }else{
                $('tbody .dndRow').height(($('.dndTable').height() - $('thead').height())/properties[0].numberOfRows );
            }
        }*/
    }
    // function audioQuestion(){
    //  if(typeof(mainQuestionAudio)!=undefined && mainQuestionAudio != ""){
    //      $('#'+id+' .dndQuestionAudio').hammer().off('tap').on('tap', function(){
    //          if($(this).hasClass('played')){
    //              $(this).removeClass('played');
    //              $(this).addClass('paused');
    //              $('audio', this).trigger('pause');
    //          }else{
    //              $(this).addClass('played');
    //              $(this).removeClass('paused');
    //              _this.audio = $(this).find('.dndQuestionAudioSrc ').trigger('play');
    //              $('audio', this).trigger('play');
    //              $('audio', this)[0].addEventListener('ended', dndAudioPause);
    //          }
    //      });
    //  }
    // }
    // function dndAudioPause(){
    //  $('#'+id+' .dndQuestionAudio').removeClass('paused');
    //  $('audio', this)[0].removeEventListener('ended', dndAudioPause);
    // }
    function dndPlayAudio() {
        dndComponentAudio.play();
        dndComponentAudio.removeEventListener('canplay', dndPlayAudio);
        dndComponentAudio.addEventListener('ended', dndAudioEnd);
    }
    function dndAudioEnd() {
        $('#' + id + ' .globalAudioIcon').removeClass('globalAudioIconPause').addClass('globalAudioIconPlay');
        dndComponentAudio.removeEventListener('ended', dndAudioEnd);
    }
    
    _this.checkAnswers = function() {
        _this.container.attr('data-checked', true);
        var allCorrect = false;
        var answerArray = new Array();
        var answerObj = {};
        var ans = 0;
        if (componentType == 'table' || componentType == 'tableOrdering') {
            $('#' + id + ' .dndCell .dndDragContainer').each(function() {
                answerObj = {};
                var draggableParent = $(this).parent();
                if ($.inArray(draggableParent.attr('data-index'), $(this).attr('data-index')) == -1) {
                    //answerArray[ans] = 'false';
                    answerObj.answer = "false";
                    answerObj.dropIndex = draggableParent.attr('data-index');
                    //$(this).parent().removeClass('correctAnswer');
                    //$(this).parent().addClass('incorrectAnswer');
                    ans++;
                    if (numberOfRows > 1) {
                        draggableParent.removeClass('correctAnswer');
                        draggableParent.addClass('incorrectAnswer');
                    }
                } else {
                    //if (!$(this).parent().hasClass('incorrectAnswer')) {
                        //answerArray[ans] = 'true';
                        answerObj.answer = "true";
                        answerObj.dropIndex = draggableParent.attr('data-index');
                        //$(this).parent().addClass('correctAnswer');
                        if (numberOfRows > 1) {
                            draggableParent.addClass('correctAnswer');
                        }
                        ans++;
                    //}
                }
                answerArray.push(answerObj);
            });
        } else if (componentType == 'ordering') {
            var dataIndex = new Array;
            var dataIndexArr = new Array;
            for (var i = 0; i < componentData.length; i++) {
                dataIndexArr[i] = dataIndex.push(componentData[i].correctAnswer);
            }
            $('#' + id + ' .dndDragContainer').each(function() {
                answerObj = {};
                var $this = $(this);
                if ($this.eq(0).attr('data-index') == dataIndexArr[ans]) {
                    //answerArray[ans] = 'true';
                    answerObj.answer = "true";
                    answerObj.dropIndex = $this.eq(0).attr('data-index');
                    $this.addClass('correctAnswer');
                    ans++;
                } else {
                    //answerArray[ans] = 'false';
                    answerObj.answer = "false";
                    answerObj.dropIndex = $this.eq(0).attr('data-index');
                    $this.addClass('incorrectAnswer');
                    ans++;
                }
                answerArray.push(answerObj);
            });
        } else if (componentType == 'free') {
            $('#' + id + ' .dndFreeLayoutData.slot .dndDragContainer').each(function() {
                answerObj = {};     
                //if ($.inArray($(this).parent().attr('data-index'), $(this).attr('data-index')) == -1) {
                var draggableParent = $(this).parent();    
                if ($(this).attr('data-index').indexOf(draggableParent.attr('data-index')) == -1) {
                    //answerArray[ans] = 'false';
                    answerObj.answer = "false";
                    answerObj.dropIndex = draggableParent.attr('data-index');
                    draggableParent.addClass('incorrectAnswer');
                    ans++;
                } else {
                    //answerArray[ans] = 'true';
                    answerObj.answer = "true";
                    answerObj.dropIndex = draggableParent.attr('data-index');
                    draggableParent.addClass('correctAnswer');
                    ans++;
                }
                answerArray.push(answerObj);
            });
        }else if (componentType == 'html') {
            $('#' + id + ' .dndHTML .slot .dndDragContainer').each(function() {
                answerObj = {};            
                //if ($.inArray($(this).parent().attr('data-index'), $(this).attr('data-index')) == -1) {
                var draggableParent = $(this).parent().parent();    
                if ($(this).attr('data-index').indexOf(draggableParent.attr('data-index')) == -1) {
                    //answerArray[ans] = 'false';
                    answerObj.answer = "false";
                    answerObj.dropIndex = draggableParent.attr('data-index');
                    draggableParent.addClass('incorrectAnswer');
                    ans++;
                } else {
                    //answerArray[ans] = 'true';
                    answerObj.answer = "true";
                    answerObj.dropIndex = draggableParent.attr('data-index');
                    draggableParent.addClass('correctAnswer');
                    ans++;
                }
                answerArray.push(answerObj);
            });
        }
        var answerArr = [];
        var correctAnswerArr = [];
        var counter = 0;
        var data = componentData.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].correctAnswer != undefined) {
                for (var j = 0; j < data[i].correctAnswer.length; j++) {
                    answerArr[counter] = data[i].correctAnswer[j];
                    counter++;
                }
            }
        }

        /*if (!clone) {
            correctAnswerArr = answerArr.filter(function(item, i, ar) {
                return ar.indexOf(item) === i;
            });
        } else {
            correctAnswerArr = answerArr;
        }*/

        if (componentType == 'free') {
            if (!clone) {
                correctAnswerArr = answerArr.filter(function(item, i, ar) {
                    return ar.indexOf(item) === i;
                });
            } else {
                correctAnswerArr = answerArr;
            }
        } else if (componentType == 'ordering') {
            correctAnswerArr = answerArr;
        } else if (componentType == 'table') {
            if (numberOfRows == 1) {
                var slotIndex;
                for (var i = 0; i < numberOfColumns; i++) {
                    slotIndex = i + 1;
                    var filterArray = $.grep(answerArray, function(item, index) {
                        return item.dropIndex == slotIndex && item.answer == 'true';
                    })
                    
                    if(answerArr.length >1){
                        var droppableAnswers = $.grep(answerArr, function(item, index) {
                            return item == slotIndex;
                        })    
                    }else{
                        var droppableAnswers = answerArr;                            
                    }
                    
                    
                    var dndSlot = $('#' + id + ' .dndCell .slot[data-index=' + slotIndex + ']');
                    if (filterArray.length == droppableAnswers.length) {
                        dndSlot.removeClass('incorrectAnswer');
                        dndSlot.addClass('correctAnswer');
                    } else {
                        dndSlot.removeClass('correctAnswer');
                        dndSlot.addClass('incorrectAnswer');
                    }
                }
            }
            correctAnswerArr = answerArr;
        }else if (componentType == 'html') {
            correctAnswerArr = answerArr;
        }
        
        var arrFalse = $.grep(answerArray, function(a) {
            //return a == 'false';
            return a.answer == 'false';
        });

        var arr = answerArray;

        /*if ($('#' + id + ' .dndCell.slot').length == 2) {
            attemptsNumber = 1;
        }*/

        if (componentType == 'ordering') {
            if (arr.length == correctAnswerArr.length && arrFalse.length == 0) {
                allCorrect = true;
                $('#' + id + ' .dndCell.slot').removeClass('incorrectAnswer');
                $('#' + id + ' .dndFreeLayoutData.slot').removeClass('incorrectAnswer');
            } else {
                allCorrect = false;
            }
        } else {
            if (arrFalse.length == 0 && arr.length > 0 && (arr.length == correctAnswerArr.length || $('#' + id + ' .slot.correctAnswer').length == $('#' + id + ' .slot').not('.dndComponentData .slot').length)) {
                allCorrect = true;
                $('#' + id + ' .dndCell.slot').removeClass('incorrectAnswer');
                $('#' + id + ' .dndFreeLayoutData.slot').removeClass('incorrectAnswer');
            } else {
                allCorrect = false;
            }
        }
        var answerLine = "";
        if (feedbackType == 'chat') {
            var answerLineInstance = "";
            if (typeof (attemptsAnswerLine) == 'string') {
                answerLineInstance = attemptsAnswerLine;
            } else {
                answerLineInstance = attemptsAnswerLine[_this.attempt];
            }
            var answeLineTokens = answerLineInstance.split(token);
            answerLine = answeLineTokens[0];
            for (var i = 0; i < answeLineTokens.length - 1; i++) {
                answerLine += inputFields[i].value + answeLineTokens[i + 1];
            }
        }
        _this.attempt++;
        checkAnswersCallBack(allCorrect, _this.attemptsReached);
        var contentData = "Content Data: ";
    	var allObjects = $('#'+id+' .dndDrag');
    	var correctObjects = $('#'+id+' .correctAnswer .dndDrag');
    	var incorrectObjects = $('#'+id+' .incorrectAnswer .dndDrag');
    	for(var i = 0; i < allObjects.length; i++){
    		if(correctObjects.index(allObjects[i]) != -1){
    			contentData+= allObjects[i].innerHTML+ " - Correct";
    		}else{
    			if(incorrectObjects.index(allObjects[i]) != -1){
	    			contentData+=allObjects[i].innerHTML + " - Incorrect";
	    		}else{
	    			contentData+=allObjects[i].innerHTML + " - Unused";
	    		}
    		}
    		if(i!=allObjects.length-1)
    			contentData += "; ";
    		else
    			contentData += ".";
	}
        return ([allCorrect, answerLine, contentData]);
    }
    
    _this.resetAnswers = function() {
        $('#' + id + ' .dndDragContainer ').remove();
        $('#' + id + ' .dndComponentData').remove();
        $('#' + id + ' .dndDroppablesContainer .slot').removeClass("incorrectAnswer").removeClass("correctAnswer");
        $('#' + id + ' .slotDefaultText').show();
        initComponentData();
        dnd();
    }
    
    _this.resetAll = function() {
    }
    
    _this.revealAnswers = function() {
        var data = componentData.data;
        if (componentType == 'table' || componentType == 'tableOrdering') {
            $('#' + id + ' .dndComponentData').remove();
            $('#' + id + ' .dndDragContainer').remove();
            $('#' + id + ' .dndCell').removeClass('incorrectAnswer');
            $('#' + id + ' .dndCell').removeClass('correctAnswer');
            initComponentData();
            for (var i = 0; i < data.length; i++) {
                var correctAnswer = data[i].correctAnswer;
                if (!correctAnswer){
                    correctAnswer = componentData.correctAnswers[i];
                }
                if (correctAnswer != undefined) {
                    if (correctAnswer.length > 1) {
                        for (var j = 0; j < correctAnswer.length; j++) {
                            $('#' + id + ' .dndCell .slot[data-index=' + parseInt(correctAnswer[j]) + ']').addClass('correctAnswer');
                            if (j == correctAnswer.length - 1) {
                                $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').appendTo($('#' + id + ' .dndCell .slot[data-index=' + parseInt(correctAnswer[j]) + ']'));
                            } else {
                                $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').clone().appendTo($('#' + id + ' .dndCell .slot[data-index=' + parseInt(correctAnswer[j]) + ']'));
                            }
                        }
                    } else {
                        $('#' + id + ' .dndCell .slot[data-index=' + parseInt(correctAnswer[0]) + ']').addClass('correctAnswer');
                        $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index=' + parseInt(correctAnswer[0]) + ']').appendTo($('#' + id + ' .dndCell .slot[data-index=' + parseInt(correctAnswer[0]) + ']'));
                    }
                }
            }
        } else if (componentType == 'ordering') {
            $('#' + id + ' .dndDragContainer').addClass('correctAnswer');
            var dataIndex = new Array;
            var dataIndexArr = new Array;
            for (var i = 0; i < data.length; i++) {
                dataIndexArr[i] = dataIndex.push(data[i].correctAnswer);
            }
            for (var i = 0; i < dataIndexArr.length; i++) {
                $('#' + id + ' .dndDragContainer[data-index=' + parseInt(dataIndexArr[i]) + ']').appendTo('#' + id + ' .dndComponentDataList');
            }
        } else if (componentType == 'free') {
            $('#' + id + ' .dndComponentData').remove();
            $('#' + id + ' .dndDragContainer').remove();
            $('#' + id + ' .dndFreeLayoutData').removeClass('incorrectAnswer');
            $('#' + id + ' .dndFreeLayoutData').removeClass('correctAnswer');
            initComponentData();
            for (var i = 0; i < data.length; i++) {
                var correctAnswer = data[i].correctAnswer;
                if (!correctAnswer){
                    correctAnswer = componentData.correctAnswers[i];
                }
                if (correctAnswer != undefined) {
                    if (clone) {
                        if (correctAnswer.length > 1) {
                            for (var j = 0; j < correctAnswer.length; j++) {
                                $('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[j]) + ']').addClass('correctAnswer');
                                if (j == correctAnswer.length - 1) {
                                    $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').appendTo($('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[j]) + ']'));
                                } else {
                                    $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').clone().appendTo($('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[j]) + ']'));
                                }
                            }
                        } else {
                            $('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[0]) + ']').addClass('correctAnswer');
                            $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index=' + parseInt(correctAnswer[0]) + ']').appendTo($('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[0]) + ']'));
                        }
                    } else {
                        $('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[0]) + ']').addClass('correctAnswer');
                        $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[0]) + ']').appendTo($('#' + id + ' .dndFreeLayoutData.slot[data-index=' + parseInt(correctAnswer[0]) + ']'));
                    }
                }
            }
        } else if (componentType == 'html') {
            $('#' + id + ' .dndComponentData').remove();
            $('#' + id + ' .dndDragContainer').remove();
            $('#' + id + ' .dndSlot').removeClass('incorrectAnswer');
            $('#' + id + ' .dndSlot').removeClass('correctAnswer');
            initComponentData();
            for (var i = 0; i < data.length; i++) {
                var correctAnswer = data[i].correctAnswer;
                if (!correctAnswer){
                    correctAnswer = componentData.correctAnswers[i];
                }
                if ((correctAnswer != undefined)&&(correctAnswer != '')) {
                    if (clone) {
                        if (correctAnswer.length > 1) {
                            for (var j = 0; j < correctAnswer.length; j++) {
                                $('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[j]) + ']').addClass('correctAnswer');
                                if (j == correctAnswer.length - 1) {
                                    $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').appendTo($('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[j]) + '] .innerSlot'));
                                } else {
                                    $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[j]) + ']').clone().appendTo($('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[j]) + '] .innerSlot'));
                                }
                            }
                        } else {
                            $('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[0]) + ']').addClass('correctAnswer');
                            $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index=' + parseInt(correctAnswer[0]) + ']').appendTo($('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[0]) + '] .innerSlot'));
                        }
                    } else {
                        // $(this).find(".slotDefaultText").hide();
                        $('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[0]) + ']').addClass('correctAnswer');
                        $('#' + id + ' .dndComponentData .dndDragContainer[data-uniqueindex=' + i + '][data-index*=' + parseInt(correctAnswer[0]) + ']').appendTo($('#' + id + ' .htmlMode .slot[data-index=' + parseInt(correctAnswer[0]) + '] .innerSlot'));
                    }
                }
            }
        }
    }
    
    _this.init();
    dragSize();
    // audioQuestion();
    $(window).on('resizeEnd', function() {
        dragSize();
    });
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
    _this.blockComponent = function() {
        $('#' + id + ' .blockedComponent').show();
    }
    _this.unblockComponent = function() {
        $('#' + id + ' .blockedComponent').hide();
    }
    _this.pause = function() {
        _this.audio.pause();
    }
    _this.play = function() {
    };
    _this.resume = function() {
        if (!_this.audio.ended && _this.audio.currentTime != 0)
            _this.audio.play();
    }
    _this.reset = function() {
        if (!_this.audio.paused)
            _this.audio.currentTime = 0;
        _this.audio.pause();
    }
    
    function dnd() {
        var currentMousePos = {x: 0,y: 0};
        if (componentType == 'ordering') {
            $(function() {
                $('#' + id + " .dndComponentDataList").sortable();
                $('#' + id + ' .dndComponentDataList').disableSelection();
            });
        } else {
            $('#' + id + ' .dndDragContainer').draggable({
                snap: '.slot',
                snapMode: 'inner',
                revert: 'invalid',
                // cursor: 'move',
                scroll: 'false',
                stop: function() {
                    $('#' + id + ' .dndTable .slot').each(function() {
                        if ($('.dndDragContainer', this).length == properties[0].numberOfDroppables) {
                            $(this).droppable("option", "disabled", true);
                        } else {
                            $(this).droppable("option", "disabled", false);
                        }
                    });
                    $('#' + id + ' .dndContainer.free .dndFreeLayoutData.slot').each(function() {
                        if ($('.dndDragContainer', this).length == properties[0].numberOfDroppables) {
                            $(this).droppable("option", "disabled", true);
                        } else {
                            $(this).droppable("option", "disabled", false);
                        }
                    });
                    $('#' + id + ' .dndContainer.htmlMode .dndHTML .slot').each(function() {
                        if ($('.dndDragContainer', this).length == properties[0].numberOfDroppables) {
                            $(this).droppable("option", "disabled", true);
                        } else {
                            $(this).droppable("option", "disabled", false);
                        }
                    });
                }
            });
            
            if (componentType == 'free') {
            // $('#'+id+' .slot').droppable({tolerance:'touch'});
            }
            $('#' + id + ' .dndComponentDataList.slot').droppable({tolerance: 'touch'});
            $('#' + id + ' .slot').droppable({
                drop: function(event, ui) {
                    var previousParent = ui.draggable.parent();
                    if (typeof (header) != "undefined" && header.length != 0) {
                        if (header[0].withCounter) {
                            $('#' + id + ' tfoot .dndCell[data-index=' + ($(this).attr('data-index') - 1) + ']').html($('.dndDragContainer', this).length + 1);
                            $('#' + id + ' .ui-draggable-dragging').attr('droppable', $(this).attr('data-index'));
                        }
                    }
                    ui.draggable.draggable('option', 'revert', true);

                    $(this).find(".slotDefaultText").hide();    

                    if (clone) {
                        //$('#'+id+' .dndComponentDataList').droppable( "option", "disabled", true);
                        //console.log("5");
                        if ($(ui.draggable).parent().hasClass('dndComponentDataList')) {
                            if (!$(event.target).hasClass("dndComponentDataList")) {
                                // start modification - adjust position of cloned droppable to 0 by Wissam Hobeika
                                var clonedDraggable = $(ui.draggable).clone();  
                                $(this).find(".innerSlot").append(clonedDraggable);
                                $(clonedDraggable).css('top', "0px");
                                $(clonedDraggable).css('left', "0px"); 
                                // end modification
                            }
                        } else {
                            if ($(event.target).hasClass("dndComponentDataList")) {
                                ui.draggable.remove();
                            } else {
                                ui.draggable.appendTo($(this));
                            }
                        }
                        $('#' + id + " .dndDragContainer").removeClass("ui-draggable-dragging");
                        $('#' + id + " .dndCell .dndDragContainer").draggable({
                            containment: 'slot',
                            snap: 'slot',
                            snapMode: 'inner',
                            revert: 'invalid',
                            scroll: 'false',
                            stop: function() {
                                $('#' + id + ' .dndTable .slot').each(function() {
                                    if ($('.dndDragContainer', this).length == properties[0].numberOfDroppables) {
                                        $(this).droppable("option", "disabled", true);
                                    } else {
                                        $(this).droppable("option", "disabled", false);
                                    }
                                });
                            }
                        });
                        
                    } else {
                        var droppbaleElement = $(this).find(".innerSlot");
                        if (droppbaleElement.length == 0)
                            droppbaleElement = $(this);

                        if (droppbaleElement.hasClass("dndComponentDataList")){
                            var elementDropped = false;
                            $.each(droppbaleElement.find(".dndDragContainer"),function(){
                                var $this = $(this);
                                if ($this.attr("data-uniqueindex") > ui.draggable.attr("data-uniqueindex")){
                                    elementDropped = true;
                                    ui.draggable.insertBefore($this);  
                                    ui.draggable.css('top', "0px");
                                    ui.draggable.css('left', "0px");  
                                    return false;
                                }
                            });
                            if (!elementDropped){
                            	var dndDragContainerWrapper = droppbaleElement.find(".dndDragContainerData");
                            	if (dndDragContainerWrapper.length > 0){
					ui.draggable.appendTo(dndDragContainerWrapper);	
                            	}else{
                            		ui.draggable.appendTo(droppbaleElement);	
                            	}
                                ui.draggable.css('top', "0px");
                                ui.draggable.css('left', "0px");       
                            }
                        }else{
                            ui.draggable.appendTo(droppbaleElement);
                            ui.draggable.css('top', "0px");
                            ui.draggable.css('left', "0px");    
                        }
                    }

                    if (previousParent.hasClass("innerSlot") && previousParent.children().length == 1){
                        previousParent.find(".slotDefaultText").show();
                    }else{
                        previousParent.find(".slotDefaultText").hide();    
                    }
                },
                out: function(even, ui) {
                    if (typeof (header) != "undefined" && header.length != 0) {
                        if (header[0].withCounter) {
                            if ($('#' + id + ' .ui-draggable-dragging').attr('droppable') == $(this).attr('data-index')) {
                                $('#' + id + ' tfoot .dndCell[data-index=' + ($(this).attr('data-index') - 1) + ']').html($('.dndDragContainer', this).length - 1);
                                $(this).attr('dropped', false);
                            }
                        }
                    }
                }
            });
        }
    }
});
