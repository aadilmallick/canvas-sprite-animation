import SpriteAnimation from "./SpriteAnimation";
import { GAME_CONSTANTS } from "./constants";
import animationsList from "./animations.json";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;

const spriteSheet = new Image();
spriteSheet.src = "shadow.png";

const shadow = new SpriteAnimation(575, 523, spriteSheet);

// do modulus math to draw image only every 5 frames instead of every frame
let staggerFrames = 5;
let gameLoopCount = 0;

type AnimationNames =
  | "idle"
  | "jump1"
  | "jump2"
  | "run1"
  | "dizzy"
  | "sit"
  | "roll"
  | "run2"
  | "sleep"
  | "there is no meaning in life";
type Animation = {
  [key in AnimationNames]: {
    row: number;
    numFrames: number;
  };
};

const animations: Partial<Animation> = {};

const select = document.querySelector("select") as HTMLSelectElement;
select.addEventListener("change", (e) => {
  const target = e.target as HTMLSelectElement;
  currentAnim = animations[target.value as keyof typeof animations]!;
  gameLoopCount = 0;
});

const staggerFramesRange = document.querySelector("input") as HTMLInputElement;
staggerFramesRange.addEventListener("input", (e) => {
  staggerFrames = Number(e.target?.value);
});

animationsList.forEach((anim) => {
  // add animation object to animations object
  animations[anim.name as AnimationNames] = {
    row: anim.row,
    numFrames: anim.numFrames,
  };

  // add option to select element
  const option = document.createElement("option");
  option.value = anim.name;
  option.text = anim.name;
  select.add(option);
});

let currentAnim = animations.dizzy!;

function gameLoop() {
  ctx.clearRect(
    0,
    0,
    GAME_CONSTANTS.CANVAS_WIDTH,
    GAME_CONSTANTS.CANVAS_HEIGHT
  );

  // calculate the current frame, taking into account the stagger, 5 frames.
  const curFrame =
    Math.floor(gameLoopCount / staggerFrames) % currentAnim.numFrames;
  // must draw each frame else canvas clears
  shadow.drawFrame(ctx, currentAnim.row, curFrame);

  gameLoopCount++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
