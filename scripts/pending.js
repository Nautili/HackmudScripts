function(context, args) {//show:false
  if(args.show)
    return #db.f({pending:true}).array();
  var trans = #db.f({pending:true}).array();
  for(var i = 0; i < trans.length; i++) {
    var res = #s.accts.xfer_gc_to({to:trans[i].user, amount:trans[i].amount,
                         memo:"Here are your winnings. Thanks for playing!"})
    if(!res.ok)
      return res;
    #db.r({pending:true, user:trans[i].user});
  }
  return {ok:true, msg:"Payments fulfilled."};
}
