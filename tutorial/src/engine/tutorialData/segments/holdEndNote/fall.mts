import { connector } from '../../components/connector.mjs'
import { noteDisplay } from '../../components/noteDisplay.mjs'
import { slide } from '../../components/slide.mjs'
import { particle } from '../../particle.mjs'
import { drawHand, spawnHoldEffect } from '../../utils.mjs'

let effectInstanceId = tutorialMemory(ParticleEffectInstanceId)

export const holdEndNoteFall = {
    enter() {
        slide.show()
        noteDisplay.showFall('tail')
        connector.showFallOut()

        effectInstanceId = spawnHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 1)
    },

    exit() {
        slide.clear()
        noteDisplay.clear()
        connector.clear()

        particle.effects.destroy(effectInstanceId)
    },
}
