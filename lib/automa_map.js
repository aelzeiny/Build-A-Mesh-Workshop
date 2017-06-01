class AutomaMap {
  constructor(mapWidth, mapHeight, map, percentWalls = 40) {
		this.MapWidth = mapWidth;
		this.MapHeight = mapHeight;
		this.PercentAreWalls = percentWalls;
		this.Map = map;
	}

  MakeCaverns() {
		// By initilizing column in the outter loop, its only created ONCE
		for(let row=0; row <= this.MapHeight-1; row++)
			for(let column = 0; column <= this.MapWidth-1; column++)
				this.Map[column,row] = this.PlaceWallLogic(column,row);
	}

	PlaceWallLogic(x, y) {
		let numWalls = this.GetAdjacentWalls(x,y,1,1);
		if(this.Map[x,y] === 1) {
			if( numWalls >= 4 )
				return 1;
			if(numWalls < 2)
				return 0;
		}
		else {
			if(numWalls >= 5)
				return 1;
		}
		return 0;
	}

  GetAdjacentWalls(x, y, scopeX = 1, scopeY = 1) {
		let startX = x - scopeX;
		let startY = y - scopeY;
		let endX = x + scopeX;
		let endY = y + scopeY;

		let iX = startX;
		let iY = startY;

		let wallCounter = 0;

		for(iY = startY; iY <= endY; iY++) {
			for(iX = startX; iX <= endX; iX++) {
 				if(!(iX === x && iY === y)) {
					if(this.IsWall(iX,iY))
						wallCounter += 1;
				}
			}
		}
		return wallCounter;
	}

  IsWall(x, y) {
		// Consider out-of-bound a wall
		if(this.IsOutOfBounds(x,y))
			return true;

		if(this.Map[x,y] === 1)
			return true;

		if(this.Map[x,y] === 0)
			return false;

		return false;
	}

  IsOutOfBounds(x, y) {
		if(x<0 || y<0)
			return true;
		if(x > this.MapWidth-1 || y > this.MapHeight-1 )
			return true;
		return false;
	}

  RandomFillMap() {
		// New, empty map
		let mapMiddle = 0; // Temp variable
		for(let row=0; row < this.MapHeight; row++) {
			for(let column = 0; column < this.MapWidth; column++)
			{
				// If coordinants lie on the the edge of the map (creates a border)
				if(column === 0)
					this.Map[column,row] = 1;
				else if (row === 0)
					this.Map[column,row] = 1;
				else if (column === this.MapWidth-1)
					this.Map[column,row] = 1;
				else if (row === this.MapHeight-1)
					this.Map[column,row] = 1;
				// Else, fill with a wall a random percent of the time
				else
				{
					mapMiddle = (this.MapHeight / 2);

					if(row === mapMiddle)
						this.Map[column,row] = 0;
					else
						this.Map[column,row] = this.RandomPercent(this.PercentAreWalls);
				}
			}
		}
	}
  
  RandomPercent(percent) {
		if(percent >= Math.random() * 100 + 1)
			return 1;
		return 0;
	}
}
