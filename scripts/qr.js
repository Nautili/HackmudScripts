function (context, args) { // s:""

  var rows = args.s.split("\n");
  var size = rows[0].length;

  var qrMat = []

  // translate to bit matrix and remove last two rows
  for (var row = 0; row < rows.length - 1; row++) {
    var row1 = [];
    var row2 = [];
    for (var col = 0; col < size; col++) {
      var char = rows[row][col];
      var val1 = 0;
      var val2 = 0;
      switch (char) {
        case "█":
          val1 = 1;
          val2 = 1;
          break;
        case "▀":
          val1 = 1;
          val2 = 0;
          break
        case "▄":
          val1 = 0;
          val2 = 1
          break;
      }
      row1.push(val1);
      row2.push(val2);
    }
    qrMat.push(row1);
    qrMat.push(row2);
  }
  qrMat.pop();

  // apply bitmask
  return qrMat;
}
