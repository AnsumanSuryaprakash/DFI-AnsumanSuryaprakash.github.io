/*
SlideShow 1.2
Gallery of assets (images, audio or videos), extends the Sliding Elements Component. Thumbnail view, title and scrollable description are linked to each asset.

Author: Wissam Hobeika

Copyright 2015, Dataflow International
Website: http://www.dataflowinternational.com

Released on 20/05/2015
*/
var slideshow = (function (id, pageName, parameters){
    var _this           =   this;
    var container   =   $('#'+id).addClass('slideshow');
    // if (parameters == undefined){
    //     var componentData = $.grep(globalArrComponentsData,function(n,k){
    //         return n.PageName == pageName && n.ComponentId == id && n.ComponentType == "textConversation"
    //     })
    //     parameters = componentData[0].ComponentParameters;
    // }
    $.fn.defaults = {
        withPagination  :   false,
        withArrows      :   false,
        initialSlide    :   0,
        direction       :   'LTR',
        withPhotoswipe  :   false,  
        isLooped        :   false,
        isAutoplayed    :   false,
        autoplaySpeed   :   500,
        componentData   :   [],
        fullscreen      :   false,
        isThumbnail     :   false,
        withRubric      :   false,
        fullScreenHeight    :   '93%',
        insideLms       :   false,
        template        :   templateType.Tatweer,
        thumbnailType   :   fullscreen_thumbnailTypeEnum.Button,
        thumbnailData   :   "",
        slideSpeed      :   500,
        withRubric      :   false,
        fullScreenHeight:   '93%',
        simulateTouch   :   false,
        resetToInitialSlide: false
    };

    var params          =   $.extend({}, $.fn.defaults, parameters);
    var withPagination  =   params.withPagination;
    var withArrows      =   params.withArrows;
    var direction       =   params.direction;
    var withPhotoswipe  =   params.withPhotoswipe;
    var isLooped        =   params.isLooped;
    var isAutoplayed    =   params.isAutoplayed;
    var autoplaySpeed   =   params.autoplaySpeed;
    var slideSpeed      =   params.slideSpeed;
    var componentData   =   params.componentData;
    var fullscreen      =   params.fullscreen;
    var isThumbnail     =   params.isThumbnail;
    var thumbnailType   =   params.thumbnailType;
    var thumbnailData   =   params.thumbnailData;
    var withRubric      =   params.withRubric;
    var fullScreenHeight=   params.fullScreenHeight;
    var template        =   params.template;
    var componentPageName =     params.componentPageName;
    var simulateTouch   =   params.simulateTouch;
    var resetToInitialSlide     =   params.resetToInitialSlide;
    var initialSlide    =   direction=='RTL' ? componentData.length-1 : 0;
    var videoSlides = [];

    _this.init = function(){
        var galleryThumbnails = document.createElement("div");
        galleryThumbnails.setAttribute("class", "leftImages "+componentPageName+"_LeftImages");

        for(var i=0;i<componentData.length;i++){
            var fig=document.createElement("figure");

            var hyperlink=document.createElement("a");
            hyperlink.setAttribute("href", "#");
            hyperlink.setAttribute("data-index", i);
            hyperlink.setAttribute("class", "img");

            var thumb=document.createElement("img");
            thumb.setAttribute("src", componentData[i].galleryThumb);
            
            if((componentData[i].galleryTitle != "") && (componentData[i].galleryTitle != undefined)){
                if((componentData[i].galleryText != "") && (componentData[i].galleryText != undefined)){
                    componentData[i].galleryText = "<h2>"+componentData[i].galleryTitle+"</h2>" + componentData[i].galleryText;
                }
            }
            hyperlink.appendChild(thumb);
            fig.appendChild(hyperlink);

            if (componentData[i].titleAsCaption && (componentData[i].galleryTitle != "" && componentData[i].galleryTitle != undefined)){
                    thumb.setAttribute("alt", componentData[i].galleryTitle);
                    var figCaption = document.createElement("figCaption");
                    figCaption.textContent = componentData[i].galleryTitle;
                    hyperlink.appendChild(figCaption);
            }else{
                if (componentData[i].galleryCaption != undefined && componentData[i].galleryCaption != "") {
                    thumb.setAttribute("alt", componentData[i].galleryCaption);
                    var figCaption = document.createElement("figCaption");
                    figCaption.textContent = componentData[i].galleryCaption;
                    hyperlink.appendChild(figCaption);
                }
            } 
            galleryThumbnails.appendChild(fig);
        }

        container.append(galleryThumbnails);
        enableDraggingOnItem("."+componentPageName+"_LeftImages");
        $("."+componentPageName+"_LeftImages figure:nth-of-type(1)").addClass("yellowBorder");
        var gallerySwiper = document.createElement("div");
        gallerySwiper.id = id+"_gallery";
        container.append(gallerySwiper);

        var swiperWrapper = new slidingElements(id+"_gallery", pageName, {
            withPagination  :   withPagination,
            withArrows      :   withArrows,
            slideDirection  :   "LTR",
            withPhotoswipe  :   withPhotoswipe,
            isLooped        :   isLooped,
            isAutoplayed    :   isAutoplayed,
            autoplaySpeed   :   autoplaySpeed,
            componentData   :   componentData,
            isThumbnail     :   isThumbnail,
            withRubric      :   withRubric,
            fullScreenHeight:   fullScreenHeight,
            template        :   template,
            componentPageName:  componentPageName,
            slideChangeCallBack: function(){
                if (globalAudioPlaying){
                    stopAndHideAudio();
                }
                _this.pausePlayer();
                var i  = swiperWrapper.pageSwiper.activeIndex;
                if(componentData[i].galleryVideo){
                var myPlayer = videojs(componentData[i].galleryId+"_video");
                if(componentData[i].videoLoop){
                    myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                    videojs(componentData[i].galleryId+"_video").ready(function(){
                        this.on("timeupdate", function(){
                            var whereYouAt = myPlayer.currentTime();
                            if ((whereYouAt < Number(myPlayer.a.childNodes[0].getAttribute("data-from"))) || (whereYouAt >= Number(myPlayer.a.childNodes[0].getAttribute("data-to")))) {
                                myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                            }
                        });
                    });
                }
            }
            },
            /*swiperCreatedCallback: function(){
                var i  = swiperWrapper.activeIndex;
                if(componentData[i].galleryVideo){
                var myPlayer = videojs(componentData[i].galleryId+"_video");
                if(componentData[i].videoLoop){
                    myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                    videojs(componentData[i].galleryId+"_video").ready(function(){
                        this.on("timeupdate", function(){
                            var whereYouAt = myPlayer.currentTime();
                            if ((whereYouAt < Number(myPlayer.a.childNodes[0].getAttribute("data-from"))) || (whereYouAt > Number(myPlayer.a.childNodes[0].getAttribute("data-to")))) {
                                myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                            }
                        });
                    });
                }
            }
            }*/
        });

        $("."+componentPageName+"_LeftImages a.img").hammer().on("tap", function(){
            $("."+componentPageName+"_LeftImages").find("figure").removeClass("yellowBorder");
            $(this).parent().addClass("yellowBorder");
            swiperWrapper.pageSwiper.reInit();
            swiperWrapper.pageSwiper.resizeFix();
            var newIndex = Number($(this).attr("data-index"));
            swiperWrapper.pageSwiper.swipeTo(newIndex);
        });


        enableDraggingOnItem(".galleryText");

        videoSlides = document.getElementsByTagName('video');
        
        setTimeout(function(){
            swiperWrapper.pageSwiper.reInit();
            swiperWrapper.pageSwiper.resizeFix();
        }, 750);
    };

    _this.checkVideoLoops = function (){
        var i  = swiperWrapper.activeIndex;
        // for(var i=0;i<componentData.length;i++){
            if(componentData[i].galleryVideo){
                var myPlayer = videojs(componentData[i].galleryId+"_video");
                if(componentData[i].videoLoop){
                    myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                    videojs(componentData[i].galleryId+"_video").ready(function(){
                        this.on("timeupdate", function(){
                            var whereYouAt = myPlayer.currentTime();
                            if ((whereYouAt < Number(myPlayer.a.childNodes[0].getAttribute("data-from"))) || (whereYouAt > Number(myPlayer.a.childNodes[0].getAttribute("data-to")))) {
                                myPlayer.currentTime(Number(myPlayer.a.childNodes[0].getAttribute("data-from")));
                            }
                        });
                    });
                }
            }
        // }
   }

   _this.pausePlayer = function () {
        for(var i = 0; i < videoSlides.length; i++){
            videoSlides[i].pause();
        }
    }
    _this.init();

});