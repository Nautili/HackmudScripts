function (context, args) { //s:"tyrell"
  if (args.fs == null || args.hs == null) {
    var re = "(" + args.s + "\.\\w+)";
    var fullStr = JSON.stringify(#s.scripts.fullsec()).match(new RegExp(re))[1];
    var highStr = JSON.stringify(#s.scripts.highsec()).match(new RegExp(re))[1];
    return `mora.scrape_t2{fs:#s.${fullStr}, hs:#s.${highStr}}`;
  }

  var pubCmd = #s.mora.uncorrupt({t:args.fs, args:{}}).match(/ (\w+):/)[1];
  var news = #s.mora.uncorrupt({t:args.fs}).match(/(\w+) [|]/)[1];

  var cmdObj = {};
  cmdObj[pubCmd] = news;
  var posts = JSON.stringify(#s.mora.uncorrupt({t:args.fs, args:cmdObj}));
  var people = [];
  var person = null;
  var re = /n(\w+) of p/g;
  while(person = re.exec(posts)) {
    people.push(person[1]);
  }

  var memArgs = {};
  var memCmd = null;
  var i = 1;
  while (memCmd == null) {
    if (i >= people.length) {
      return {ok:false, msg:"No npcs had member logins."};
    }
    memArgs.username = people[i++];
    memCmd = #s.mora.uncorrupt({t:args.hs, args:memArgs}).match(/!(\w+)!/);
  }
  memArgs[memCmd[1]] = "order_qrs";

  var qrs = #s.mora.uncorrupt({t:args.hs, args:memArgs});
  var retVal = {qrRecs:[], errors:[]}
  for (var i = 0; i < qrs.length; i++) {
    if (qrs[i].charAt(0) == "█") {
      var res = #s.mora.qr({s:qrs[i]});
      return res;
      if (res.ok === false) {
        retVal.errors.push(res);
      }
      else {
        retVal.qrRecs.push(res);
      }
    }
  }
  return retVal;
}
