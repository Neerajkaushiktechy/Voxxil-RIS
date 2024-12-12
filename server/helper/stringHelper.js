const smallAlphabetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const capitalAlphabetArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const numberArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const specialCharArray = ["@", "#", "$", "*"]

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

exports.convertToTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

exports.generateExamList = (examList) => examList
.map((item) => item.list.map((listItem) => listItem?.name))
.flat()
.join(", ")

exports.generatePatientPassword = async (patientName, patientDOB) => {
    const smallAlpahbets = shuffleArray(smallAlphabetArray)
    const capitalAlphabets= shuffleArray(capitalAlphabetArray)
    const numbers = shuffleArray(numberArray)
    const specialChars = shuffleArray(specialCharArray)
    const passwordArray = [...smallAlpahbets.slice(0, 2), capitalAlphabets.slice(0, 1), numbers.slice(0, 1), specialChars.slice(0, 1)]
    const password = shuffleArray(passwordArray).join("")
    return password
}