function (context, args) { //fs:#s.name.call, hs:#s.name.call
  var pubCmd = #s.mora.uncorrupt({t:args.fs, args:{}}).match(/ ([a-z]+):/)[1];
  var news = #s.mora.uncorrupt({t:args.fs}).match(/([a-z]+) [|]/)[1];

  var cmdObj = {};
  cmdObj[pubCmd] = news;
  var posts = JSON.stringify(#s.mora.uncorrupt({t:args.fs, args:cmdObj}));
  var people = posts.match(/n([a-z_]+) of p/);

  var memArgs = {};
  var i = 1;
  while (memArgs[memCmd] == null) {
    if (i >= people.length) {
      return {ok:false, msg:"No npcs had member logins."};
    }
    memArgs.username = people[i++];
    var memCmd = #s.mora.uncorrupt({t:args.hs, args:memArgs}).match(/!([a-z]+)!/)[1];
    memArgs[memCmd] = "order_qrs";
  }

  var qrs = #s.mora.uncorrupt({t:args.hs, args:memArgs});
  var locs = [];
  for (var i = 0; i < qrs.length; i++) {
    if (qrs[i].charAt(0) == "█") {
      return #s.mora.qr({s:qrs[i]});
      //locs.concat(#s.mora.qr({s:qrs[i]}));
    }
  }
  return locs;
}
