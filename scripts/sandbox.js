function(context, args) {
  var res = #s.accts.xfer_gc_to_caller({amount:"10KGC"});
  if(!res.ok) {
    return {ok:false, msg:"not enough"};
  }
  return {ok:true};
}
