import {Component, GlobalSystem, LagomType, Sprite} from "lagom-engine";
import * as PIXI from "pixi.js"

const fragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;       // The sprite's texture
uniform sampler2D inputPalette;   // The input palette (4×1 texture)
uniform sampler2D outputPalette;  // The output palette (4×1 texture)

void main(void) {
    // Sample the sprite's texture to get the color index
    vec4 indexColor = texture2D(uSampler, vTextureCoord);
    float index = indexColor.r; // Assuming the index is stored in the red channel

    // Calculate the texture coordinate for the palettes
    float xCoord = index; // Since the palette is 4x1, and index is normalized [0, 1]

    // Retrieve the original color from the input palette
    vec4 originalColor = texture2D(inputPalette, vec2(xCoord, 0.5));

    // Retrieve the new color from the output palette
    vec4 newColor = texture2D(outputPalette, vec2(xCoord, 0.5));

    // If the current pixel matches the original color, replace it with the new color
    if (indexColor.rgb == originalColor.rgb) {
        gl_FragColor = vec4(newColor.rgb, indexColor.a);
    } else {
        gl_FragColor = indexColor;
    }
}
`

export class PaletteSwapper extends GlobalSystem<[Sprite[]]> {
  types= [Sprite];

  onAdded() {
    super.onAdded();
  }

  update(delta: number): void {
    this.runOnComponents((sprites: Sprite[]) => {

      for (let sprite of sprites) {

        sprite.pixiObj.filters = [
          new PIXI.Filter(
            undefined,
            fragmentShader,
            {
              uSampler: sprite.pixiObj.texture,
              inputPalette: this.scene.game.getResource("inputPalette").texture,
              outputPalette: this.scene.game.getResource("outputPalette").texture,
            }
          )
        ]
      }
    })
  }

}


