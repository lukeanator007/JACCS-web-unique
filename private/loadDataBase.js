var decks = { 
"Rain":[
    6516859, //E^rabastel
    5176379, //doomsday
    6864159, //collector of
    6451781, //sky knights
    6342096, //cursestrider
    5924208, //offical enforcer
    6566198, //boltvapour
    6567865, //lycanthrope
    6483072, //atsali
    6093224, //bloodring
    6561696, //pride legion
    6561695, //returner
    5149977, //yokianna
    6345079, //apex
    4359136, //darkfeast

]
};
const axios = require('axios');
const e = require('express');





module.exports=
{
    getServers: function()
    {
        var ans="";
        for (const key in decks) {
            if (decks.hasOwnProperty(key)) {
                ans+= "<option value = "+key+"> "+key +"</option>\n";
            }
        }
        return ans;
    },

    addToDataBase: function(id, server)
    {
        if(!decks.hasOwnProperty(server))
        {
            decks[server]=[id];
        }
        else if(!decks[server.includes(id)])
        {
            decks[server].unshift(id);
            return true;
        }
        return false;

    }, 
    removeFromDataBase: function(id, server)
    {
        const index = decks[server].indexOf(id);
        if (index > -1) {
        decks[server].splice(index, 1);
        }   
        
    }, 

    getCards : async (server) => {
        var promises = [];
        var i = 0;
        for (i = 0; i < decks[server].length; i++) {
            const id = decks[server][i];
            promises.push(axios
                .get('https://www.duelingbook.com/php-scripts/load-deck.php?id=' + id)
                .then((response) => {
                    temp = response.data;
                    let cards = [];
                    if (temp["action"] == 'Success') {
                        for (let i = 0; i < temp.main.length; i++) {
                            cards.push(temp.main[i]);
                        }
                        for (let i = 0; i < temp.extra.length; i++) {
                            cards.push(temp.extra[i]);
                        }
                    }
                    return cards;
                })
                .catch((error) => {
                    console.error(error);
                }));
        }

        var ans;
        await Promise.all(promises).then((values) => {
            ans = values;
          });
        return ans;

    }, 

    filterCards: function(cards, search)
    {
        var arr=[];
        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < cards[i].length; j++) {
                const card = cards[i][j];
                if(checkConditions(card, search)) //card meets search conditions
                {
                    arr.push(card);
                }
                
            }
        }
        return JSON.stringify(arr);
    }



}


function checkConditions(card, search)
{
    
    if(!card.name.toLowerCase().includes(search.name.toLowerCase()))return false;
    if(!card.effect.toLowerCase().includes(search.description.toLowerCase())&&!
    card.pendulum_effect.toLowerCase().includes(search.description.toLowerCase())) return false;

    if(search.cardType!="")
    {
        
        if(card.card_type!=search.cardType) 
        {
            return false;
        }
        if (search.type!="") {
            if(card.type!==search.type) return false;
        }
        
        if (card.card_type=="Monster") 
        {
            

            
            if (search.monsterType!=""){
                if(search.monsterType==="Pendulum") return card.pendulum;
                else return search.monsterType==card.monster_color;
            }
            if (search.ability!=""){
                if(search.ability!==card.ability) return false;
            }
            if (search.attribute!=""){
                if(search.attribute!==card.attribute) return false;
            }

            var statChecker = function(str)
            {
                
                if (search["lowest"+str]!="") {
                    if(card[str]=="?") return false;
                    if (card[str]<search["lowest"+str]) return false;
                }
                if (search["highest"+str]!="") {
                    if(card[str]=="?") return false;
                    if (card[str]>search["highest"+str]) return false;
                }
                return true;
                
            }

            if(!statChecker("level")) return false;
            if(!statChecker("atk")) return false;
            if(!statChecker("def")) return false;

        }
    }



    return true;
}





