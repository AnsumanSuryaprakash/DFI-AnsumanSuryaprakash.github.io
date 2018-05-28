var itemDivLoadingScreen;
var pagesContainer;
var pagesContainerData;
var pagesContainerDataChildren;
var objectLeft;
var objectTop;
var arrPagesToLoad = [];
var tempContainer;
$(document).ready(function ()
{
	ProcessInitialize();
	$(window).unload(function(){
		ProcessTerminate();			
	});
	var panelStatus = false;
	pagesContainer = $("#pagesContainer");
	pagesContainerData = $("#pagesContainerData");
	itemDivLoadingScreen = $('.loadingScreenHidden');
	tempContainer = $("#tempContainer");
	
	$(".backToMenu").hammer().on("tap",function(event){
		self.location.href = "../readingSubject.html";
	});

	
	$(".activityElement").hammer().on("tap",function(event){
		var $this = $(this);
		$('#goBack').hide();
		var pageNumber = $this.attr("data-pageNumber");
		arrPagesToLoad = [];
		arrPagesToLoad.push({Page:arrAllPages[pageNumber]});
		objectLeft = $this.position().left + 20;
		objectTop = $this.position().top + 20;	
		itemDivLoadingScreen.removeClass("loadingScreenHidden");
		itemDivLoadingScreen.addClass("loadingScreenVisible");
		getHTML(arrPagesToLoad[0]);

	});
	
	$("#pagesContainerClose").hammer().on("tap",function(event){
		// ProcessTerminate();
		ScormProcessCommit();
		closePage(event);
	});
});

var closePage = function(event){
	event.gesture.preventDefault();
	event.stopPropagation();
	var angle = 0;
	if (pagesContainer.attr("flag") == "0")
		return;
	if (globalAudioPlaying)
		stopAndHideAudio(event);
	$(".contentData").hide();
	pagesContainer.attr("flag","0");
	pagesContainer.animate(
		{
			top:objectTop,
			left:objectLeft,
			height:"0%",
			width:"0%",
		},
		{
			step: function(now,fx) {
				/*angle -=2;
				$(this).css('-webkit-transform','rotate(' + angle + 'deg)'); */
			},
			duration:500,
			complete: function(){
				pagesContainer.css("top","0");
				pagesContainer.css("left","0");
				pagesContainer.css("display","none");
				/*pagesContainer.removeClass("displayBlock");
				pagesContainer.addClass("displayNone");*/
				//$(this).css('-webkit-transform','rotate(0deg)'); 
				pagesContainerDataChildren = pagesContainerData.children();
				pagesContainerDataChildren.appendTo(tempContainer);
			     $('#goBack').show();
			}
		}
	);
}


var getHTML = function(page){
	var arrFiltered = $.grep(arrPagesHTML, function(n, k){
		return (n.Page == page.Page && n.Loaded == 1);
	});
	if (arrFiltered.length == 0){
		$.get("html/" + page.Page + ".html", function(data){
			var responseData = $(data);
			var  textareas = responseData.find('textarea') ;
            if(textareas.length > 0)
            {
                for(var i = 0 ; i < textareas.length ; i++)
                {
                    // textareas[i].setAttribute('autocapitalize','off');
                    textareas[i].setAttribute('autocorrect','off');
                    textareas[i].setAttribute('onblur','inputText_onBlur();');
                }
            }
            var  inputs = responseData.find('input') ;
            if(inputs.length > 0)
            {
                for(var i = 0 ; i < inputs.length ; i++)
                {
                    // inputs[i].setAttribute('autocapitalize','off');
                    inputs[i].setAttribute('autocorrect','off');
                    inputs[i].setAttribute('onblur','inputText_onBlur();');
                }
            }
			var containerContent = responseData.filter('div.container')[0].outerHTML;
			var arrStyles = [];
			var arrScripts = [];
			var pageItems;
			
			responseData.filter('script').each(function(index, element) {
				arrScripts.push({Page:page.Page, Script:element, Loaded:0});
			});
			
			responseData.filter('link').each(function(index, element) {
				arrStyles.push({Page:page.Page, Style:element, Loaded:0});
			});
			
			arrPagesHTML.push({Page:page.Page, HTML:containerContent, Loaded:1});		
			//var carouselItem = page.PageContainer;
			containerContent = "<div class='currentPageName' id='" + page.Page + "' style='width:100%;height:100%;'>" + containerContent + "</div>";
			pagesContainerData.html(containerContent);
			//carouselItem.replaceWith(containerContent);
			
			//var itemDivLoadingScreen = carouselItem.find('.loadingScreenHidden');
			//itemDivLoadingScreen.removeClass("loadingScreenHidden");
			//itemDivLoadingScreen.addClass("loadingScreenVisible");
			
			//pageItems = {Page:page.Page, DivLoadingScreen:itemDivLoadingScreen, PageContainer:carouselItem};
			pageItems = {Page:page.Page};
			
			getStyles(arrStyles,arrScripts,pageItems);
			arrPagesToLoad.shift();
			page = arrPagesToLoad[0];
			if(page != undefined)
				getHTML(page); 
		});
	}else{
		//arrPagesToLoad.shift();
		page = arrPagesToLoad[0];
		displayPage(page.Page,true);
		/*if (page != undefined)
			getHTML(page);
		else
			displayPage();*/
	}
};

var getStyles = function(arrStyles,arrScripts,pageItems){
	loadStyles(arrStyles,loadStylesCallback,arrScripts,pageItems);
};

var loadStyles = function(array,callback,arrScripts,pageItems){
    var loader = function(item,handler){
		var href = $(item.Style).attr("href");
		var len = $('link[href*="' + href + '"]').length;
		if (len == 0){
			var style = document.createElement("link");
			style.rel = "stylesheet";
			style.href = href;
			style.onload = style.onreadystatechange = function(){
			style.onreadystatechange = style.onload = null;
				handler();
			}
			var head = document.getElementsByTagName("head")[0];
			(head || document.body).appendChild(style);
		}else{
			handler();
		}
    };
    (function(){
        if(array.length!=0){
        	loader(array.shift(),arguments.callee);
        }else{
        	//callback && callback();
			callback(arrScripts,pageItems)
        }
    })();
}

var loadStylesCallback = function(arrScripts,pageItems){
	getScripts(arrScripts,pageItems);
}

var getScripts = function(arrScripts,pageItems){
	loadScripts(arrScripts,loadScriptsCallback,pageItems);
};

var loadScripts = function(array,callback,pageItems){
    var loader = function(item,handler){
		var src = $(item.Script).attr("src");
		var len = $('script[src*="' + src + '"]').length;
		if (len == 0){ 		
			var script = document.createElement("script");
			script.type = 'text/javascript';
			script.src = src;
			script.async = true;
			script.onload = script.onreadystatechange = function(){
				script.onreadystatechange = script.onload = null;
				handler();
			}	
			/*var head = document.getElementsByTagName("head")[0];
			(head || document.body).appendChild(script);*/
			var s = document.getElementsByTagName('script')[0];
 			s.parentNode.insertBefore(script, s);
		}else{
			handler();
		}
    };
    (function(){
        if(array.length!=0){
        	loader(array.shift(),arguments.callee);
        }else{
        	//callback && callback();
			callback(pageItems)
        }
    })();
}

var loadScriptsCallback = function(pageItems){
	/*pageItems.PageContainer.hide();
	pageItems.PageContainer.show();
	pageItems.DivLoadingScreen.removeClass("loadingScreenVisible");
	pageItems.DivLoadingScreen.addClass("loadingScreenHidden");*/
	
	
	//pagesContainer.show();
	
	
	//console.timeEnd('timerName');
	//console.log('All scripts are loaded');
	displayPage(pageItems.Page,false);
}

var displayPage = function(pageNumber,paintObject){
	//var angle = -360;
	var compContainer = $("#" + pageNumber + " .contentData");
	if (paintObject){
		var pageToAppend = tempContainer.find("#" + pageNumber);
		pageToAppend.addClass('currentPageName');
		pagesContainerData.html("");
		pagesContainerData.append(pageToAppend);
	}

	itemDivLoadingScreen.removeClass("loadingScreenVisible");
	itemDivLoadingScreen.addClass("loadingScreenHidden");
	
	pagesContainer.css("top",objectTop);
	pagesContainer.css("left",objectLeft);
	pagesContainer.css("display","block");
	pagesContainer.attr("flag","1");
	/*pagesContainer.removeClass("displayNone");
	pagesContainer.addClass("displayBlock");
	pagesContainer.attr("flag","1");*/
	compContainer.hide();
	/*compContainer.show();
	compContainer.show();*/
	pagesContainer.animate(
		{
			top:0,
			left:0,
			height:"100%",
			width: "100%",
		},
		{
			step: function(now,fx) {
				/*angle +=3;
				
				if (angle > 0)
					angle = 0;
				$(this).css('-webkit-transform','rotate(' + angle + 'deg)'); */
			},
			duration:500,
			complete:function(){
				// compContainer.fadeOut("fast");
				compContainer.hide("fast");
				compContainer.css({"opacity":"0"});
				// compContainer.show();
				compContainer.show("fast", function(){
					compContainer.fadeIn("slow", function(){
						$(window).resize();
						compContainer.css({"opacity":"1"});
						$(window).resize();
					});
				});

				resizePageComponent(pageNumber);
			}
		}
	);
	$(".closeScreen").hammer().off('tap').on("tap",function(event){
		gatherCustomPageData();
		$(".contentData").hide();
		if (globalAudioPlaying){
			stopAndHideAudio();
		}
		$('.currentPageName').removeClass('currentPageName');
		closePage(event);
	});
	$(".audioIcon").hammer().on("tap",function(event){
		if (globalAudioPlaying)
			stopAndHideAudio(event);
		var $this = $(this);
		var audioSource = $this.attr("audiosource");
		globalAudioIcon = $this;
		globalAudioSource = "";
		globalAudioTemplate = "";
		globalAudioShowPlayer = true;
		activateAudio();
		// if($(event.currentTarget).parent().hasClass("instructionText"))
			$(event.currentTarget).parent().find(".audioText").addClass("audioHighlight");
			// $(event.currentTarget).parent().find(".audioText").css("background", "rgba(41,171,226,0.6)");
	});
	var startPosition = 0 ;
	$('#leftPanel').hammer().on("drag",'.content' ,function(event) {
		this.scrollTop = startPosition +  event.gesture.deltaY;
	});

	$('#leftPanel').hammer().on("dragstart",'.content' ,function(event) {	
		var element = $(this);
		if( element.attr('data-startposition') === undefined ){
			element.attr('data-startposition',0); 
		}
		startPosition =  startPosition + event.gesture.deltaY
		element.attr('data-startposition',startPosition); 
	});

	$('#leftPanel').hammer().on("dragend",'.content' ,function(event) {
		$(this).attr('data-startposition',(startPosition + event.gesture.deltaY)); 
		startPosition =  startPosition + event.gesture.deltaY;
	});
	var startPositionAnswer = 0 ;
	$('#leftPanel').hammer().on("drag",'.ccFirstContent' ,function(event) {
		this.scrollTop = startPositionAnswer +  event.gesture.deltaY;
	});

	$('#leftPanel').hammer().on("dragstart",'.ccFirstContent' ,function(event) {	
		var element = $(this);
		if( element.attr('data-startposition') === undefined ){
			element.attr('data-startposition',0); 
		}
		startPositionAnswer =  startPositionAnswer + event.gesture.deltaY
		element.attr('data-startposition',startPositionAnswer); 
	});

	$('#leftPanel').hammer().on("dragend",'.ccFirstContent' ,function(event) {
		$(this).attr('data-startposition',(startPositionAnswer + event.gesture.deltaY)); 
		startPositionAnswer =  startPositionAnswer + event.gesture.deltaY;
	});
	if($('.overflowY').length >0)
		enableDraggingOnItem('overflowY');
	if($('.leftImages').length >0)
		enableDraggingOnItem('leftImages');
	 //Darine
            addVideoEvents($('.currentPageName video'));
}