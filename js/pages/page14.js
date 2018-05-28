var page14_Passages = new slidingElements("page14_SE", "page14",{
    componentData : [
    {
        "type": "component",
        "id": "page14_W1"
    },
    {
        "type": "component",
        "id": "page14_W2"
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
    var page14_W1 = new passage('page14_W1', 'page14', {
            "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
            "instruction":"Here are some questions about electromagnets and electromagnetism. Read the questions carefully. Then, provide answers for each question. Click forward to see some suggested answers to these questions.",
            "instructionAudio":"sounds/page14/RUS_L2_M6_SB_014_A001.mp3",
            "paragraphs": [
                {"audio":"", "desc":"<subTitle>Question 1"},
                {"audio":"", "desc":"In a metal recycling plant, items made from different kinds of materials need to be sorted and separated. The items collected in the recycling bins are passed along a conveyer belt through a tunnel or chute that is lined with powerful electromagnets. Why and how do you think electromagnets are used here? "},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea rows='10' cols='61'></textarea>"},
                {"audio":"", "desc":"<subTitle>Question 2"},
                {"audio":"", "desc":"In a scrapyard, a large crane uses an electromagnet to pick up metal items, such as cars. Why is an electromagnet used, and not a permanent magnet?"},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea rows='10' cols='61'></textarea>"},
                {"audio":"", "desc":"<subTitle>Question 3"},
                {"audio":"", "desc":"If you place a compass close to a wire in a simple electric circuit and switch the current on, the compass needle moves. Why is this?"},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea rows='10' cols='61'></textarea>"},
            ],
            "leftImages":[
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_001_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_001_fls.jpg",
                "caption":""
                },
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_002_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_002_fls.jpg",
                "caption":""
                },
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_003_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_003_fls.jpg",
                "caption":""
                },
            ]
    });



    var page14_W2 = new passage('page14_W2', 'page14', {
            "type"      : "withoutPrompts", // withoutPrompts, withPrompts, withPromptsCC, exploreType1, exploreType2
            "instruction":"Here are some questions about electromagnets and electromagnetism. Read the questions carefully. Then, provide answers for each question. Click forward to see some suggested answers to these questions.",
            "instructionAudio":"sounds/page14/RUS_L2_M6_SB_014_A001.mp3",
            "paragraphs": [
                {"audio":"", "desc":"<subTitle>Question 1"},
                {"audio":"", "desc":"In a metal recycling plant, items made from different kinds of materials need to be sorted and separated. Here, the items collected in the recycling bins are passed along a conveyer belt through a tunnel or chute that is lined with powerful electromagnets. Why and how do you think electromagnets are used here? "},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea readonly rows='10' cols='61'>When the electromagnets are switched on, they attract the items made from metal, such as iron and steel, and not cheaper items made out of non-magnetic materials, such as tin or plastic. </textarea>"},
                {"audio":"", "desc":"<subTitle>Question 2"},
                {"audio":"", "desc":"In a scrapyard, a large crane uses an electromagnet to pick up metal items, such as cars. Why is an electromagnet used, and not a permanent magnet?"},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea readonly rows='10' cols='61'>You can switch electromagnets on or off, simply by breaking a circuit. This allows the crane operator to lift up metal items, such as cars, while the huge electromagnet is switched on. Then, when the operator wants to drop the item somewhere else, all he has to do is press a button that switches the electromagnet off and lets the items fall.</textarea>"},
                {"audio":"", "desc":"<subTitle>Question 3"},
                {"audio":"", "desc":"If you place a compass close to a wire in a simple electric circuit and switch the current on, the compass needle moves. Why is this?"},
                {"audio":"", "desc":"<subTitle>Answer:<br><textarea readonly rows='10' cols='61'>A compass will normally point to the earth’s magnetic north pole. However, if you bring any magnet close to the compass, the compass will naturally move towards it. An electric circuit has its own magnetic field. So it, like a magnet, moves the compass needle.</textarea>"},
            ],
            "leftImages":[
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_001_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_001_fls.jpg",
                "caption":""
                },
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_002_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_002_fls.jpg",
                "caption":""
                },
                {
                "thumb":"images/page14/RUS_L2_M6_014_PHO_003_sml.jpg",
                "fullscreen":"images/page14/RUS_L2_M6_014_PHO_003_fls.jpg",
                "caption":""
                },
            ]
    });
}