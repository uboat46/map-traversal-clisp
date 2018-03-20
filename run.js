const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const preprocess = require('./preprocess.js');

function runFile(data) {
  console.log(`(look '${data[2]} '${data[3]})`);
  let ls = spawn('clisp', ['-q','-i', './aStar/ASTAR.fas', '-x', `(look '${data[2]} '${data[3]})`])
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

function run() {
  process.argv.length != 4 ? console.log('Please send arguments to run\n    ex. \n    node run.js rennes avignon') 
  : runFile(process.argv);
}

run()