function (context, args) { //t:#s.name.call
  var sec = #s.scripts.get_level({name:args.t.name});
  if(sec === 4) {
    var ret = args.t.call();
    return ret;
  }
  else {
    return {
      ok: false,
      msg: "This script is unsafe. User beware." };
  }
}
