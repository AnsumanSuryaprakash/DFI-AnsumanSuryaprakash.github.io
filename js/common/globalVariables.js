// JavaScript Document
var arrPagesToLoad = [];

var arrAllPages = ['page1','page2','page3','page4','page5','page6','page7','page8','page9','page10','page11','page12','page13','page14'];

var arrPagesCount = 0;
var arrCarousel = [];
var arrPagesHTML = [];
var arrScripts = [];
var arrScripts2 = [];
var arrStyles = [];
var additionalEmptyPagesCount = arrAllPages.length - arrPagesToLoad.length;
var containerCarousel;


// added by Samir
var globalAudioPlayerCreated = false ;
var globalAudioPlaying = false ;
var globalAudioIcon;
var globalAudioTemplate;
var globalAudioShowPlayer;
var globalAudioSource;

var globalScormPages = [
    {page:'page1',type:'presentation',nbOfComponents:1, presentationType: 'Aims'},
    {page:'page2',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page3',type:'presentation',nbOfComponents:1, presentationType: 'Slideshow'},
    {page:'page4',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page5',type:'presentation',nbOfComponents:1, presentationType: 'Writing + Answer'},
    {page:'page6',type:'custom',nbOfComponents:1, assessmentType:['textArea']},
    {page:'page7',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page8',type:'custom',nbOfComponents:1, assessmentType:['textArea']},
    {page:'page9',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page10',type:'presentation',nbOfComponents:1, presentationType: 'Slideshow'},
    {page:'page11',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page12',type:'presentation',nbOfComponents:1, presentationType: 'Writing'},
    {page:'page13',type:'custom',nbOfComponents:1, assessmentType: ['video']},
    {page:'page14',type:'custom',nbOfComponents:1, assessmentType:['textArea']},
];

var assessmentArray= new Array;
assessmentArray = $.grep(globalScormPages, function(i,n){
  return i.type == 'assessment';
}); 
var sumOfComponents = 0;
for(k=0;k<assessmentArray.length;k++){
    sumOfComponents+=assessmentArray[k].nbOfComponents;
}
var globalScormHighestScore = 100;
var globalInteractions = sumOfComponents;
var videoPageData = [];
