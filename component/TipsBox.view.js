import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';
import BaseComponent from '../base/Component.js';

export default class TipsBox extends BaseComponent {
    _opts = {
        rootId: 'msgBox',
        topColor: '#cca352',
        topColorDK: '#cca352',
        contentColor: 'white',
        textColor: 'black'
    }

    _showopts = {
        title: '',
        contentH: '200px',
        isHideBackBtn: false,
        isTouchOtherClose: true,
        getContent: null, // handle
        setStyle: null, // handle
        backHandel: null // handle
    }

    window_w

    window_h

    constructor(opts) {
        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.window_w = $(window).width()

        this.window_h = $(window).height()

        this._init()
    }

    _init() { // 内部方法
        let top = '<div class="pages-msgbox-content-top" id="msgBox_content_top">[con]</div>'

        let top_back = '<div class="pages-msgbox-content-top-back" id="msgBox_content_top_back">[con]</div>'

        let top_back_img = '<img src="./pic/theme/back.png" style="height: 15px"/>'

        top_back = top_back.replace('[con]', top_back_img)

        let top_text = '<div class="pages-msgbox-content-top-text" id="msgBox_content_top_text">text</div>'

        let top_line = '<div style="width: 45px"></div>'

        top = top.replace('[con]', top_back + top_text + top_line)

        let view = '<div class="pages-msgbox-content-view" id="msgBox_content_view"></div>'

        $('#' + this._opts.rootId + '_content').html(top + view)

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'width': this.window_w,
            'height': this.window_h,
            'display': 'none',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_content').css({
            'width': this.window_w,
            'height': 'auto',
            'y': this.window_h,
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_content_top').css({
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            'width': '100%',
            'height': '45px',
            'background': this._opts.topColor,
            'font-size': '16px',
            'color': this._opts.textColor
        })

        $('#' + this._opts.rootId + '_content_top_back').css({
            'width': '45px',
            'height': '45px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        })

        $('#' + this._opts.rootId + '_content_top_text').css({
            'height': '45px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        })

        $('#' + this._opts.rootId + '_content_view').css({
            'width': '100%',
            'height': '200px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'background': this._opts.contentColor,
            'font-size': '14px',
            'color': this._opts.textColor
        })

        AppTool.setBtnOnTouchEvent($('#' + this._opts.rootId + '_content_top_back'), (obj) => {
            if (this._showopts.backHandel) {
                this._showopts.backHandel()
            }

            this.close()
        }, this._opts.topColorDK, '', null)

        $('#' + this._opts.rootId).click(() => {
            if (this._showopts.isTouchOtherClose) {
                this.close()
            }
        })

        $('#' + this._opts.rootId + '_content_view').click((event) => { })

        $('#' + this._opts.rootId + '_content_top').click((event) => { })

        $('#' + this._opts.rootId + '_content_view').on('click', (event) => {
            event.stopPropagation()
        })

        $('#' + this._opts.rootId + '_content_top').on('click', (event) => {
            event.stopPropagation()
        })
    }

    show(showopts) {
        this._showopts = AppTool.structureAssignment(this._showopts, showopts, true)

        $('#' + this._opts.rootId).css({
            'display': 'block',
            'z-index': routing.changedZIndex()
        })

        if (this._showopts.isHideBackBtn) {
            $('#' + this._opts.rootId + '_content_top_back').css({
                'visibility': 'hidden'
            })
        } else {
            $('#' + this._opts.rootId + '_content_top_back').css({
                'visibility': 'visible'
            })
        }

        $('#' + this._opts.rootId + '_content_view').css({
            'height': this._showopts.contentH
        })

        $('#' + this._opts.rootId + '_content').transition({
            y: this.window_h - (Number(this._showopts.contentH.replace('px', '')) + 45)
        }, 'fast')

        $('#' + this._opts.rootId + '_content_top_text').html(this._showopts.title)

        if (this._showopts.getContent) {
            $('#' + this._opts.rootId + '_content_view').html(this._showopts.getContent())
        }

        if (this._showopts.setStyle) {
            this._showopts.setStyle()
        }
    }

    close() {
        $('#' + this._opts.rootId + '_content').transition({
            y: this.window_h
        }, 'slow', () => {
            $('#' + this._opts.rootId).css({
                'display': 'none'
            })
        })
    }
}
