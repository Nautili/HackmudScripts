function (context, args) { //acct_nt:0, magnara:"", t:#s.name.call
  function solveConSpec(str) {
    var gap1 = str.charCodeAt(1) - str.charCodeAt(0);
    var gap2 = str.charCodeAt(2) - str.charCodeAt(1);

    var charVal = str.charCodeAt(str.length - 1);

    if (str.length % 2 == 0) {
      var temp = gap2;
      gap2 = gap1;
      gap1 = temp;
    }

    var retStr = String.fromCharCode(charVal + gap1);
    retStr += String.fromCharCode(charVal + gap1 + gap2);
    retStr += String.fromCharCode(charVal + gap1 + gap2 + gap1);
    return retStr;
  }

  var t = args.t;
  if(#s.scripts.get_level({name:t.name}) < 2) {
    return{ok:true, msg:"Security is too low!"};
  }

  var t2args = {sn_w_glock:"", CON_SPEC:"", acct_nt:args.acct_nt, magnara:args.magnara};
  var res = t.call(t2args);
  var type = "";

  if (res.includes("hardline"))
    return res;
    
  var flood = #s.caerula.flood({amount:"1GC", times:10});
  flood;
  while (!res.includes("UNLOCKED")) {
    if (res.includes("letters")) { //CON_SPEC
      t2args.CON_SPEC = solveConSpec(res.split("\n")[0]);
    }
    else if (res.includes("balance")) { //sn_w_glock
      var types = ["secret", "special", "meaning", "elite", "hunter", "mono", "beast", "magic", "secure"];

      for (var i = 0; i < types.length; i++) {
        if (res.includes(types[i])) {
          type = types[i];
        }
      }
      if (type == "") {
        return {ok:false, msg:"Unknown glock type:\n" + res};
      }

      #s.caerula.get_glock({s:type});
      flood;
    }
    else if (res.includes("magnara")) { //handle this manually
      return res;
    }
    else { //acct_nt
      if (res.includes("large")) {
        flood;
        t2args.acct_nt = 1;
      }
      else {
        return {ok:false, msg:res, args:t2args};
      }
    }

    res = t.call(t2args);
  }

  #s.mora.to_bank();
  return {ok:true, msg:"Pretty neat, huh!"};
}
