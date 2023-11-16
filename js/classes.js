class Sprite {
    constructor({position, image_src, scale = 1, framesMax = 1}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();  // creates HTML image inside JS
        this.image.src = image_src; 
        this.scale = scale;
        this.framesCurrent = 0;
        this.framesMax = framesMax;

        // below is optional, maybe deleted later??
        this.framesElapsed = 0;
        this.framesHold = 10;
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax), 
            0, 
            this.image.width/this.framesMax, 
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width)/this.framesMax * this.scale, 
            this.image.height * this.scale
        ) 
    }

    animateFrames() {
        this.framesElapsed += 1;

        if (this.framesElapsed % this.framesHold === 0) {
            // Go through all the frames 
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent += 1;   // go to next frame
            }
            // reset back to first frame once all frames are passed
            else {
                this.framesCurrent = 0;
            }
        }
    }


    // For every frame, update sprites
    update() {
        this.draw();   // call draw method again
        this.animateFrames();
    }
}





class Fighter extends Sprite {
    constructor({position, velocity, colour = "green", offset = offset = { x: 0, y: 0 }, sprites, attackBox = { offset: {}, width: undefined, height: undefined }, image_src, scale = 1, framesMax = 1}) {
        super({
            position,
            image_src,
            scale,
            framesMax,
            offset
        });   // calls constructor of parent (class 'Sprite')
        
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKeyPressed;

        
        // area that determines where players can attack
        this.attackBox = {
            position: {
                x: this.position.x, 
                y: this.position.y
            },
            offset: attackBox.offset,   // offset for attack box
            width: attackBox.width,
            height: attackBox.height 
        }
        this.colour = colour;
        this.isAttacking = false;
        this.health = 100;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;

        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].image_src
        }
    }

    // // Draw the sprites in the canvas (tag in html file).
    // draw() {
    //     c.fillStyle = this.colour;  // sprite is green
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height); 

    //     // draw attack border
    //     if (this.isAttacking) {
    //         c.fillStyle = "red";
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }


    // For every frame, update sprites
    update() {
        this.draw();   // call draw method again

        // keep on animating frames if player is not dead
        if (!this.dead) {
            this.animateFrames();
        }


        // attack box positions
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Determines how to move players
        this.position.x += this.velocity.x;   // move in x-direction
        this.position.y += this.velocity.y;   // move in y-direction

        // Prevents sprite from falling down canvas
        // If overall position of sprite is greater than or equal to canvas...
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        }   
        // gravity is ONLY ADDED if sprites (players) haven't reached bottom of canvas
        else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20
    
        if (this.health <= 0) {
          this.switchSprite('death')
        } 
        else this.switchSprite('takeHit')
    }


    switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
        case 'idle':
            if (this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image;
                this.framesMax = this.sprites.idle.framesMax;
                this.framesCurrent = 0;
            }
            break;
        case 'run':
            if (this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image;
                this.framesMax = this.sprites.run.framesMax;
                this.framesCurrent = 0;
            }
            break;
        case 'jump':
            if (this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax;
                this.framesCurrent = 0;
            }
            break;

        case 'fall':
            if (this.image !== this.sprites.fall.image) {
                this.image = this.sprites.fall.image;
                this.framesMax = this.sprites.fall.framesMax;
                this.framesCurrent = 0;
            }
            break;

        case 'attack1':
            if (this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image;
                this.framesMax = this.sprites.attack1.framesMax;
                this.framesCurrent = 0;
            }
            break;

        case 'takeHit':
            if (this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image;
                this.framesMax = this.sprites.takeHit.framesMax;
                this.framesCurrent = 0;
            }
            break;

        case 'death':
            if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image;
                this.framesMax = this.sprites.death.framesMax;
                this.framesCurrent = 0;
            }
            break;
    }
  }
}

