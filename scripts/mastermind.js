function (context, args) {
  // mastermind lock
  var colors = {r:"D", o:"F", y:"J", g:"L", b:"P", v:"T"};
  var colorArray = ["r", "o", "y", "g", "b", "b"];

  //initialize solution
  var query = #db.f({script:"mastermind", user:context.caller}).first();
  var solution;
  if (query == null) {
    solution = "";
    for (var i = 0; i < 4; i++) {
      solution += (colorArray[Math.floor((Math.random() * 6))]);
    }
    #db.i({script:"mastermind", user:context.caller, solution:solution});
  }
  else {
    solution = query.solution;
  }

  // print intro message
  if (args == null) {
    return "Connected to " + context.this_script;
  }
  if (args.mstr_mnd == null) {
    return "`VLOCK_ERROR`\nDenied access by cBn `Nmstr_mnd` lock.";
  }
  if (args.mstr_mnd.match(/^[roygbv]{4}$/) == null) {
    return "I need four colors from `Dr``Fo``Jy``Lg``Pb``Tv`.";
  }

  // find correct guesses
  var correctPositions = 0;
  var correctColors = 0;
  var guess = args.mstr_mnd.split("");
  var remainingSolution = solution.split("");;

  for (var i = guess.length - 1; i >= 0; i--) {
    if (guess[i] == remainingSolution[i]) {
      correctPositions += 1;
      guess.splice(i, 1);
      remainingSolution.splice(i, 1);
    }
  }

  for (var i = guess.length - 1; i >= 0; i--) {
    var charLoc = remainingSolution.indexOf(guess[i])
    if (charLoc > -1) {
      correctColors += 1;
      guess.splice(i, 1);
      remainingSolution.splice(charLoc, 1);
    }
  }
  //return guess + "\n" + solution + "\n" + correctPositions + " " + correctColors;

  // render output
  var inChars = args.mstr_mnd.split("");
  var retStr = "Guess: ";
  for (var i = 0; i < inChars.length; i++) {
    retStr += "`" + colors[inChars[i]] + "☗`";
  }
  retStr += "  ";

  for (var i = 0; i < correctPositions; i++) {
    retStr += "`A●`";
  }
  for (var i = 0; i < correctColors; i++) {
    retStr += "`X●`";
  }
  if (args.mstr_mnd == solution) {
    retStr += "\n`NLOCK_UNLOCKED` mstr_mnd\n";
    #db.r({script:"mastermind", user:context.caller});
  }
  return retStr;
}
