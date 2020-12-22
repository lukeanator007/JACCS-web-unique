var searchResults=[];
var smallCardMaxWidth = 176;
var smallCardMargins = 5;
var page = 0;
var columns = 4;
var rows = 5;


function sendSearch()
{
    //search params
    //TODO cashe params
    var $name = $("#name");
    var $description = $("#description");
    var $cardType = $("#cardType");
    var $type = $("#type");
    var $monsterType = $("#monsterType");
    var $ability = $("#ability");
    var $attribute = $("#attribute");
    var $lowestlevel = $("#lowestlevel");
    var $highestlevel = $("#highestlevel");
    var $lowestatk = $("#lowestatk");
    var $highestatk = $("#highestatk");
    var $lowestdef = $("#lowestdef");
    var $highestdef = $("#highestdef");
    var $limit = $("#limit");
    var $order = $("#order");
    var $server = $("#server");

    var search = {
        name: $name.val(),
        description: $description.val(),
        cardType: $cardType.val(),
        type: $type.val(),
        monsterType: $monsterType.val(),
        ability: $ability.val(),
        attribute: $attribute.val(),
        lowestlevel: $lowestlevel.val(),
        highestlevel: $highestlevel.val(),
        lowestatk: $lowestatk.val(),
        highestatk: $highestatk.val(),
        lowestdef: $lowestdef.val(),
        highestdef: $highestdef.val(),
        server: $server.val()
        
    };
    $.ajax({
        type: 'GET',
        url: '/search?',
        data: search,
        success: function(event) {
            searchResults=JSON.parse(event);
            calculateTableSizes();
            addCardsToPage(0);
        },
        error: function(e)
        {
            alert(JSON.stringify(e));
        }
        
        
    });
}


function makeBigCard($smallCard)
{
    var scale = $smallCard.find(".smallCardName").css("transform");
    if(scale!="none")
    {
        scale = scale.substring(7,scale.indexOf(","));
    }
    else scale = 1;
    makeBigCardFromData($smallCard.attr("data-index"), scale);
}

function makeBigCardFromData(index, scale)
{
    var card = searchResults[index];
    var floor = Math.floor(card["id"]/100000);
    var picFolder = floor*100000;
    var imgSrc;
    switch(card["pic"])
    {
        case 0: imgSrc = "https://www.duelingbook.com/images/black.jpg";
            break;
        case 1: imgSrc = "https://www.duelingbook.com/images/custom-pics/" +picFolder+ "/" +card.id + ".jpg";
            break;
        default:  imgSrc = "https://www.duelingbook.com/images/custom-pics/" +picFolder+ "/" +card.id + ".jpg?version="+card["pic"];
            break;            
    }
    
    var cardColourClass;
    
    switch(card["card_type"])
    {
        case "Monster":
            switch(card["monster_color"])
            {
                case "Normal": cardColourClass = "normalMonsterCard";
                    break;
                case "Effect": cardColourClass = "effectMonsterCard";
                    break;
                case "Ritual": cardColourClass = "ritualMonsterCard";
                    break;
                case "Fusion": cardColourClass = "fusionMonsterCard";
                    break;
                case "Synchro": cardColourClass = "synchroMonsterCard";
                    break;
                case "Xyz": cardColourClass = "xyzMonsterCard";
                    break;
                case "Link": cardColourClass = "linkMonsterCard";
                    break;
            }
            
            break;
        case "Spell": cardColourClass = "spellCard";
            break;
        case "Trap": cardColourClass = "trapCard";
            break;
            
    }
    
    
    var bigCard=document.getElementById("bigCard");
    bigCard.className="";
    bigCard.classList.add(cardColourClass);
    if(card["pendulum"]) bigCard.classList.add("pendulumCard");
    
    var effectText = card["effect"];
    if(card["pendulum"])
    {
        effectText="<strong>Pendulum Effect:</strong>\n"+card["pendulum_effect"].replace(/(?:\r\n|\r|\n)/g, '<br>')+
            "\n<strong>Monster Effect:</strong>\n"+effectText;
    }
    
    effectText=effectText.replaceAll("\n","<br>");
    
    
    bigCard.innerHTML="<div class = \"bigCardName bigCardText\" "+
        "style = \"transform: scaleX("+scale+");\" >"+
        card["name"]+
        "</div>"+
        "<img class=\"bigCardImg\"src="+imgSrc+">"+
        "<div class =\" bigCardText\" >"+effectText.replace(/(?:\r\n|\r|\n)/g, '<br>')+" </div>";
    
    
    
    
    
}



function cyclePage($arrow)
{
    calculateTableSizes();
    var max = Math.floor(searchResults.length/(rows*columns));
    var newPage = Math.min(page+parseInt($arrow.attr("rel")),max);
    if(newPage<0||newPage>=searchResults.length/(rows*columns))
    {
        return;
    }
    else addCardsToPage(newPage);
    
}

function calculateTableSizes()
{
    var h = window.innerHeight;
    var w = window.innerWidth;
    
    columns = Math.floor((w-405)/326);
    rows = Math.floor((h-276)/150);
    
    
    
}


function addCardsToPage(pageNumber)
{
    page=pageNumber;
    document.getElementById("searchButton").innerHTML="<br>Search<br>"+
        (pageNumber+1)+"/"+(Math.floor(searchResults.length/(rows*columns))+1);
    var searchedCards=[];
    
    for(var i=0;i<columns;i++)
    {
        searchedCards[i]="<div class = \"searchedCardsColumn\">";//+"</div>"
    }
    
    var columnIndex=-1;
    for(var i = pageNumber*rows*columns;i<Math.min(searchResults.length,(pageNumber*20)+20);i++)
    {
        if(i % rows==0||i==0) columnIndex++;
        searchedCards[columnIndex]+=createHTMLCard(searchResults[i], i)+"\n ";
    }
    
    var str =""
    for(var i=0;i<columns;i++)
    {
        str += searchedCards[i]+"</div>\n ";
    }
    
    
    
    document.getElementById("searchedCards").innerHTML=str;
    
    
    var $names = $(".smallCardName")
    var textWidth = smallCardMaxWidth-(2*smallCardMargins);
    for(var i = 0; i<$names.length;i++)
    {
        var scale =1;
        if($names.eq(i).width()>textWidth)
        {
            scale= textWidth / ($names.eq(i).width());
             $names.eq(i).css("transform", "scaleX(" + scale + ")");
        }
        $names.eq(i).css("width", (smallCardMaxWidth)+"px");
        $names.eq(i).css("padding-left", (smallCardMargins)+"px");
        $names.eq(i).css("padding-right", (smallCardMargins)+"px");
        if(i==0)
        {
            makeBigCardFromData(pageNumber*rows*columns,scale);
        }
    }
    
    
    
    
}

function createHTMLCard(card, index)
{
    var floor = Math.floor(card["id"]/100000);
    var picFolder = floor*100000;
    var imgSrc;
    switch(card["pic"])
    {
        case 0: imgSrc = "https://www.duelingbook.com/images/black.jpg";
            break;
        case 1: imgSrc = "https://www.duelingbook.com/images/custom-pics/" +picFolder+ "/" +card.id + ".jpg";
            break;
        default:  imgSrc = "https://www.duelingbook.com/images/custom-pics/" +picFolder+ "/" +card.id + ".jpg?version="+card["pic"];
            break;            
    }
    
    var cardColourClass;
    var attribute;
    var stats="";
    
    switch(card["card_type"])
    {
        case "Monster":
            
            stats="<br>ATK/"+card["atk"]+" DEF/"+card["def"];
            stats+="<br>Level "+card["level"];
            switch(card["monster_color"])
            {
                case "Normal": cardColourClass = "normalMonsterCard";
                    break;
                case "Effect": cardColourClass = "effectMonsterCard";
                    break;
                case "Ritual": cardColourClass = "ritualMonsterCard";
                    break;
                case "Fusion": cardColourClass = "fusionMonsterCard";
                    break;
                case "Synchro": cardColourClass = "synchroMonsterCard";
                    break;
                case "Xyz": cardColourClass = "xyzMonsterCard";
                    stats="<br>ATK/"+card["atk"]+" DEF/"+card["def"];
            stats+="<br>Rank "+card["level"];
                    break;
                case "Link": cardColourClass = "linkMonsterCard";
                    stats=stats="<br>ATK/"+card["atk"];
                    var arrows = JSON.stringify(card["arrows"]);
                    for(var i=0;i<arrows.length;i++)
                    {
                        if(arrows.charAt(i)=="1")
                        {
                            stats+=getLinkArrow(i);
                        }
                    }
                    stats+="("+card["level"]+")";
                    
                    break;
            }
            if(card["pendulum"]) cardColourClass+=" pendulumCard";
            attribute=card["attribute"].toLowerCase();
            
            break;
        case "Spell": cardColourClass = "spellCard";
            attribute="spell";
            break;
        case "Trap": cardColourClass = "trapCard";
            attribute="trap";
            break;
            
    }
    
    
    
    var info="<img class = \"attribute\" "+
        "src=\"https://www.duelingbook.com/images/card/"+
        attribute+
        "_attribute.png\">"+
        "<div class = \"smallCardInfo\">"+
        card["type"]+
        "</div>";
    
    var username="<div class=\"username\">"+card["username"]+"</div>";
    
    
    var cardAsHtml = 
    "<div class = \"smallCard noselect "+cardColourClass+" \"data-index=\"" + index +"\">"+
        "<img  src="+imgSrc+" class=\"smallCardImg\">"+
        "<div class=\"smallCardText \">"+
            "<div class =\"smallCardName\">"+card["name"]+"</div><br><br>"+ 
            info+   
            stats+
            username+
        "</div>"+ 
    "</div>";
    
    
    
    
    return cardAsHtml;
}


function getLinkArrow(index)
{
    var imgSrc="https://www.duelingbook.com/images/card/red_arrow_corner.png\" "+
            "class = \"cornerArrow\"";
    
    
    var angle = index*45;
    
    
    return "<img src=\""+imgSrc+""+
        "style=\"transform: rotate("+angle+"deg)\" >";
    
    
}



function getType(input)
{
    var cardType = document.getElementById("cardType");
    var type = document.getElementById("type");
    
    var monsterType = document.getElementById("monsterType");
    
    var monsterOnly = document.getElementsByClassName("monsteronly");
    
    var list =[];
    
    switch(cardType.value)
    {
        case "":
            break;
        case "Monster":
            list = ["", "Aqua", "Beast", "Beast-Warrior", "Cyberse", "Dinosaur", "Divine-Beast", "Dragon", "Fairy", "Fiend", "Fish", "Insect", "Machine", "Plant", "Psychic", "Pyro", "Reptile", "Rock", "Sea Serpent", "Spellcaster", "Thunder", "Warrior", "Winged-Beast", "Wyrm", "Zombie"];
            break;
        case "Spell":
            list= ["", "Normal", "Continious", "Equip", "Quick-Play", "Field", "Ritual"];
            break;
        case "Trap":
            list= ["", "Normal", "Continious", "Counter"] ;
            break;

    }
    var i=0;
    if(cardType.value!=="Monster")
    {
        for(i =0;i<monsterOnly.length;i++)
        {
            monsterOnly.item(i).disabled=true;
            monsterOnly.item(i).value="";
        }
    }
    else
    {
        for(i =0;i<monsterOnly.length;i++)
        {
            monsterOnly.item(i).disabled=false;
        }
    }
    
    
    
    setType(list, type);
}


function setType(list, type)
{
    var ans="";
    for(i=0;i<list.length;i++)
    {
        ans+="<option value = "+list[i]+"> "+list[i]+"</option>";
    }
    
    type.innerHTML=ans;
    if(ans==="")
    {
        type.disabled=true;
    }
    else
    {
        type.disabled=false;
    }
    
}


function checkStatValue(sender) {
    var lastChar = sender.value.charAt(sender.value.length-1);
    var max=10000;
    if(sender.value.charAt(0)==='0') 
    {
        sender.value=sender.value.substr(1);
        sender.setSelectionRange(0,0);
        return;
    }
    if(lastChar<='9'&&lastChar>='0')
    {
        var int = parseInt(sender.value);
        if(int > max) 
        {
            int/=10;
            int = Math.floor(int);//give us typed data plz
            sender.value=int.toString();
        }
    }
    else
    {
        sender.value=sender.value.substring(0,sender.value.length-1);
    }
    
}


function checkLevelValue(sender) {
    var max = 12;
    var lastChar = sender.value.charAt(sender.value.length-1);
    
    if(lastChar<='9'&&lastChar>='1')
    {
        var int = parseInt(sender.value);
        if(int > max) 
        {
            int/=10;
            int = Math.floor(int);//give us typed data plz
            sender.value=int.toString();
        }
        
            
    }
    else
    {
        sender.value=sender.value.substring(0,sender.value.length-1);
    }
    
}






























