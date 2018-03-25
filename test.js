import test from 'ava';
const config           = require('./server.config.js'); 
const { exec }         = require('child_process');
const validUrl         = require('valid-url');

let host = config.test.host;
let loginName = config.test.loginName;
let modifiedLoginName = config.test.modifiedLoginName;
let name = config.test.name;
let password = config.test.password;
let wrongPassword = config.test.wrongPasword;
let invalidPassword = config.test.invalidPassword;
let invalidOption = config.test.invalidOption;
let uuid;
let tests;

if(!validUrl.isHttpsUri(host)) {
  console.log('HTTPS REQUIRED TO CONNECT TO SERVER');
  printUsageAndExit();
} else {

  tests = {
    'create user': {
      cmd: `node client.js ${host} --create ${loginName} "${name}" --password ${password}`,
      assertTrue: ['user', 'created', 'successfully']
    },
    'create exists': {
      cmd: `node client.js ${host} --create ${loginName} "${name}" --password ${password}`,
      assertTrue: [loginName, 'exists']
    },
    'lookup': {
      cmd: `node client.js ${host} --lookup ${loginName}`,
      assertTrue: [loginName, 'uuid']
    },
    'reverse-lookup': {
      cmd: `node client.js ${host} --reverse-lookup `,
      assertTrue: [loginName, 'uuid']
    },
    'modify': {
      cmd: `node client.js ${host} --modify ${loginName} ${modifiedLoginName} --password ${password}`,
      assertTrue: [loginName, 'uuid']
    },
    'modify invalid password': {
      cmd: `node client.js ${host} --modify ${modifiedLoginName} ${loginName} --password ${wrongPassword}`,
      assertTrue: [loginName, 'incorrect', 'password']
    },
    'modify invalid option': {
      cmd: `node client.js ${host} --modify ${modifiedLoginName} ${loginName} ${invalidOption} ${password}`,
      assertTrue: ['INVALID', 'QUERY']
    },
    'modify does not exist': {
      cmd: `node client.js ${host} --modify asdf ${modifiedLoginName} --password ${password}`,
      assertTrue: ['asdf', 'not', 'exist']
    },
    'get all': {
      cmd:`node client.js ${host} --get all`,
      assertTrue: [modifiedLoginName, 'uuid']
    },
    'get users': {
      cmd:`node client.js ${host} --get users`,
      assertTrue: [modifiedLoginName]
    },
    'get uuids': {
      cmd:`node client.js ${host} --get uuids`,
      assertTrue: ['{','}', 'uuid']
    },
    'delete': {
      cmd:`node client.js ${host} --delete ${modifiedLoginName} --password ${password}`,
      assertTrue: ['deleted']
    },
    'delete does not exist': {
      cmd:`node client.js ${host} --delete asdf --password ${password}`,
      assertTrue: ['asdf', 'not', 'exist']
    },
    'delete invalid option': {
      cmd:`node client.js ${host} --delete asdf --paword ${password}`,
      assertTrue: ['INVALID', 'QUERY']
    },
    'reverse-lookup does not exist': {
      cmd: `node client.js ${host} --reverse-lookup `,
      assertTrue: ['uuid', 'not', 'exist']
    },
    'lookup does not exist': {
      cmd: `node client.js ${host} --lookup ${loginName}`,
      assertTrue: [loginName, 'not', 'exist']
    },
    'create user no password': {
      cmd: `node client.js ${host} --create ${loginName} "${name}"`,
      assertTrue: ['user', 'created', 'successfully']
    },
    'modify user no password': {
      cmd: `node client.js ${host} --modify ${loginName} ${modifiedLoginName}`,
      assertTrue: [loginName, 'uuid']
    },
    'delete user no password': {
      cmd: `node client.js ${host} --delete ${modifiedLoginName}`,
      assertTrue: ['deleted']
    },
    'invalid command': {
      cmd: `node client.js ${host} --asdf ${modifiedLoginName}`,
      assertTrue: ['not', 'command', 'try', 'help']
    }
  }

  for(let k in tests) {
    test.serial.cb(k, t => {
      t.plan(tests[k].assertTrue.length);
      if(k.indexOf('reverse-lookup') >= 0)
        tests[k].cmd += uuid;
      exec(tests[k].cmd , 
        (err, stdout, stderr) => {
          if (err) {
            t.fail();
            t.end();
            return;
          } else {
            for(let i = 0 ; i < tests[k].assertTrue.length; i++) {
              if(k.indexOf('create user') >= 0) {
                let hasUuid = stdout.indexOf('uuid')
                if(hasUuid > 0) {
                  uuid = stdout.slice( hasUuid + 6, hasUuid + 42);
                  t.pass();
                }
                else
                  t.fail();
              } else {
                if(tests[k].assertTrue[i] == 'uuid')
                  t.true(stdout.indexOf(uuid) > 0);
                else
                  t.true(stdout.indexOf(tests[k].assertTrue[i]) > 0);
              }
            }
            t.end();
            return;
          }
        });
    });
  }
}

function printUsageAndExit() {
  console.log('USAGE: node client.js <server-host-uri> [--<command> ...]');
  process.exit(0); 
}
