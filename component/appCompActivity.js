import routing from '../base/routing.js/index.js';
import AppTool from '../tool/appTool.js';
import BaseComponent from '../base/component.js/index.js.js';

class AppToolbar {
    // button opts
    _button_opts = {
        level: 1,
        id: null,
        icon: '',
        text: '按钮',
        touchHandle: function () {
        }
    }

    // keep button opts
    _button_keep_opts = {
        level: 1,
        id: null,
        icon: '',
        text: '按钮',
        touchHandle: function () {
        }
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
            icon: './pic/theme/back.png',
            touchHandle: function () {
            }
        },
        drawer: {
            active: false,
            icon: './pic/theme/menu.png',
            type: 'right', // left right
            touchHandle: function () {
            }
        },
        logo: {
            active: true,
            icon: null,
            touchHandle: function () {
            }
        },
        title: {
            active: true,
            text: 'FrameworkEland',
            touchHandle: function () {
            }
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

    constructor(opts) { // 构造器
        if (opts == null || opts.topId == null) {
            return
        }

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._opts.drawer.type = this._opts.drawer.type == 'right' ? 'right' : 'left' // 默认为左

        if (this._opts.topH < 50) {
            this._opts.topH = 50
        }
        if (this._opts.topH > 60) {
            this._opts.topH = 60
        }

        this.keep_zone = '<div class="' + this._opts.topId + '_keep_zone"></div>'

        this.customize_zone = '<div class="' + this._opts.topId + '_customize_zone"></div>'

        this.item_root = '<div class="' + this._opts.topId + '_item_cas" id="[id]">[con]</div>'

        this.icon_root = '<img class="' + this._opts.topId + '_icon_cas" src="[src]"></img>'

        this.text_root = '<div class="' + this._opts.topId + '_text_cas">[txt]</div>'

        this._opts.keepId = this._opts.topId + '_keep_zone'

        this._opts.customizeId = this._opts.topId + '_customize_zone'

        // icon
        let button_finish = this.item_root.replace('[id]', this._opts.keepId + '_finish')
            .replace('[con]', this.icon_root.replace('[src]', this._opts.finish.icon))

        // icon
        let button_drawermenu = this.item_root.replace('[id]', this._opts.keepId + '_drawermenu')
            .replace('[con]', this.icon_root.replace('[src]', this._opts.drawer.icon))

        // icon
        let icon_logo = this.item_root.replace('[id]', this._opts.keepId + '_logo')
            .replace('[con]', this.icon_root.replace('[src]', this._opts.logo.icon))

        // text
        let text_title = this.item_root.replace('[id]', this._opts.keepId + '_title')
            .replace('[con]', this.text_root.replace('[txt]', this._opts.title.text))

        $('#' + this._opts.topId).html(this.keep_zone + this.customize_zone)

        $('#' + this._opts.keepId).html(button_finish + button_drawermenu + text_title + icon_logo)

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
        $('.' + this._opts.keepId).css({
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
        $('.' + this._opts.customizeId).css({
            'width': 'fit-content',
            'max-width': '50%',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'flex-end',
            'align-items': 'center',
            'padding': '0px 10px 0px 10px',
            'box-sizing': 'border-box'
        })

        // bind customize zone
        this._bindCustomizeZone()
    }

    _update() { // 更新配置项
        // item root view style
        $('.' + this._opts.topId + '_item_cas').css({
            'width': 'fit-content',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'margin-left': '5px',
            'padding': '3px',
            'box-sizing': 'border-box'
        })

        // item icon view style
        let icon_h = parseInt(this._opts.topH * 0.4)
        $('.' + this._opts.topId + '_icon_cas').css({
            'width': 'fit-content',
            'height': icon_h + 'px',
            'box-sizing': 'border-box'
        })

        // item text view style
        let font_size = parseInt(this._opts.topH * 0.32)
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

            let zone = id_list[id_len - 3]

            if (zone != 'keep') { return }

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
        })

        // 自定义区 操作项事件绑定
        for (let i = 0; i < this._opts.buttons.length; i++) {
            let item = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            let _id = this._opts.customizeId + '_' + item.id

            if (item.touchHandle) {
                AppTool.setBtnOnTouchEventForScale($('#' + _id + '-' + i), 0.9, 1.0, (e) => {
                    item.touchHandle()
                }, null, true)
            }
        }
    }

    _bindCustomizeZone() { // 自定义区 VIEW 绑定
        let new_buttons = [] // 过滤后的项

        let ispushkeep = true // 是否需要推送 drawermenu 项

        // 过滤无效按钮对象
        for (let i = 0; i < this._opts.buttons.length; i++) {
            this._button_opts = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            if (this._button_opts.id == null) {
                continue
            }

            if (this._button_opts.text) {
                this._button_opts.text = this._button_opts.text.substr(0, 4)
            }

            if (this._button_opts.iskeep) {
                ispushkeep = false
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

        if (ispushkeep) {
            this._opts.buttons.push({
                level: Number.MAX_SAFE_INTEGER,
                id: 'drawermenu',
                icon: './pic/theme/menu.png',
                text: 'menu',
                iskeep: true,
                touchHandle: this._opts.drawer.touchHandle
            })
        }

        let views = ''

        for (let i = 0; i < this._opts.buttons.length; i++) {
            this._button_opts = AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), this._opts.buttons[i])

            let _id = this._opts.customizeId + '_' + this._button_opts.id

            if (this._button_opts.icon) { // 图标按钮
                views += this.item_root.replace('[id]', _id + '-' + i)
                    .replace('[con]', this.icon_root.replace('[src]', this._button_opts.icon))
            } else if (this._button_opts.text) { // 文字按钮
                views += this.item_root.replace('[id]', _id + '-' + i)
                    .replace('[con]', this.text_root.replace('[txt]', this._button_opts.text))
            }
        }

        $('#' + this._opts.customizeId).html(views)

        this._update()

        console.log('app comp act toolbar for buttons sort', new_buttons)
    }

    // 用户处理器
    pushCustomizeItem(opts) { // 推送自定义 VIEW 项
        if (opts == null || opts.id == null) {
            return
        }

        this._opts.buttons.push(AppTool.structureAssignment(Object.assign({}, this._button_keep_opts), opts))

        this._bindCustomizeZone()
    }

    show() {
        $('#' + this._opts.topId).css({
            'display': 'flex'
        })

        if (this._opts.activity) {
            this._opts.activity.onShowToolbar()
        }
    }

    hide() {
        $('#' + this._opts.topId).css({
            'display': 'none'
        })

        if (this._opts.activity) {
            this._opts.activity.onHideToolbar()
        }
    }

    showBack() {
        $('#' + this._opts.keepId + '_finish').css({
            'display': 'flex'
        })
    }

    hideBack() {
        $('#' + this._opts.keepId + '_finish').css({
            'display': 'none'
        })
    }

    showDrawerMenu() {
        let len = this._opts.buttons.length

        let last = this._opts.buttons[len - 1] // 最后一个为 drawermenu 项

        let left_id = this._opts.keepId + '_drawermenu'

        let right_id = this._opts.customizeId + '_' + last.id + '-' + (len - 1)

        if (this._opts.drawer.type == 'left') {
            $('#' + left_id).css({
                'display': 'flex'
            })

            $('#' + right_id).css({
                'display': 'none'
            })
        } else {
            $('#' + left_id).css({
                'display': 'none'
            })

            $('#' + right_id).css({
                'display': 'flex'
            })
        }

        this._opts.drawer.active = true
    }

    hideDrawerMenu() {
        let len = this._opts.buttons.length

        let last = this._opts.buttons[len - 1] // 最后一个为 drawermenu 项

        let left_id = this._opts.keepId + '_drawermenu'

        let right_id = this._opts.customizeId + '_' + last.id + '-' + (len - 1)

        $('#' + left_id).css({
            'display': 'none'
        })

        $('#' + right_id).css({
            'display': 'none'
        })

        this._opts.drawer.active = false
    }

    showLogo() {
        if (this._opts.logo.icon == null) {
            return
        }

        $('#' + this._opts.keepId + '_logo').attr('src', this._opts.logo.icon)

        $('#' + this._opts.keepId + '_logo').css({
            'display': 'block'
        })

        this._opts.logo.active = true
    }

    hideLogo() {
        $('#' + this._opts.keepId + '_logo').css({
            'display': 'none'
        })

        this._opts.logo.active = false
    }

    showTitle() {
        $('#' + this._opts.keepId + '_title').css({
            'display': 'block'
        })

        this._opts.title.active = true
    }

    hideTitle() {
        $('#' + this._opts.keepId + '_title').css({
            'display': 'none'
        })

        this._opts.title.active = false
    }

    setTitle(text) {
        if (text == null || text == '') {
            return
        }

        $('#' + this._opts.keepId + '_title').html(text)

        this._opts.title.text = text
    }
}

class AppActivity extends BaseComponent {
    _opts = { // 配置对象
        rootId: '',
        isMainAct: false,
        name: null,
        getContent: null,
        setStyle: null,
        toolbar: { // 操作栏配置
            activity: null,
            topH: 50,
            finish: {
                active: true,
                icon: './pic/theme/back.png',
                touchHandle: function () {
                }
            },
            drawer: {
                active: true,
                icon: './pic/theme/menu.png',
                type: 'left', // left right
                touchHandle: function () {
                }
            },
            logo: {
                active: true,
                icon: null,
                touchHandle: function () {
                }
            },
            title: {
                active: true,
                text: 'FrameworkEland',
                align: 'left',
                touchHandle: function () {
                }
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
            icon: './pic/theme/menu.png',
            type: 'left', // left right
            background: 'white',
            widthscale: 0.75,
            name: '',
            getContent: function () {
                return null
            },
            setStyle: function () {
            },
            initHandle: function () {
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
        resumeHandel: function () {
        },
        pauseHandel: function () {
        },
        initHandel: function () {
        }
    }

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

        if (routing.isMainActMount == true) { // main act 已挂载
            this._opts.isMainAct = false // 已挂载 main act 则不能再设置 main act
        } else { // main act 未挂载
            if (this._opts.isMainAct == true) {
                routing.isMainActMount = true
            }
        }

        // 配置检查
        this._opts.drawer.type = this._opts.drawer.type == 'right' ? 'right' : 'left' // 默认为左
        if (this._opts.drawer.widthscale > 0.8) {
            this._opts.drawer.widthscale = 0.8
        } else if (this._opts.drawer.widthscale < 0.2) {
            this._opts.drawer.widthscale = 0.2
        }

        console.log('activity structureAssignment opts', this._opts)

        this.page = $("#" + this._opts.rootId)

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
            'top': this._opts.toolbarTopH,
            'left': 0,
            'z-index': 8,
            'width': this.window_w,
            'height': this.window_h - this._opts.toolbarTopH,
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
            'display': 'none'
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

        this.toolbar = new AppToolbar({
            activity: this,
            topId: this._opts.rootId + '_top',
            topH: this._opts.toolbar.topH,
            finish: {
                active: this._opts.toolbar.finish.active,
                icon: this._opts.toolbar.finish.icon,
                touchHandle: () => {
                    this.finish()
                }
            },
            drawer: {
                active: this._opts.toolbar.drawer.active,
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

        let _this_init = () => {
            if (this._opts.initHandel != null) {
                this._opts.initHandel()
            }
        }

        let _drawer_init = () => {
            if (this._opts.drawer.initHandle) {
                this._opts.drawer.initHandle()
            }
        }

        // content
        if (this._opts.name) {
            AppTool.LoadHTML({
                link: this._opts.name,
                conId: this.page_content.attr('id'),
                color: this._opts.preloading.color,
                succHandle: () => {
                    _this_init()

                    console.log('act load content succ')
                },
                errHandle: () => {
                    _this_init()

                    console.error('act load content err')
                },
                renum: 2
            })
        } else if (this._opts.getContent) {
            this.page_content.html(this._opts.getContent())

            if (this._opts.setStyle) {
                this._opts.setStyle()
            }

            _this_init()
        }

        // drawer
        if (this._opts.drawer.name) {
            AppTool.LoadHTML({
                link: this._opts.drawer.name,
                conId: this.page_drawe_menu.attr('id'),
                color: this._opts.preloading.color,
                succHandle: () => {
                    _drawer_init()

                    console.log('act drawe menu load content succ')
                },
                errHandle: () => {
                    _drawer_init()

                    console.error('act drawe menu load content err')
                },
                renum: 2
            })
        } else if (this._opts.drawer.getContent) {
            this.page_drawe_menu.html(this._opts.drawer.getContent())

            if (this._opts.drawer.setStyle) {
                this._opts.drawer.setStyle()
            }

            _drawer_init()
        }
    }

    show() { // 展示界面
        if (this.isshow) {
            console.log('current activity then show')

            return
        }

        routing.pushActivity(this)
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
        if (!this._opts.drawer.type) {
            return
        }

        this.page_drawe.css('display', 'block')

        this.page_drawe_menu.css('display', 'block')

        let _run = () => {
            if (this._opts.drawer.changedHandle) {
                this._opts.drawer.changedHandle(true)
            }
        }

        if (this._opts.drawer.type == 'left') {
            this.page_drawe_menu.transition({
                left: 0
            }, 'fast', _run)
        } else {
            this.page_drawe_menu.transition({
                right: 0
            }, 'fast', _run)
        }

        console.log('open drawe menu')
    }

    closeDraweMenu() {
        if (!this._opts.drawer.type) {
            return
        }

        let _run = () => {
            this.page_drawe_menu.css('display', 'none')

            this.page_drawe.css('display', 'none')

            if (this._opts.drawer.changedHandle) {
                this._opts.drawer.changedHandle(false)
            }
        }

        if (this._opts.drawer.type == 'left') {
            this.page_drawe_menu.transition({
                left: -(this.window_w * this._opts.drawer.widthscale)
            }, 'fast', _run)
        } else {
            this.page_drawe_menu.transition({
                right: -(this.window_w * this._opts.drawer.widthscale)
            }, 'fast', _run)
        }

        console.log('close drawe menu')
    }

    onResume() {
        super.onResume()

        if (this._opts.resumeHandel) {
            this._opts.resumeHandel()
        }
    }

    onPause() {
        super.onPause()

        if (this._opts.pauseHandel) {
            this._opts.pauseHandel()
        }
    }

    // activity 基础处理器
    finish() {
        routing.finish(this)
    }

    setInterceptHandel(handle) {
        routing.setInterceptHandel(handle)
    }

    onCreate() {
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
    }

    onDestroy() {
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
    }

    onUpdate() {
        super.onUpdate()
    }

    onShowToolbar() {
        this.page_content.css({
            'top': this._opts.toolbarTopH,
            'height': this.window_h - this._opts.toolbarTopH
        })
    }

    onHideToolbar() {
        this.page_content.css({
            'top': 0,
            'height': this.window_h
        })
    }

    getToolbar() {
        return this.toolbar
    }
}

export default AppActivity
