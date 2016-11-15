function(context, args) { //t:#s.name.call
  var t = args.t;
  var pass = ["open", "unlock", "release"];
  var colors = ["red", "purple", "blue", "cyan", "green", "lime", "yellow", "orange"];
  if(#s.scripts.get_level({name:t.name}) < 4) {
    return{ok:true, msg:"Security is too low!"};
  }
  var res = t.call(args);

  if(res.includes("hardline"))
    return res;

  while(res.includes("ERROR")) {
    res = res.substring(res.indexOf("ERROR"));
    if(res.includes("magnara")) {
      args.magnara = "";
      return t.call(args);
    }
    if(res.includes("prime")) {
      args.ez_prime = 2;
      res = t.call(args);
      if(res.includes("prime")) {
        args.ez_prime = 3;
        res = t.call(args);
      }
      while(res.includes("prime")) {
        args.ez_prime += 2; //slow, but concise
        res = t.call(args);
      }
    }
    else if(res.includes("digit")) {
      args.digit = 0;
      res = t.call(args);
      while(res.includes("digit")) {
        args.digit++;
        res = t.call(args);
      }
    }
    else if(res.includes("EZ")) {
      var ix = res.indexOf("EZ");
      var i = 0;
      var l = res.substring(ix, ix + 5);
      args[l] = pass[i];
      res = t.call(args);

      while(res.includes("correct")) {
        args[l] = pass[++i];
        res = t.call(args);
      }
    }
    else { //colors
      var ix = res.indexOf("c00");
      var l = res.substring(ix, ix+4);
      //do first loop
      var i = 0;
      do {
        args[l] = colors[i++];
        res = t.call(args);
      } while(res.includes("correct"));
      i--;

      if(res.includes("ERROR")) {
        if(l === "c001") {
          args.color_digit = colors[i].length;
          res = t.call(args);
        }
        else if(l === "c002") {
          args.c002_complement = colors[(i + 4) % 8];
          res = t.call(args);
        }
        else if(l === "c003") {
          args.c003_triad_1 = colors[(i + 3) % 8];
          args.c003_triad_2 = colors[(i + 5) % 8];
          res = t.call(args);
        }
      }
    }
  }
  return {ok:true, msg:"All done!"};
}
