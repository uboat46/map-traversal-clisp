const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const preprocess = require('./preprocess.js');

function runFile(start, end, res) {
  let args = `(look '${start} '${end})`;
  let response = '';
  let ls = spawn('clisp', ['-q','-i', `${__dirname}/aStar/ASTAR.fas`, '-x', `(look '${start} '${end})`]);
  //res.status(200).send(`${__dirname}/aStar/ASTAR.fas`);
  //let ls = spawn('clisp', ['-q','-i', `/root/mapTraversalClisp/aStar/ASTAR.fas`, '-x', `(look '${start} '${end})`], {shell: 'bin/bash'});
  //let ls = spawn('/bin/bash', ['/root/mapTraversalClisp/look.sh', '\''+start, '\''+end]);
  //let ls = spawn('clisp', ['-q', '-x', '(PRINT \'hello']);
  ls.stdout.on('data', (data) => {
    if(data.includes('}') || data.includes('(')) {response += data};
    //response += data;
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
   console.log(`stderr: ${data}`);
   //ls.kill();
  });
  
  ls.on('close', (code) => {
    response = response.trim().replace('NIL', '').split('}').join(',').substring(0, response.trim().length - 6);
    response = `{"route":"${response}}`.replace("\n","");
    res.status(200).send(response);
    console.log(`child process exited with code ${code}`);
  });

}

function run(start, end, res) {
  if(start.trim() != "" && end.trim() != "")
  {
    runFile(start, end, res);
  }else {
    res.status(200).send('Please send arguments to run\n    ex. \n    node run.js rennes avignon');
  }
}

module.exports = run;