// 1
    function groundCollision(row,col,blocktypes) {
		let blockRC = blocktypes[`snowSolid${row},${col}`];
		if (Player.x + 16 >= blockRC.x && Player.x + 16 <= blockRC.x + blockRC.width && Player.y >= blockRC.y && Player.y >= blockRC.height && pause == false) {groundMovement -= Player.speed, Wallob.x -= Player.speed, Chicken.x -= Player.speed, Shop.x -= Player.speed;}
		if (Player.x + 48 >= blockRC.x && Player.x <= blockRC.x && Player.y >= blockRC.y && Player.y >= blockRC.height && pause == false) {groundMovement += Player.speed, Wallob.x += Player.speed, Chicken.x += Player.speed, Shop.x += Player.speed;}
		if (Player.y >= blockRC.y - 64 && Player.x <= blockRC.x + 48 && Player.x >= blockRC.x - 48 && Player.y <= blockRC.y && !keys[" "]) {Player.y = blockRC.y - 64, Player.velocityY = 0; onGround = true} };

// 2

    function solidCollision(row,col,blocktypes) {
		let blockRC = blocktypes[`Solid${row},${col}`]
		if (Player.x + 16 > blockRC.x && Player.x < blockRC. x + blockRC.width && Player.y >= blockRC.y && Player.y > blockRC.height && Player.y > blockRC.y && pause == false)
			 {groundMovement -= Player.speed, Wallob.x -= Player.speed, Chicken.x -= Player.speed, Shop.x -= Player.speed;}
		if (Player.x + 48 > blockRC.x && Player.x < blockRC.x && Player.y > blockRC.y && Player.y > blockRC.height && pause == false)
			{groundMovement += Player.speed, Wallob.x += Player.speed, Chicken.x += Player.speed, Shop.x += Player.speed;}
		if (Player.y + Player.height * 1.2 > blockRC.y &&
			Player.y < blockRC.y + blockRC.height &&
			Player.x < blockRC.x + blockRC.height &&
			Player.x > blockRC.x - blockRC.width)
			{Player.y = blockRC.y - 64; onGround = true; }
        }

// 3

    function solidCollision(row,col,blocktypes) {
		let blockRC = blocktypes[`Solid${row},${col}`]
        if (player.x + player.width > blockCollision.x
            && player.x < blockCollision.x + blockCollision.width
            && player.y > blockCollision.y
            && player.y < blockCollision.y + blockCollision.height
            && pause == false)
            {groundMovement += player.speed, wallob.x += player.speed, chicken.x += player.speed, shop.x += player.speed;}
        if (player.y >= blockCollision.y - 64 && player.x <= blockCollision.x + 48 && player.x >= blockCollision.x - 48 && player.y <= blockCollision.y)
            {onGround = true;}
        else {onGround = false;}

        if (onGround == true) {player.gravity = 0.4, parachuteDeployed = false; player.y = blockCollision.y - blockCollision.height; player.velocityY = 0;
            if (keys[' '] && onGround == true) { jump(-14); onGround = false}; }
            if (keys[' '] && onGround == false && player.velocityY > 0) { parachute(player); }
                }

// 4

    let leftOverlap = false;
    let rightOverlap = false;
    let topOverlap = false;
    let bottomOverlap = false;

    function solidCollision(row,col,blocktypes) {
		let blockCollision = blocktypes[`Solid${row},${col}`]

        if (dead == false && pause == false){

            if(player.x < blockCollision.x + blockCollision.width) {rightOverlap = true}
            if(player.x + player.width > blockCollision.x) {leftOverlap = true}
            if(player.y + player.height < blockCollision.y) {bottomOverlap = true}
            if(player.y > blockCollision.y + blockCollision.height) {topOverlap = true}

            if (leftOverlap == true)
                {groundMovement += player.speed, wallob.x += player.speed, chicken.x += player.speed, shop.x += player.speed;}
            if (rightOverlap == true)
                {groundMovement -= player.speed, wallob.x -= player.speed, chicken.x -= player.speed, shop.x -= player.speed;}
            if (bottomOverlap == true)
                {onGround = false;}
            if (topOverlap == true)
                {onGround = true; player.gravity = 0.0, parachuteDeployed = false; player.velocityY = 0;

                if (keys[' '] && onGround == true) { jump(-14); onGround = false}; }
                if (keys[' '] && onGround == false && player.velocityY > 0) { parachute(player); }
            }
        }

// 5

function colliding({player, blockCollision}) {
		let isColliding = (
		player.x < blockCollision.x + blockCollision.width &&
		player.x + player.width > blockCollision.x &&
		player.y + player.height < blockCollision.y &&
		player.y > blockCollision.y + blockCollision.height
	);
		return isColliding;
	}

	/**
	 * Stops the player from moving through blocks and falling through the floor
	 * @param {*} row - which array in the 2d array "ground" is specified from ground.js
	 * @param {*} col - which index is specified from inside the sub array (row) from ground.js
	 * @param {*} blocktypes - 
	 */
	function solidCollision(row, col, blocktypes) {
		let blockCollision = blocktypes[`Solid${row},${col}`]
		let isColliding = colliding({player, blockCollision})
		if (isColliding)
			{onGround = true; player.gravity = 0; player.y = blockCollision.y; parachuteDeployed = false; player.velocityY = 0;}
		if (keys[' '] && onGround == true) { jump(-14); onGround = false};
		if (keys[' '] && onGround == false && player.velocityY > 0) { parachute(player);}
	};

// 6

    function solidCollision(row,col,blocktypes) {
		let blockCollision = blocktypes[`Solid${row},${col}`];
        let leftOverlap = (player.x < blockCollision.x + blockCollision.width);
        let rightOverlap = (player.x + player.width > blockCollision.x);
        let topOverlap = (player.y + player.height < blockCollision.y);
        let bottomOverlap = (player.y > blockCollision.y + blockCollision.height);

        if (dead == false && pause == false){

            if (leftOverlap)
                {groundMovement += player.speed, wallob.x += player.speed, chicken.x += player.speed, shop.x += player.speed;}
            if (rightOverlap)
                {groundMovement -= player.speed, wallob.x -= player.speed, chicken.x -= player.speed, shop.x -= player.speed;}
            if (bottomOverlap)
                {onGround = false;}
            if (topOverlap)
                {onGround = true; player.gravity = 0.0, parachuteDeployed = false; player.velocityY = 0;

                if (keys[' '] && onGround == true) { jump(-14); onGround = false}; }
                if (keys[' '] && onGround == false && player.velocityY > 0) { parachute(player); }
            }
        }
