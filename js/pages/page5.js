// JavaScript Document
var page5_Passages = new slidingElements("page5_Passages", "page5",{
    componentData : [
        {
            "type": "component",
            "id": "page5_passage1"
        },
        {
            "type": "component",
            "id": "page5_passage2"
        },
        {
            "type": "component",
            "id": "page5_passage3"
        }
    ],
    simulateTouch : true,
    withPagination: false,
    withArrows    : true,
    swiperCreatedCallback: function(){
        initComponents();
    },
    slideChangeCallBack: function(){
        if (globalAudioPlaying){
            stopAndHideAudio();
        }
    }
});
function initComponents(){
    var page5_Passage1 = new passage('page5_passage1', 'page5', {
        "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"You are going to observe a number of trials to find out which variables affect the strength of an electromagnet.Examine the photo that shows the first trial below. Then create a table like the one shown and record the data from the trial into the table. Click the Trial 1 heading to see the correct data.",
        "instructionAudio":"sounds/page5/RUS_L2_M6_SB_005_A001.mp3",
        "paragraphs": [
            {"audio":"", "desc":"<div class='imgDiv'><img src='images/page5/RUS_L2_M6_mov_16.jpg' alt=''/></div>"},
            {"audio":"", "desc":"<title>Number of coil turns"},
            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td colspan = 4 class='darkOrange'>Electromagnet variables</td>"+
                "</tr>"+
                "<tr>"+
                    "<td class='darkOrange'>Trial</td>"+
                    "<td class='darkOrange'>Variable</td>"+
                    "<td class='darkOrange'>Value</td>"+
                    "<td class='darkOrange'>Number of paper clips</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td rowspan = 2 class='clickable' id='header1'>1</td>"+
                    "<td rowspan = 2>Coil turns</td>"+
                    "<td>40 turns</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td id='editable1'></td>"+
                    "<td id='editable2'></td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>2</td>"+
                    "<td rowspan = 2>Bolt length</td>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+
                "<tr>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>3</td>"+
                    "<td rowspan = 2>Voltage</td>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+
                "<tr>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+

            "</tbody>"+
            "</table>"},
        ]
    });
$("#page5 #header1").hammer().on("tap", function(){
    if ($('#editable1').html() == ""){
        $('#editable1').html("60 turns");
        $('#editable2').html("3");
        $("#page5 #header1").addClass('clicked');
    }else{
        $('#editable1').html("");
        $('#editable2').html("");
        $("#page5 #header1").removeClass('clicked');
    }
});


    var page5_Passage2 = new passage('page5_passage2', 'page5', {
        "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Examine the photo that shows the second trial below. Then record the data from the trial into a table like the one shown. Click the Trial 2 heading to see the correct data.",
        "instructionAudio":"sounds/page5/RUS_L2_M6_SB_005_A002.mp3",
        "paragraphs": [
            {"audio":"", "desc":"<div class='imgDiv'><img src='images/page5/RUS_L2_M6_mov_17.jpg' alt=''/></div>"},
            {"audio":"", "desc":"<title>Number of coil turns"},
            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td colspan = 4 class='darkOrange'>Electromagnet variables</td>"+
                "</tr>"+
                "<tr>"+
                    "<td class='darkOrange'>Trial</td>"+
                    "<td class='darkOrange'>Variable</td>"+
                    "<td class='darkOrange'>Value</td>"+
                    "<td class='darkOrange'>Number of paper clips</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td rowspan = 2 >1</td>"+
                    "<td rowspan = 2>Coil turns</td>"+
                    "<td>40 turns</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2 class='clickable' id='header2'>2</td>"+
                    "<td rowspan = 2>Bolt length</td>"+
                    "<td id='editable3'></td>"+
                    "<td id='editable4'></td>"+
                "</tr>"+
                "<tr>"+
                    "<td id='editable5'></td>"+
                    "<td id='editable6'></td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>3</td>"+
                    "<td rowspan = 2>Voltage</td>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+
                "<tr>"+
                    "<td></td>"+
                    "<td></td>"+
                "</tr>"+

            "</tbody>"+
            "</table>"},
        ]
    });
$("#page5 #header2").hammer().on("tap", function(){
    if ($('#editable3').html() == ""){
        $('#editable3').html("40 mm");
        $('#editable4').html("2");
        $('#editable5').html("80 mm");
        $('#editable6').html("2");
        $("#page5 #header2").addClass('clicked');
    }else{
        $('#editable3').html("");
        $('#editable4').html("");
        $('#editable5').html("");
        $('#editable6').html("");
        $("#page5 #header2").removeClass('clicked');
    }
});


var page5_Passage3 = new passage('page5_passage3', 'page5', {
        "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Examine the photo that shows the third trial below. Then record the data from the trial into a table like the one shown. Click the Trial 3 heading to see the correct data.",
        "instructionAudio":"sounds/page5/RUS_L2_M6_SB_005_A003.mp3",
        "paragraphs": [
            {"audio":"", "desc":"<div class='imgDiv'><img src='images/page5/RUS_L2_M6_mov_18.jpg' alt=''/></div>"},
            {"audio":"", "desc":"<title>Number of coil turns"},
            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td colspan = 4 class='darkOrange'>Electromagnet variables</td>"+
                "</tr>"+
                "<tr>"+
                    "<td class='darkOrange'>Trial</td>"+
                    "<td class='darkOrange'>Variable</td>"+
                    "<td class='darkOrange'>Value</td>"+
                    "<td class='darkOrange'>Number of paper clips</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td rowspan = 2 >1</td>"+
                    "<td rowspan = 2>Coil turns</td>"+
                    "<td>40 turns</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2 >2</td>"+
                    "<td rowspan = 2>Bolt length</td>"+
                    "<td>40 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>80 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2 class='clickable' id='header3'>3</td>"+
                    "<td rowspan = 2>Voltage</td>"+
                    "<td id = 'editable7'></td>"+
                    "<td id = 'editable8'></td>"+
                "</tr>"+
                "<tr>"+
                    "<td id = 'editable9'></td>"+
                    "<td id = 'editable10'></td>"+
                "</tr>"+

            "</tbody>"+
            "</table>"},
        ]
    });
$("#page5 #header3").hammer().on("tap", function(){
    if ($('#editable7').html() == ""){
        $('#editable7').html("1.5 volts");
        $('#editable8').html("2");
        $('#editable9').html("3 volts");
        $('#editable10').html("4");
        $("#page5 #header2").addClass('clicked');
    }else{
        $('#editable7').html("");
        $('#editable8').html("");
        $('#editable9').html("");
        $('#editable10').html("");
        $("#page5 #header3").removeClass('clicked');
    }
});
}

