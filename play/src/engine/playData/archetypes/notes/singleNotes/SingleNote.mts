import { getZ, layer, skin, sprites } from '../../../skin.mjs'
import { Note } from '../Note.mjs'

export abstract class SingleNote extends Note {
    singleImport = this.defineImport({
        sim: { name: 'sim', type: Boolean },
        hold: { name: 'hold', type: Boolean },
    })

    singleSharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
    })

    sim = this.entityMemory({
        z: Number,
    })

    initialize() {
        super.initialize()

        if (this.singleImport.sim)
            this.sim.z = getZ(layer.note.sim, this.targetTime, this.import.lane)
    }

    render() {
        if (this.singleImport.hold && time.now >= this.targetTime) return

        super.render()
		
		const startSize = 1/5
		const scale = this.s*(1 - startSize) + startSize
		const currLayout = this.note.layout.mul(this.s**Math.SQRT2)
		const currCenter = new Vec( (currLayout.l + currLayout.r) / 2, (currLayout.t + currLayout.b) / 2 )
		const dimensions = new Vec( (this.note.layout.r - this.note.layout.l) / 2, (this.note.layout.t - this.note.layout.b) / 2)
		const newLayout = new Rect({
			l: currCenter.x - dimensions.x * scale,
			r: currCenter.x + dimensions.x * scale,
			t: currCenter.y + dimensions.y * scale,
			b: currCenter.y - dimensions.y * scale,
		})
	
        skin.sprites.draw(sprites.head, newLayout, this.note.z, 1)

        if (this.singleImport.sim)
            skin.sprites.draw(sprites.sim, newLayout, this.sim.z, 1)
    }
}
