// JavaScript Document
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};
function playAudio(audiosource){
	var obj = document.createElement("img");
	obj.className = "audioIcon audioIconPopUp";
	obj.setAttribute("audiosource",audiosource);
	
	if (globalAudioPlaying)
			stopAndHideAudio(event);
		var $this = $(obj);
		var audioSource = $this.attr("audiosource");
		globalAudioIcon = $this;
		globalAudioSource = "";
		globalAudioTemplate = "";
		globalAudioShowPlayer = true;
		activateAudio();
}
function inputText_onBlur(){
	document.activeElement.blur();
	window.scroll(0,0);
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

var getHexBackgroundColor = function(color) {
    var rgb = color;
    if (!rgb) {
        return '#FFFFFF';
    }
    var hex_rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    if (hex_rgb) {
        return "#" + hex(hex_rgb[1]) + hex(hex_rgb[2]) + hex(hex_rgb[3]);
    } else {
        return rgb;
    }
}
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function resizeDiv(slideName){
	if($("#" + slideName + " .pageContentContainer .instructionalTextWrapper").length>0){
		var headerHeight = $("#" + slideName + " .pageContentContainer .instructionalTextWrapper").innerHeight();
		var pageContentContainerHeight = $("#" + slideName + " .pageContentContainer").height();
		$("#" + slideName + " .pageContentContainer .contentWrapper").height(pageContentContainerHeight - headerHeight);
	}
	if (typeof MathJax !== 'undefined') 
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub],slideName);
}
function resizeComponent(componentId){
	if($("#" + componentId + " .componentInstructionalTextWrapper").length>0){
		var headerHeight = $("#" + componentId + " .componentInstructionalTextWrapper").innerHeight();
		$("#" + componentId + " .componentContentWrapper").css('top', headerHeight);
		$("#" + componentId + " .componentContentWrapper").hide();
		$("#" + componentId + " .componentContentWrapper")[0].innerHeight;
		setTimeout(function(){
			$("#" + componentId + " .componentContentWrapper").show();
			$("#" + componentId + " .componentContentWrapper")[0].innerHeight;
		},100);
	}
	if (typeof MathJax !== 'undefined') 
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub],componentId);
}
function resizePageComponent(pageId){
	if($("#" + pageId + " .componentInstructionalTextWrapper").length>0){
		var headerHeight = $("#" + pageId + " .componentInstructionalTextWrapper").innerHeight();
		$("#" + pageId + " .componentContentWrapper").css('top', headerHeight);
	}
	if (typeof MathJax !== 'undefined') 
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub],pageId);
}

function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	
	return true;
}

function textArea_onBlur(){
	document.activeElement.blur();
	window.scroll(0,0);
}

/* For binding "hide" and "show" events to any html element*/
(function($) {
    $.each(['show','hide'], function(i, val) {
		var _org = $.fn[val];
		$.fn[val] = function() {
	        this.trigger(val);
	        _org.apply(this, arguments);
		};
	});
})(jQuery);
function isTouchDevice(){
	try{
		document.createEvent("TouchEvent");
		return true;
	}catch(e){
		return false;
	}
}
function enableDraggingOnItem(id){
	if(isTouchDevice()){ //if touch events exist...
		var el=document.getElementById(id);
		var scrollStartPos=0;
 		if(el == null){

 			var galleryTexts = document.querySelectorAll(id);
			for(var g=0;g<galleryTexts.length;g++){
				galleryTexts[g].addEventListener("touchstart", function(event) {
					scrollStartPos=this.scrollTop+event.touches[0].pageY;
					// event.preventDefault();
				},false);
		 
				galleryTexts[g].addEventListener("touchmove", function(event) {
					this.scrollTop=scrollStartPos-event.touches[0].pageY;
					// event.preventDefault();
				},false);
			}
		}else{
			document.getElementsByClassName(id)[0].addEventListener("touchstart", function(event) {
				scrollStartPos=this.scrollTop+event.touches[0].pageY;
				// event.preventDefault();
			},false);
	 
			document.getElementsByClassName(id)[0].addEventListener("touchmove", function(event) {
				this.scrollTop=scrollStartPos-event.touches[0].pageY;
				// event.preventDefault();
			},false);
		}
	}
}
function gatherCustomPageData(){
	//var currentScormPage = parseInt($('.currentPageName').attr('id').slice(4)) - 1;
	var currentScormPage = $('.currentPageName').attr('id');
	var filterArray = $.grep(globalScormPages,function(n,i){
		return n.page == currentScormPage;
	})
	//var pageType = globalScormPages[currentScormPage].type;
	var pageType = filterArray[0].type;
	var currentPage = $('.currentPageName').attr('id');
	if(pageType.indexOf('custom')!=-1){
		//for(var assNb = 0; assNb < globalScormPages[currentScormPage].assessmentType.length; assNb++){
		for(var assNb = 0; assNb < filterArray[0].assessmentType.length; assNb++){
			switch(filterArray[0].assessmentType[assNb]){
				case 'textArea':
					var txtAreas = $('.currentPageName textarea');
					for(var t = 0; t < txtAreas.length; t++){
						var content = txtAreas[t].value;
						if(content.length > 0)
							ProcessSetValue('custom',currentPage,currentPage+'_textarea_'+(t+1),0,0,content,'', 'Text Area - Open Assessment');
					}
					break;
				case 'video':
					var videoFilter = $.grep(videoPageData,function(n,i){
						return n.page == currentScormPage;
					});
					if(videoFilter[0] != undefined && typeof(videoFilter[0]) != "undefined")
						if(videoFilter[0].timesPlayed > 0)
							ProcessSetValue('custom',currentPage,currentPage+'_video',0,0,JSON.stringify(videoFilter[0]),'', 'Video');
					break;
			}
		}
	}
	if(pageType.indexOf('presentation')!=-1){
		var objID = filterArray[0].presentationType;
		while(objID.indexOf(' ') != -1)
			objID = objID.replace(" ", '_');
		ProcessSetValue('presentation',currentPage,currentPage+'_'+objID,0,0,0,0, filterArray[0].presentationType);
	}
}
// function checkVideoContent(pageNumber){
// 	var isVideo = false;
// 	var page = globalScormPages[pageNumber];
// 	for(var assNb = 0; assNb < page.assessmentType.length; assNb++){
// 		if(page.assessmentType[assNb] == 'video'){
// 			isVideo = true;
// 		}
// 	}
// }
function videoIsPlayed(){
	console.log('played');
}
function addVideoEvents(video){
	if(video.length > 0){
		for(i=0; i<video.length; i++){
			video[i].onplay = function(){
				//console.log('played');
				var currentPage = $('.currentPageName').attr('id');
				var videoFilter = $.grep(videoPageData,function(n,i){
					return n.page == currentPage;
				});
				if(videoFilter == 0){
					videoPageData.push({'page': currentPage, 'timesPlayed': 1, 'timesPaused': 0, 'pausedAt': [], 'timesCompleted': 0});
				}else if(videoFilter[0].timesCompleted > 0){
					videoFilter[0].timesPlayed += 1;
				}
			}
			video[i].onpause = function(){
				//console.log('paused');
				var currentPage = $('.currentPageName').attr('id');
				var videoFilter = $.grep(videoPageData,function(n,i){
					return n.page == currentPage;
				});
				if(videoFilter != 0){
					videoFilter[0].timesPaused +=1;
					videoFilter[0].pausedAt.push(Math.round($('#'+currentPage+' video')[0].currentTime *100) /100);
				}
			}
			video[i].onended = function(){
				//console.log('ended');
				var currentPage = $('.currentPageName').attr('id');
				var videoFilter = $.grep(videoPageData,function(n,i){
					return n.page == currentPage;
				});
				if(videoFilter != 0){
					videoFilter[0].timesCompleted +=1;
					videoFilter[0].timesPaused -=1;
				}
			}
		}
	}
}