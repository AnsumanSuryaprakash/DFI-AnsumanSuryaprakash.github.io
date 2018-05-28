(function($){
	$.fn.goFullScreen = function(options) {		
	
		var componentContainer = $(this);
		
		$.fn.goFullScreen.defaults = {
			isThumbnail		:	false,
			thumbnailType	:	"",
			thumbnailData	:	"",
			withRubric		:	true
		};
		var settings = $.extend({}, $.fn.goFullScreen.defaults, options);

		var isThumbnail = settings.isThumbnail;
		var thumbnailType = settings.thumbnailType;
		var thumbnailData = settings.thumbnailData;
		var template = settings.template;
		//var flashCards = settings.flashCardsFS;
		//var flashcardSize = settings.flashcardSize;
		var withRubric = settings.withRubric;

		var fullScreenContainer = $("#fullScreenContainer");	
		var fullScreenData = $("#fullScreenData");		
		var fullScreenClose = $("#fullScreenClose");
		
		var fullScreenIconUrl = "images/fullScreenIcons/" + template + ".png";
		var componentToReveal = $(componentContainer.children()); 
		var componentContainerParent = $(componentContainer.parent());
		var componentContainerId = componentContainer.attr("id");
		var mainParent = $(componentContainerParent.parent());
		var rubricPanel = mainParent.find(".rubricPanel");
		//rubricPanel.attr("id", "rubricPanel_" + componentContainerId);
		var thumbnailObject, thumbnailLink, fullScreenIconContainer, fullScreenIcon;
		
		function createFullscreenItem(){ 
			if(!isThumbnail)
			{
				fullScreenIconContainer = $("<div>")
											.attr("class","fullScreenIconContainer");
				fullScreenIcon = $("<img>")
									.attr("id", "fullScreenIcon_" + componentContainerId) 
									.attr("src", fullScreenIconUrl)
									.attr("class", "fullScreenIcon")
									.on("click",function(){
										toggleFullScreen();
									});
				fullScreenIcon.appendTo(fullScreenIconContainer);
				componentContainerParent.prepend(fullScreenIconContainer);
			}else{
				thumbnailLink = $("<div>")
									.attr("id", "thumbnailLink_" + componentContainerId).attr("class", "fullScreenThumbnailLink");
									// .attr("class", "fullScreenThumbnailLink positionRelative");
				switch(thumbnailType){
					case fullscreen_thumbnailTypeEnum.Img:
						thumbnailObject = $("<img>")
											.attr("src", thumbnailData).attr("class","propDimensions cursorPointer positionRelative");
											// .attr("class","propDimensions cursorPointer positionRelative");
						break;
					case fullscreen_thumbnailTypeEnum.Button:
						thumbnailObject = $("<div>")
											.html(thumbnailData).attr("class","c2Button propDimensions cursorPointer textColor_" + template);
											// .attr("class","positionRelative c2Button propDimensions cursorPointer textColor_" + template);
						break;
					defaults:
						thumbnailObject = $("<img>")
											.attr("src", thumbnailData).attr("class","propDimensions cursorPointer");
											// .attr("class","propDimensions cursorPointer positionRelative");
						break;
				} 
				thumbnailObject.on("click",function(){
					toggleFullScreen();
				})
				thumbnailObject.appendTo(thumbnailLink);   
				thumbnailLink.appendTo(componentContainerParent);
				componentContainer.hide();
			}
		};
		
		createFullscreenItem();
		
		function toggleFullScreen() {
			fullScreenClose.on("click",closeFullScreen);
			// $('#sidr').outerWidth(!0);
			$("#panelIcon").attr("src","images/expandPanel.png");
			leftPanelStatus = false;
			fullScreenData.children().remove();
			var x = "insetShadow borderRadius backgroundWhite rowspan_6 fullScreenData " + template + "Border20";
			fullScreenData.get(0).className = x ;
			if (withRubric)
				rubricPanel.appendTo(fullScreenData);
				
			componentContainer.appendTo(fullScreenData);
			fullScreenContainer.fadeIn("slow");
			componentContainer.hide(); 
			componentContainer.show(); 
			componentContainer.show();
			componentContainer.addClass('fullScreenMode');
			if(globalAudioPlaying)
			{
				stopAndHideAudio();
			}
		};
		
		function closeFullScreen() {
			fullScreenClose.off("click",closeFullScreen);
			if(withRubric) 
				mainParent.prepend(rubricPanel);
			// $('#sidr').outerWidth(!0);
			componentContainer.appendTo(componentContainerParent);
			if(!isThumbnail){
				componentContainer.hide(); 
				componentContainer.show(); 
				componentContainer.show();
			}else{
				componentContainer.hide();
			}
				componentContainer.removeClass('fullScreenMode');
			fullScreenContainer.fadeOut("slow");
			if(globalAudioPlaying)
			{
				stopAndHideAudio();
			}
		};
	}
})(jQuery);