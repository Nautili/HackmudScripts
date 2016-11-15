function (context, args) { //i:""
  var numUpgrades = #s.sys.upgrades().length;
  for (var i = args.i; i < numUpgrades; i++) {
    #s.sys.upgrades({destroy:args.i, confirm:true});
  }
  return {ok:true, msg:"all clean!"}
}
