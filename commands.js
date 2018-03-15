let chalk     = require('chalk');
  
let desc = {
  'uuid': 'creates a uuid',
  'createUser': 'creates a new user',
  'help': 'prints out this prompt',
  'exit': 'shuts down the client gracefully'
};

let usage = {
  'uuid': 'uuid',
  'createUser': 'createUser <login-name> ["real-name"] [<password>]',
  'help': 'help',
  'exit': 'exit'
};

let aliases = {
  'uuid': 'none',
  'createUser': ['--create'],
  'help': 'none',
  'exit': 'none',
}

let create = function(args, serverProxy, stop) {

  let user = {};
  let argc = args.length;

  if(argc == 4) {
    user.password = args[3];
  }
  if(argc >= 3) {
    user.realName = args[2];
  }
  if(argc >= 2) {
    user.loginName = args[1]
  } else {
    console.log(chalk.red('INVALID QUERY:'));
    printUsage('createUser');
    printAlias('createUser');
    if(stop)
      exit();
    return;
  }

  serverProxy.createUser(user);
};


let help = function(args, serverProxy, stop) {
    
  
  console.log(chalk.blue('list of commands'));
  
  for(k in desc) {
    console.log('--',chalk.green(k));
    console.log('---- Description:',desc[k]);
    printUsage(k);
    printAlias(k);
  }

  if(stop)
    exit();

  return;
};

let exit = function() {
  console.log(chalk.red('exiting client...'));
  process.exit(0);
}

let cmdFail = function(stop, rl) {
  
  if(!stop) {
    rl.prompt();
    console.log(chalk.red('that is not a command! try help for a list of commands.'));
  } else {
    console.log(chalk.red('that is not a command! try help for al ist of commands.'));
    exit();
  }
  
};


let printUsage = function(cmd) {
  console.log(
    chalk.blue('---- Usage:'), 
    chalk.blue(usage[cmd])
  );
};

let printAlias = function(cmd) {
  console.log(
    chalk.blue('---- Aliases:'),
    chalk.blue(aliases[cmd])
  )
}

module.exports.create   = create;
module.exports.help     = help;
module.exports.exit     = exit;
module.exports.cmdFail  = cmdFail;
