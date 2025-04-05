import {GlobalSystem, Sprite} from "lagom-engine";
import * as PIXIF from "pixi-filters";

export class PaletteSwapper extends GlobalSystem<[Sprite[]]>
{
    types = [Sprite];

    update(delta: number): void
    {
        this.runOnComponents((sprites: Sprite[]) => {

            for (let sprite of sprites)
            {
                if (sprite.pixiObj.filters == null)
                {
                    sprite.pixiObj.filters = [
                        new PIXIF.MultiColorReplaceFilter([[0x0b0926, 0x0b0926], [0x594f7d, 0xc93864], [0xcc9a6e, 0xffdb85], [0xfaf0b9, 0x1b192a]])
                    ]
                }
            }
        })
    }

}


