import { options } from '../../configuration/options.mjs'
import { panel } from '../panel.mjs'
import { getZ, layer, skin, sprites } from '../skin.mjs'
import { archetypes } from './index.mjs'

export class HoldConnector extends Archetype {
    import = this.defineImport({
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    render() {
        const t = {
            min: bpmChanges.at(this.headImport.beat).time,
            max: bpmChanges.at(this.tailImport.beat).time,
        }

        const index = {
            min: Math.floor(t.min / panel.h),
            max: Math.floor(t.max / panel.h),
        }

        const lane = this.headImport.lane
        const l = lane - 0.5 * options.noteSize
        const r = lane + 0.5 * options.noteSize

        const z = getZ(layer.connector, t.min, lane)

        for (let i = index.min; i <= index.max; i++) {
            const pt = {
                min: Math.max(t.min, i * panel.h),
                max: Math.min(t.max, (i + 1) * panel.h),
            }

            skin.sprites.draw(
                sprites.connector,
                new Rect({
                    l,
                    r,
                    b: pt.min - i * panel.h,
                    t: pt.max - i * panel.h,
                }).translate(i * panel.w, 0),
                z,
                options.connectorAlpha,
            )
        }
    }

    get headImport() {
        return archetypes.TapNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.TapNote.import.get(this.import.tailRef)
    }
}
