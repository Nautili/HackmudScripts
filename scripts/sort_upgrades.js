function(context, args) {
  function upgradeCompare(u1, u2) {
    if (u1.type > u2.type) {
      return 1;
    }
    else if (u1.type < u2.type) {
      return -1;
    }

    if (u1.name > u2.name) {
      return 1;
    }
    else if (u1.name < u2.name) {
      return -1;
    }

    return u2.rarity - u1.rarity;
  }

  var start = new Date().getTime();
  var query = #db.f({script:"sort_upgrades", user:context.caller}).first();
  if (query == null) {
    var index = 0;
    var upgrades = #s.sys.upgrades();
    for (var i = 0; i < upgrades.length; i++) { //set final indices
      upgrades[i].from = i;
    }
    upgrades.sort(upgradeCompare);
  }
  else {
    var index = query.index;
    var upgrades = query.upgrades;
    #db.r({script:"sort_upgrades", user:context.caller});
  }

  for (var i = index; i < upgrades.length; i++) {
    #s.sys.upgrades({reorder:{to:i, from:upgrades[i].from}});
    for (var j = i + 1; j < upgrades.length; j++) {
      if(upgrades[j].from <= upgrades[i].from) {
        upgrades[j].from += 1;
      }
    }

    if (new Date().getTime() - start > 4000) {
      #db.i({script:"sort_upgrades", user:context.caller, upgrades:upgrades, index:i+1});
      return {ok:false, msg:"Ran out of time! Please run this script again."};
    }
  }

  return {ok:true, msg:"Sorted!"};
}
