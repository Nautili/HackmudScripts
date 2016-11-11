function (context, args) {
  var bal = #s.accts.balance();
  if (args == null || args.name == null) {
    #s.accts.xfer_gc_to({to:"caerula", amount:bal});
  }
  else {
    #s.accts.xfer_gc_to({to:args.name, amount:bal});
  }
  return {ok:true, msg:"Thanks!"};
}
