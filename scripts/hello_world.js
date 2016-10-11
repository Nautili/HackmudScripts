function (context, args)
{
  var record = args;
  //record.channel = "3141";
  record.msg = "Hello, world!";
  var result = #s.chats.send(record);

  return result;
}
