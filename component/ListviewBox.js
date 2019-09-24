import BaseComponent from "../base/AppComponent.js"

export default class ListviewBox extends BaseComponent {
    _defaults = {
        rootId: '',
        threshold: 100, // 滑动触发下拉刷新的距离
        topRingradius: 24,
        botRingradius: 24,
        topFontsize: 14,
        botFontsize: 14,
        colorTopRing: 'gray',
        colorTopText: 'gray',
        colorBotRing: 'gray',
        colorBotText: 'gray',
        isinitAction: true,
        isopenBotPull: true,
        upCallback: null,
        downCallback: null
    }

    _el = null // 定义操作 dom

    _progress = null // 下拉刷新显示的 dom

    _loadMore = null // 上拉加载显示的 dom

    options = {
        rootId: '',
        threshold: 100,
        topRingradius: 24,
        botRingradius: 24,
        topFontsize: 14,
        botFontsize: 14,
        colorTopRing: 'gray',
        colorTopText: 'gray',
        colorBotRing: 'gray',
        colorBotText: 'gray',
        isinitAction: true,
        isopenBotPull: true,
        upCallback: null,
        downCallback: null
    }

    progressHeight = 0 // 下拉刷新的 dom 的高度

    rotate = null // 下拉刷新 转圈 的角度

    touchstartY = 0 // 触摸到屏幕的坐标起始 Y 值

    currentY = 0 // 移动时实时记录的坐标 Y 值

    isAnimation = false // 是否在自动回滚

    isRefresh = false // 是否正在刷新数据

    isLoadMore = false // 是否正在加载数据

    hasMore = true // 是否有更多数据

    rotateTimer = null // 控制 下拉刷新 转圈 的时间计时器

    isPauseDown = false

    isPauseUp = false

    constructor(opts) {
        if (opts == null || opts.rootId == null) {
            return
        }

        this.options = Object.assign({}, this._defaults, opts)

        if (this.options.topRingradius < 16) {
            this.options.topRingradius = 16
        } else if (this.options.topRingradius > 96) {
            this.options.topRingradius = 96
        }
        if (this.options.botRingradius < 16) {
            this.options.botRingradius = 16
        } else if (this.options.botRingradius > 96) {
            this.options.botRingradius = 96
        }

        this._el = document.getElementById(this.options.rootId)
        this._progress = null
        this._loadMore = null

        this.progressHeight = 0
        this.rotate = null
        this.touchstartY = 0
        this.currentY = 0
        this.isAnimation = false
        this.isRefresh = false
        this.isLoadMore = false
        this.hasMore = true
        this.rotateTimer = null
        this.isPauseDown = false
        this.isPauseUp = false

        this._init()
    }

    _init() {
        // 增加下拉刷新的显示
        let _top_rot = '<div id="' + this.options.rootId + '-downwarp">[con]</div>'
        let _top_rot_con = '<div id="' + this.options.rootId + '-downwarp-content">[con]</div>'
        let _top_rot_pos = '<div id="' + this.options.rootId + '-downwarp-progress"></div>'
        let _top_rot_txt = '<div id="' + this.options.rootId + '-downwarp-tip">下拉刷新</div>'
        _top_rot = _top_rot.replace('[con]', _top_rot_con.replace('[con]', _top_rot_pos + _top_rot_txt))
        let _div_top = document.createElement('div')
        _div_top.innerHTML = _top_rot
        this._progress = _div_top.children[0]
        this._el.prepend(this._progress)

        // 增加上拉加载的显示
        let _bot_rot = '<div id="' + this.options.rootId + '-upwarp">[con]</div>'
        let _bot_rot_pos = '<div id="' + this.options.rootId + '-upwarp-progress"></div>'
        let _bot_rot_txt = '<div id="' + this.options.rootId + '-upwarp-tip">加载中...</div>'
        _bot_rot = _bot_rot.replace('[con]', _bot_rot_pos + _bot_rot_txt)
        let _div_bot = document.createElement('div')
        _div_bot.innerHTML = _bot_rot
        this._loadMore = _div_bot.children[0]
        this._el.appendChild(this._loadMore)

        // 下拉
        $('#' + this.options.rootId + '-downwarp').css({
            'position': 'relative',
            'width': '100%',
            'height': 0,
            'box-sizing': 'border-box'
        })

        $('#' + this.options.rootId + '-downwarp-content').css({
            'position': 'absolute',
            'bottom': 0,
            'left': 0,
            'width': '100%',
            'padding': '10px 0px 10px 0px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this.options.rootId + '-downwarp-progress').css({
            'display': 'inline-block',
            'width': this.options.topRingradius + 'px',
            'height': this.options.topRingradius + 'px',
            'border-radius': '50%',
            'border': '1px solid ' + this.options.colorTopRing,
            'margin-right': '8px',
            'border-bottom-color': 'transparent',
            'vertical-align': 'middle',
            'transform': 'rotate(0deg)',
            'box-sizing': 'border-box'
        })

        $('#' + this.options.rootId + '-downwarp-tip').css({
            'display': 'inline-block',
            'font-size': this.options.topFontsize + 'px',
            'color': this.options.colorTopText,
            'vertical-align': 'middle',
            'box-sizing': 'border-box'
        })

        // 上拉
        $('#' + this.options.rootId + '-upwarp').css({
            'padding': '10px 0px 10px 0px',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'visibility': 'hidden',
            'box-sizing': 'border-box'
        })

        $('#' + this.options.rootId + '-upwarp-progress').css({
            'display': 'inline-block',
            'width': this.options.botRingradius + 'px',
            'height': this.options.botRingradius + 'px',
            'border-radius': '50%',
            'border': '1px solid ' + this.options.colorBotRing,
            'margin-right': '8px',
            'border-bottom-color': 'transparent',
            'vertical-align': 'middle',
            'animation': 'linearRotate 0.5s linear infinite',
            'box-sizing': 'border-box'
        })

        $('#' + this.options.rootId + '-upwarp-tip').css({
            'display': 'inline-block',
            'font-size': this.options.botFontsize + 'px',
            'color': this.options.colorBotText,
            'vertical-align': 'middle',
            'box-sizing': 'border-box'
        })

        if (this.options.isopenBotPull == true) {
            $('#' + this.options.rootId + '-upwarp').css({
                'display': 'flex'
            })
        } else {
            $('#' + this.options.rootId + '-upwarp').css({
                'display': 'none'
            })
        }

        this._el.addEventListener('touchstart', (e) => {
            this.touchstartY = e.touches[0].clientY
        })

        this._el.addEventListener('touchmove', (e) => {
            if (this.isPauseDown == true) {
                return
            }

            let scrollTop = this._el.scrollTop

            this.currentY = e.touches[0].clientY

            if (this.currentY - this.touchstartY >= 0 && scrollTop <= 0) {
                if (!this.isAnimation && !this.isRefresh) {
                    this.moveDown(this.currentY - this.touchstartY)
                }
            }
        })

        this._el.addEventListener('touchend', (e) => {
            let scrollTop = this._el.scrollTop

            if (scrollTop > 0 || this.isRefresh || this.isAnimation) { // 只有在屏幕顶部才进行处理
                this.touchstartY = 0

                this.currentY = 0

                return
            }

            if ((this.currentY - this.touchstartY) > this.options.threshold) {
                if (this.options.downCallback) { // 触发参数穿过来的请求数据
                    this.options.downCallback()
                }

                this.isRefresh = true

                this.moveBack(this.options.topRingradius * 2) // 下拉刷新时停留的位置距离屏幕顶部的距离
            } else {
                this.moveBack()
            }

            this.touchstartY = 0

            this.currentY = 0
        })

        this._el.addEventListener('scroll', (e) => {
            if (this.options.isopenBotPull == false || this.isPauseUp == true) {
                return
            }

            let s_top = this._el.scrollTop
            let rot_h = this._el.clientHeight
            let con_h = 0

            let children = this._el.children
            for (let item of children) {
                con_h += item.clientHeight
            }

            let s_h = s_top + rot_h

            if ((Math.abs(con_h - s_h) <= 50) && (!this.isLoadMore && this.hasMore)) {
                this.isLoadMore = true
                this._loadMore.style.visibility = 'visible'
                if (this.options.upCallback) {
                    this.options.upCallback()
                }
            }
        })

        if (this.options.isinitAction) {
            this.initAction()
        }
    }

    moveDown(dis) {
        if (dis < this.options.threshold) {
            this._progress.style.height = this.progressHeight + dis + 'px'

            this.rotateProgress(dis * 2)

            this.changeProgressState('下拉刷新')
        } else {
            // 当滑动距离超过 threshold 时放慢下拉速度
            let aftDis = this.options.threshold + (dis - this.options.threshold) / 3

            let aftAngle = this.options.threshold * 2 + (dis - this.options.threshold) / 1.7

            this._progress.style.height = this.progressHeight + aftDis + 'px'

            this.rotateProgress(aftAngle)

            this.changeProgressState('释放刷新')
        }
    }

    rotateProgress(rotate) {
        let rotateDom = document.getElementById(this.options.rootId + '-downwarp-progress')

        if (rotate != undefined) {
            rotateDom.style.transform = 'rotate(' + rotate + 'deg)'

            this.rotate = rotate
        } else {
            let t = 0

            this.rotateTimer = setInterval(() => {
                t++

                let angle = (this.rotate + t * 15) % 360

                rotateDom.style.transform = 'rotate(' + angle + 'deg)'

                rotateDom.style.WebkitTransform = 'rotate(' + angle + 'deg)'
            }, 16)
        }
    }

    changeProgressState(name) {
        document.getElementById(this.options.rootId + '-downwarp-tip').innerHTML = name
    }

    moveBack(dis) {
        dis = dis || 0

        this.isAnimation = true // 正在回退

        let currentHeight = this._progress.clientHeight

        let t = 0, // 进行的步数
            b = 10, // 总步数
            c = (currentHeight - dis) / b // 每一步的距离

        let timer = setInterval(() => {
            t++

            this._progress.style.height = currentHeight - c * t + 'px'

            if (t == b) {
                if (dis === 0) {
                    this.changeProgressState('下拉刷新')

                    this.progressHeight = 0
                } else {
                    this.changeProgressState('正在刷新')

                    this.progressHeight = this.options.topRingradius * 2

                    this.rotateProgress()
                }

                this.touchstartY = 0

                this.isAnimation = false // 回退完成

                clearInterval(timer)
            }
        }, 16)
    }

    endSuccess(bool) {
        if (this.isRefresh) { //  如果是正在刷新数据

            this.changeProgressState('刷新成功')

            if (bool) {
                setTimeout(() => { //延迟 500ms 回滚
                    this.moveBack(0)

                    this.isRefresh = false

                    clearInterval(this.rotateTimer)
                }, 500)
            } else {
                this.toggleLoadingText(true)
            }
        }

        if (this.isLoadMore) { //  如果是正在加载数据
            this.isLoadMore = false

            this.hasMore = bool

            this._loadMore.style.visibility = 'hidden'

            this.toggleLoadingText(bool)
        }
    }

    toggleLoadingText(hasMore) {
        if (hasMore) {
            document.getElementById(this.options.rootId + '-upwarp-tip').innerHTML = '加载中...'

            document.getElementById(this.options.rootId + '-upwarp-progress').style.display = 'inline-block'
        } else {
            this._loadMore.style.visibility = 'visible'

            document.getElementById(this.options.rootId + '-upwarp-tip').innerHTML = '没有更多数据了'

            document.getElementById(this.options.rootId + '-upwarp-progress').style.display = 'none'
        }
    }

    initAction() {
        if (this.options.downCallback) { // 触发参数穿过来的请求数据
            this.options.downCallback()
        }

        this.isRefresh = true

        this.moveBack(this.options.topRingradius * 2) // 下拉刷新时停留的位置距离屏幕顶部的距离
    }

    setPauseDown(isPause) {
        this.isPauseDown = isPause
    }

    setPauseUp(isPause) {
        this.isPauseUp = isPause
    }
}
