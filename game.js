
      // these are declared and initiliased outside of function to give them a global scope
      let scoreslist = []
      let numRounds = 0;
      let balance = 0
      let userInput;

      function getUserInput() {
        // takes the input, only allows range from 3-6, then closes prompt window
        do {
          userInput = window.prompt("Enter a number between 3 and 6:");
          if (userInput !== null) {
            if (userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6") {
              console.log("Number of dice is: " + userInput); 
              //gets rid of the input button and makes the start game button visible
              document.getElementById("originalButton").style.display = "none";
              document.getElementById("startGame").style.display = "block";
              window.close();
            } else {
              alert("Input must be between 3 and 6.");
            }
          }
        } while (userInput !== null && (userInput < "3" || userInput > "6"));
      }
       
      //this function does most of the work in the game, it generates the dice roll then displays the score, as well as keeping track of rounds and balance.
      function play() {
        numRounds++
        //here an array is created and dice rolls  are added to it using the random function
        let dicelist = []
        for (let i = 0; i < userInput; i++) {
             randomNumber = Math.floor(Math.random() * 6) + 1;
             dicelist.push(randomNumber)
        ;}
        let rollScore = scoreTally(dicelist)
        //the dice rolls and score is logged in the console
        console.log("Dice rolls are ",dicelist)
        console.log("Score is: ", rollScore)
        //here the <p> elements in the html markup are written into with the current round information
        //score is calculated using scoretally, a function described below
        let roundScore = document.getElementById("roundScore")
        roundScore.innerHTML = "Your score is " + rollScore
        let roundNum = document.getElementById("roundNum")
        roundNum.innerHTML = "Round Number is : " + numRounds
        balance += rollScore
        let overallBalance = document.getElementById("balance")
        overallBalance.innerHTML = " Overall balance: " + balance

        // the buttons available to the user are changed so that they can either click play again (rather than "start game") or end the game
        document.getElementById("startGame").style.display = "none";
        document.getElementById("playAgain").style.display = "block";
        document.getElementById("endGame").style.display = "block";

        //scores list is array of all scores earned, and is used to calculate the average score at the end of the game
        scoreslist.push(rollScore)
        console.log("All scores are " + scoreslist)

        // here a table of one row is created to display one dice roll image per cell, it was the easiest and cleanest way I could find to display the images of dice
        const diceTable = table(userInput,dicelist)
        let dicedisplay = document.getElementById("dicerolls")
        dicedisplay.innerHTML = ""
        dicedisplay.appendChild(diceTable);
      
      }
      
       // this is the function to create the above dice table
      function table(userInput,dicelist) {
        const table = document.createElement("table");
        const row = document.createElement("tr");
        //creates cells in row equal to number of user input for dice
        for (let i = 0; i < userInput; i++) {
          const cell = document.createElement("td");
          row.appendChild(cell);
          //image of dice of particular number is sourced and made equal to that particular dice roll
          const img = document.createElement("img");
          img.src = "dice" + dicelist[i] + ".png"; 
          //alternate title showing description of dice roll
          img.title = "Image of dice showing the number " + dicelist[i];
          cell.appendChild(img);
        }
        table.appendChild(row);
        return table
      }
      // activated when user clicks on the end game button
      function endGame(){
        //removes information and buttons used in the  current round, and displays the reset button
        document.getElementById("dicerolls").style.display = "none";
        document.getElementById("playAgain").style.display = "none";
        document.getElementById("roundResult").style.display = "none";
        document.getElementById("roundScore").style.display = "none"; 
        document.getElementById("endGame").style.display = "none"; 
        document.getElementById("reset").style.display = "block"; 
        
        //  display shows total number of round played
        roundNum.innerHTML = "Total rounds played is: " + numRounds

        // display shows the total balance at the end of the game
        let finalBalance = document.getElementById("balance")
        finalBalance.innerHTML = " Final balance: " + balance

        // the average score over the rounds is calculated and displayed
        let averageScore = document.getElementById("averageScore")
        averageScore.innerHTML = " Your average score over the rounds was : " + averageScores(scoreslist).toFixed(2)

      }

      //function used to calculate score, takes dicelist as an argument
      function scoreTally(scores) {

        //first the dicerolls are sorted, makes it easier to calculate some scores and looks better when displayed
        scores.sort()

        // creates a variable for when the sum of the dice rolls needs to be added to the score
        let sum = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        //here various testing functions are run and return boolean values, if True then the appropriate score is awarded, 
        if (sameN(scores)) {

            let result = document.getElementById("roundResult")
            result.innerHTML = "Congrats! You got all the same number! That's an extra 60 points"
            return sum + 60  

        } else if (almostsameN(scores)) {

            let result = document.getElementById("roundResult")
            result.innerHTML = "Congrats! You got almost all the same number! That's an extra 40 points!"
            
            return sum + 40

        } else if (run(scores)) {

          let result = document.getElementById("roundResult")
          result.innerHTML = "Congrats! You got a run! That's an extra 20 points"
          
          return sum + 20

        // for this test the values need to be unique AND not a run, so both tests are run
        } else if (unique(scores) &&  (run(scores)==false)) {

          let result = document.getElementById("roundResult")
          result.innerHTML = "WOW! All unique numbers! Your score is the sum of your dice rolls!"

          return sum
        }
        //finally if none of the other functions return True, 0 points are awarded
        else {

          let result = document.getElementById("roundResult")
          result.innerHTML = "Sorry! You didn't get any points this round!"
          return 0
        }

      
      }

      // here are the various functions used to find out if the dice list meets certain criteria to be awarded points

      //this function tests to see if thre dicelist contains all the same values
      function sameN(scores) {

        //iterates over and checks to see if every element is the same as the first element, if even one element isn't then returns False, else returns True
        for (let i = 1; i < scores.length; i++) {
                if (scores[i] !== scores[0]) {
                    return false;
                }
            }
        return true;
       }     
       
       //checks to see if all elements SAVE one are the same value
       function almostsameN(scores) {
            //creates a variable to track the number of times a different number is registered.
            let differentCount = 0;
                for (let i = 1; i < scores.length; i++) {
                    if (scores[i] !== scores[(i-1)]) {
                    differentCount++;
                    //if the number of times a different value is registered exceeds 1, there is more than one different number in the set and so False is returned
                    if (differentCount > 1) {
                        return false;
                }
                }
            }
            // there are some scenarios, such as the dicelist = [2,2,4,4] or [1,1,1,5,5,5] where the difference counter would not exceed 1 and 
            // so True would be returned despite not being a valid scoring.
            // to fix this, we count the number of elements with the value of the first and last elements in the dice list

            const count1 = scores.reduce((acc, num) => (num === scores[0] ? acc + 1 : acc), 0);
            const count2 = scores.reduce((acc, num) => (num === scores[scores.length-1] ? acc + 1 : acc), 0);
           
            //finally we check to see if at least one of the counts comes to one, so that we know it is indeed an set of all N-1
            if (differentCount === 1 && (count1==1 || count2 == 1))
            {return true}
            else {return false};
            
            
          }
       //this checks to see if the set dicelist is a run, we have already sorted the array, so we simply iterate through and check if 
       // each value is 1 more than the previous iteration   
       function run(scores) {
            
              for (let i = 1; i < scores.length; i++) {
                  if (scores[i] != (scores[(i-1)])+1) {
                    return false
                  }
                }     
                    
              return true       
                }
        
       // this checks if all the values in the array are unique, creates a set of unique values in the array and compares the length 
       // if length is the same then values are unique
       function unique(scores) {
          
        let uniquearray = new Set(scores);
        if (uniquearray.size === scores.length) {
          return true
        }
        else {return false }
        


       }       
       //simply run through the iteration and calculate the total sum of the list, similar to the sum variable above. 
       //the divide by the length of the list to get average score.
       function averageScores(scoreslist) {

        const avg = scoreslist.reduce((acc, val) => acc + val) / scoreslist.length;
        return avg
       }


       

      
    