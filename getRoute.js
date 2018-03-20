const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const preprocess = require('./preprocess.js');

function runFile(start, end, res) {
  let response = '';
  let ls = spawn('clisp', ['-q','-i', './aStar/ASTAR.fas', '-x', `(look '${start} '${end})`])
  
  ls.stdout.on('data', (data) => {
    response += data;
    res.status(200).send(response);
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    res.status(200).send(response);
    console.log(`child process exited with code ${code}`);
  });

  return response;
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