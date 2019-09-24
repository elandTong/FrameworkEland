import routing from '../base/Routing.js'
import AppTool from '../tool/Tool.js'
import BaseComponent from '../base/Component.js'

export default class Toast extends BaseComponent {
    _opts = {
        rootId: 'toast',
        maskOpacity: 0,
        colorText: '#cccccc',
        colorBox: '#383838',
        fontSize: '16px'
    }

    toast // dom 对象

    constructor(opts) {
        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.toast = $('#' + this._opts.rootId)

        this.toast.css({
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'z-index': -1,
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')'
        })

        $('#' + this._opts.rootId + '_content').css({
            'width': 'auto',
            'height': 'auto',
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
            'color': this._opts.colorText
        })

        this.toast.click((event) => {
            event.stopPropagation()

            this.close()
        })
    }

    show(msg) {
        this.toast.css({
            'z-index': routing.changedZIndex()
        })

        $('#' + this._opts.rootId + '_content').html(msg)

        this.toast.fadeIn(500)
    }

    close() {
        this.toast.fadeOut(500)
    }
}
