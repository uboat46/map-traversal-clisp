/**
 * Recieves text and formats it into a 
 * friendly lisp file
 * @param {*} data 
 */
function preprocess(data) {
    const patt = /[\t\n]/gm;
    var trimedData = data;
    trimedData = trimedData.replace(patt, '');
    return trimedData;
}

module.exports = preprocess;