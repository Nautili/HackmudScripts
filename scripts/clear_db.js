function (context, args) { //s:""
  #db.r({script:args.s});
  return {ok:true, msg:"Cleared " + args.s};
}
