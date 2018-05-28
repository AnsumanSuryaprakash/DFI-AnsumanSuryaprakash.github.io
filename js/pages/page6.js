// JavaScript Document
var page6_Passages = new slidingElements("page6_Passages", "page6",{
    componentData : [
        {
            "type": "component",
            "id": "page6_passage1"
        },
        {
            "type": "component",
            "id": "page6_passage2"
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
    var page6_Passage1 = new passage('page6_passage1', 'page6', {
        "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Examine the data in the table below and discuss these results with your classmates. Then write down answers to the questions below the table. Click forward to see some suggested answers to the questions.",
        "instructionAudio":"sounds/page6/RUS_L2_M6_SB_006_A001.mp3",
        "paragraphs": [
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
                    "<td rowspan = 2>1</td>"+
                    "<td rowspan = 2>Coil turns</td>"+
                    "<td>40 turns</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>2</td>"+
                    "<td rowspan = 2>Bolt length</td>"+
                    "<td>40 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>80 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>3</td>"+
                    "<td rowspan = 2>Voltage</td>"+
                    "<td>1.5 volts</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>3 volts</td>"+
                    "<td>4</td>"+
                "</tr>"+

            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td>Which variable affects the strength of the electromagnet, and which doesn’t?</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea cols=7 rows = 2></textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td>For those variables that seemed to change the strength, by how much did the strength change? Write down your observations for all trials.</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea cols=7 rows = 2></textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},
        ]
    });

    var page6_Passage2 = new passage('page6_passage2', 'page6', {
        "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
        "instruction":"Examine the data in the table below and discuss these results with your classmates. Then write down answers to the questions below the table. Click forward to see some suggested answers to the questions.",
        "instructionAudio":"sounds/page6/RUS_L2_M6_SB_006_A001.mp3",
        "paragraphs": [
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
                    "<td rowspan = 2>1</td>"+
                    "<td rowspan = 2>Coil turns</td>"+
                    "<td>40 turns</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>60 turns</td>"+
                    "<td>3</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>2</td>"+
                    "<td rowspan = 2>Bolt length</td>"+
                    "<td>40 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>80 mm</td>"+
                    "<td>2</td>"+
                "</tr>"+

                "<tr>"+
                    "<td rowspan = 2>3</td>"+
                    "<td rowspan = 2>Voltage</td>"+
                    "<td>1.5 volts</td>"+
                    "<td>2</td>"+
                "</tr>"+
                "<tr>"+
                    "<td>3 volts</td>"+
                    "<td>4</td>"+
                "</tr>"+

            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td class='align_left'>Which variable affects the strength of the electromagnet, and which doesn’t?</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea cols=7 rows = 2 readonly>Increasing the number of coil turns and the voltage also increases the number of paper clips that can be picked up. Increasing the length of the bolt doesn’t have any effect.</textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},

            {"audio":"", "desc":"<table>"+
            "<thead>"+
                "<tr>"+
                    "<td class='align_left'>For those variables that seemed to change the strength, by how much did the strength change? Write down your observations for all trials.</td>"+
                "</tr>"+
            "</thead>"+
            "<tbody>"+
                "<tr>"+
                    "<td><textarea cols=7 rows = 2 readonly>Multiplying the number of coil turns by 1.5 also multiplied the number of paper clips picked up by the same amount. Doubling the voltage also doubled the number of paper clips picked up.</textarea></td>"+
                "</tr>"+
            "</tbody>"+
            "</table>"},
        ]
    });
}

