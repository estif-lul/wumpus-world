import { Display } from "./display.js";
const container = document.querySelectorAll('.grid-container');

let win_input = document.getElementById('win');
let loss_input = document.getElementById('loss');
let score_input = document.getElementById('score');
let accuracy_input = document.getElementById('accuracy');

let rate = 3;
let speed = 1000/rate;

let stop = false;

let sense = {stench: false,
             breeze: false,
             glitter: false,
             bump: false,
             scream: false
            }

let path = [];
let safe_locations = [];

let wumpus_prob = [];
let pit_prob = [];
let next_possible_locations = [];
let visited = new Object();

let none_pit = [];
let none_wumpus = [];

let wumpus_location;

let ds = new Display(container);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reset(){
    path = [];
    safe_locations = [];

    wumpus_prob = [];
    pit_prob = [];
    next_possible_locations = [];
    visited = new Object();
    ds.resetDisplay();
    win_input.value = win;
    loss_input.value = loss;

    none_pit = [];
    none_wumpus = [];
}

function gameOver(){
    loss++;
    console.log("Game Over");
}

let count = 0;
let game_play = 0;
let win = 0;
let loss = 0;

let score = 0;
let accuracy = 100;

async function autoMove(){
    // console.log(sense.breeze);
    score_input.value = 0;
    accuracy_input.value = accuracy;

        while(game_play < 20){
            initiate();
            while((count < 30)){
                score -= 1;
                score_input.value = score;
                findNextPossibleLocations();
                if(!path.includes(ds.agent_location)){
                    path.push(ds.agent_location);
                }
                // visited.push(ds.agent_location);
    
                count++;
                // if the agent get a living wumpus or get into a pit
                if(((ds.agent_location == ds.wumpus_location) &&
                    (!sense.scream)) ||
                    (ds.PITlocation.includes(ds.agent_location))){
                        score -= 1000;
                        score_input.value = score;
                        gameOver();
                        reset();
                        break;
                }
                // if the agent find a Gold
                else if(ds.agent_location == ds.gold_location){
                    console.log("Congra!!!! You got the Gold!");
                    score += 1000;
                    score_input.value = score;
                    sense.glitter = true;
                    goBack();
                    win ++;
                    reset();
                    break;
                }
                // if the agent find a Breeze or Stench
                else if(ds.breeze_locations.includes(ds.agent_location) || 
                        ds.stench_locations.includes(ds.agent_location)){                    
                            if(ds.breeze_locations.includes(ds.agent_location)){
                                sense.breeze = true;
                            }
                            if(ds.stench_locations.includes(ds.agent_location)){
                                sense.stench = true;
                            }
                        }
                else{   
                    resetSense();   
                }
                if(!safe_locations.includes(ds.agent_location)){
                    safe_locations.push(ds.agent_location);
                }
                calculateProbability();
    
                // console.log(sense);
                // console.log("Safe Locatiions:    ", safe_locations);
                // console.log("PIT Probability:    ", pit_prob);
                // console.log("Wumpus Probability: ", wumpus_prob);
                // console.log("Path:               ", path);
                
                chooseNextMove();
               
                await sleep(speed);
            }
            count = 0;
            game_play++;
            accuracy = (win/(game_play))*100;
            accuracy_input.value = accuracy;
            // stop = false;
            // console.log("Win: ", win);
            // console.log("loss: ", loss);
            console.log("");
        }

}

function goBack(){
    let len = path.length;
    for(let i = len-2; i >=0; i--){
        moveTo(path[i]);
        // await sleep(speed);
    }
}

function resetSense(){
    sense.stench = false;
    sense.breeze = false;
    sense.glitter = false;
    sense.bump = false;
}

Set.prototype.intersection = function(otherSet)
{
    // creating new set to store intersection
    var intersectionSet = new Set();
  
    // Iterate over the values 
    for(var elem of otherSet)
    {
        // if the other set contains a 
        // similar value as of value[i]
        // then add it to intersectionSet
        if(this.has(elem))
            intersectionSet.add(elem);
    }
  
// return values of intersectionSet
return intersectionSet;                
}

Set.prototype.union = function(otherSet)
{
    // creating new set to store union
    var unionSet = new Set();
  
    // iterate over the values and add 
    // it to unionSet
    for (var elem of this)
    {
        unionSet.add(elem);
    }
  
    // iterate over the values and add it to 
    // the unionSet
    for(var elem of otherSet)
        unionSet.add(elem);
  
    // return the values of unionSet
    return unionSet;
}

function chooseNextMove(){
    let safe_set = new Set(safe_locations);
    let next_location_set = new Set(next_possible_locations);

    let none_wumpus_set = new Set(none_wumpus);
    let none_pit_set = new Set(none_pit);

    let none_wumpus_pit = none_wumpus_set.intersection(none_pit_set);
    safe_set = safe_set.union(none_wumpus_pit);

    // none_wumpus_pit.forEach((key) => {
    //     if(wumpus_prob.includes(key)){
    //         wumpus_prob.splice(wumpus_prob.indexOf(key), 1);

    //     }
    // });

    let next_safe = safe_set.intersection(next_location_set);

    let index;

    if(!visited[ds.agent_location]){
        visited[ds.agent_location] = [];
    }
    
    next_safe.forEach((key) =>{
        if(!Object.keys(visited).includes(key) && !visited[ds.agent_location].includes(key)){
            visited[ds.agent_location].push(key);
        }
    });
    // visited[ds.agent_location] = next_safe_array;
    // console.log("Visited: ", visited);
    // console.log("Current Location from Main: ", ds.agent_location);
    if(visited[ds.agent_location].length > 0){
        index = chooseRandome(visited[ds.agent_location].length);
        let move_to = visited[ds.agent_location][index];
        visited[ds.agent_location].splice(index, 1);
        // console.log("Move to : ", move_to);
        moveTo(move_to);
    }
    else if (path.length > 0){
        if(path.length == 1){
            guess();
        }
        else if(visited[path[path.length-2]].length > 0){
            path.splice(-1, 1);
            moveTo(path[path.length-1]);
        }
        // backtracking until you found a safe space
        else {
            let key = Object.keys(visited)
            // console.log("KEYS: ", key);
            for(let j = key.length-1; j >= 0; j--){
                if(visited[key[j]].length > 0){
                    let found = false;
                    while(!found && path){
                        path.splice(-1, 1);
                        // console.log("Last Path: ", path);
                        moveTo(path[path.length-1]);
                        if(path[path.length-1] == key[j]){
                            found = true;
                        }
                    }
                    // ds.resetDisplay();
                    break;
                }
            }
            
            if(visited[ds.agent_location].length == 0){
                findNextPossibleLocations();
                guess();
            }
            // index = chooseRandome(next_guess.length)
        }
    }
    
}

function guess(){
    let next_guess = [];
    let index;

    next_possible_locations.forEach(value =>{
        if(!Object.keys(visited).includes(value)){
            next_guess.push(value);
        }
        else if (visited[value]){
            next_guess.push(value);
        }
        else if(!next_guess){
            next_guess.push(value);
        }
    });
    index = chooseRandome(next_guess.length);
    if(sense.stench && !sense.scream){
        console.log("Has shoot an arrow ----->");
        let dead = shootArrow(next_guess[index]);
        if (dead){
            moveTo(next_guess[index]);
        }
        else {
            moveTo(next_guess[index]);
            next_guess.splice(index, 1);
            if(next_guess.length == 1){
                wumpus_location = next_guess[0];
            }
            
        }
    }
    else{
        moveTo(next_guess[index]);
    }
}

function shootArrow(shootTo){
    let dead;
    score -= 10;
    score_input.value = score;
    if(shootTo == ds.wumpus_location){
        sense.scream = true;
        wumpus_location = shootTo;
        console.log("Screaming!!!!!");
        return true;
    }
    console.log("You miss the Wumpus :(")
    return false;
}

function chooseRandome(length){
    return Math.floor(Math.random() * length);
}

async function moveTo(destination){
    
    if(destination){
        let agent_row = parseInt(ds.agent_location.split("_")[0]);
        let agent_columen = parseInt(ds.agent_location.slice("_")[2]);
    
        let dest_row = parseInt(destination.split("_")[0]);
        let dest_columen = parseInt(destination.slice("_")[2]);
        
        // console.log("destination: ", destination)
    
        // Difference = Destination - Agent
        let row_diff = dest_row - agent_row;
        let columen_diff = dest_columen - agent_columen;
    
        // console.log("Col diff: ", columen_diff);
    
        let target_dxn = 0;
    
        // Diagonal movment is not allowed
        if(row_diff == 1){
            target_dxn = ds.UP;
        }
        else if(row_diff == -1){
            target_dxn = ds.DOWN;
        }
        else if(columen_diff == 1){
            target_dxn = ds.RIGHT;
        }
        else if(columen_diff == -1){
            target_dxn = ds.LEFT;
        }
        // console.log("Target Dxn: ", target_dxn);
    
        let dxn_diff = target_dxn - ds.direction;
    
        // if the target_dxn is the same as current direction
        // just move forward
        if (dxn_diff == 0){
            // ds.moveForward();
        }
        else if(dxn_diff < 0){
            for(let i = 0; i<Math.abs(dxn_diff); i++){
                // console.log("Turn Right");
                ds.turnRight();
                // await sleep(speed);
    
            }
            // console.log("Move Forward");
            // ds.moveForward();
        }
        else if(dxn_diff > 0){
            for(let i = 0; i < dxn_diff; i++){
                // console.log("Turn Left");
                ds.turnLeft();
                // await sleep(speed);
            }
            // console.log("Move Forward");    
            // ds.moveForward();
        }
        ds.moveForward();
    }
    else {
        // console.log("[ERROR] desitination: ", destination);
        stop = true;
    } 
    
}

function calculateProbability(){
    let row = parseInt(ds.agent_location.split("_")[0]);
    let columen = parseInt(ds.agent_location.slice("_")[2]);
    // console.log("some");
    // console.log(ds.agent_location.slice("_")[2]);
    let avl_location;

    function assign(){
        if(sense.breeze && !pit_prob.includes(avl_location)) {
            pit_prob.push(avl_location);
            if(!sense.stench && !safe_locations.includes(avl_location)){
                none_wumpus.push(avl_location);
            }
        }
        if(sense.stench && !wumpus_prob.includes(avl_location)){
            wumpus_prob.push(avl_location);
            if(!sense.breeze && !safe_locations.includes(avl_location)){
                none_pit.push(avl_location);
            }
        } 
            
        if(!sense.breeze && !sense.stench && !safe_locations.includes(avl_location)) {
            
            safe_locations.push(avl_location);
        }
        
        
    }

    if (columen < 4){
        avl_location = row + "_" + (columen+1);
        if(!safe_locations.includes(avl_location)){
            assign();
        }
    }
    if (columen > 1){
        avl_location = row + "_" + (columen-1);
        if(!safe_locations.includes(avl_location)){
            assign();
        }
    }
    if (row < 4){
        avl_location = (row+1) + "_" + columen;
        if(!safe_locations.includes(avl_location)){
            assign();
        }
    }
    if (row > 1){
        avl_location = (row-1) + "_" + columen;
        if(!safe_locations.includes(avl_location)){
            assign();
        }
    }
    // console.log("None wumpus: ", none_wumpus);
    // console.log("None Pit: ", none_pit);
}


function findNextPossibleLocations(){
    next_possible_locations = [];
    let row = parseInt(ds.agent_location.split("_")[0]);
    let columen = parseInt(ds.agent_location.slice("_")[2]);

    let avl_location;

    if (columen < 4){
        avl_location = row + "_" + (columen+1);
        next_possible_locations.push(avl_location);
    }
    if (columen > 1){
        avl_location = row + "_" + (columen-1);
        next_possible_locations.push(avl_location);
    }
    if (row < 4){
        avl_location = (row+1) + "_" + columen;
        next_possible_locations.push(avl_location);
    }
    if (row > 1){
        avl_location = (row-1) + "_" + columen;
        next_possible_locations.push(avl_location);
    }


}

// assignAgent('1_1');

// assignWumpus();

// assignPIT();

// assignStench();

// assignGold();

// demo();

// turnLeft("1_1");

function initiate(){
    ds.assignAgent('1_1');
    ds.assignWumpus();
    ds.assignPIT();
    
    ds.assignStench();
    
    ds.assignGold();
}

autoMove();
// demo();