function (context, args) { //action:"", bet:""
  var actions = ["start", "claim", "hi", "lo"];
  var deck = [];
  var draws = [];
  var suits = ["D", "L", "N", "V"];
  var nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  var user = context.caller;

  var curGame = #db.f({script:"hi_lo", user:user}).first();
  if (curGame == null) {
    if(args == null || actions.indexOf(args.action) < 1) {
      var m =
          "█ █ ███\n" +
          "███  █  █  ███\n" +
          "█ █ ███ █  █ █\n" +
          "        ██ ███\n\n" +
          "On each turn, guess whether the next card will be higher or lower.\n" +
          "Make five correct guesses and win three times your bet.\n" +
          "Make ten correct guesses and win ten times your bet.\n" +
          "Use action:\"start\" and make a bet up to 1MGC with bet:<amount> to begin!";
      return {ok:true, msg:m}
    }

    //TODO: take bet with escrow account
    //initialize deck
    for(var i = 0; i < 4; i++ ) {
      for(var j = 0; j < 13; j++) {
        deck.push({"s":suits[i], "v":nums[j]});
      }
    }
    deck = #s.scripts.lib().shuffle(deck);
  }
  else {
    deck = curGame.deck;
    draws = curGame.draws;
  }
  draws.push(deck.pop());
  //TODO: check win state here

  if(curGame == null) {
    #db.i({script:"hi_lo", user:user, deck:deck, draws:draws});
  }
  else {
    #db.u({script:"hi_lo", user:user}, {$set:{deck:deck, draws:draws}});
  }

  function drawCards(cards) {
    var rows = ["", "", "", "", "", "", ""];
    for(var i = 0; i < cards.length; i++) {
      var c = "`" + cards[i].s;
      for(var j = 0; j < 7; j++)
        rows[j] += c;

      var card = cards[i];
      rows[0] += "╭-----╮`  ";
      rows[1] += "│" + card.v;
      if(card.v != 10)
        rows[1] += " ";
      rows[1] += "   │`  ";
      rows[2] += "│     │`  ";
      rows[3] += "│  ●  │`  ";
      rows[4] += "│     │`  ";
      rows[5] += "│   ";
      if(card.v != 10)
        rows[5] += " ";
      rows[5] += card.v + "│`  ";
      rows[6] += "╰-----╯`  ";
    }

    var ret = "";
    for(var i = 0; i < 7; i++) {
      ret += rows[i] + "\n";
    }
    return ret;
  }

  return{ok:true, msg:drawCards(draws)};
}
