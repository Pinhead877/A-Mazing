# A-Mazing

You are a yellow face and an evil freelancer (his goal is to become a big and evil coorporation) has put you in a maze. your mission is to find the fruit inside the maze. why? well, why not.

## But seriously

I wanted to recap stuff i've learned in college like A* and Prim's algorithms so I created a maze game. start at 0,0 and find your way to the fruit inside the maze in order to finish. 

### The first maze

the first version of the maze game was pretty dumb. the walls were cells that you couldn't enter them and the algorithm for building the maze wasn't really efficient. the algorithm would randomlly place an empty cell or a wall in every cell and afterwards for every the code removes neighboring walls from cell which has more than 2 walls. this didn't insured that there would be a path from the player to the fruit, my solution was using the A* algorithm. basicly the idea was to check if the player has a possible path to the fruit, if not than regenerate the maze. and yes, I know it is a dumb way to generate a maze but I just wanted to implement the A* algorithm in the maze, make the maze operational and continue to a new better version.

### Maze 2.0







## Roadmap
- Convert to React
- 
