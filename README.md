## Description
The wumpusworld is a cave consisting of rooms connected by passageways. Lurking WUMPUS WORLD somewhere in the cave is the terrible wumpus, a beast that eats anyone who enters its room. The wumpus can be shot by an agent, but the agent has only one arrow. Some rooms contain bottomless pits that will trap anyone who wanders into these rooms (except for the wumpus, which is too big to fall in). The only mitigating feature of this bleak environment is the possibility of finding a heap of gold.

_The aim of this program is to auto play the game in order to get a Highscore._

---

### Performance measure
+1000 for climbing out of the cave with the gold, –1000 for falling into a pit or being eaten by the wumpus, –1 for each action taken and –10 for using up the arrow. The game ends either when the agent dies or when the agent climbs out of the cave.

### Environment 
A 4×4 grid of rooms. The agent always starts in the square labeled [1,1], facing to the right. The locations of the gold and the wumpus are chosen randomly, with a uniform distribution, from the squares other than the start square. In addition, each square other than the start can be a pit, with probability 0.2.

### Actuators
The agent can move Forward, TurnLeft by 90 ◦ , or TurnRight by 90 ◦. The agent dies a miserable death if it enters a square containing a pit or a live wumpus. (It is safe, albeit smelly, to enter a square with a dead wumpus.) If an agent tries to move forward and bumps into a wall, then the agent does not move. The action Grab can be used to pick up the gold if it is in the same square as the agent. The action Shoot can be used to fire an arrow in a straight line in the direction the agent is facing. The arrow continues until it either hits (and hence kills) the wumpus or hits a wall. The agent has only one arrow, so only the first Shoot action has any effect. Finally, the action Climb can be used to climb out of the cave, but only from square [1,1].

### Sensors
The agent has five sensors, each of which gives a single bit of information:
  * In the square containing the wumpus and in the directly (not diagonally) adjacent squares, the agent will perceive a Stench.
  * In the squares directly adjacent to a pit, the agent will perceive a Breeze.
  * In the square where the gold is, the agent will perceive a Glitter.
  * When an agent walks into a wall, it will perceive a Bump.
  * When the wumpus is killed, it emits a woeful Scream that can be perceived anywhere in the cave.