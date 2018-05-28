// JavaScript Document
var page8_Passages = new slidingElements("page8_Passages", "page8",{
	componentData : [
		{
			"type": "component",
			"id": "page8_passage1"
		},
		{
			"type": "component",
			"id": "page8_passage2"
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
	var page8_Passage1 = new passage('page8_passage1', 'page8', {
		"type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Study the observations made on varying the number of coil turns in an electromagnet. Then, in the spaces provided, write a scientific question based on your observations and a hypothesis or prediction based on this question. Click forward to see a suggested question and hypothesis based on these observations.",
        "instructionAudio":"sounds/page8/RUS_L2_M6_SB_008_A001.mp3",
        "paragraphs": [
            {"audio":"", "desc":"<div class='imgDiv'><img src='images/page8/RUS_L2_M6_mov_16.jpg' alt=''/></div>"},
            {"audio":"", "desc":"<title>Varying the number of coil turns"},
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
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},


            {"audio":"", "desc":"<subTitle>Scientific question: "},
            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td>What will happen if…</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea cols=7 rows = 2></textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<subTitle>Hypothesis"},
            {"audio":"", "desc":"<table>"+
            "<tbody>"+
                "<tr>"+
                    "<td class='darkOrange'>if"+
                    "<td><textarea cols=40 rows = 2></textarea></td>"+
                "</tr>"+
                "<tr>"+
                    "<td class='darkOrange'>Then I predict that</td>"+
                    "<td><textarea cols=40 rows = 2></textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},
        ]
    });
	var page8_Passage2 = new passage('page8_passage2', 'page8', {
		"type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Study the observations made on varying the number of coil turns in an electromagnet. Then, in the spaces provided, write a scientific question based on your observations and a hypothesis or prediction based on this question. Click forward to see a suggested question and hypothesis based on these observations.",
        "instructionAudio":"sounds/page8/RUS_L2_M6_SB_008_A001.mp3",
        "paragraphs": [
            {"audio":"", "desc":"<div class='imgDiv'><img src='images/page8/RUS_L2_M6_mov_16.jpg' alt=''/></div>"},
            {"audio":"", "desc":"<title>Varying the number of coil turns"},
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
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},


            {"audio":"", "desc":"<subTitle>Scientific question: "},
            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td>What will happen if…</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea readonly cols=7 rows = 2>I continue to change the number of coil turns in my electromagnet? Will the electromagnet’s strength change by the same amount?</textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<subTitle>Hypothesis"},
            {"audio":"", "desc":"<table>"+
            "<tbody>"+
                "<tr>"+
                    "<td class='darkOrange'>if</td>"+
                    "<td><textarea readonly cols=40 rows = 2>I multiply the number of coil turns by any amount</textarea></td>"+
                "</tr>"+
                "<tr>"+
                    "<td class='darkOrange'>Then I predict that</td>"+
                    "<td><textarea readonly cols=40 rows = 2>The electromagnet’s strength will also multiply by that same amount.</textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},
        ]
    });
}

