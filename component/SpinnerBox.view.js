import BaseComponent from "../base/Component.js"
import Routing from "../base/Routing.js"
import Tool from "../tool/Tool.js"
import Spinner from "./Spinner.view.js"


export default class SpinnerBox extends BaseComponent {
    _opts = {
        rootId: 'loading',
        maskId: null,
        contentId: null,
        mode: 1,
        maskOpacity: 0,
        text: 'Framework',
        colorSpin: '#FFFFFF',
        colorBox: 'rgba(56,56,56,0.5)',
        colorBoxLine: 'white',
        colorText: 'white',
        textWeight: 'bold', // normal
        isTouchCancel: true
    }

    spinner = null

    isshow = false

    constructor(opts) {
        super()

        this._opts = Tool.structureAssignment(this._opts, opts, true)

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        this.spinner = new Spinner({
            color: this._opts.colorSpin
        })

        let root = '<div id="' + this._opts.contentId + '_root">[con]</div>'
        let view = '<div id="' + this._opts.contentId + '_view"></div>'
        let text = '<div id="' + this._opts.contentId + '_text"></div>'

        $('#' + this._opts.contentId).html(root.replace('[con]', view + text))

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'box-sizing': 'border-box'
        })

        // 内容视图
        let con_w = $(window).width() / 3
        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'left': '50%',
            'top': '50%',
            'transform': 'translate(-50%,-50%)',
            'width': con_w,
            'height': con_w,
            'padding': '15px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'border-radius': '10px',
            'border': '1px solid ' + this._opts.colorBoxLine,
            'background': this._opts.colorBox,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId + '_root').css({
            'width': '100%',
            'height': 'auto',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        // 加载视图
        $('#' + this._opts.contentId + '_view').css({
            'width': 'auto',
            'height': 'auto',
            'box-sizing': 'border-box'
        })

        // 提示文字
        $('#' + this._opts.contentId + '_text').css({
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

        Tool.o(this._opts.maskId).onclick = (e) => {
            e.stopPropagation()

            if (this._opts.isTouchCancel) {
                this.close()
            }
        }

        Tool.o(this._opts.contentId).onclick = function (e) {
            e.stopPropagation()
        }
    }

    show(text) {
        if (this.isshow) {
            return
        }

        this._opts.text = text ? text : 'LOADING...'

        this.isshow = true

        $('#' + this._opts.rootId).css('z-index', Routing.changedZIndex())

        switch (this._opts.mode) {
            case 1: {
                $('#' + this._opts.contentId + '_text').css('display', 'block')

                $('#' + this._opts.contentId + '_text').html(this._opts.text)

                break
            }
            case 2: {
                $('#' + this._opts.contentId + '_text').css('display', 'none')

                $('#' + this._opts.contentId + '_text').html('')

                break
            }
            default: {
                $('#' + this._opts.contentId + '_text').css('display', 'block')

                $('#' + this._opts.contentId + '_text').html(this._opts.text)

                break
            }
        }

        this.spinner.spin(Tool.o(this._opts.contentId + '_view'))

        $('#' + this._opts.rootId).fadeIn(300, () => { })
    }

    close() {
        this.isshow = false

        $('#' + this._opts.rootId).fadeOut(300, () => {
            this.spinner.spin()
        })
    }
}
