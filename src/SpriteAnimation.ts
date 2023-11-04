import { GAME_CONSTANTS } from "./constants";

export default class SpriteAnimation {
  constructor(
    private spriteWidth: number,
    private spriteHeight: number,
    private spriteSrc: CanvasImageSource
  ) {}

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
