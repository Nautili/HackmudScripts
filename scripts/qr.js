function (context, args) { // s:""
  var rows = args.s.split("\n");
  var size = rows[0].length;
  var sizeDict = {45:[6,22,38], 49:[6,24,42], 53:[6,26,46]}
  if (sizeDict[size] == null) {
    return {ok:false, msg:"QR is an unknown size. Add table for size " + size + "."};
  }

  // translate to bit matrix and remove last two rows
  var qrMat = [];
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
          break
        case "▄":
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
  var qrMask = (qrMat[8][2] * 4 + qrMat[8][3] * 2 + qrMat[8][4]) ^ 5;
  var maskFun = function(){};
  switch (qrMask) {
    case 0:
      maskFun = function (r, c) { return (r + c) % 2 == 0; };
      break;
    case 1:
      maskFun = function (r, c) { return (r % 2) == 0; };
      break;
    case 2:
      maskFun = function (r, c) { return (c % 3) == 0; };
      break;
    case 3:
      maskFun = function (r, c) { return ((r + c) % 3) == 0; };
      break;
    case 4:
      maskFun = function (r, c) { return ((Math.floor(r/2) + Math.floor(c/3)) % 2) == 0; };
      break;
    case 5:
      maskFun = function (r, c) { return (((r * c) % 2) + ((r * c) % 3)) == 0; };
      break;
    case 6:
      maskFun = function (r, c) { return ((((r * c) % 2) + ((r * c) % 3)) % 2) == 0; };
      break;
    case 7:
      maskFun = function (r, c) { return ((((r + c) % 2) + ((r * c) % 3)) % 2) == 0; };
  }

  for (var row = 0; row < size; row++) {
    for (var col = 0; col < size; col++) {
      if (maskFun(row, col)) {
        qrMat[row][col] ^= 1;
      }
    }
  }

  //flag non-data for removal
  //finders
  for(var i = 0; i <= 8; i++) {
    for (var j = 0; j <= 8; j++) {
      qrMat[i][j] = 2;
      if (i < 8)
        qrMat[i + size - 8][j] = 2;
      if (j < 8)
        qrMat[i][j + size - 8] = 2;
    }
  }

  //timing
  for (var i = 0; i < size; i++) {
    qrMat[6][i] = 2;
  }

  //format
  if (size >= 45) {
    for (var i = size - 11; i < size - 8; i++) {
      for (var j = 0; j < 6; j++) {
        qrMat[i][j] = 2;
        qrMat[j][i] = 2;
      }
    }
  }

  function fillAligns(a, b) {
    for (var i = a - 2; i <= a + 2; i++) {
      for (var j = b - 2; j <= b + 2; j++) {
        qrMat[i][j] = 2;
      }
    }
  }

  //alignments
  var alignLocs = sizeDict[size];
  for (var i = 0; i < alignLocs.length; i++) {
    for (var j = 0; j < alignLocs.length; j++) {
      var ti = alignLocs[i];
      var tj = alignLocs[j];
      if (!((i == 0 && j == alignLocs.length - 1) ||
            (i == alignLocs.length - 1 && j == 0))) {
        fillAligns(ti, tj);
      }
    }
  }

  //remove dead column
  for (var i = 0; i < size; i++) {
    qrMat[i].splice(6,1);
  }

  // turn qrMat into stream
  var qrStream = "";
  // grab each column in the proper direction
  for (var col = size - 2; col >=0 ; col -= 2) {
    //read up
    if ((col + 1) % 4 == 0) {
      for (var row = size - 1; row >= 0; row--) {
        qrStream += qrMat[row][col];
        qrStream += qrMat[row][col-1];
      }
    }
    // read down
    else {
      for (var row = 0; row < size; row++) {
        qrStream += qrMat[row][col];
        qrStream += qrMat[row][col-1];
      }
    }
  }

  var rawQrStream = qrStream.replace(/2/g, "");
  if (rawQrStream.substring(0,4) != "0100") {
    return {ok:false, msg:"QR code is not in byte format."};
  }
  var rawQrBytes = rawQrStream.match(/.{1,8}/g);

  // reorder error bytes from error correction
  // split indices into blocks with proper lengths
  var ecDict = {45:{blocks:[[13,4], [14,1]]},
                49:{blocks:[[14,4], [15,2]]},
                53:{blocks:[[12,4], [13,4]]}};

  var blocks = ecDict[size].blocks;
  var numBlocks = blocks[0][0] * blocks[0][1] + blocks[1][0] * blocks[1][1];
  var nums = [];
  for (var i = 0; i < numBlocks; i++) {
    nums.push(i);
  }
  var indexBlocks = [];
  for (var i = 0; i < blocks.length; i++) {
    for (var j = 0; j < blocks[i][1]; j++) {
      indexBlocks.push(nums.splice(0, blocks[i][0]));
    }
  }

  var indices = [];
  for (var i = 0; i < indexBlocks[indexBlocks.length - 1].length; i++) {
    for (var j = 0; j < indexBlocks.length; j++) {
      if (indexBlocks[j][i] != null) {
        indices.push(indexBlocks[j][i]);
      }
    }
  }

  // reorder bytes
  var ecQrBytes = new Array(numBlocks);
  for (var i = 0; i < indices.length; i++) {
    ecQrBytes[indices[i]] = rawQrBytes[i];
  }

  var reQrStream = ecQrBytes.join("");
  if (reQrStream.substring(0,4) != "0100") {
    return {ok:false, msg:"QR code is not in byte format."};
  }
  var qrLength = parseInt(reQrStream.substring(4,12), 2);
  var qrBytes = reQrStream.substring(12).match(/.{1,8}/g).slice(0, qrLength);

  var qrString = qrBytes.map(function (s) { return String.fromCharCode(parseInt(s, 2))}).join("");
  return JSON.parse(qrString);
}
