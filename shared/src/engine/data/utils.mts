import { lanes } from './lanes.mjs'
import { note } from './note.mjs'

export const layout = (lane: number, size: number) =>
    new Rect({
        l: -note.radius * size,
        r: note.radius * size,
        t: -note.radius * size -0.2,
        b: note.radius * size -0.2,
    }).add(new Vec(0, 1.2).rotate(-lane * lanes.angle))
