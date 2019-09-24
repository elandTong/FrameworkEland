import AppTool from '../tool/AppTool.js'
import BaseComponent from '../base/AppComponent.js'

/**
 *v1.0.1 拖拽部件
 *过于频繁的拖拽会影响性能
 */
export default class AppSlideview extends BaseComponent {
    initX
    initY

    dragable = false

    wrapTop
    wrapLeft

    wrapWidth
    wrapHeight

    _opts = {
        wrapId: '',
        touchColor: '',
        handle: null
    }

    constructor(opts) {
        if (opts == null || opts.wrapId == null) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.wrapTop = this.getCssFormTop()

        this.wrapLeft = this.getCssFormLeft()

        this.wrapWidth = this.getCssFormW()

        this.wrapHeight = this.getCssFormH()

        AppTool.o(this._opts.wrapId).addEventListener('touchstart', this.touchstartHandel, false)

        document.addEventListener('touchmove', this.touchmoveHandel)

        AppTool.o(this._opts.wrapId).addEventListener('touchend', this.touchendHandel, false)

        AppTool.setBtnOnTouchEvent($('#' + this._opts.wrapId), (obj) => {
            if (this._opts.handle != null) {
                this._opts.handle()
            }
        }, this._opts.touchColor)
    }

    removeEvent() {
        document.removeEventListener("touchmove", this.touchmoveHandel)
        AppTool.o(this._opts.wrapId).removeEventListener("touchstart", this.touchstartHandel, false)
        AppTool.o(this._opts.wrapId).removeEventListener("touchend", this.touchendHandel, false)
    }

    getCssFormTop() {
        let t = AppTool.o(this._opts.wrapId).style.top
        t = t.replace('px', '')
        return Number(t)
    }

    getCssFormLeft() {
        let l = AppTool.o(this._opts.wrapId).style.left
        l = l.replace('px', '')
        return Number(l)
    }

    getCssFormW() {
        let w = AppTool.o(this._opts.wrapId).style.width
        w = w.replace('px', '')
        return Number(w)
    }

    getCssFormH() {
        let h = AppTool.o(this._opts.wrapId).style.height
        h = h.replace('px', '')
        return Number(h)
    }

    setCssFormTop(t) {
        AppTool.o(this._opts.wrapId).style.top = t + 'px'
    }

    setCssFormLeft(l) {
        AppTool.o(this._opts.wrapId).style.left = l + 'px'
    }

    touchstartHandel(event) {
        this.dragable = true

        let touches = event.touches[0]

        let position = {
            X: touches.pageX,
            Y: touches.pageY
        }

        this.initX = position.X
        this.initY = position.Y
    }

    touchmoveHandel(event) {
        requestAnimationFrame(() => {
            let touches = event.touches[0]

            let position = {
                X: touches.pageX,
                Y: touches.pageY
            }

            if (this.dragable && !this.isOutscreen(position)) {
                let nowX = position.X
                let nowY = position.Y
                let disX = nowX - this.initX
                let disY = nowY - this.initY
                this.setCssFormTop(this.wrapTop + disY)
                this.setCssFormLeft(this.wrapLeft + disX)
            }
        })
    }

    touchendHandel(event) {
        this.dragable = false
        this.wrapTop = this.getCssFormTop()
        this.wrapLeft = this.getCssFormLeft()
    }

    isOutscreen(position) {
        let x = position.X
        let y = position.Y
        if ((x + this.wrapWidth / 2) >= $(window).width() || (x < this.wrapWidth / 2)) {
            return true
        }
        if ((y + this.wrapHeight / 2) >= $(window).height() || y < (this.wrapHeight / 2)) {
            return true
        }
        return false
    }
}
