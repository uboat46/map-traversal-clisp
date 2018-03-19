const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');

fs.readFile(process.argv[2] + '.lisp', 'utf8', (err, data) => {
  if (err) {
    console.log(`{"error": "${err.message}"}`);
  }else {
    transform(data);
  }
});

function transform(data) {
  const patt = /[\t\n]/gm;
  var trimedData = data;
  trimedData = trimedData.replace(patt, '');
  run(trimedData);
}


function run(data) {
  let ls = spawn('clisp', ['-x', '-q',  ,data])
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
