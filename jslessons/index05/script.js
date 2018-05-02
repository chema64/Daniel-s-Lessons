// ===================== js =====================

// ----------------------------------------------
	/*  diceRollResultsListSpesh:

	Using the inputs of numberOfDice and diceSides, values for each possible roll result or 
	rollOutcome is populated into an array. 
	For example 1d6 sided dice roll will produce [1,2,3,4,5,6]. This array can then be 
	passed to createDiceRollProbability function, to create a rollCount value.

	Returns an array: [oldList[] which contains all possible dice rolls, from the number of 
	dice and dice sides]
	*/
function diceRollResultsListSpesh(numberOfDice, diceSides) {

    //setting oldList to zero allows oldList to be populated during first loop
    let oldList = [0]
    let freshList = []

    //number of times dice are rolled
    for (var nextRoll = 1; nextRoll <= numberOfDice; nextRoll++) {
    	// each run of this loop adds another dice roll to the result set

        // initialize freshList
        freshList = []

        // for each result we have SO FAR, add to newList each of the possible results
        // that come from that old result plus one more dice roll.
        oldList.forEach( function(oldRes) {
            for (var possibleResult = 1; possibleResult <= diceSides; possibleResult++) {
                freshList.push(oldRes + possibleResult)
            }
        })
        
        // set oldList with latest results set stored in freshList 
        oldList = freshList
    }

    return oldList

}

// ----------------------------------------------
	/* createDiceRollProbability:

	This processes the rawData array, and returns an array where 
	the value at a given array index is the count of the number 
	of times that value shows up. The array index value represents 
	a dice roll result or value. For example index value 
	resultCount[6], represents a dice roll value of 6.  
	For example if 6 is rolled twice then the resultCountresultCount 
	value at resultCount[6] will be 2.	

	Returns an array: [resultCount[] which contains a roll count value for each index value in
	the array. As explained above in this array each index value represents a dice roll value]
	*/
function createDiceRollProbability(rawData) {
    
    let resultCount = [] 

    rawData.forEach(function(rawResult) {

	    if(resultCount[rawResult]) {
	    	// if we've counted this result before, increment it
	        resultCount[rawResult] += 1;
	    } else {
	    	// if this is the first time we've seen this result, its count is 1
	        resultCount[rawResult] = 1;
	    }
    });

    return resultCount

}

// ----------------------------------------------
	/* makeDiv:

	Create a div element of the specified width, and return it

	Returns an object: [div[] which contains DOM div element object]
	*/
function makeDiv(divLength) {
    const div = document.createElement("div")
    div.style.width = divLength + "em"
    return div
}

// ----------------------------------------------
    /* printProbabilityTable:

	Given an array where the value at a given index
	is the times that index will show up as a result
	(as returned by createDiceRollProbability(...)),
	produce a nice looking table of results including
	a pretty graph.

	if the result is "roll", the number of times
	roll occurs is "rollCount".. the table includes 
	these columns:
    
    - roll
    - ratio  (rollCount / totalRollCount)
    - percentage  (rollCount / totalRollCount)
    - div bar chart (rollCount /  highestRollCount * 100)

    Returns false : [False value is returned if
    validateInput function returns false] 

    */ 
function printProbabilityTable(resultData) {

    var table = document.createElement("table")

    var totalRollCount = 0 // sum of all rollCounts
    var highestRollCount = 0 // max of rollCounts

    //
    // first, work out total and max.
    //

    //Find the totalRollCount and highestRollCount from rollCount
    resultData.forEach(function(rollCount) {
    	// do two things in this loop:
    	// ..sum up the total roll counts
        totalRollCount += rollCount
        // ..remember the highest we've seen
        if( highestRollCount < rollCount) {
             highestRollCount = rollCount
        }
    })

    //
    // now make the actual table
    //

	const maxGraphBarLength = 400
    resultData.forEach(function(rollCount, rollOutcome) {

    	// rollOutcome is the actual result
    	// rollCount is the number of ways that result can occur

        // make the row
        var tr = document.createElement("tr")
        table.appendChild(tr)

        // do the rollOutcome cell
        var rollOutcomeCell = document.createElement("td")
        rollOutcomeCell.innerHTML = rollOutcome
        tr.appendChild(rollOutcomeCell)

        // do the ratio cell
        var ratioCell = document.createElement("td")
        ratioCell.innerHTML = rollCount  + '/' + totalRollCount
        tr.appendChild(ratioCell)

        // do the percentage cell
        var ratioCell = document.createElement("td")
        ratioCell.innerHTML = Math.round(rollCount / totalRollCount * 1000)/10 + '%'
        tr.appendChild(ratioCell)

        // do the graph bar cell
        var divCell = document.createElement("td")
        var div = makeDiv(rollCount)

        var divWidth = rollCount / highestRollCount * maxGraphBarLength
        div.style.width = divWidth + "px"

        //attach div element to table cell 
        divCell.appendChild(div)
        tr.appendChild(divCell)

    })

    document.body.appendChild(table)
}

// ----------------------------------------------
	/* diceRollOutput

	Validate input from html input element. If input is valid calculate dice roll probability 
	information, using the following funcitons.
	diceRollResultsListSpesh and createDiceRollProbability. Lastly present the results in a 
	html table using the printProbabilityTable function.

	Returns false : [False value is returned if
    validateInput function returns false] 
		
	*/
function diceRollOutput() {

	let numberOfDice = 0
	let diceSides = 0
	let rollLetter = ''
	let rawData = []
	let resultData = []
	let diceParameters = validateInput()

	if (diceParameters) {
		
		numberOfDice = diceParameters[0]
		rollLetter = diceParameters[1]
		diceSides = diceParameters[2]

		//Create an array containing all possible dice roll outcomes
		rawData = diceRollResultsListSpesh(numberOfDice, diceSides)

		//Work out the probability of each dice roll from rawData
		resultData = createDiceRollProbability(rawData)

		//Create an table displaying results
		printProbabilityTable(resultData)


		// make this work:
		// printProbabilityTable(resultData, '#results')



		let table = document.querySelector("table")
		console.log(table)
		let tr = document.createElement('tr')
		console.log(tr)
		let th = document.createElement('th')
		th.colSpan = 4
		console.log(th)
		th.innerHTML = numberOfDice + rollLetter + diceSides
		console.log(th)
		tr.appendChild(th)

		// table.appendChild(tr)
		table.insertAdjacentElement('afterbegin', tr)

	} else {
		alert("I couldn't understand that roll.")
		return false
	}	
}

// ----------------------------------------------
	/* validateInput
	
	Regex testing for three character string. For example 2d2. 
	^([1-5] : First value must be a single digit between 1-5. ^ corret symbol means that this 
	character gas to be the first character. Value represents number of dice. 
	(d) : Second character is a single digit with the value of 'd'
	([1-9][0-9]?)$ : Third character is either a single digital character or two. The $ symbol 
	means that the second character is optional. The $ symbol means that these characters have
	to be last characters in the string. Value represents number of sides of a dice. 

	Returns an array: [num-of-dice-digit, "d", num-of-sides-digits]
	
	OR
	
	Returns false : [If RegEx failed] 

	*/
function validateInput() {
	
	let userInput = ""

	//get text entered into input element
	userInput = document.getElementById("diceInput").value.trim()
	
	//Tests RegEx if successful save to inputTestResults, otherwise exist and print invalid to console
	const diceMatcher = RegExp(/^([1-5])(d)([1-9][0-9]?)$/i)

	let inputMatches = diceMatcher.exec(userInput)

	if (inputMatches) {
		// then the input DID match the regexp
		return [inputMatches[1], inputMatches[2], inputMatches[3]]
	} else {
		return false
	}
}

// ----------------------------------------------




// ===================== js =====================