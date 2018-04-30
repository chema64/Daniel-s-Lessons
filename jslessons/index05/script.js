// ===================== js =====================

// ----------------------------------------------
	/*  diceRollResultsListSpesh:

	Using the inputs of numberOfDice and diceSides, values for each possible roll result or rollOutcome is populated into an array. 
	For example a 6 sided dice roll is stored as 6. This array is then returned for further processing in the createDiceRollProbability function, which creates a rollCount value. For example if the value of 6 is rolled twice then the collCount value is totaled to the value of 2.  
	*/
function diceRollResultsListSpesh(numberOfDice, diceSides) {

    //setting oldList to zero allows oldList to be populated during first loop
    let oldList = [0]
    let freshList = []

    //number of times dice are rolled
    for (var nextRoll = 1; nextRoll <= numberOfDice; nextRoll++) {
        
  

        // initialize freshList
        freshList = []

        /*creates all possible dice roll values from dice roll data stored in oldRes array. 
          freshList is populated with these new results*/
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

	The rawdata array is  processing in the  createDiceRollProbability function, which creates a rollCount value in the resultData. For example if the value of 6 is rolled twice then the collCount value is totaled to the value of 2. 
	
	*/
function createDiceRollProbability(rawData) {
    
    let resultData = [] 

    rawData.forEach(function(element) {

    if(resultData[element]) {

        resultData[element] += 1;
    }
    else
    {

        resultData[element] = 1;
    }


    });

    return resultData

}

// ----------------------------------------------
	/* makeDiv:

	Create a div element and return div for use in printProbabilityTable function
	
	*/
function makeDiv(divLength) {
    const div = document.createElement("div")
    div.style.width = divLength + "em"
    return div
}

// ----------------------------------------------
    /* printProbabilityTable:

    Two values relating to the probability of dice rolls are tallied here from the resultData. Firstly all possible roll values 
    in resultData are stored as a array index value, which below is called rollOutcome. For example the rollOutcome value could be 
    6 when using a six sided dice, for one roll. Secondly the number of times that rollOutcome occurs is stored in the 
    rollCount value. 

    totalRollCount: Tallies all rollCount values for each rollOutome.
    highestRollCount: Finds the highest rollCount value from all rollOutome values.
    
    These values are then used to populate a table below with the following column values:
    
    -rollOutcome
    -ratio  (rollOutcome / totalRollCount)
    -percentage  (rollOutcome / totalRollCount)
    -div bar chart (rollCount /  highestRollCount * 100)

    */ 
function printProbabilityTable(resultData) {

    var table = document.createElement("table")

    var totalRollCount = 0
    var highestRollCount = 0

    //Find the totalRollCount and highestRollCount from rollCount
    resultData.forEach(function(rollCount) {
        
        totalRollCount += rollCount
        if( highestRollCount < rollCount) {

             highestRollCount = rollCount

        }
        
         
    })


    
    //create a table to display rollCount results
    resultData.forEach(function(rollCount, rollOutcome) {

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

        var divWidth = rollCount /  highestRollCount * 100
        div.style.width = divWidth + "px"

        //attach div element to table cell 
        divCell.appendChild(div)
        tr.appendChild(divCell)

    })

    document.body.appendChild(table)
}

// ----------------------------------------------
	/* diceRollOutput

	Validate input from html input element. If input is valid calculate dice roll probability information, using the following funcitons
	diceRollResultsListSpesh and createDiceRollProbability. Lastly present the results in a html table using the printProbabilityTable 
	function
		
	*/
function diceRollOutput() {

	let diceParameters = []
	let numberOfDice = 0
	let diceSides = 0
	let rawData = []
	let resultData = []

	if(validateInput()) {
		diceParameters = validateInput()
		
		numberOfDice = diceParameters[0]
		diceSides = diceParameters[2]

		//Create an array containing all possible dice roll outcomes
		rawData = diceRollResultsListSpesh(numberOfDice, diceSides)

		//Work out the probability of each dice roll from rawData
		resultData = createDiceRollProbability(rawData)

		//Create an table container all dice probably results
		printProbabilityTable(resultData)
	}
	else {
		console.log("diceRollOutput invalid")
		return false
	}

	
	
}

// ----------------------------------------------
	/* validateInput
	
	Regex testing for three character string. For example 2d2. 
	[1-5]{1}: First value must be a single digit between 1-5. Value represents number of dice. 
	[d]{1}: Second character is a single digit with the value of 'd'
	([0-9]{2}|[1-9]{1}): Third character is either a single digital character or two. The two digit 
	character was created for values equal to 10 or greater. Value represents number of sides. 

	*/
function validateInput() {
	
	let userInput = ""

	//get text entered into input element
	userInput = document.getElementById("diceInput").value

	
	let inputTestResults = []

	//Tests RegEx if successful save to inputTestResults, otherwise exist and print invalid to console
	inputTestResults = userInput.match(/[1-5]{1}[d]{1}([0-9]{2}|[1-9]{1})/i)
	console.log(inputTestResults)
	
	if(inputTestResults) {

		console.log(inputTestResults[0])
		
		//Use "" delimiter to break string into character array
		let inputSplitIntoArray = []
		inputSplitIntoArray = inputTestResults[0].split("")
		
		
		/* If the value of 10 or greater then was found in the last regex character.
		Concatinate the last two array values into the third index and remove the 
		last value in the array.
		*/
		if(inputSplitIntoArray.length === 4) {
			inputSplitIntoArray[2] = inputSplitIntoArray[2] + inputSplitIntoArray[3]
			inputSplitIntoArray.pop()
			console.log(inputSplitIntoArray)
		}
		
		console.log(inputSplitIntoArray)
		return inputSplitIntoArray
	}
	else	{
		console.log("invalid")
		return false
	}
}

// ----------------------------------------------



// ===================== js =====================