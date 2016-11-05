function(context, args) {
  var res = #s.autos.reset();
  if(!res.ok)
    return {ok:false, msg:"Reset failed"};
  #s.scripts.trust();
  #s.scripts.fullsec();
  #s.scripts.highsec();
  #s.scripts.user();
  return{ok:true, msg:"Autocompletes reset!"};
}
