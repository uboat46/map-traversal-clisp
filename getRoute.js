const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const preprocess = require('./preprocess.js');

function runFile(start, end) {
  let ls = spawn('clisp', ['-q','-i', './aStar/ASTAR.fas', '-x', `(look '${start} '${end})`])
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function run(start, end) {
  if(start.trim() != "" && end.trim() != "")
  {
    return runFile(start, end);
  }else {
    return 'Please send arguments to run\n    ex. \n    node run.js rennes avignon';
  }
}

module.exports = run;