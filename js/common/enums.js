// JavaScript Document
var templateType = {
	LanguageFocus:"languageFocus",
	LBD:"lbd",
	Listening:"listening",
	Reading:"reading",
	Review:"review",
	Speaking:"speaking",
	Vocabulary:"vocabulary",
	Writing:"writing",
	Intro : "intro",
	RiseOrange : "riseOrange",
	RiseBlue : "riseBlue",
	RiseGreen : "riseGreen",
	RiseBlueB123 : "riseBlueB123"
}

/*---------------------------------------------------------- a1: Fill In The Blank ----------------------------------------------------------*/
var a1_inputTypeEnum = {
	AlphaNumeric: 0,
	Numeric: 1,
}

var a1_listStyleEnum = {
	NotOrdered:0,
	Ordered: 1,
	None:2
}

var a1_fillInTheBlankType = {
	Normal: 0,
	Table: 1,
	Free:2
}

var a1_tableInputType = {
	Input: "input",
	TextArea: "textarea"
}



/*-------------------------------------------------------------- d6: Matching --------------------------------------------------------------*/
var d6_componentTypeEnum = {
	TextToText: 0,
	TextToImg: 1,
	ImgToText: 2,
	ImgToImg: 3
}

var d6_elementBehaviorEnum = {
	Click: 0,
	Drag: 1,
	ClickAndDrag: 2
}

var d6_containerSizeEnum = {
	OneThird : 0,
	Half : 1,
	TwoThirds : 2
}
/*-------------------------------------------------------- a3: Write Your Paragraph ----------------------------------------------------------*/
var a3_inputTypeEnum = {
	AlphaNumeric	:	0,
	Numeric			:	1,
}

var a3_listStyleEnum = {
	NotOrdered		:	0,
	Ordered			: 	1,
}

var a3_writeYourParagraphType = {
	Normal			:	0
}

var a3_countMode = {
	WordsAndChars : 0 , 
	WordsOnly     : 1 , 
	CharactersOnly : 2 ,
	None          : 3 ,
}
/*--------------------------------------------------------------- Fullscreen -----------------------------------------------------------------*/
var fullscreen_thumbnailTypeEnum = {
	 Img			: 	0,
	 Button			: 	1,
}
/*----------------------------------------- d1,d5: Show Headers --------------------------------- */
var d1_pageLayout = {
	Horizontal	: 0,
	Vertical	: 1,
	Free		: 2
}
var d1_pageType = {
	Text	: 0,
	Img	: 1
}
var showObjectsHeader = {
	 True 		: 0 , 
	 False 		: 1  
}
var showSlotsHeader = {
	 True 		: 0 , 
	 False 		: 1  
}
var slotHeaderType = {
	 Text 		: 0 , 
	 Img 		: 1  
}
var slotsBackground = {
	 None 		: 0 , 
	 Img 		: 1  
}
/*----------------------------------------- Feed back --------------------------------- */
var feedback_mode = {
	 True 		: 0 , 
	 False 		: 1 , 
	 CheckOnly 	: 2	,
	 ResetOnly 	: 3 ,
}

/*------------------------------- Flash Cards --------------------------------------------*/ 
var e1_size = {
	Small  : "small" ,
	Medium : "medium",
	Large  : "large",
	ExtraSmall : 'extrasmall',
}
var e1_type = {
	Text : "text" ,
	List : 'list' ,
	Image : 'image',
	ArrowedList: 'arrowedList',
	ExampleText :'exampletext',
	AudioFlip       :'audioflip',
	AudioWithTitle:"audiowithtitle",
	ImageWithTitle:"imagewithtitle",
}

/*---------------List Styles---------------*/
var listStyle = {
	Numeric 	 : "list-numeric",
	AlphaLower 	 : "list-alpha-lower",
	AlphaUpper 	 : "list-alpha-upper",
	RomanUpper 	 : "list-roman-upper" ,
	RomanLower 	 : "list-roman-lower",
	Square  	 : "list-square",
	Circle  	 : "list-circle",
	Nothing 	 : "list-nothing",
}

/*-------b123 --------*/
var b123_type = {
	 Radio    : "radio",
	 Checkbox : "checkbox",
	 YesNo    :  "yesno" ,
}
var type2Form = {
	 buildUp    : 2,
	 popUp 		: 1,
}
var comboBoxType = {
	Simple 			: 'simple',
	Sentence 		: 'sentence',
	Free 			: 'free',
	Table 			: 'table',
	ImageHorizontal : 'imageHorizontal',
	ImageVertical 	: 'imageVertical'
}