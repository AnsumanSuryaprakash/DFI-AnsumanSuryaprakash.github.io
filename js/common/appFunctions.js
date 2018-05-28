var totalScore = 0;
var startScore = 0;
var scoreArray = new Array;
var objectivesArray = new Array;

function ScanForAPI(win){} 
function GetAPI(win){}

startTimeStamp = new Date();
function ProcessInitialize(){
	ScormProcessInitialize();
	var numberOfExistingObjectives = ScormProcessGetValue('cmi.objectives._count');
	for(var j =0;j<numberOfExistingObjectives;j++ ){
		objectivesArray[j] = ScormProcessGetValue('cmi.objectives.'+j+'.id');    	
	}  
	if(ScormProcessGetValue('cmi.core.score.raw') != ""){
		startScore = parseInt(ScormProcessGetValue('cmi.core.score.raw'));
	}
}
function ProcessTerminate(reset){	    
	var endTimeStamp = new Date();
	var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
	var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);        
	ScormProcessSetValue('cmi.core.session_time', scormTime);	             
	if(parseInt(ScormProcessGetValue('cmi.core.lesson_location')) == arrAllPages.length){        
		ScormProcessSetValue('cmi.core.lesson_status','completed')        
	}else{
		ScormProcessSetValue('cmi.core.lesson_status','incomplete')
	}    
	var correctArray= new Array;
	correctArray = jQuery.grep(scoreArray, function(value) {
		return value != 'wrong';
	});    
	
	totalScore =  Math.round(correctArray.length * globalScormHighestScore / globalInteractions);
	ScormProcessSetValue("cmi.core.score.raw", totalScore + startScore);
	ScormProcessSetValue("cmi.core.score.min", "0");
	ScormProcessSetValue("cmi.core.score.max", 100);
    /*if(totalScore >= 50){
        ScormProcessSetValue('cmi.core.lesson_status','passed') 
    }else{
        ScormProcessSetValue('cmi.core.lesson_status','failed')    }*/ 

    ScormProcessFinish();
    // if(typeof(reset) != undefined && typeof(reset) != 'undefined')
    // 	if(reset)
    // 		ProcessInitialize();
}

function ProcessGetValue(element, checkError){}

function ProcessSetValue(componentType,interactionId, objectiveId, attemptNumber, numberOfAttempts, answerValue, contentData, componentName){	
	var filteredArray = $.grep(globalScormPages, function(i,n){
		return i.page == interactionId;
	});
	if(componentType == 'component'){        
		if(answerValue == 'correct')
			answerValue = 'Correct';
		else if(answerValue == 'wrong')
			answerValue == 'Wrong';
		var numberOfInteractions = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		var numberOfObjectives = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		attemptNumber = parseInt(attemptNumber);
		var myflag = 0;
		for(k=0;k<numberOfInteractions;k++){
			if(ScormProcessGetValue('cmi.objectives.'+k+'.id') == objectiveId){
				myflag = 1;
				break;
			}
		}
		if (myflag == 0){            
			if(answerValue == 'Correct' && attemptNumber == 1){
				ScormProcessSetValue('cmi.interactions.'+numberOfInteractions+'.id',interactionId);
				ScormProcessSetValue('cmi.objectives.'+numberOfObjectives+'.id',objectiveId);    	
				ScormProcessSetValue('cmi.interactions.'+numberOfInteractions+'.student_response',objectiveId+', '+componentName+' - Assessment, '+interactionId+', attempt 1: Correct, '+ contentData);    
				scoreArray.push(answerValue);                  
				// console.log(interactionId+','+objectiveId+':'+answerValue);
			}else if(attemptNumber == numberOfAttempts){
				ScormProcessSetValue('cmi.interactions.'+numberOfInteractions+'.id',interactionId);
				ScormProcessSetValue('cmi.objectives.'+numberOfObjectives+'.id',objectiveId); 
				ScormProcessSetValue('cmi.interactions.'+numberOfInteractions+'.student_response',objectiveId+', '+componentName+' - Assessment, '+interactionId+', attempt '+attemptNumber+': '+answerValue+', '+contentData);         
				// console.log(interactionId+','+objectiveId+':'+answerValue);
				scoreArray.push(answerValue);                
			} 
		}
	}else if(componentType == 'custom'){
		var numberOfInteractions = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		var numberOfCustomInteractions = parseInt(ScormProcessGetValue('cmi.interactions._count'));
		var myflag = 0;
		var objNum = 0;
		for(k=0;k<numberOfInteractions;k++){
			if(ScormProcessGetValue('cmi.objectives.'+k+'.id') == objectiveId){
				myflag = 1;
				objNum = k;
				break;
			}
		}
		var numberOfObjectives = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		if (myflag == 0){            
			ScormProcessSetValue('cmi.interactions.'+numberOfCustomInteractions+'.id',interactionId);
			ScormProcessSetValue('cmi.objectives.'+numberOfObjectives+'.id',objectiveId); 
			ScormProcessSetValue('cmi.interactions.'+numberOfCustomInteractions+'.student_response',componentName+', '+interactionId+', '+objectiveId+': '+answerValue);
		}else{
			ScormProcessSetValue('cmi.interactions.'+objNum+'.student_response',componentName+', '+interactionId+', '+objectiveId+': '+answerValue);
		}
		// console.log(interactionId+','+objectiveId+':'+answerValue);
	}else if(componentType == 'presentation'){
		var numberOfInteractions = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		var numberOfCustomInteractions = parseInt(ScormProcessGetValue('cmi.interactions._count'));
		var numberOfObjectives = parseInt(ScormProcessGetValue('cmi.objectives._count'));
		var myflag = 0;
		var objNum = 0;
		for(k=0;k<numberOfInteractions;k++){
			if(ScormProcessGetValue('cmi.objectives.'+k+'.id') == objectiveId){
				myflag = 1;
				objNum = k;
				break;
			}
		}
		// ScormProcessSetValue('cmi.interactions.'+numberOfCustomInteractions+'.id',interactionId);
		ScormProcessSetValue('cmi.objectives.'+numberOfObjectives+'.id',objectiveId); 
		if (myflag == 0){            
			ScormProcessSetValue('cmi.interactions.'+numberOfCustomInteractions+'.student_response',componentName+', '+interactionId+', Presentation Page - Visited');
		}else{
			ScormProcessSetValue('cmi.interactions.'+objNum+'.student_response',componentName+', '+interactionId+', Presentation Page - Visited');
		}
		// console.log(interactionId+','+objectiveId+':'+answerValue);
	}
}

//Functions Called By App
// var appCallBack = function(data) {
// 	var methodName = data.method;
// 	switch(methodName)
// 	{
// 		case 'getPagesData':
// 			var parameters = data.parameters;
// 			globalArrPagesData.push(parameters);
// 		break;
// 		case 'getPageAnnotations':
// 			var parameters = data.parameters;
// 			dispatchPagesAnnotations(parameters); //TODO: parse 'getPageAnnotations' received
// 		break;
// 		case 'getPageName':
// 			var parameters = data.parameters;
// 			setPageName(parameters);
// 		break;
// 	}
// };

// function getPagesData(componentId){
// 	if (Mt.App != undefined){
// 		var appCodeDelegate = "CallNativeCode";
// 		Mt.App.fireEvent(appCodeDelegate, { 
// 			method: 'getPagesData',
// 			parameters: arrPages
// 		});
// 	}	
// 	if($.inArray(componentId,objectivesArray) == -1){
// 		return false
// 	}else{
// 		return true;
// 	}
// }

// function savePageName(pageName){
//     var appCodeDelegate = "CallNativeCode";
// 	Mt.App.fireEvent(appCodeDelegate, { 
//         method: 'savePageName',
//         parameters: pageName
//     });
// }

// function getPageName(){
//     /*var appCodeDelegate = "CallNativeCode";
//     Mt.App.fireEvent(appCodeDelegate, { 
//         method: 'getPageName'
//     });*/
// }

// function setPageName(params){
//     var pageno;
//     if(arrAllPages.indexOf(params) == null){
//     	pageno = 0;
//     }else{
//     	pageno = arrAllPages.indexOf(params);
// 	}
// 	navigateToSlide(pageno);	
// }

function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, blnIncludeFraction){

	var intHours;
	var intintMinutes;
	var intSeconds;
	var intMilliseconds;
	var intHundredths;
	var strCMITimeSpan;	
	if (blnIncludeFraction == null || blnIncludeFraction == undefined){
		blnIncludeFraction = true;
	}	
    //extract time parts
    intMilliseconds = intTotalMilliseconds % 1000;
    intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;
    intMinutes = ((intTotalMilliseconds - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;
    intHours = (intTotalMilliseconds - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;
    /*
    deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
    to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
    note - this case is permissable under SCORM, but will be exceptionally rare
    */
    if (intHours == 10000) 
    {	
    	intHours = 9999;
    	intMinutes = (intTotalMilliseconds - (intHours * 3600000)) / 60000;
    	if (intMinutes == 100) 
    	{
    		intMinutes = 99;
    	}
    	intMinutes = Math.floor(intMinutes);		
    	intSeconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
    	if (intSeconds == 100) 
    	{
    		intSeconds = 99;
    	}
    	intSeconds = Math.floor(intSeconds);		
    	intMilliseconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
    }

    //drop the extra precision from the milliseconds
    intHundredths = Math.floor(intMilliseconds / 10);
    //put in padding 0's and concatinate to get the proper format
    strCMITimeSpan = ZeroPad(intHours, 4) + ":" + ZeroPad(intMinutes, 2) + ":" + ZeroPad(intSeconds, 2);	
    if (blnIncludeFraction){
    	strCMITimeSpan += "." + intHundredths;
    }
    //check for case where total milliseconds is greater than max supported by strCMITimeSpan
    if (intHours > 9999) 
    {
    	strCMITimeSpan = "9999:99:99";
    	
    	if (blnIncludeFraction){
    		strCMITimeSpan += ".99";
    	}
    }
    return strCMITimeSpan;
    
}

function ZeroPad(intNum, intNumDigits){
	var strTemp;
	var intLen;
	var i;	
	strTemp = new String(intNum);
	intLen = strTemp.length;	
	if (intLen > intNumDigits){
		strTemp = strTemp.substr(0,intNumDigits);
	}else{
		for (i=intLen; i<intNumDigits; i++){
			strTemp = "0" + strTemp;
		}
	}	
	return strTemp;
}	