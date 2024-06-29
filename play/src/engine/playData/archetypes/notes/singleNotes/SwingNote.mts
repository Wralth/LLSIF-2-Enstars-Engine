import { SwingDirection } from '../../../../../../../shared/src/engine/data/SwingDirection.mjs'
import { windows } from '../../../../../../../shared/src/engine/data/windows.mjs'
import { options } from '../../../../configuration/options.mjs'
import { buckets } from '../../../buckets.mjs'
//import { arrowLayout } from '../../../note.mjs'
import { getZ, layer, skin, sprites } from '../../../skin.mjs'
import { isUsed, markAsUsed, transform } from '../../InputManager.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SwingNote extends SingleNote {
    swingImport = this.defineImport({
        direction: { name: 'direction', type: DataType<SwingDirection> },
    })

    windows = windows.swingNote

    bucket = buckets.swingNote

    /*arrow = this.entityMemory({
        layout: Quad,
        z: Number,
    })*/

    preprocess() {
        super.preprocess()

        //if (options.mirror) this.swingImport.direction *= -1
    }

    initialize() {
        super.initialize()

        //arrowLayout(this.import.lane, this.swingImport.direction).copyTo(this.arrow.layout)
        //this.arrow.z = getZ(layer.note.arrow, this.targetTime, this.import.lane)
    }

    touch() {
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            const { lane, radius } = transform(touch.position)
            if (Math.abs(radius - 1) > 0.32) continue
            if (Math.abs(lane - this.import.lane) > 0.5) continue

            if (touch.started) {
                if (isUsed(touch)) continue

                markAsUsed(touch)

                this.complete(touch, touch.startTime)
                return
            } else {
                const { lane: lastLane, radius: lastRadius } = transform(touch.lastPosition)
                if (Math.abs(lastRadius - 1) > 0.32) continue
                if (Math.abs(lastLane - this.import.lane) <= 0.5) continue

                this.complete(touch, touch.time)
                return
            }
        }
    }

    complete(touch: Touch, hitTime: number) {
        this.singleSharedMemory.activatedTouchId = touch.id

        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }

    render() {
        super.render()
		
		/*
		const startSize = 1/5
		const scale = this.s*(1 - startSize) + startSize
		const currLayout = this.arrow.layout.mul(this.s**Math.SQRT2)
		const currCenter = new Rec( 
			(currLayout.x1 + currLayout.x2) / 2, 
			(currLayout.y1 + currLayout.y2) / 2,
			(currLayout.x3 + currLayout.x4) / 2,
			(currLayout.y3 + currLayout.y4) / 2
		)
		const dimensions = new Rec( 
			(this.arrow.layout.x1 - this.arrow.layout.x2) / 2, 
			(this.arrow.layout.y1 - this.arrow.layout.y2) / 2,
			(this.arrow.layout.x3 - this.arrow.layout.x4) / 2, 
			(this.arrow.layout.y3 - this.arrow.layout.y4) / 2
		)
		const newLayout = new Quad({
			x1: currCenter.l - dimensions.l * scale,
			x2: currCenter.l + dimensions.l * scale,
			y1: currCenter.
			l: currCenter.x - dimensions.x * scale,
			r: currCenter.x + dimensions.x * scale,
			t: currCenter.y + dimensions.y * scale,
			b: currCenter.y - dimensions.y * scale,
		})
		*/

        //skin.sprites.draw(sprites.arrow, this.arrow.layout.mul(this.s), this.arrow.z, 1)
    }
}
