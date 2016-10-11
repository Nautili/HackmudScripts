function (context, args) {
  var sec = #s.scripts.get_level({name:args.target.name});
  if(sec === 4) {
    var ret = args.target.call();
    return {ret};
  }
  else {
    return {
      ok: false,
      msg: "This script is unsafe. User beware." };
  }
}
