function (context, args) { //amount:"7GC", times:10
  var a = args.amount;
  var t = args.times;
  if(a == null)
    a = "7GC";
  if(t == null)
    t = 10;
  for (var i = 0; i < t; i++)
    #s.accts.xfer_gc_to({to:"caerula", amount:a});

  return {ok:true, msg:"Wash away your acct_nt pains!"};
}
