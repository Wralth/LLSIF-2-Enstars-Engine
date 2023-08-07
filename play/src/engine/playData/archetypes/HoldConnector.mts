import { options } from '../../configuration/options.mjs'
import { effects, particle } from '../particle.mjs'
import { skin, sprites } from '../skin.mjs'
import { SwingDirection } from './SwingDirection.mjs'
import { archetypes } from './index.mjs'
import { lanes } from './lanes.mjs'
import { layer } from './layer.mjs'
import { note } from './note.mjs'
import { arrowLayout, getZ, holdEffectLayout, noteLayout } from './utils.mjs'

export class HoldConnector extends Archetype {
    data = this.defineData({
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    head = this.entityMemory({
        time: Number,
        lane: Number,

        sim: Boolean,
        arrow: DataType<0 | SwingDirection>,
    })

    tail = this.entityMemory({
        time: Number,
    })

    spawnTime = this.entityMemory(Number)

    visualTime = this.entityMemory({
        min: Number,
        max: Number,
        hidden: Number,
    })

    connector = this.entityMemory({
        l: Vec,
        r: Vec,

        z: Number,
    })

    slide = this.entityMemory({
        layout: Rect,
        z: Number,
    })

    sim = this.entityMemory({
        z: Number,
    })

    arrow = this.entityMemory({
        layout: Quad,
        z: Number,
    })

    holdEffectInstanceId = this.entityMemory(ParticleEffectInstanceId)

    preprocess() {
        this.head.time = bpmChanges.at(this.headData.beat).time

        this.visualTime.min = this.head.time - this.duration

        this.spawnTime = this.visualTime.min
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    initialize() {
        this.head.lane = this.headData.lane
        this.head.sim = this.headSingleData.sim
        this.head.arrow =
            this.headInfo.archetype === archetypes.SwingNote.index
                ? this.headSwingData.direction
                : 0

        this.tail.time = bpmChanges.at(this.tailData.beat).time

        this.visualTime.max = this.tail.time

        if (options.hidden > 0)
            this.visualTime.hidden = this.tail.time - this.duration * options.hidden

        const a = -this.head.lane * lanes.angle
        const w = note.radius * options.noteSize

        new Vec(-w, 1).rotate(a).copyTo(this.connector.l)
        new Vec(w, 1).rotate(a).copyTo(this.connector.r)

        this.connector.z = getZ(layer.connector, this.head.time, this.head.lane)

        noteLayout(this.head.lane).copyTo(this.slide.layout)
        this.slide.z = getZ(layer.slide.body, this.head.time, this.head.lane)

        if (this.head.sim) this.sim.z = getZ(layer.slide.sim, this.head.time, this.head.lane)

        if (this.head.arrow) {
            arrowLayout(this.head.lane, this.head.arrow).copyTo(this.arrow.layout)
            this.arrow.z = getZ(layer.slide.body, this.head.time, this.head.lane)
        }
    }

    updateParallel() {
        if (this.isDead) {
            this.despawn = true
            return
        }

        if (this.shouldHoldEffect && !this.holdEffectInstanceId && this.isActive) {
            const layout = holdEffectLayout(this.head.lane)

            this.holdEffectInstanceId = particle.effects.spawn(effects.hold, layout, 0.6, true)
        }

        if (time.now < this.visualTime.min || time.now >= this.visualTime.max) return

        this.renderConnector()

        if (time.now < this.head.time) return

        this.renderSlide()
    }

    terminate() {
        if (this.shouldHoldEffect && this.holdEffectInstanceId)
            particle.effects.destroy(this.holdEffectInstanceId)
    }

    get headInfo() {
        return entityInfos.get(this.data.headRef)
    }

    get headData() {
        return archetypes.TapNote.data.get(this.data.headRef)
    }

    get headSingleData() {
        return archetypes.TapNote.singleData.get(this.data.headRef)
    }

    get headSwingData() {
        return archetypes.SwingNote.swingData.get(this.data.headRef)
    }

    get headSingleSharedMemory() {
        return archetypes.TapNote.singleSharedMemory.get(this.data.headRef)
    }

    get tailInfo() {
        return entityInfos.get(this.data.tailRef)
    }

    get tailData() {
        return archetypes.HoldNote.data.get(this.data.tailRef)
    }

    get useActiveSprite() {
        return skin.sprites.activeHold.exists
    }

    get shouldHoldEffect() {
        return options.noteEffectEnabled && particle.effects.exists(effects.hold)
    }

    get isActive() {
        if (options.autoplay) {
            return time.now >= this.head.time
        } else {
            return (
                this.headInfo.state === EntityState.Despawned &&
                this.headSingleSharedMemory.activatedTouchId
            )
        }
    }

    get isDead() {
        if (options.autoplay) {
            return time.now >= this.tail.time
        } else {
            return this.tailInfo.state === EntityState.Despawned
        }
    }

    renderConnector() {
        if (options.hidden > 0 && time.now > this.visualTime.hidden) return

        const hiddenDuration = options.hidden > 0 ? this.duration * options.hidden : 0

        const visibleTime = {
            min: Math.max(this.head.time, time.now + hiddenDuration),
            max: Math.min(this.tail.time, time.now + this.duration),
        }

        const s = {
            min: Math.unlerp(visibleTime.min - this.duration, visibleTime.min, time.now),
            max: Math.unlerp(visibleTime.max - this.duration, visibleTime.max, time.now),
        }

        const l = {
            min: this.connector.l.mul(s.min),
            max: this.connector.l.mul(s.max),
        }

        const r = {
            min: this.connector.r.mul(s.min),
            max: this.connector.r.mul(s.max),
        }

        const layout = new Quad({
            p1: l.min,
            p2: l.max,
            p3: r.max,
            p4: r.min,
        })

        if (this.useActiveSprite && this.isActive) {
            const a = Math.abs(Math.sin((time.now - this.head.time) * Math.PI * 2))

            skin.sprites.activeHold.draw(layout, this.connector.z, options.connectorAlpha * a)
        } else {
            skin.sprites.draw(sprites.connector, layout, this.connector.z, options.connectorAlpha)
        }
    }

    renderSlide() {
        skin.sprites.draw(sprites.head, this.slide.layout, this.slide.z, 1)

        if (this.head.sim) skin.sprites.draw(sprites.sim, this.slide.layout, this.sim.z, 1)

        if (this.head.arrow) skin.sprites.draw(sprites.arrow, this.arrow.layout, this.arrow.z, 1)
    }

    get duration() {
        return options.noteSpeed >= 6
            ? 1.6 - options.noteSpeed * 0.1
            : 1.9 - options.noteSpeed * 0.15
    }
}
