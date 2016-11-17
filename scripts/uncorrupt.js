function (context, args) { //t:#s.name.call, args:""
  var res = #s.escrow.charge({cost:"100KGC", is_unlim:true});
  if(res) {
    return res;
  }

  var corruptChars = "¡¢£¤¥¦§¨©ª";
  var ret = JSON.stringify(args.t.call(args.args));
  var retArr = ret.replace(/`.([¡¢£¤¥¦§¨©ª])`/g, "$1").split("");

  var remainingIndices = [];
  for (var i = 0; i < retArr.length; i++) {
    if (corruptChars.indexOf(retArr[i]) > -1)
      remainingIndices.push(i);
  }

  while (remainingIndices.length > 0) {
    var newStr = JSON.stringify(args.t.call(args.args)).replace(/`.([¡¢£¤¥¦§¨©ª])`/g, "$1");
    for (var i = 0; i < remainingIndices.length; i++) {
      if (corruptChars.indexOf(newStr[remainingIndices[i]]) < 0) {
        retArr[remainingIndices[i]] = newStr[remainingIndices[i]];
        remainingIndices.splice(i, 1);
      }
    }
  }

  return JSON.parse(retArr.join(""));
}
