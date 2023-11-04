# sprite-animation

## Canvas Setup

## Navigating a sprite sheet

![Sprite Sheet](./dist/shadow.png)

As you can see, a sprite sheet is an image where each sprite has the same size, and each sprite in a sprite sheet represents an individual frame of an animation.

- Each row represents a single animation. Going down rows goes through different animations.

Navigating a sprite sheet involves using a row index and a column index to crop out a single frame of the sprite sheet.

We can then loop through the columns to give the illusion of animation.

```ts
import { GAME_CONSTANTS } from "./constants";

export default class SpriteAnimation {
  constructor(
    private spriteWidth: number,
    private spriteHeight: number,
    private spriteSrc: CanvasImageSource
  ) {}

  // return coordinates of the specific sprite frame in the sprite sheet
  private getAnimationFrame(rowIndex: number, columnIndex: number) {
    return [
      columnIndex * this.spriteWidth,
      rowIndex * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
    ] as [number, number, number, number];
  }

  drawFrame(
    ctx: CanvasRenderingContext2D,
    rowIndex: number,
    columnIndex: number
  ) {
    ctx.drawImage(
      this.spriteSrc,
      ...this.getAnimationFrame(rowIndex, columnIndex),
      0,
      0,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.CANVAS_HEIGHT
    );
  }
}
```

We can take advantage of the fact that all sprite frames in a sprite sheet will have the same width and height. This makes looping through the frames of a sprite sheet very easy.

In the example below, we are loading a spritesheet with dimensions 6876 x 5230, which looks like it has 12 columns and 10 rows. Each sprite frame is 575 x 523.

```ts
const spriteSheet = new Image();
spriteSheet.src = "shadow.png";

const shadow = new SpriteAnimation(575, 523, spriteSheet);
```

## Animation loop

To animate a sprite, we have to follow these steps:

1. Pick an animation row
2. Loop through the animation row, drawing each frame. Loop back around when you get to last frame

But to prevent the animation from being ultra-fast, we will use a stagger frame technique that works like so:

1. Have a counter variable that keeps track of the number of elapsed frames. Keep incrementing this in `requestAnimationFrame()` callback
2. Have a variable that keeps track of the number of frames to wait before incrementing the animation frame. This is the `staggerFrames` variable
3. Only increment the current frame (column number) if `gameLoopCount % staggerFrames === 0`, as a way of incrementing only once every `staggerFrames` frames

```javascript
// change frames every 5 frames
const staggerFrames = 5;
let gameLoopCount = 0;

// do first animation row in sprite sheet which has 7 frames
let curAnimRow = 0;
let numFrames = 7;

function gameLoop() {
  // clear canvas each frame before drawing
  ctx.clearRect(
    0,
    0,
    GAME_CONSTANTS.CANVAS_WIDTH,
    GAME_CONSTANTS.CANVAS_HEIGHT
  );

  // calculate the current frame, taking into account the stagger, 5 frames.
  // basically increment animation frame only every 5 requestAnimation frames that pass
  const curFrame = Math.floor(gameLoopCount / staggerFrames) % numFrames;
  // draw the frame to canvas
  shadow.drawFrame(ctx, curAnimRow, curFrame);

  gameLoopCount++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

## JSON pattern

List out all the animations in your sprite sheet, along with their row number in the sprite sheet and the number of frames/columns they have:

```json
[
  {
    "name": "idle",
    "row": 0,
    "numFrames": 7
  },
  {
    "name": "jump1",
    "row": 1,
    "numFrames": 7
  },
  {
    "name": "jump2",
    "row": 2,
    "numFrames": 7
  },
  {
    "name": "run1",
    "row": 3,
    "numFrames": 9
  },
  {
    "name": "dizzy",
    "row": 4,
    "numFrames": 11
  },
  {
    "name": "sit",
    "row": 5,
    "numFrames": 5
  },
  {
    "name": "roll",
    "row": 6,
    "numFrames": 7
  },
  {
    "name": "run2",
    "row": 7,
    "numFrames": 7
  },
  {
    "name": "sleep",
    "row": 8,
    "numFrames": 12
  },
  {
    "name": "there is no meaning in life",
    "row": 9,
    "numFrames": 4
  }
]
```

Use this JSON array to dynamically population animation options and the like.
