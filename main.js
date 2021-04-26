const container = document.querySelectorAll('.grid-container');
console.log(container);

let row = undefined;
let columen = undefined;
let wumpus_location = undefined;
let gold_location = undefined;
let squares = ['1_1', '1_2', '1_3', '1_4', 
                '2_1', '2_2', '2_3', '2_4',
                '3_1', '3_2', '3_3', '3_4',
                '4_1', '4_2', '4_3', '4_4'];
let PITlocation = [];

let agent = document.createElement("img");
agent.setAttribute("src", "image/agent.gif");
agent.setAttribute("class", "agent");

let wumpus = document.createElement("img");
wumpus.setAttribute("src", "image/wumpus.gif");
wumpus.setAttribute("class", "wumpus");

let breeze = document.createElement("img");
breeze.setAttribute("src", "image/breeze.png");
breeze.setAttribute("class", "breeze");

// container[0].children[0].appendChild(breeze);

let stench = document.createElement("img");
stench.setAttribute("src", "image/stench.png");
stench.setAttribute("class", "stench");
// container[0].children[0].appendChild(stench);

let gold = document.createElement("img");
gold.setAttribute("src", "image/gold.png");
gold.setAttribute("class", "gold");
// container[0].children[0].appendChild(gold);

// container[0].children['1_1'].innerHTML = 'slk';
// console.log(container[0].children);


function assignWumpus(){
    let r = Math.ceil(Math.random()*15);

    wumpus_location = squares[r];
    // console.log(location)
    // container[0].children[wumpus_location].innerHTML = 'Wumpus';
    container[0].children[wumpus_location].classList.add('wumpus');

    // console.log('Wumpus Location: ', wumpus_location);

}

function assignPIT() {
    // container[0].children['4_1'].children[0].classList.add('pit');
    // container[0].children['4_1'].children[0].innerHTML = 'PIT';
    while(PITlocation.length < 3){
        let r = Math.ceil(Math.random() * 15)
        if (PITlocation.indexOf(squares[r]) == -1)
            PITlocation.push(squares[r]);
    }

    PITlocation.forEach((val, i) => {
        container[0].children[val].children[0].classList.add('pit');
        container[0].children[val].children[0].innerHTML = 'PIT';
    });
    assignBreeze();
    console.log('PIT Location: ',PITlocation);

}

function assignGold(){
    let r = undefined;
    while((gold_location == undefined) ||
        (gold_location == wumpus_location) ||
        (PITlocation.indexOf(gold_location) != -1)){

        r = Math.ceil(Math.random()*15);
        gold_location = squares[r];
    }
    // console.log('Gold Location: ', gold_location);
    container[0].children[gold_location].appendChild(gold);
    // container[0].children[gold_location].children[0].innerHTML = 'GOLD';
}

function assignAgent(val){
    container[0].children[val].classList.add('agent');
}

function assignBreeze(){
    let breeze_locations = [];
    let breeze_location;
    PITlocation.forEach((val) => {
        let row = parseInt(val.split("_")[0]);
        let columen = parseInt(val.split("_")[1]);

        if((row < 4) && (row > 1)){
            
            breeze_location = (row - 1) + "_" + (columen);
            breeze_locations.push(breeze_location);

            breeze_location = (row + 1) + "_" + (columen);
            breeze_locations.push(breeze_location);
            console.log("Breeze Location: ",breeze_location); 
        } else if (row == 4){
            breeze_location = (row - 1) + "_" + (columen);
            breeze_locations.push(breeze_location);
        } else if (row == 1){
            breeze_location = (row + 1) + "_" + (columen);
            breeze_locations.push(breeze_location);
        }

        if((columen < 4) && (columen > 1)){
            breeze_location = (row) + "_" + (columen - 1);
            breeze_locations.push(breeze_location);

            breeze_location = (row) + "_" + (columen + 1);
            breeze_locations.push(breeze_location);
        } else if (columen == 4){
            breeze_location = (row) + "_" + (columen - 1);
            breeze_locations.push(breeze_location);
        } else if (columen == 1){
            breeze_location = (row) + "_" + (columen + 1);
            breeze_locations.push(breeze_location);
        }
    });
    console.log(breeze_locations);
    let breeze_locations_set = new Set(breeze_locations);

    breeze_locations_set.forEach((val) => {
        
        if(PITlocation.indexOf(val) == -1){
            // console.log(val);
            container[0].children[val].appendChild(breeze.cloneNode(true));
        }
    });
}

function assignStench(){
    let row = parseInt(wumpus_location.split("_")[0]);
    let columen = parseInt(wumpus_location.split("_")[1]);

    let stench_location;
    let stench_locations = [];

    if((row < 4) && (row > 1)){
            
        stench_location = (row - 1) + "_" + (columen);
        stench_locations.push(stench_location);

        stench_location = (row + 1) + "_" + (columen);
        stench_locations.push(stench_location);
        console.log("Breeze Location: ",stench_location); 
    } else if (row == 4){
        stench_location = (row - 1) + "_" + (columen);
        stench_locations.push(stench_location);
    } else if (row == 1){
        stench_location = (row + 1) + "_" + (columen);
        stench_locations.push(stench_location);
    }

    if((columen < 4) && (columen > 1)){
        stench_location = (row) + "_" + (columen - 1);
        stench_locations.push(stench_location);

        stench_location = (row) + "_" + (columen + 1);
        stench_locations.push(stench_location);
    } else if (columen == 4){
        stench_location = (row) + "_" + (columen - 1);
        stench_locations.push(stench_location);
    } else if (columen == 1){
        stench_location = (row) + "_" + (columen + 1);
        stench_locations.push(stench_location);
    }

    console.log("Stench Location:", stench_locations);
    let stench_locations_set = new Set(stench_locations);

    stench_locations_set.forEach((val) => {
        
        if(PITlocation.indexOf(val) == -1){
            console.log(val);
            container[0].children[val].appendChild(stench.cloneNode(true));
        }
    });
}

function moveForward(){

}

function turnLeft(){

}
 
function turnRight(){

}

assignAgent('1_1');

assignWumpus();

assignPIT();

assignStench();

assignGold();