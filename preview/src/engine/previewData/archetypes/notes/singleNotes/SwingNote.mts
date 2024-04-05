import { SwingDirection } from '../../../../../../../shared/src/engine/data/SwingDirection.mjs'
import { options } from '../../../../configuration/options.mjs'
import { layer, sprites } from '../../../skin.mjs'
import { SingleNote } from './SingleNote.mjs'

export class SwingNote extends SingleNote {
    swingImport = this.defineImport({
        direction: { name: 'direction', type: DataType<SwingDirection> },
    })

    preprocess() {
        super.preprocess()

        if (options.mirror) this.swingImport.direction *= -1
    }

    render() {
        super.render()

        switch (this.swingImport.direction) {
            case SwingDirection.Left:
                this.renderSprite(sprites.arrow, layer.note.arrow, 'left')
                break
            case SwingDirection.Right:
                this.renderSprite(sprites.arrow, layer.note.arrow, 'right')
                break
        }
    }
}
