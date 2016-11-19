function (context, args) { //s:"tyrell"
  var start = new Date().getTime();
  // find corp scripts
  if (args.t == null) {
    var re = "(" + args.s + "\.\\w+)";
    var fullStr = JSON.stringify(#s.scripts.fullsec()).match(new RegExp(re))[1];
    return `mora.scrape_t1{t:#s.${fullStr}}`;
  }

  // get commands
  var info = #s.mora.uncorrupt({t:args.t, args:{}});
  var pubCmd = info.match(/ (\w+):/)[1];
  var dir = info.match(/:"(\w+)/)[1];
  var actions = #s.mora.uncorrupt({t:args.t}).match(/(\w+) [|] (\w+)/);

  // get password
  var cmdObj = {};
  cmdObj[pubCmd] = actions[2]; //get corp info
  var pass = #s.mora.uncorrupt({t:args.t, args:cmdObj}).match(/egy (\w+)/)[1];
  cmdObj[pubCmd] = dir;
  cmdObj.p = pass;
  cmdObj.pass = pass;
  cmdObj.password = pass;


  // get list of projects
  cmdObj[pubCmd] = actions[1];
  var posts = JSON.stringify(#s.mora.uncorrupt({t:args.t, args:cmdObj}));
  var projects = [];
  var project = null;
  var re = /on (\w+) pro/g;
  while(project = re.exec(posts)) {
    projects.push(project[1]);
  }

  //get people
  var people = [];
  var pidx = 0;
  cmdObj[pubCmd] = dir;
  while (new Date().getTime() - start < 3000 && pidx < projects.length) {
    cmdObj.project = projects[pidx++];
    var res = (#s.mora.uncorrupt({t:args.t, args:cmdObj}));
    if (typeof res == "object") {
      people = people.concat(res);
    }
  }
  return people.sort();
}
