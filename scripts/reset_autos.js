function(context, args) {
  var res = #s.autos.reset();
  if(!res.ok)
    return {ok:false, msg:"Reset failed"};
  #s.scripts.trust();
  #s.scripts.fullsec();
  #s.scripts.highsec();
  #s.scripts.user();
  #s.scripts.sys();
  return{ok:true, msg:"Autocompletes reset!"};
}
