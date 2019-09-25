import BaseComponent from '../base/Component.js'
import routing from '../base/Routing.js'
import AppTool from '../tool/Tool.js'

export default class Toast extends BaseComponent {
    _opts = {
        rootId: 'toast',
        maskId: null,
        contentId: null,
        maskOpacity: 0,
        position: 'bottom', // top bottom center
        autoCancel: true,
        autoCancelLength: 'short', // short long
        isTouchCancel: true,
        colorText: '#cccccc',
        colorBox: '#383838',
        fontSize: '16px'
    }

    toast = null // dom 对象

    cancelTimeout = null

    constructor(opts) {
        super()

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._opts.autoCancelLength = this._opts.autoCancelLength == 'long' ? 'long' : 'short'

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        this.toast = $('#' + this._opts.rootId)

        this.toast.css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'z-index': -1,
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'width': 'fit-content',
            'height': 'fit-content',
            'max-width': '90%',
            'line-height': '120%',
            'padding': '10px',
            'border-radius': '10px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            'background': this._opts.colorBox,
            'font-size': this._opts.fontSize,
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })

        let offset = 25

        switch (this._opts.position) {
            case 'top': {
                $('#' + this._opts.contentId).css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': offset,
                    'transform': 'translate(-50%,0)'
                })
                break
            }
            case 'bottom': {
                $('#' + this._opts.contentId).css({
                    'position': 'absolute',
                    'left': '50%',
                    'bottom': offset,
                    'transform': 'translate(-50%,0)'
                })
                break
            }
            case 'center': {
                $('#' + this._opts.contentId).css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })
                break
            }
            default: {
                $('#' + this._opts.rootId + '_content').css({
                    'position': 'absolute',
                    'left': '50%',
                    'bottom': offset,
                    'transform': 'translate(-50%,0)'
                })
                break
            }
        }

        AppTool.o(this._opts.maskId).onclick = (e) => {
            e.stopPropagation()

            if (this._opts.isTouchCancel) {
                this.close()
            }
        }

        AppTool.o(this._opts.contentId).onclick = function (e) {
            e.stopPropagation()
        }
    }

    show(text) {
        this.toast.css('z-index', routing.changedZIndex())

        $('#' + this._opts.contentId).html(text)

        this.toast.fadeIn(300, () => {
            let times

            if (this._opts.autoCancelLength == 'short') {
                times = 1000
            } else {
                times = 3000
            }

            this.cancelTimeout = setTimeout(() => {
                this.close()
            }, times)
        })
    }

    close() {
        clearTimeout(this.cancelTimeout)

        this.toast.fadeOut(300, () => { })
    }
}
