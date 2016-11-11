function (context, args) { //s:"ABCD"
  function solveConSpec(str) {
    var gap1 = str.charCodeAt(1) - str.charCodeAt(0);
    var gap2 = str.charCodeAt(2) - str.charCodeAt(1);

    var charVal = str.charCodeAt(str.length - 1);
    var retStr = "";
    if (str.length % 2 == 0) {
      retStr += String.fromCharCode(charVal + gap1);
      retStr += String.fromCharCode(charVal + gap1 + gap2);
      retStr += String.fromCharCode(charVal + gap1 + gap2 + gap1);
    }
    else {
      retStr += String.fromCharCode(charVal + gap2);
      retStr += String.fromCharCode(charVal + gap2 + gap1);
      retStr += String.fromCharCode(charVal + gap2 + gap1 + gap2);
    }

    return retStr;
  }

  var ret = solveConSpec(args.s);
  return {ok:true, msg:ret};
}
