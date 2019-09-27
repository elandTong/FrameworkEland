import BaseComponent from '../base/Component.js';
import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';

/**
 * 核心组件
 * 视图组织
 * by eland.Tong
 */
class Toolbar {
    // button opts
    _button_opts = {
        level: 1,
        id: null,
        icon: '',
        text: '按钮',
        iskeep: false,
        touchHandle: null
    }

    // keep button opts
    _button_keep_opts = {
        level: 1,
        id: null,
        icon: '',
        text: '按钮',
        iskeep: false,
        touchHandle: null
    }

    // init opts
    _opts = {
        activity: null,
        topId: null,
        keepId: null,
        customizeId: null,
        topH: 50,
        finish: {
            active: true,
            id: null,
            icon: './pic/theme/back.png',
            iconId: null,
            touchHandle: null
        },
        drawer: {
            active: false,
            id: null,
            icon: './pic/theme/menu.png',
            iconId: null,
            type: 'right', // left right
            touchHandle: null
        },
        logo: {
            active: false,
            id: null,
            icon: null,
            iconId: null,
            touchHandle: null
        },
        title: {
            active: true,
            id: null,
            text: 'FrameworkEland',
            textId: null,
            touchHandle: null
        },
        font: {
            color: 'black',
            style: 'normal',
            weight: 'normal',
        },
        shadow: {
            color: '#000',
            length: 2
        },
        buttons: [],
        background: 'white'
    }

    icon_width_offset = 0.45

    button_width_offset = 0.35

    font_width_offset = 0.32

    constructor(opts) { // 构造器
        if (opts == null || opts.topId == null) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._opts.drawer.type = this._opts.drawer.type == 'left' ? 'left' : 'right'

        if (this._opts.topH < 50) {
            this._opts.topH = 50
        }

        if (this._opts.topH > 60) {
            this._opts.topH = 60
        }

        this._opts.keepId = this._opts.topId + '_keep'
        this._opts.customizeId = this._opts.topId + '_customize'

        this._opts.finish.id = this._opts.keepId + '_finish'
        this._opts.finish.iconId = this._opts.topId + '_icon_button_finish'

        this._opts.drawer.id = this._opts.keepId + '_drawermenu'
        this._opts.drawer.iconId = this._opts.topId + '_icon_button_drawermenu'

        this._opts.logo.id = this._opts.keepId + '_logo'
        this._opts.logo.iconId = this._opts.topId + '_icon_logo'

        this._opts.title.id = this._opts.keepId + '_title'
        this._opts.title.textId = this._opts.topId + '_text_title'

        this.keep_zone = '<div id="' + this._opts.keepId + '"></div>'

        this.customize_zone = '<div id="' + this._opts.customizeId + '"></div>'

        this.item_root = '<div class="' + this._opts.topId + '_item_cas" id="[id]">[con]</div>'

        this.icon_root = '<img class="' + this._opts.topId + '_icon_cas" id="[id]"></img>'

        this.icon_button_root = '<img class="' + this._opts.topId + '_icon_button_cas" id="[id]"></img>'

        this.text_root = '<div class="' + this._opts.topId + '_text_cas" id="[id]"></div>'

        $('#' + this._opts.topId).html(this.keep_zone + this.customize_zone)

        // root view style
        $('#' + this._opts.topId).css({
            'width': $(window).width(),
            'height': this._opts.topH,
            'background': this._opts.background,
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            'box-shadow': '0px 0px ' + this._opts.shadow.length + 'px 0px ' + this._opts.shadow.color,
            'box-sizing': 'border-box'
        })

        // keep zone view style
        $('#' + this._opts.keepId).css({
            'width': 'fit-content',
            'max-width': '50%',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'padding': '0px 10px 0px 10px',
            'box-sizing': 'border-box'
        })

        // customize zone view style
        $('#' + this._opts.customizeId).css({
            'width': 'fit-content',
            'max-width': '50%',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'flex-end',
            'align-items': 'center',
            'padding': '0px 10px 0px 10px',
            'box-sizing': 'border-box'
        })

        this._bindKeepZone()

        this._bindCustomizeZone()

        this._update()
    }

    _update() { // 更新配置项
        // item root view style
        $('.' + this._opts.topId + '_item_cas').css({
            'width': 'fit-content',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'padding': '0px 10px 0px 10px',
            'box-sizing': 'border-box'
        })

        let icon_h = this._opts.topH * this.icon_width_offset

        // item icon view style
        $('.' + this._opts.topId + '_icon_cas').css({
            'width': 'auto',
            'max-width': icon_h * 3,
            'height': icon_h,

            'box-sizing': 'border-box'
        })

        let icon_button_h = this._opts.topH * this.button_width_offset

        // item button view style
        $('.' + this._opts.topId + '_icon_button_cas').css({
            'width': 'auto',
            'max-width': icon_button_h * 2,
            'height': icon_button_h,

            'box-sizing': 'border-box'
        })

        let font_size = this._opts.topH * this.font_width_offset

        // item text view style
        $('.' + this._opts.topId + '_text_cas').css({
            'width': 'fit-content',
            'height': 'fit-content',

            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',

            'font-size': font_size + 'px',
            'font-style': this._opts.font.style,
            'font-weight': this._opts.font.weight,
            'color': this._opts.font.color,

            'box-sizing': 'border-box'
        })

        this.setTitle(this._opts.title.text)

        if (this._opts.finish.active) {
            this.showFinish()
        } else {
            this.hideFinish()
        }

        if (this._opts.logo.active) {
            this.showLogo()
        } else {
            this.hideLogo()
        }

        if (this._opts.drawer.active) {
            this.showDrawerMenu()
        } else {
            this.hideDrawerMenu()
        }

        if (this._opts.title.active) {
            this.showTitle()
        } else {
            this.hideTitle()
        }

        let self = this

        // 保留区 操作项事件绑定
        $('.' + this._opts.topId + '_item_cas').each(function () {
            let id = this.id

            let id_list = id.split('_')

            let id_len = id_list.length

            let type = id_list[id_len - 1]

            let zone = id_list[id_len - 2]

            if (zone == 'keep') {
                switch (type) {
                    case 'finish': {
                        if (self._opts.finish.touchHandle) {
                            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (e) => {
                                self._opts.finish.touchHandle()
                            }, null, true)
                        }
                        break
                    }
                    case 'drawermenu': {
                        if (self._opts.drawer.touchHandle) {
                            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (e) => {
                                self._opts.drawer.touchHandle()
                            }, null, true)
                        }
                        break
                    }
                    case 'logo': {
                        if (self._opts.logo.touchHandle) {
                            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (e) => {
                                self._opts.logo.touchHandle()
                            }, null, true)
                        }
                        break
                    }
                    case 'title': {
                        if (self._opts.title.touchHandle) {
                            AppTool.setBtnOnTouchEventForScale($(this), 0.9, 1.0, (e) => {
                                self._opts.title.touchHandle()
                            }, null, true)
                        }
                        break
                    }
                }
            }
        })

        // 自定义区 操作项事件绑定
        for (let i = 0; i < this._opts.buttons.length; i++) {
            let item = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            let _id = this._opts.customizeId + '_' + item.id

            if (item.touchHandle) {
                AppTool.setBtnOnTouchEventForScale($('#' + _id), 0.9, 1.0, (e) => {
                    item.touchHandle()
                }, null, true)
            }
        }
    }

    _bindKeepZone() { // 保留区 VIEW 绑定
        // finish button
        let button_finish = this.item_root.replace('[id]', this._opts.finish.id)
            .replace('[con]', this.icon_button_root.replace('[id]', this._opts.finish.iconId))

        // drawermenu button
        let button_drawermenu = this.item_root.replace('[id]', this._opts.drawer.id)
            .replace('[con]', this.icon_button_root.replace('[id]', this._opts.drawer.iconId))

        // logo icon
        let icon_logo = this.item_root.replace('[id]', this._opts.logo.id)
            .replace('[con]', this.icon_root.replace('[id]', this._opts.logo.iconId))

        // title text
        let text_title = this.item_root.replace('[id]', this._opts.title.id)
            .replace('[con]', this.text_root.replace('[id]', this._opts.title.textId))

        $('#' + this._opts.keepId).html(button_finish + button_drawermenu + icon_logo + text_title)
    }

    _bindCustomizeZone() { // 自定义区 VIEW 绑定
        let new_buttons = [] // 过滤后的项

        // 过滤无效按钮对象
        for (let i = 0; i < this._opts.buttons.length; i++) {
            this._button_opts = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            if (this._button_opts.id == null || this._button_opts.iskeep) { // 如果有 drawermenu 保留属性则不 push 到新数组
                continue
            }

            if (this._button_opts.text) {
                this._button_opts.text = this._button_opts.text.substr(0, 4)
            }

            new_buttons.push(Object.assign({}, this._button_opts))
        }

        let _sort = () => {
            return (m, n) => {
                return m.level - n.level
            }
        }

        new_buttons.sort(_sort())

        this._opts.buttons = new_buttons

        this._opts.buttons.push({
            level: Number.MAX_SAFE_INTEGER,
            id: 'drawermenu',
            icon: this._opts.drawer.icon,
            text: 'menu',
            iskeep: true,
            touchHandle: this._opts.drawer.touchHandle
        })

        for (let i = 0; i < this._opts.buttons.length; i++) {
            this._button_opts = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            let _id = this._opts.customizeId + '_' + this._button_opts.id

            if (this._button_opts.icon) { // 图标按钮
                let view = this.item_root.replace('[id]', _id).replace('[con]', this.icon_button_root.replace('[id]', _id + '_icon'))

                $('#' + this._opts.customizeId).append(view)

                $('#' + _id + '_icon').attr('src', this._button_opts.icon)
            } else if (this._button_opts.text) { // 文字按钮
                let view = this.item_root.replace('[id]', _id).replace('[con]', this.text_root.replace('[id]', _id + '_text'))

                $('#' + this._opts.customizeId).append(view)

                $('#' + _id + '_text').html(this._button_opts.text)
            }
        }

        console.log('app comp act toolbar for buttons sort', new_buttons)
    }

    // 用户处理器
    pushCustomizeItem(opts) { // 推送自定义 VIEW 项
        if (opts == null || opts.id == null) {
            return
        }

        this._opts.buttons.push(AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), opts))

        this._bindCustomizeZone()

        this._update()
    }

    show() {
        $('#' + this._opts.topId).css('display', 'flex')

        if (this._opts.activity) {
            this._opts.activity.onShowToolbar()
        }
    }

    hide() {
        $('#' + this._opts.topId).css('display', 'none')

        if (this._opts.activity) {
            this._opts.activity.onHideToolbar()
        }
    }

    showFinish() {
        $('#' + this._opts.finish.iconId).attr('src', this._opts.finish.icon)

        $('#' + this._opts.finish.id).css('display', 'flex')
    }

    hideFinish() {
        $('#' + this._opts.finish.id).css('display', 'none')
    }

    showDrawerMenu() {
        let last = this._opts.buttons[this._opts.buttons.length - 1] // 最后一个为 drawermenu 项

        let last_id = this._opts.customizeId + '_' + last.id

        if (this._opts.drawer.type == 'left') {
            $('#' + this._opts.drawer.iconId).attr('src', this._opts.drawer.icon)

            $('#' + this._opts.drawer.id).css('display', 'flex')

            $('#' + last_id).css('display', 'none')
        } else {
            $('#' + this._opts.drawer.id).css('display', 'none')

            $('#' + last_id).css('display', 'flex')
        }

        this._opts.drawer.active = true
    }

    hideDrawerMenu() {
        let last = this._opts.buttons[this._opts.buttons.length - 1] // 最后一个为 drawermenu 项

        let last_id = this._opts.customizeId + '_' + last.id

        $('#' + this._opts.drawer.id).css('display', 'none')

        $('#' + last_id).css('display', 'none')

        this._opts.drawer.active = false
    }

    showLogo() {
        if (this._opts.logo.icon == null) {
            this.hideLogo()

            return
        }

        $('#' + this._opts.logo.iconId).attr('src', this._opts.logo.icon)

        $('#' + this._opts.logo.id).css('display', 'block')

        this._opts.logo.active = true
    }

    hideLogo() {
        $('#' + this._opts.logo.id).css('display', 'none')

        this._opts.logo.active = false
    }

    showTitle() {
        $('#' + this._opts.title.textId).html(this._opts.title.text)

        $('#' + this._opts.title.id).css('display', 'block')

        this._opts.title.active = true
    }

    hideTitle() {
        $('#' + this._opts.title.id).css('display', 'none')

        this._opts.title.active = false
    }

    setTitle(text) {
        if (text == null || text == '') {
            return
        }

        this._opts.title.text = text

        $('#' + this._opts.title.textId).html(this._opts.title.text)
    }

    showCustomizeForId(id) {
        if (id == null || id == '') {
            return
        }

        $('#' + this._opts.customizeId + '_' + id).css('display', 'flex')
    }

    hideCustomizeForId(id) {
        if (id == null || id == '') {
            return
        }

        $('#' + this._opts.customizeId + '_' + id).css('display', 'none')
    }
}

class Activity extends BaseComponent {
    _opts = { // 配置对象
        rootId: '',
        isMainAct: false,
        content: {
            name: null,
            getContent: function () {
                return null
            },
            setStyle: function () {
            },
            initHandle: function (succ) {
            }
        },
        toolbar: { // 操作栏配置
            activity: null,
            topH: 50,
            finish: {
                active: true,
                icon: './pic/theme/back.png',
                touchHandle: null
            },
            drawer: { // 该项由 act 配置
                active: false,
                icon: './pic/theme/menu.png',
                type: 'right', // left right
                touchHandle: null
            },
            logo: {
                active: false,
                icon: null,
                touchHandle: null
            },
            title: {
                active: true,
                text: 'FrameworkEland',
                align: 'left',
                touchHandle: null
            },
            font: {
                color: 'black',
                style: 'normal',
                weight: 'normal',
            },
            shadow: {
                color: '#000',
                length: 2
            },
            buttons: [],
            background: 'white'
        },
        drawer: { // 抽屉菜单配置
            active: true,
            icon: './pic/theme/menu.png',
            type: 'right', // left right
            background: 'white',
            widthscale: 0.75,
            name: null,
            getContent: function () {
                return null
            },
            setStyle: function () {
            },
            initHandle: function (succ) {
            },
            changedHandle(isopen) {
            }
        },
        preloading: { // 预加载配置
            color: 'black'
        },
        background: 'white',
        finishTopHandle: function () {
        },
        resumeHandle: function () {
        },
        pauseHandle: function () {
        },
        initHandle: function () {
        }
    }

    componentHandleOpts = {
        onCreate: null,
        onResume: null,
        onPause: null,
        onUpdate: null,
        onDestroy: null
    }

    componentHandles = []

    window_w = $(window).width()
    window_h = $(window).height()

    toolbar = null // toolbar

    page = null // act dom
    page_root = null // act root dom
    page_top = null // act top dom
    page_content = null // act content dom
    page_drawe = null
    page_drawe_menu = null

    isshow = false // act 是否显示
    isresume = false

    constructor(opts) { // act 构造器
        super()

        if (opts == null || opts.rootId == null) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        if (!AppTool.o(this._opts.rootId)) {
            AppTool.addPageToHtml('app', this._opts.rootId)

            console.log('act div not exist and so addPageToHtml')
        }

        // 检查主 ACT 是否已挂载
        if (routing.isMainActMount == true) { // main act 已挂载
            this._opts.isMainAct = false // 已挂载 main act 则不能再设置 main act
        } else { // main act 未挂载
            if (this._opts.isMainAct == true) {
                routing.isMainActMount = true
            }
        }

        if (this._opts.toolbar.topH < 50) {
            this._opts.toolbar.topH = 50
        }

        if (this._opts.toolbar.topH > 60) {
            this._opts.toolbar.topH = 60
        }

        // 配置检查
        this._opts.drawer.type = this._opts.drawer.type == 'left' ? 'left' : 'right'

        if (this._opts.drawer.widthscale > 0.8) {
            this._opts.drawer.widthscale = 0.8
        } else if (this._opts.drawer.widthscale < 0.2) {
            this._opts.drawer.widthscale = 0.2
        }

        console.log('activity structureAssignment opts', this._opts)

        this.page = $('#' + this._opts.rootId)

        this.page_root = $('#' + this._opts.rootId + '_root')

        this.page_top = $('#' + this._opts.rootId + '_top')

        this.page_content = $('#' + this._opts.rootId + '_content')

        this.page_drawe = $('#' + this._opts.rootId + '_drawe')

        this.page_drawe_menu = $('#' + this._opts.rootId + '_drawe_menu')

        let _left = this.window_w

        if (this._opts.isMainAct == true) { // 主 act
            _left = 0
        }

        this.page.css({
            'position': 'absolute',
            'top': 0,
            'left': _left,
            'width': this.window_w,
            'height': this.window_h,
            'display': 'none'
        })

        this.page_root.css({
            'position': 'relative',
            'width': this.window_w,
            'height': this.window_h
        })

        this.page_top.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 9
        })

        this.page_content.css({
            'position': 'absolute',
            'top': this._opts.toolbar.topH,
            'left': 0,
            'z-index': 8,
            'width': this.window_w,
            'height': this.window_h - this._opts.toolbar.topH,
            'background': this._opts.background
        })

        this.page_drawe.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': this.window_w,
            'height': this.window_h,
            'z-index': 10,
            'background': 'rgba(0,0,0,0.4)',
            'display': 'none'
        })

        this.page_drawe_menu.css({
            'position': 'absolute',
            'top': 0,
            'width': (this.window_w * this._opts.drawer.widthscale),
            'height': this.window_h,
            'z-index': 11,
            'background': this._opts.drawer.background,
            'display': 'block'
        })

        if (this._opts.drawer.type) {
            if (this._opts.drawer.type == 'left') {
                this.page_drawe_menu.css({
                    'left': -(this.window_w * this._opts.drawer.widthscale)
                })
            } else if (this._opts.drawer.type == 'right') {
                this.page_drawe_menu.css({
                    'right': -(this.window_w * this._opts.drawer.widthscale)
                })
            }
        }

        this.page_drawe.click((e) => {
            this.closeDraweMenu()
        })

        this.page_drawe_menu.click((e) => {
            e.stopPropagation()
        })

        this.toolbar = new Toolbar({
            activity: this,
            topId: this._opts.rootId + '_top',
            topH: this._opts.toolbar.topH,
            finish: {
                active: this._opts.toolbar.finish.active,
                icon: this._opts.toolbar.finish.icon,
                touchHandle: () => { // 由 ACT 配置
                    this.finish()
                }
            },
            drawer: { // 由 ACT 配置
                active: this._opts.drawer.active,
                icon: this._opts.drawer.icon,
                type: this._opts.drawer.type, // left right
                touchHandle: () => {
                    this.draweMenu()
                }
            },
            logo: {
                active: this._opts.toolbar.logo.active,
                icon: this._opts.toolbar.logo.icon,
                touchHandle: this._opts.toolbar.logo.touchHandle
            },
            title: {
                active: this._opts.toolbar.title.active,
                text: this._opts.toolbar.title.text,
                align: this._opts.toolbar.title.align,
                touchHandle: this._opts.toolbar.title.touchHandle
            },
            font: {
                color: this._opts.toolbar.font.color,
                style: this._opts.toolbar.font.style,
                weight: this._opts.toolbar.font.weight,
            },
            shadow: {
                color: this._opts.toolbar.shadow.color,
                length: this._opts.toolbar.shadow.length
            },
            buttons: this._opts.toolbar.buttons,
            background: this._opts.toolbar.background
        })

        // content
        if (this._opts.content.name) {
            AppTool.LoadHTML({
                link: this._opts.content.name,
                conId: this.page_content.attr('id'),
                color: this._opts.preloading.color,
                renum: 2,
                succHandle: () => {
                    if (this._opts.content.initHandle) {
                        this._opts.content.initHandle(true)
                    }

                    console.log('act load content succ')
                },
                errHandle: () => {
                    if (this._opts.content.initHandle) {
                        this._opts.content.initHandle(false)
                    }

                    console.error('act load content err')
                }
            })
        } else {
            if (this._opts.content.getContent) {
                this.page_content.html(this._opts.content.getContent())

                if (this._opts.content.setStyle) {
                    this._opts.content.setStyle()
                }

                if (this._opts.content.initHandle) {
                    this._opts.content.initHandle(true)
                }
            } else {
                if (this._opts.content.initHandle) {
                    this._opts.content.initHandle(false)
                }
            }
        }

        // drawer
        if (this._opts.drawer.name) {
            AppTool.LoadHTML({
                link: this._opts.drawer.name,
                conId: this.page_drawe_menu.attr('id'),
                color: this._opts.preloading.color,
                succHandle: () => {
                    if (this._opts.drawer.initHandle) {
                        this._opts.drawer.initHandle(true)
                    }

                    console.log('act drawe menu load content succ')
                },
                errHandle: () => {
                    if (this._opts.drawer.initHandle) {
                        this._opts.drawer.initHandle(false)
                    }

                    console.error('act drawe menu load content err')
                },
                renum: 2
            })
        } else {
            if (this._opts.drawer.getContent) {
                this.page_drawe_menu.html(this._opts.drawer.getContent())

                if (this._opts.drawer.setStyle) {
                    this._opts.drawer.setStyle()
                }

                if (this._opts.drawer.initHandle) {
                    this._opts.drawer.initHandle(true)
                }
            } else {
                if (this._opts.drawer.initHandle) {
                    this._opts.drawer.initHandle(false)
                }
            }
        }

        if (this._opts.initHandle) {
            this._opts.initHandle()
        }
    }

    show() { // 展示界面
        if (this.isshow) {
            console.log('current activity then show')

            return
        }

        routing.pushActivity(this)
    }

    getToolbar() {
        return this.toolbar
    }

    draweMenu() {
        let dis = this.page_drawe.css('display')

        if (dis == 'none') {
            this.openDraweMenu()
        } else {
            this.closeDraweMenu()
        }

        console.log('act drawmenu')
    }

    openDraweMenu() {
        if (this._opts.drawer.type == 'left') {
            this.page_drawe.fadeIn(100, () => {
                this.page_drawe_menu.transition({
                    left: 0
                }, 'fast', () => {
                    if (this._opts.drawer.changedHandle) {
                        this._opts.drawer.changedHandle(true)
                    }
                })
            })
        } else {
            this.page_drawe.fadeIn(100, () => {
                this.page_drawe_menu.transition({
                    right: 0
                }, 'fast', () => {
                    if (this._opts.drawer.changedHandle) {
                        this._opts.drawer.changedHandle(true)
                    }
                })
            })
        }

        console.log('open drawe menu')
    }

    closeDraweMenu() {
        if (this._opts.drawer.type == 'left') {
            this.page_drawe_menu.transition({
                left: -(this.window_w * this._opts.drawer.widthscale)
            }, 'fast', () => {
                this.page_drawe.fadeOut(100, () => {
                    if (this._opts.drawer.changedHandle) {
                        this._opts.drawer.changedHandle(false)
                    }
                })
            })
        } else {
            this.page_drawe_menu.transition({
                right: -(this.window_w * this._opts.drawer.widthscale)
            }, 'fast', () => {
                this.page_drawe.fadeOut(100, () => {
                    if (this._opts.drawer.changedHandle) {
                        this._opts.drawer.changedHandle(false)
                    }
                })
            })
        }

        console.log('close drawe menu')
    }

    // activity 基础处理器
    finish() {
        routing.finish(this)
    }

    setInterceptHandel(handle) {
        routing.setInterceptHandel(handle)
    }

    pushComponentHandle(opts) {
        if (opts == null) {
            return
        }

        this.componentHandles.push(opts)
    }

    removeComponentHandle(opts) {
        if (opts == null) {
            return
        }

        for (let i = 0; i < this.componentHandles.length; i++) {
            if (this.componentHandles[i] === opts) {
                this.componentHandles[i] = null
            }
        }
    }

    runRemove() {
        for (let i = 0; i < this.componentHandles.length; i++) {
            if (this.componentHandles[i] == null) {
                this.componentHandles.splice(i, 1)
            }
        }
    }

    // component 生命周期回调
    onCreate() { // 创建
        super.onCreate()

        this.page.css({
            'display': 'block',
            'z-index': routing.changedZIndex()
        })

        if (this._opts.isMainAct == false) { // 非主 act
            this.page.transition({

                x: -this.window_w

            }, 'fast')
        }

        this.isshow = true

        for (let opt of this.componentHandles) {
            if (opt && opt.onCreate) {
                opt.onCreate()
            }
        }

        this.runRemove()
    }

    onResume() { // 恢复
        super.onResume()

        this.isresume = true

        if (this._opts.resumeHandle) {
            this._opts.resumeHandle()
        }

        for (let opt of this.componentHandles) {
            if (opt && opt.onResume) {
                opt.onResume()
            }
        }

        this.runRemove()
    }

    onPause() { // 暂停
        super.onPause()

        this.isresume = false

        if (this._opts.pauseHandle) {
            this._opts.pauseHandle()
        }

        for (let opt of this.componentHandles) {
            if (opt && opt.onPause) {
                opt.onPause()
            }
        }

        this.runRemove()
    }

    onDestroy() { // 销毁
        super.onDestroy()

        if (this._opts.isMainAct == false) { // 非主 act
            this.page.transition({

                x: 0

            }, 'fast')

            this.isshow = false
        }

        if (this._opts.finishTopHandle) {
            this._opts.finishTopHandle()
        }

        for (let opt of this.componentHandles) {
            if (opt && opt.onDestroy) {
                opt.onDestroy()
            }
        }

        this.runRemove()
    }

    onUpdate() { // 更新
        super.onUpdate()

        for (let opt of this.componentHandles) {
            if (opt && opt.onUpdate) {
                opt.onUpdate()
            }
        }

        this.runRemove()
    }

    onShowToolbar() {
        this.page_content.css({
            'top': this._opts.toolbar.topH,
            'height': this.window_h - this._opts.toolbar.topH
        })
    }

    onHideToolbar() {
        this.page_content.css({
            'top': 0,
            'height': this.window_h
        })
    }
}

export default Activity
