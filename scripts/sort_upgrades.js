function(context, args) {
  var lockOrder = ["sn_w_glock", "ez_40", "acct_nt", "c001", "ez_35", "CON_SPEC", "c002", "ez_21", "c003", "magnara", "w4rn"]
  function upgradeCompare(u1, u2) {
    if (u1.type > u2.type) {
      return 1;
    }
    else if (u1.type < u2.type) {
      return -1;
    }

    if (u1.type == "lock" && u2.type == "lock") {
      var diff = lockOrder.indexOf(u1.name) - lockOrder.indexOf(u2.name);
      if (diff != 0) {
        return diff;
      }
    }

    if (u1.tier != u2.tier) {
      return u2.tier - u1.tier;
    }

    if (u1.name > u2.name) {
      return 1;
    }
    else if (u1.name < u2.name) {
      return -1;
    }

    if(u1.rarity != u2.rarity) {
      return u2.rarity - u1.rarity;
    }

    return u2.loaded - u1.loaded;
  }

  var start = new Date().getTime();
  var res = #s.escrow.charge({cost:"10MGC", is_unlim:true});
  if(res) {
    return res
  }

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
    if (i != upgrades[i].from) {
      #s.sys.upgrades({reorder:{to:i, from:upgrades[i].from}});
      for (var j = i + 1; j < upgrades.length; j++) {
        if(upgrades[j].from <= upgrades[i].from) {
          upgrades[j].from += 1;
        }
      }
    }

    if (new Date().getTime() - start > 4000) {
      #db.i({script:"sort_upgrades", user:context.caller, upgrades:upgrades, index:i+1});
      return {ok:false, msg:"Ran out of time! Please run this script again."};
    }
  }

  return {ok:true, msg:"Sorted!"};
}
