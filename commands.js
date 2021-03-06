let chalk     = require('chalk');

let desc = {
  'uuid': 'creates a uuid',
  'createUser': 'creates a new user',
  'lookup': 'looks up a user\'s information by their login name',
  'reverse-lookup': 'looks up a user\'s information by their unique user id',
  'delete': 'deletes a user with the given login name',
  'modify': 'changes a given user\'s login name to a new login name',
  'get': 'retrieves login names, uuids, or all information for all users',
  'help': 'prints out this prompt',
  'exit': 'shuts down the client gracefully'
};

let usage = {
  'uuid': 'uuid',
  'createUser': 'createUser <login-name> ["real-name"] [--password <password>]',
  'lookup': 'lookup <login-name>',
  'reverse-lookup': 'reverseLookup <uuid>',
  'delete': 'delete <loginName> [--password <password>]',
  'modify': 'modify <oldLoginName> <newLoginName> [ --password <password>]',
  'get': 'get <users> | <uuids> | <all>',
  'help': 'help',
  'exit': 'exit'
};

let aliases = {
  'uuid': 'none',
  'createUser': '--create',
  'lookup': '--lookup',
  'reverse-lookup': '--reverse-lookup',
  'delete': '--delete',
  'modify': '--modify',
  'get': '--get',
  'help': 'none',
  'exit': 'none',
}

let create = function(args, serverProxy, client, stop) {

  let user = {};
  let argc = args.length;

  if(argc >= 2 && argc <= 5) {
    if((argc == 5 && args[3] != '--password') | argc == 4) {
      console.log(chalk.red('INVALID QUERY:'));
      printUsage('createUser');
      printAlias('createUser');
      if(stop)
        exit(client);
      return;
    } else if(argc == 5) {
      user.password = args[4];
    } 
    if(argc >= 3) {
      user.realName = args[2];
    }
    if(argc >= 2) {
      user.loginName = args[1]
    } 
  } else {
    console.log(chalk.red('INVALID QUERY:'));
    printUsage('createUser');
    printAlias('createUser');
    if(stop)
      exit(client);
    return;
  }

  serverProxy.createUser(user);
};

let lookup = function(args, serverProxy, client, stop) {
  let argc = args.length;
  if(argc != 2) {
    console.log(chalk.red('INVALID QUERY:'));
    printUsage('lookup');
    printAlias('lookup');
    if(stop)
      exit(client);
    return;
  }

  serverProxy.lookup(args[1]);
};

let reverseLookup = function(args, serverProxy, client, stop) {
  let argc = args.length;
  if(argc != 2) {
    console.log(chalk.red('INVALID QUERY:'));
    printUsage('reverse-lookup');
    printAlias('reverse-lookup');
    if(stop)
      exit(client);
    return;
  }

  serverProxy.reverseLookup(args[1]);
};

let get = function(args, serverProxy, client, stop) {
  let argc = args.length;
  if(argc != 2 | (args[1] != 'all' && args[1] != 'users' && args[1] != 'uuids')) {
    console.log(chalk.red('INVALID QUERY:'));
    printUsage('get');
    printAlias('get');
    if(stop)
      exit(client);
    return;
  }

  serverProxy.get(args[1]);
};

let remove = function(args, serverProxy, client, stop) {
  let argc = args.length;
  let loginName, password;
    if((argc !=  2 && argc != 4) || (argc == 4 && args[2] != '--password')) {
      console.log(chalk.red('INVALID QUERY:'));
      printUsage('delete');
      printAlias('delete');
      if(stop)
        exit(client);
      return;
    } else {
      loginName = args[1];
      if(args[3])
        password = args[3];
      else
        password = null;
    }

  serverProxy.delete(loginName, password);
};

let modify = function(args, serverProxy, client, stop) {
  let argc = args.length;
  let oldLoginName, newLoginName, password;
    if((argc != 3 && argc != 5) || (argc == 5 && args[3] != '--password')) {
      console.log(chalk.red('INVALID QUERY:'));
      printUsage('modify');
      printAlias('modify');
      if(stop)
        exit(client);
      return;
    } else {
      oldLoginName = args[1];
      newLoginName = args[2];
      if(args[4])
        password = args[4];
      else
        password = null;
    }

  serverProxy.modify(oldLoginName, newLoginName, password);
};

let help = function(args, serverProxy, client, stop) {


  console.log(chalk.cyan('list of commands'));

  for(k in desc) {
    console.log('--',chalk.green(k));
    console.log('---- Description:',desc[k]);
    printUsage(k);
    printAlias(k);
  }

  if(stop)
    exit(client);

  return;
};

let exit = function(client, cmdExit) {
  if(!cmdExit)
    console.log(chalk.red('exiting client...'));
  client.disconnect();
  process.exit(0);
}

let cmdFail = function(stop, rl, client) {

  if(!stop) {
    rl.prompt();
    console.log(chalk.red('that is not a command! try help for a list of commands.'));
  } else {
    console.log(chalk.red('that is not a command! try help for alist of commands.'));
    exit(client);
  }

};


let printUsage = function(cmd) {
  console.log(
    chalk.cyan('---- Usage:'), 
    chalk.cyan(usage[cmd])
  );
};

let printAlias = function(cmd) {
  console.log(
    chalk.cyan('---- Aliases:'),
    chalk.cyan(aliases[cmd])
  )
}

module.exports.create   = create;
module.exports.lookup   = lookup;
module.exports.reverseLookup   = reverseLookup;
module.exports.remove   = remove;
module.exports.modify   = modify;
module.exports.get      = get;
module.exports.help     = help;
module.exports.exit     = exit;
module.exports.cmdFail  = cmdFail;
