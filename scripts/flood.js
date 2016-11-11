function (context, args) { //amount:"1GC", times:8
  if (context.caller != "mora")
    return {ok:true, msg:"Sorry! Message me and I might help you out."};
  var a = args.amount;
  var t = args.times;
  if(a == null)
    a = "1GC";
  if(t == null)
    t = 8;
  for (var i = 0; i < t; i++) {
    #s.accts.xfer_gc_to_caller({amount:a});
    #s.accts.xfer_gc_to({to:"caerula", amount:a});
  }

  return {ok:true, msg:"Wash away your acct_nt pains!"};
}
