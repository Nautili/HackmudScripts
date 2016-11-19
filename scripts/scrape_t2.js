function (context, args) { //s:"tyrell"
  // find corp scripts
  if (args.fs == null || args.hs == null) {
    var re = "(" + args.s + "\.\\w+)";
    var fullStr = JSON.stringify(#s.scripts.fullsec()).match(new RegExp(re))[1];
    var highStr = JSON.stringify(#s.scripts.highsec()).match(new RegExp(re))[1];
    return `mora.scrape_t2{fs:#s.${fullStr}, hs:#s.${highStr}}`;
  }

  // get usernames
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

  // get first user with a member login
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

  // get objects from qr codes
  var qrs = #s.mora.uncorrupt({t:args.hs, args:memArgs});
  var qrRet = {qrRecs:[], errors:[]}
  for (var i = 0; i < qrs.length; i++) {
    if (qrs[i].charAt(0) == "█") {
      var res = #s.mora.qr({s:qrs[i]});
      if (res.ok === false) {
        qrRet.errors.push(res);
      }
      else {
        qrRet.qrRecs.push(res);
      }
    }
  }

  // get npc locs
  var locs = [];
  memArgs[memCmd[1]] = "cust_service";
  for (var i = 0; i < qrRet.qrRecs.length; i++) {
    memArgs["order_id"] = qrRet.qrRecs[i].id;
    var locStr = #s.mora.uncorrupt({t:args.hs, args:memArgs});
    locs = locs.concat(locStr.substring(locStr.indexOf(":") + 2).match(/\w+\.\w+/g));
  }
  if (qrRet.errors.length > 0) {
    return {errors:qrRet.errors, locs:locs};
  }
  return locs;
}
