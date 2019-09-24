import AppTool from '../tool/AppTool.js'
import routing from '../base/Routing.js/index.js'
import BaseComponent from '../base/AppComponent.js'

export default class SpinnerView extends BaseComponent {
    _opts = {
        rootId: 'loading',
        maskOpacity: 0,
        colorSpin: '#FFFFFF',
        colorBox: 'rgba(56,56,56,0.5)',
        colorBoxLine: 'white',
        colorText: 'white',
        textWeight: 'bold', // normal
        isTouchCancel: true
    }

    _showopts = {
        mode: 1,
        text: 'Framework',
        tag: null
    }

    spinner = null

    isshow = false

    constructor(opts) {
        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.spinner = new Spinner({
            color: this._opts.colorSpin
        })

        let root = '<div id="' + this._opts.rootId + '_content_root">[con]</div>'
        let view = '<div id="' + this._opts.rootId + '_content_view"></div>'
        let text = '<div id="' + this._opts.rootId + '_content_text"></div>'
        root = root.replace('[con]', view + text)
        $('#' + this._opts.rootId + '_content').html(root)

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'left': '0px',
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        // 内容视图
        let con_w = $(window).width() / 3
        $('#' + this._opts.rootId + '_content').css({
            'width': con_w,
            'height': con_w,
            'padding': '15px',
            'margin-top': ($(window).height() - con_w) / 2,
            'margin-left': ($(window).width() - con_w) / 2,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'border-radius': '10px',
            'border': '1px solid ' + this._opts.colorBoxLine,
            'background': this._opts.colorBox,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_content_root').css({
            'width': '100%',
            'height': 'auto',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        // 加载视图
        $('#' + this._opts.rootId + '_content_view').css({
            'width': 'auto',
            'height': 'auto',
            'box-sizing': 'border-box'
        })

        // 提示文字
        $('#' + this._opts.rootId + '_content_text').css({
            'width': 'auto',
            'height': 'auto',
            'max-width': '100%',
            'word-wrap': 'break-word',
            'word-break': 'break-all',
            'font-size': '16px',
            'font-weight': this._opts.textWeight,
            'color': this._opts.colorText,
            'margin-top': '20px',
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId).click((event) => {
            event.stopPropagation()

            if (this._opts.isTouchCancel) {
                this._close()
            }
        })
    }

    show(showopts) {
        if (this.isshow) {
            return
        }

        this.isshow = true

        this._showopts = AppTool.structureAssignment(this._showopts, showopts, true)

        $('#' + this._opts.rootId).css({
            'z-index': ++routing.currentZIndex
        })

        $('#' + this._opts.rootId).fadeIn(500)

        switch (this._showopts.mode) {
            case 1: {
                $('#' + this._opts.rootId + '_content_text').css({
                    'display': 'block'
                })

                if (this._showopts.text == '') {
                    this._showopts.text = 'Framework'
                }

                $('#' + this._opts.rootId + '_content_text').html(this._showopts.text)

                break
            }
            case 2: {
                $('#' + this._opts.rootId + '_content_text').css({
                    'display': 'none'
                })

                $('#' + this._opts.rootId + '_content_text').html('')

                break
            }
            default: {
                $('#' + this._opts.rootId + '_content_text').css({
                    'display': 'block'
                })

                if (this._showopts.text == '') {
                    this._showopts.text = 'Framework'
                }

                $('#' + this._opts.rootId + '_content_text').html(this._showopts.text)

                break
            }
        }

        this.spinner.spin(AppTool.o(this._opts.rootId + '_content_view'))
    }

    close(tag) {
        if (this._showopts.tag == null) {
            this._close()
        } else if (this._showopts.tag == tag) {
            this._close()
        }
    }

    _close() { // 私有
        this._showopts.tag = null

        this.isshow = false

        this.spinner.spin()

        $('#' + this._opts.rootId).fadeOut(500)
    }
}
