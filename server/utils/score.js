module.exports = {
  //Calculate the Sitter Score based on sitter name.  Sitter Score is 5 times
  //the fraction of the English alphabet comprised by the distinct letters in
  //what we've recovered of the sitter's name.
  calculateScore: (name) => {
    if(name === null) {
      return 0;
    }

    let table = {};
    name = name.toLowerCase();

    for(let i = 0; i < name.length; i++) {
      let charCode = name.charCodeAt(i);
      if(charCode > 96 && charCode < 123) {
        table[charCode] = true;
      }
    }

    return 5 * (Object.keys(table).length / 26);
  }
}
