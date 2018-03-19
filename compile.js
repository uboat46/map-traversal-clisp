const { spawn } = require('child_process');
const fs = require('fs');
const util = require('util');
const preprocess = require('./preprocess.js');

/**
 * Removes data from temp lisp file
 */
function removeTempFile() {
  fs.writeFile('temp.lisp', '', function (err) {
    if (err) throw err;
  });
}

/**
 * Creates a temp lisp file with data in it
 * @param {*} data 
 */
function createTempFile(data) {
  fs.writeFile('temp.lisp', data, function (err) {
    if (err) throw err;
  });
}

/**
 * Recieves a preprocessed lisp file and compiles it 
 * into a binary from the clisp cli
 * @param {*} data 
 * @param {*} filename 
 */
function compileFile(data, filename) {
  createTempFile(data);
  let ls = spawn('clisp', ['-x','-q','-c', 'temp.lisp', '-o', `${filename.replace('.lisp','.fas')}`])
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ls.on('close', (code) => {
    removeTempFile();
    console.log(`child process exited with code ${code}`);
  });
}

/**
 * Reads a lisp file, preprocess it and sents it to compile 
 * to the clisp cli
 * @param {*} file 
 */
function readFile(file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(`{"error": "${err.message}"}`);
    }else {
      compileFile(preprocess(data), file);
    }
  }); 
}

/**
 * Compiles all the files sent to the argv array
 * @param {*} files 
 */
function compile(files) {
  for(i = 2; i < files.length; i++) {
    let file = files[i];
    if(!file.includes('.lisp')){file = file + '.lisp'};
    console.log(file);
    readFile(file);
  }
}

process.argv.length <= 2 ? console.log('Please send a file to compile\n    ex. \n    node compile.js MyFilename *.lisp is not necessary') 
: compile(process.argv);