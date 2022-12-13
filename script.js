function confirmButton() { //function ran when the confirm button is clicked
	output.value = ""; //resets the output value so it is made clear when something succeeds or not succeeds
	if (makeSquare()) { //runs the makeSquare function which will make the square and return a boolean
		if (encipherRadio.checked)
			encipher();
		else
			decipher();
	}
}

function encipher() { //enciphers the inputted plaintext into ciphertext
	let inArr = strToBlocks(input.value, false);
	let outArr = [];
	for (let i = 0; i < inArr.length; i++) {
		let firstLetterCoords = findLetter(inArr[i].charAt(0));
		let secondLetterCoords = findLetter(inArr[i].charAt(1));
		let firstLetterCoordsEn = -1; //these are the coordinates for the enciphered letters. -1 is a temporary value.
		let secondLetterCoordsEn = -1;
		if (firstLetterCoords[0] == secondLetterCoords[0]) { //checks if the row is the same
			firstLetterCoordsEn = [firstLetterCoords[0], (firstLetterCoords[1]+1) % 5]; //the coordinate is incremented by one
			secondLetterCoordsEn = [secondLetterCoords[0], (secondLetterCoords[1]+1) % 5]; //it is then modded by 5 to ensure it stays within acceptable range
		} else if (firstLetterCoords[1] == secondLetterCoords[1]) { //checks if the column is the same
			firstLetterCoordsEn = [(firstLetterCoords[0]+1) % 5, firstLetterCoords[1]];
			secondLetterCoordsEn = [(secondLetterCoords[0]+1) % 5, secondLetterCoords[1]];
		} else { //runs if neither the row or the column are the same
			firstLetterCoordsEn = [firstLetterCoords[0], secondLetterCoords[1]]; //the column number is switched between the first and second letter
			secondLetterCoordsEn = [secondLetterCoords[0], firstLetterCoords[1]];
		}
		outArr.push(square[firstLetterCoordsEn[0]][firstLetterCoordsEn[1]] + square[secondLetterCoordsEn[0]][secondLetterCoordsEn[1]]); 
		//takes the new coordinates and gets the characters found at those coordinates. This will be the enciphered block.
	}
	outputToTextbox(outArr); //writes the output to the output textbox
}

function decipher() { //deciphers the inputted ciphertext into plaintext
	let inArr = strToBlocks(input.value, true);
	if (!inArr) //strToBlocks outputs false rather than an array if the ciphertext had a double block. This ensures nothing gets outputted.
		return;
	let outArr = [];
	for (let i = 0; i < inArr.length; i++) { //the code in this function is identical to encipher except in a few places
		let firstLetterCoords = findLetter(inArr[i].charAt(0));
		let secondLetterCoords = findLetter(inArr[i].charAt(1));
		let firstLetterCoordsDe = -1; //these are the coordinates for the deciphered letters. -1 is a temporary value.
		let secondLetterCoordsDe = -1;
		if (firstLetterCoords[0] == secondLetterCoords[0]) { //checks if the row is the same
			firstLetterCoordsDe = [firstLetterCoords[0], (firstLetterCoords[1]-1+5) % 5]; //5 is added to the result so that a -1 index will be processed correctly
			secondLetterCoordsDe = [secondLetterCoords[0], (secondLetterCoords[1]-1+5) % 5]; //This is not needed for enciphering since there are no negative numbers to worry about
		} else if (firstLetterCoords[1] == secondLetterCoords[1]) { //checks if the column is the same
			firstLetterCoordsDe = [(firstLetterCoords[0]-1+5) % 5, firstLetterCoords[1]];
			secondLetterCoordsDe = [(secondLetterCoords[0]-1+5) % 5, secondLetterCoords[1]];
		} else { //runs if neither the row or the column are the same
			firstLetterCoordsDe = [firstLetterCoords[0], secondLetterCoords[1]];
			secondLetterCoordsDe = [secondLetterCoords[0], firstLetterCoords[1]];
		}
		outArr.push(square[firstLetterCoordsDe[0]][firstLetterCoordsDe[1]] + square[secondLetterCoordsDe[0]][secondLetterCoordsDe[1]]);
	}
	outputToTextbox(outArr); //writes the output to the output textbox
}

function outputToTextbox(arrToOutput) { //outputs the array to the textbox depending on output mode
	if (fiveLetterRadio.checked) { //five letter block format
		let strToSplit = arrToOutput.join(""); //the array is joined then resplit since five letter format is not the format the array is in
		for (let i = 0; i < strToSplit.length; i++) {
			if (i % 5 == 0 && i != 0) //this determines when to put a space in the output. It checks if i evenly divides into 5 and that i is not 0
				output.value += (" " + strToSplit[i]); //this puts a space before the element being added
			else
				output.value += strToSplit[i]; //this adds the element with nothing else
		}
	} else if (singleStringRadio.checked) { //single string format
		output.value = arrToOutput.join(""); //single string format is achieved by simply joining the array together with nothing in between blocks
	} else { //two letter block format
		output.value = arrToOutput.join(" "); //since the array is already in two letter format, all that needs to be done is joining the array with a space
	}
}

function findLetter(letter) { //finds the letter passed in on the square
	if (letter == 'J')
		letter = 'I';
	for (let i = 0; i < square.length; i++) {
		let result = square[i].indexOf(letter); //searches each subarray to find the letter
		if (result != -1) //if the letter was found, something other than -1 is returned
			return [i, result];
	}
	window.alert("Somehow a letter was not found in the square.");
	return;
}

function strToBlocks(instr, isCipher) { //converts the input string to two letter blocks while applying padding as needed
	let newString = ""; //this will contain the input string after it has been simplified
	let padding = 'X'; //this gets the padding letter from the textbox for use later
	let altPadding = 'Z'; //this gets the alternate padding letter in the event the padding letter needs to be padded
	for (let x of instr) {
		if (x.match(/[A-Za-z]/i))
			newString += x.toUpperCase(); //this filters out non-alphabetic characters, uppercases the alphabetic characters, and adds them to the newString variable
	}
	let currentBlock = ""; //holds each block as they are being made
	let atSecondChar = false; //tells the program whether to continue or end a block. Needed for when duplicate characters occur and padding is used.
	let stringArr = []; //the array that holds all the blocks and what is ultimately returned
	for (let i = 0; i < newString.length; i++) {
		if (!atSecondChar) { //when the loop is on an even character, the character gets added to the block without any checks
			currentBlock += newString[i];
			atSecondChar = true;
		} else { //when the loop is on an odd character, checks need to be made to ensure blocks are produced correctly
			if (newString[i] == currentBlock) { //checks if the current character is the same as one in the current block to determine if padding is needed
				if (isCipher) { //checks if the text being processed is plaintext or ciphertext
					window.alert("The ciphertext has a double letter block! Ciphertext should never have a double letter block.");
					return false; //applying padding to ciphertext should never happen so the function is exited early
				} else if (newString[i] != padding) //ensures that the letter is not equal to the padding letter so that a duplicate letter block is not created
					currentBlock += padding; //if they are not equal, then it is fine to apply the padding letter
				else
					currentBlock += altPadding; //if they are equal, the alternate padding letter needs to be utilized
				stringArr.push(currentBlock);
				i -= 1; //decrements the loop iterator as the current letter needs to be reprocessed
			} else {
				currentBlock += newString[i]; //if it is not, the current character gets added to the block and the block is put on the array
				stringArr.push(currentBlock);
			}
			atSecondChar = false; //sets atSecondChar to false regardless of the above code as the program needs to treat characters pushed off because of duplicates as the first character in a new block
			currentBlock = ""; //currentBlock is reset to prevent old blocks from getting into new ones
		}
	}
	if (currentBlock.length != 0) { //after the loop finishes, the current block is checked to see if it is not empty to determine if padding is needed
		if (currentBlock != padding) //does the same padding check as above to prevent duplicate letter blocks
			currentBlock += padding;
		else
			currentBlock += altPadding;
		stringArr.push(currentBlock);
	}
	return stringArr;
}

function makeSquare() { //this takes the characters the user inputted and puts them into an array the program can use
	square = [];
	usedLetters = [];
	for (let i = 0; i < 5; i++) { //iterates over every row
		let row = []; //every row is built as a seperate array and then added to the square once fully built
		for (let j = 0; j < 5; j++) { //iterates over every column
			let letter = document.getElementById("t" + i + j).value.toUpperCase();
			//this line grabs the value from the corresponding textbox by forming an ID with "t" + i + j. This ID will correspond to a
			//textbox that is defined in the HTML page. It gets the value from the textbox and converts it to uppercase.
			if (letter == 'J') //this converts the letter j into the letter i to prevent errors related to i and j sharing a space
				letter = "I";
			if (letter.match(/[A-Z]/i)) { //verifies that the entered character is a letter and not anything else
				if (usedLetters.indexOf(letter) != -1) { //checks if the current letter is present on the square
					window.alert("There is a duplicate letter on the sqaure! Make sure that there are no duplicates. (J is counted as I so both cannot exist on the table at the same time)"); 
					//if it is, there is a duplicate
					return false; //an alert is displayed and the function is exited early
				}
				row[j] = letter; //otherwise, the letter is pushed to the row
				usedLetters.push(letter); //the letter is then added to the usedLetters list
			} else {
				window.alert("One of the characters on the square is invalid or the square is not completely filled!");
				return false; //if not, an alert is displayed and the function is exited early
			}
		}
		square[i] = row; //once the row is filled, the row is put onto the table
	}
	return true; //if there were no abnormalities, the function returns true
}

function formSquareFromKeyword() { //this function forms a Playfair square from a keyword inputted by the user. This does not put it into the square array, this is done when the makeSquare function runs.
	let alphabet = ['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	//alphabet is used for filling the remainder of the square once the keyword is added
	let newAlphabet = []; //this will contain the keyword and then the alphabet
	for (let x of keywordBox.value.toUpperCase()) {
		if (x.match(/[A-Z]/i)) { //prevents non-alphabetic characters from being considered part of the keyword
			if (x == 'J') //changes the letter j to i since the alphabet array does not contain j
				x = "I";
			if (newAlphabet.indexOf(x) == -1) //checks to see if the current letter has not been used
				newAlphabet.push(x); //if the letter has not been used, it is pushed to the new alphabet
		}
	}
	for (let x of alphabet) { //adds the rest of the alphabet to the new alphabet
		if (newAlphabet.indexOf(x) == -1)
			newAlphabet.push(x);
	}
	let iterator = 0; //keeps track of where in the new alphabet the program is at
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			document.getElementById("t" + i + j).value = newAlphabet[iterator];
			iterator++;
			//Forms an ID which corresponds to a table textbox. Takes the next letter in the new alphabet according to the iterator and puts it in the textbox. Increments the iterator to ensure no duplicate letters.
		}
	}
}

function resetButton() { //sets all values back to defaults
	input.value = "";
	output.value = "";
	encipherRadio.checked = true;
	document.getElementById("two").checked = true; //since the radio button for two letter blocks is not needed in other code, it is gotten here to check it
	keywordBox.value = "";
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			document.getElementById("t" + i + j).value = "";
		}
	}
}

function clearSquare() { //resets only the square
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			document.getElementById("t" + i + j).value = "";
		}
	}
}

var square = [0]; //square is initialized into a default state. This is changed via makesquare when the user presses the confirm button.
var confirm = document.getElementById("confirm"); //the confirm button will begin the enciphering/deciphering process
confirm.addEventListener("click", confirmButton);
var input = document.getElementById("input"); //this contains the user input for enciphering or deciphering
var output = document.getElementById("output"); //this contains the enciphered or deciphered text when confirm is pressed
var reset = document.getElementById("reset"); //the reset button will reset all modifiable elements (textboxes, radio buttons) to their default state
reset.addEventListener("click", resetButton);
var clearSquareButton = document.getElementById("squareclear"); //lets the user clear the square only and not all textboxes
clearSquareButton.addEventListener("click", clearSquare);
var encipherRadio = document.getElementById("encipher"); //this radio button determines the mode. Since there are only two radio buttons, the mode can be determined by whether this one is checked or not without having to check the other one.
var fiveLetterRadio = document.getElementById("five"); //this radio button has the output in five letter string format
var singleStringRadio = document.getElementById("single"); //this radio button has the output in single string format
//the radio button that has the output in two letter string format is not here as if both of the other radio buttons are unchecked, that one must
//be checked
var keywordBox = document.getElementById("keyword"); //this contains the keyword used to form a table
var keywordButton = document.getElementById("keywordconfirm"); //this tells the program to form a table from the keyword
keywordButton.addEventListener("click", formSquareFromKeyword);