function (context, args) { //t:#s.name.call, args:""
  // object to string and remove color codes
  var corruptChars = "¡¢£¤¥¦§¨©ª";
  var ret = JSON.stringify(args.t.call(args.args));
  var retArr = ret.replace(/`.([¡¢£¤¥¦§¨©ª])`/g, "$1").split("");

  // find corrupt char locations
  var remainingIndices = [];
  for (var i = 0; i < retArr.length; i++) {
    if (corruptChars.indexOf(retArr[i]) > -1)
      remainingIndices.push(i);
  }

  // repeatedly compare to new outputs to clear corrupt characters
  while (remainingIndices.length > 0) {
    var newStr = JSON.stringify(args.t.call(args.args)).replace(/`.([¡¢£¤¥¦§¨©ª])`/g, "$1");
    for (var i = remainingIndices.length - 1; i >= 0; i--) {
      var charPos = remainingIndices[i];
      if (corruptChars.indexOf(newStr[charPos]) < 0) {
        retArr[charPos] = newStr[charPos];
        remainingIndices.splice(i, 1);
      }
    }
  }

  return JSON.parse(retArr.join(""));
}
