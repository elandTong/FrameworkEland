import BaseComponent from '../base/Component.js';
import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';
import Activity from './Activity.view.js';

export default class TipsBox extends BaseComponent {
    _opts = {
        rootId: 'tipsBox',
        maskId: null,
        contentId: null,
        isTouchCancel: true,
        maskOpacity: 0,
        closeIcon: './pic/theme/close.png',
        top: {
            color: 'white',
            background: '#4169E1'
        },
        view: {
            color: 'black',
            background: 'white'
        },
        closeButton: true,
        cancelHandel: null // handle
    }

    _showopts = {
        title: 'TipsBox',
        name: null,
        getContent: null, // handle
        setStyle: null, // handle
    }

    _showopts_keep = {
        title: 'TipsBox',
        name: null,
        getContent: null, // handle
        setStyle: null, // handle
    }

    componentHandleOpts = {
        onCreate: () => {
        },
        onResume: () => {
        },
        onPause: () => {
            this.close()
        },
        onUpdate: () => {
        },
        onDestroy: () => {
        }
    }

    win_width = $(window).width()

    win_height = $(window).height()

    con_height = 200

    top_height = 45

    isshow = false

    activity = null

    constructor(opts) {
        super()

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.win_width = $(window).width()

        this.win_height = $(window).height()

        this.con_height = this.win_height / 3.8

        this.top_height = 45

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        let styleId = 'pages-tipsbox-content'

        let top = '<div class="' + styleId + '-top" id="' + this._opts.contentId + '_top">[con]</div>'

        let top_item = '<div class="' + this._opts.contentId + '_top_item_cas" id="' + this._opts.contentId + '_top_item_[id]">[icon]</div>'

        let top_text = '<div class="' + this._opts.contentId + '_top_text_cas" id="' + this._opts.contentId + '_top_text_title"></div>'

        let view = '<div class="' + styleId + '-view" id="' + this._opts.contentId + '_view"></div>'

        let icon = '<img class="' + this._opts.contentId + '_icon_cas" src=[src]></img>'

        let top_none = top_item.replace('[id]', 'none').replace('[icon]', '')

        let top_clos = top_item.replace('[id]', 'clos').replace('[icon]', icon.replace('[src]', this._opts.closeIcon))

        $('#' + this._opts.contentId).html(top.replace('[con]', top_none + top_text + top_clos) + view)

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': this.win_width,
            'height': this.win_height,
            'display': 'none',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'bottom': -(this.con_height + this.top_height),
            'left': 0,
            'z-index': 10,
            'width': '100%',
            'height': 'fit-content',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId + '_top').css({
            'width': '100%',
            'height': this.top_height,
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            'background': this._opts.top.background,
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.contentId + '_top_item_cas').css({
            'width': this.top_height,
            'height': this.top_height,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.contentId + '_top_text_cas').css({
            'width': this.win_width - (this.top_height * 2),
            'height': this.top_height,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'font-size': '16px',
            'color': this._opts.top.color,
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.contentId + '_icon_cas').css({
            'width': this.top_height * 0.65,
            'height': this.top_height * 0.65,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId + '_view').css({
            'width': '100%',
            'height': this.con_height,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'background': this._opts.view.background,
            'font-size': '16px',
            'color': this._opts.view.color,
            'box-sizing': 'border-box'
        })

        AppTool.setBtnOnTouchEventForScale($('#' + this._opts.contentId + '_top_item_clos'), 0.95, 1.0, (obj) => {
            if (this._opts.closeButton) {
                this.close()
            }
        }, null, true)

        AppTool.o(this._opts.maskId).onclick = (e) => {
            e.stopPropagation()

            if (this._opts.isTouchCancel) {
                this.close()
            }
        }

        AppTool.o(this._opts.contentId).onclick = (e) => {
            e.stopPropagation()
        }

        // HIDE BUTTON
        if (this._opts.closeButton) {
            $('#' + this._opts.contentId + '_top_item_clos').css('visibility', 'visible')
        } else {
            $('#' + this._opts.contentId + '_top_item_clos').css('visibility', 'hidden')
        }
    }

    show(act, showopts) {
        if (this.isshow || act == null || !(act instanceof Activity) || act.isresume == false) {
            return
        }

        this.activity = act

        this._showopts = AppTool.structureAssignment(Object.assign({}, this._showopts_keep), showopts, true)

        if (this.activity && this.activity.pushComponentHandle) {
            this.activity.pushComponentHandle(this.componentHandleOpts)
        }

        this.isshow = true

        $('#' + this._opts.rootId).css('z-index', routing.changedZIndex())

        $('#' + this._opts.rootId).fadeIn(100, () => {
            $('#' + this._opts.contentId).transition({
                bottom: 0
            }, 'fast')
        })

        $('#' + this._opts.contentId + '_top_text_title').html(this._showopts.title)

        if (this._showopts.name) {
            AppTool.LoadHTML({
                link: this._showopts.name,
                conId: this._opts.contentId + '_view',
                succHandle: () => {
                },
                errHandle: () => {
                    $('#' + this._opts.contentId + '_view').html('LOAD HTML ERROR!')
                },
                renum: 3,
                color: this._opts.top.background
            })
        } else {
            if (this._showopts.getContent) {
                $('#' + this._opts.contentId + '_view').html(this._showopts.getContent())
            }

            if (this._showopts.setStyle) {
                this._showopts.setStyle()
            }
        }
    }

    close() {
        if (this.activity && this.activity.removeComponentHandle) {
            this.activity.removeComponentHandle(this.componentHandleOpts)
        }

        this.activity = null

        $('#' + this._opts.contentId).transition({
            bottom: -(this.con_height + this.top_height)
        }, 'slow', () => {
            $('#' + this._opts.rootId).fadeOut(100, () => {
                this.isshow = false

                if (this._opts.cancelHandel) {
                    this._opts.cancelHandel()
                }
            })
        })
    }

    update(opts) {
        if (opts == null) {
            return
        }

        this._opts.closeButton = opts.closeButton != null ? opts.closeButton : this._opts.closeButton

        if (this._opts.closeButton) {
            $('#' + this._opts.contentId + '_top_item_clos').css('visibility', 'visible')
        } else {
            $('#' + this._opts.contentId + '_top_item_clos').css('visibility', 'hidden')
        }
    }
}
