export class Display{
    constructor(container){
        this.container = container;
        this.RIGHT = 1;
        this.UP = 2;
        this.LEFT = 3;
        this.DOWN = 4;

        this.row = undefined;
        this.columen = undefined;
        this.wumpus_location = undefined;
        this.gold_location = undefined;
        this.squares = ['1_1', '1_2', '1_3', '1_4', 
                        '2_1', '2_2', '2_3', '2_4',
                        '3_1', '3_2', '3_3', '3_4',
                        '4_1', '4_2', '4_3', '4_4'];
        this.PITlocation = [];
        this.agent_location = "1_1";
        this.breeze_locations = [];
        this.stench_locations = [];

        this.direction = this.RIGHT;

        this.rate = 1;
        this.speed = 1000/this.rate;

        this.agent = document.createElement("img");
        this.agent.setAttribute("src", "image/agent.gif");
        this.agent.setAttribute("class", "agent");

        // this.wumpus = document.createElement("img");
        // wumpus.setAttribute("src", "image/wumpus.gif");
        // wumpus.setAttribute("class", "wumpus");

        this.breeze = document.createElement("img");
        this.breeze.setAttribute("src", "image/breeze.png");
        this.breeze.setAttribute("class", "breeze");

        // container[0].children[0].appendChild(breeze);

        this.stench = document.createElement("img");
        this.stench.setAttribute("src", "image/stench.png");
        this.stench.setAttribute("class", "stench");
        // container[0].children[0].appendChild(stench);

        this.gold = document.createElement("img");
        this.gold.setAttribute("src", "image/gold.png");
        this.gold.setAttribute("class", "gold");

        this.pit_text = document.createElement("span");
        this.pit_text.setAttribute("class", "pit_text");
        this.pit_text.innerHTML = "PIT";
    }
    // container[0].children[0].appendChild(gold);

    // container[0].children['1_1'].innerHTML = 'slk';
    // console.log(container[0].children);


    assignWumpus(){
        let r = Math.ceil(Math.random()*15);

        this.wumpus_location = this.squares[r];
        // console.log(location)
        // container[0].children[wumpus_location].innerHTML = 'Wumpus';`
        this.container[0].children[this.wumpus_location].classList.add('wumpus');

        // console.log('Wumpus Location: ', wumpus_location);

    }

    assignPIT() {
        // container[0].children['4_1'].children[0].classList.add('pit');
        // container[0].children['4_1'].children[0].innerHTML = 'PIT';
        while(this.PITlocation.length < 3){
            let r = Math.ceil(Math.random() * 15)
            if (this.PITlocation.indexOf(this.squares[r]) == -1)
                this.PITlocation.push(this.squares[r]);
        }

        this.PITlocation.forEach((val, i) => {
            this.container[0].children[val].children[0].classList.add('pit');
            this.container[0].children[val].children[0].appendChild(this.pit_text.cloneNode(true));
        });
        this.assignBreeze();
        // console.log('PIT Location: ',this.PITlocation);

    }

    assignGold(){
        let r = undefined;
        while((this.gold_location == undefined) ||
            (this.gold_location == this.wumpus_location) ||
            (this.PITlocation.indexOf(this.gold_location) != -1)){

            r = Math.ceil(Math.random()*15);
            this.gold_location = this.squares[r];
        }
        // console.log('Gold Location: ', gold_location);
        this.container[0].children[this.gold_location].appendChild(this.gold);
        // container[0].children[gold_location].children[0].innerHTML = 'GOLD';
    }

    assignAgent(val){
        // console.log("VAlue:  ", val);
        this.container[0].children[val].classList.add('agent');
    }

    assignBreeze(){
        // let breeze_locations = [];
        let breeze_location;
        this.PITlocation.forEach((val) => {
            let row = parseInt(val.split("_")[0]);
            let columen = parseInt(val.split("_")[1]);

            if((row < 4) && (row > 1)){
                
                breeze_location = (row - 1) + "_" + (columen);
                this.breeze_locations.push(breeze_location);

                breeze_location = (row + 1) + "_" + (columen);
                this.breeze_locations.push(breeze_location);
                // console.log("Breeze Location: ",breeze_location); 
            } else if (row == 4){
                breeze_location = (row - 1) + "_" + (columen);
                this.breeze_locations.push(breeze_location);
            } else if (row == 1){
                breeze_location = (row + 1) + "_" + (columen);
                this.breeze_locations.push(breeze_location);
            }

            if((columen < 4) && (columen > 1)){
                breeze_location = (row) + "_" + (columen - 1);
                this.breeze_locations.push(breeze_location);

                breeze_location = (row) + "_" + (columen + 1);
                this.breeze_locations.push(breeze_location);
            } else if (columen == 4){
                breeze_location = (row) + "_" + (columen - 1);
                this.breeze_locations.push(breeze_location);
            } else if (columen == 1){
                breeze_location = (row) + "_" + (columen + 1);
                this.breeze_locations.push(breeze_location);
            }
        });
        // console.log(this.breeze_locations);
        let breeze_locations_set = new Set(this.breeze_locations);

        breeze_locations_set.forEach((val) => {
            
            if(this.PITlocation.indexOf(val) == -1){
                // console.log(val);
                this.container[0].children[val].appendChild(this.breeze.cloneNode(true));
            }
        });
    }

    assignStench(){
        let row = parseInt(this.wumpus_location.split("_")[0]);
        let columen = parseInt(this.wumpus_location.split("_")[1]);

        let stench_location;
        

        if((row < 4) && (row > 1)){
                
            stench_location = (row - 1) + "_" + (columen);
            this.stench_locations.push(stench_location);

            stench_location = (row + 1) + "_" + (columen);
            this.stench_locations.push(stench_location);
            // console.log("Breeze Location: ",stench_location); 
        } else if (row == 4){
            stench_location = (row - 1) + "_" + (columen);
            this.stench_locations.push(stench_location);
        } else if (row == 1){
            stench_location = (row + 1) + "_" + (columen);
            this.stench_locations.push(stench_location);
        }

        if((columen < 4) && (columen > 1)){
            stench_location = (row) + "_" + (columen - 1);
            this.stench_locations.push(stench_location);

            stench_location = (row) + "_" + (columen + 1);
            this.stench_locations.push(stench_location);
        } else if (columen == 4){
            stench_location = (row) + "_" + (columen - 1);
            this.stench_locations.push(stench_location);
        } else if (columen == 1){
            stench_location = (row) + "_" + (columen + 1);
            this.stench_locations.push(stench_location);
        }

        // console.log("Stench Location:", this.stench_locations);
        let stench_locations_set = new Set(this.stench_locations);

        stench_locations_set.forEach((val) => {
            
            if(this.PITlocation.indexOf(val) == -1){
                // console.log(val);
                this.container[0].children[val].appendChild(this.stench.cloneNode(true));
            }
        });
    }

    moveForward(){
        let row = parseInt(this.agent_location.split("_")[0]);
        let columen = parseInt(this.agent_location.split("_")[1]);

        let move_to;

        if(this.direction == this.RIGHT){
            if(columen < 4)
                move_to = row + "_" + (columen + 1);
            else{
                console.log("BUMP!!!!");
                move_to = this.current_location;
            }
        } else if(this.direction == this.UP){
            if(row < 4){
                move_to = (row + 1) + "_" + columen;
            } else{
                console.log("BUMP!!!!");
                move_to = this.current_location;
            }
        } else if(this.direction == this.LEFT){
            if(columen > 1){
                move_to = row + "_" + (columen - 1);
            } else {
                console.log("BUMP!!!!");
                move_to = this.current_location;
            }
        } else if(this.direction == this.DOWN){
            if(row > 1){
                move_to = (row - 1) + "_" + columen;
            } else {
                console.log("BUMP!!!!");
                move_to = this.current_location;
            }
        } else {
            console.log("[FATAL ERROR]: unknown direction- ", this.direction)
        }

        this.container[0].children[this.agent_location].classList.remove('agent');
        // console.log("Move to : ", move_to)
        this.assignAgent(move_to);
        this.agent_location = move_to;
        this.adjustDirection();
        // console.log("Agent Location From Display: ", this.agent_location);
        // console.log(" ");

    }

    turnLeft(){
        if(this.direction < 4){
            this.direction++;
        } else{
            this.direction = 1;
        }

        this.rotate();
    }
    
    turnRight(){
        if(this.direction > 1){
            this.direction--;
        } else{
            this.direction = 4;
        }

        this.rotate();
    }

    rotate(){
        let length = this.container[0].children[this.agent_location].children.length;

        this.resetDxn();
        let angle = (this.direction-1) * 90;
        // rotate the whole frame
        // i use this because the agent is assigned as a background image
        this.container[0].children[this.agent_location].style.transform = "rotate(-"+angle+"deg)";

        for(let i = 0; i < length; i++){
            this.container[0].children[this.agent_location].children[i].style.transform = "rotate("+angle+"deg)";
        }
    }

    resetDxn(){
        this.container[0].children[this.agent_location].style.transform = "rotate(0deg)";
    }

    adjustDirection(){
        let length = this.container[0].children[this.agent_location].children.length;
        this.resetDxn();
        // console.log("Dxn: ", this.direction);
        
        let angle = (this.direction-1) * 90;
        this.container[0].children[this.agent_location].style.transform = "rotate(-"+angle+"deg)";
        for(let i = 0; i < length; i++){
            this.container[0].children[this.agent_location].children[i].style.transform = "rotate("+angle+"deg)";
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetDisplay(){
        // console.log("STENCH:  ",this.stench_locations);
        let stench_img = document.querySelectorAll(".stench");
        let breeze_img = document.querySelectorAll(".breeze");
        let pit = document.querySelectorAll(".pit");
        let pit_text = document.querySelectorAll(".pit_text");
        let gold_img = document.querySelectorAll(".gold");
        let wumpus = document.querySelectorAll(".wumpus");
        stench_img.forEach(val =>{
            // console.log(val);
            val.remove();
            // console.log(this.container[0].children[val].childNodes);
            // this.container[0].children[val].removeChild(this.container[0].children[val].childNodes[2]);
        });
        breeze_img.forEach(val => {
            // console.log(val);
            val.remove();
        });
        pit.forEach(val =>{
            val.classList.remove('pit');
        });
        pit_text.forEach(val => {
            val.remove();
        });
        gold_img.forEach(val => {
            val.remove();
        });
        this.container[0].children[this.wumpus_location].classList.remove('wumpus');
        this.container[0].children[this.agent_location].classList.remove('agent');

        this.PITlocation = [];
        this.agent_location = "1_1";
        this.breeze_locations = [];
        this.stench_locations = [];

        this.direction = this.RIGHT;

        this.row = undefined;
        this.columen = undefined;
        this.wumpus_location = undefined;
        this.gold_location = undefined;
    }

    // resetDisplay(){
    //     this.PITlocation = [];
    //     this.agent_location = "1_1";
    //     this.breeze_locations = [];
    //     this.stench_locations = [];

    //     this.direction = this.RIGHT;
    // }
}