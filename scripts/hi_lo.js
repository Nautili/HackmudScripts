function (context, args) { //bet:"", action:""
  var deck = [];
  var draws = [];
  var suits = ["D", "L", "N", "V"];
  var user = context.caller;

  var curGame = #db.f({script:"hi_lo", user:user}).first();
  if (curGame == null) {
    if (args.action == null || args.action != "start") {
      var m =
          "█ █ ███\n" +
          "███  █  █  ███\n" +
          "█ █ ███ █  █ █\n" +
          "        ██ ███\n\n" +
          "On each turn, guess whether the next card will be higher or lower.\n" +
          "Make five correct guesses and win four times your bet.\n" +
          "Make ten correct guesses and win ten times your bet.\n" +
          "Aces are high and drawing the same value twice is a free guess." +
          "Use action:\"start\" and make a bet up to 1MGC with bet:\"amount\" to begin!";
      return {ok:true, msg:m}
    }

    //TODO: take bet with escrow account
    //initialize deck
    for(var i = 0; i < 4; i++ ) {
      for(var j = 0; j < 13; j++) {
        deck.push({"s":suits[i], "n":j});
      }
    }
    deck = #s.scripts.lib().shuffle(deck);
    draws.push(deck.pop());
    #db.i({script:"hi_lo", user:user, deck:deck, draws:draws});
  }
  else {
    deck = curGame.deck;
    draws = curGame.draws;
  }

  //execute a turn
  var h = args.action == "hi";
  var l = args.action == "lo";
  var msg = "";
  var playing = true;

  if(args.action == "stop" && draws.length == 6) {
    //TODO: handle bet
    reset()
    return {ok:true, msg:"Thanks for playing!"};
  }

  if (h || l) {
    draws.push(deck.pop());
    var last = draws[draws.length - 2].n;
    var next = draws[draws.length - 1].n;

    if (next > last) {
      msg += "Your draw was higher than the last card.";
      playing = h;
    }
    else if (next < last) {
      msg += "Your draw was lower than the last card.";
      playing = l;
    }
    else {
      msg += "Your draw was the same as the last card. Free card!";
    }
    msg += "\n";

    if(playing) {
      if(draws.length == 6) {
        msg += "\nYou've made five correct guesses.\n" +
               "Use action:\"stop\" to win four times your bet.\n" +
               "Make five more guesses to win ten times your bet."
      }
      if(draws.length == 11) {
        msg += "\nCongratulations!";
        playing = false;
      }
      #db.u({script:"hi_lo", user:user}, {$set:{deck:deck, draws:draws}});
    }
    else {
      msg += "\nToo bad. Better luck next time!";
    }
  }
  return{ok:true, msg:drawCards(draws)};

  //function definitions
  function reset() {
    #db.r({script:"hi_lo", user:user});
  }

  function drawCards(cards) {
    var rows = ["", "", "", "", "", "", ""];
    var vals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    for(var i = 0; i < cards.length; i++) {
      var c = "`" + cards[i].s;
      for(var j = 0; j < 7; j++)
        rows[j] += c;

      var card = cards[i];
      rows[0] += "╭-----╮`  ";
      rows[1] += "│" + vals[card.n];
      if(card.n != 10)
        rows[1] += " ";
      rows[1] += "   │`  ";
      rows[2] += "│     │`  ";
      rows[3] += "│  ●  │`  ";
      rows[4] += "│     │`  ";
      rows[5] += "│   ";
      if(card.n != 10)
        rows[5] += " ";
      rows[5] += vals[card.n] + "│`  ";
      rows[6] += "╰-----╯`  ";
    }

    var ret = "";
    for(var i = 0; i < 7; i++) {
      ret += rows[i] + "\n";
    }
    ret += msg;
    if(playing)
      ret += "\nWill the next card be action:\"hi\" or action:\"lo\"?";
    else {
      reset();
    }
    return ret;
  }
}
