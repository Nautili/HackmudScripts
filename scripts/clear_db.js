function (context, args) { //query:""
  #db.r(args.query);
  return {ok:true, msg:"Cleared"};
}
