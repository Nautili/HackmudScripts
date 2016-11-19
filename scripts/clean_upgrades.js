function (context, args) {
  var upgrades = #s.sys.upgrades();
  var upgradeCounts = {};

  var upgradesToRemove = [];
  for (var i = 0; i < upgrades.length; i++) {
    var name = upgrades[i].name;
    if (upgradeCounts[name] == null) {
      upgradeCounts[name] = 0;
    }
    upgradeCounts[name]++;

    if (!(upgrades[i].loaded || upgrades[i].rarity > 0) && upgradeCounts[name] > 2) {
      upgradesToRemove.push(i);
    }
  }
  if (upgradesToRemove.length > 0)
    var res = #s.sys.upgrades({destroy:upgradesToRemove, confirm:true});
  return {ok:true, msg:"all clean!"}
}
