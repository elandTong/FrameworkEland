import EmitEventBus from './AppEventBus.js';

export default class AppTool {
    static T0EventList = [] // 唯一事件队列

    static mEventBusObj = new EmitEventBus()

    static startEvent = ''
    static moveEvent = ''
    static endEvent = ''
    static cancelEvent = ''

    static checkEvent() {
        let hasTouch = 'ontouchstart' in window

        this.startEvent = hasTouch ? 'touchstart' : 'mousedown'

        this.moveEvent = hasTouch ? 'touchmove' : 'mousemove'

        this.endEvent = hasTouch ? 'touchend' : 'mouseup'

        this.cancelEvent = hasTouch ? 'touchcancel' : 'mouseup'
    }

    static LoadHTML(opts) {
        let pagedom

        let loading = null

        let isLoading = false

        let _opts = {
            link: null,
            conId: null,
            succHandle: null,
            errHandle: null,
            renum: 3,
            color: 'black'
        }

        let init = () => {
            if (opts == null || opts.link == null || opts.conId == null) {
                return
            }

            this.structureAssignment(_opts, opts, true)

            console.log('LoadHtml', _opts)

            loading = new Spinner({
                color: _opts.color
            })

            pagedom = $('#' + _opts.conId)

            pagedom.html('<div id="' + _opts.conId + '_loading" ></div>')

            $('#' + _opts.conId + '_loading').css({
                'width': '100%',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'padding': '10px',
                'box-sizing': 'border-box'
            })

            loadPage(_opts.renum)
        }

        let closeLoading = () => {
            isLoading = false

            loading.spin()

            $('#' + _opts.conId + '_loading').css({
                'display': 'none'
            })
        }

        let showLoading = () => {
            if (isLoading) {
                return
            }

            isLoading = true

            $('#' + _opts.conId + '_loading').css({
                'display': 'block'
            })

            loading.spin(this.o(_opts.conId + '_loading'))
        }

        let loadPage = (resize) => {
            // 加载 html 页面, resize 重试次数
            showLoading()

            this.getRequest(_opts.link, (data) => {
                closeLoading()

                pagedom.html(data)

                if (_opts.succHandle != null) {
                    _opts.succHandle()
                }
            }, (error) => {
                if (resize > 0) {
                    resize = resize - 1

                    loadPage(resize)
                } else {
                    closeLoading()

                    if (_opts.errHandle != null) {
                        _opts.errHandle()
                    }
                }
            })
        }

        init()
    }

    static isMobile() {
        let sUserAgent = navigator.userAgent.toLowerCase()
        let bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
        let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
        let bIsMidp = sUserAgent.match(/midp/i) == "midp"
        let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
        let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
        let bIsAndroid = sUserAgent.match(/android/i) == "android"
        let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
        let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true
        } else {
            return false
        }
    }

    static isInApp() {
        let url = location.href

        if (url.indexOf('127.0.0.1') != -1) {
            return true
        } else {
            return false
        }
    }

    static isInIOS() {
        let u = navigator.userAgent

        if (u.match(/(iPhone|iPod|iPad)?/i)) {
            return true
        }

        return false
    }

    static isInAndroid() {
        // 不在主框架则统一模拟安卓
        let u = navigator.userAgent

        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1

        return isAndroid
    }

    static saveLocalStorage(key, val) {
        if (key == null || key == "") {
            return
        }
        if (window.localStorage) {
            localStorage.setItem(APP_ID + '-' + key, val)
        } else {
            Cookie.write(APP_ID + '-' + key, val)
        }
    }

    static getLocalStorage(key) {
        if (key == null || key == "") {
            return
        }
        return window.localStorage ? localStorage.getItem(APP_ID + '-' + key) : Cookie.read(APP_ID + '-' + key)
    }

    static addPageToHtml(rootId, activityId, handel) {
        let act = '<div id="' + activityId + '">[con]</div>'

        let rot = '<div id="' + activityId + '_root">[con]</div>'

        let top = '<div id="' + activityId + '_top"></div>'

        let con = '<div id="' + activityId + '_content"></div>'

        let drawe = '<div id="' + activityId + '_drawe"></div>'

        let drawe_menu = '<div id="' + activityId + '_drawe_menu"></div>'

        act = act.replace('[con]', rot.replace('[con]', top + con + drawe + drawe_menu))

        $('#' + rootId).append(act)

        if (handel != null) {
            $('#' + activityId + '_content').html(handel())
        }
    }

    static isTopFrame() {
        // 是否处于主框架
        return window.self === window.top
    }

    static postRequest(url, params, succHandle, errHandle, config) {
        let asyn = true

        let withCredenIs = true

        let outTime = 5000

        let xhrField = {
            withCredentials: true
        }

        if (!window.runOuttimeAjax) {
            window.runOuttimeAjax = 2000
        }

        if (config != null) {
            asyn = config['asyn']

            if (asyn == null) {
                asyn = true
            }

            withCredenIs = config['withCredenIs']

            if (withCredenIs == null) {
                withCredenIs = true
            }

            outTime = config['outTime']

            if (outTime == null || isNaN(outTime)) {
                outTime = 5000
            }
        }

        if (!withCredenIs) {
            xhrField = null
        }

        let _run = () => {
            $.ajax({
                type: 'post',
                url: url,
                data: params,
                async: asyn,
                xhrFields: xhrField,
                timeout: outTime,
                beforeSend: function (xmlhttprequest) {},
                success: function (data) {
                    let result

                    try {
                        result = JSON.parse(data)
                    } catch (e) {
                        result = data
                    }

                    if (succHandle != null) {
                        succHandle(result)
                    }
                },
                error: function (xmlhttprequest, error) {
                    if (errHandle != null) {
                        errHandle(error)
                    }
                },
                complete: function () {}
            })

            window.runOuttimeAjax = 0
        }

        setTimeout(_run, window.runOuttimeAjax)
    }

    static getRequest(url, succHandle, errHandle) {
        if (!window.runOuttimeAjax) {
            window.runOuttimeAjax = 2000
        }

        let _run = () => {
            $.ajax({
                type: 'get',
                url: url,
                async: true,
                timeout: 5000,
                beforeSend: function (xmlhttprequest) {},
                success: function (data) {
                    let result

                    try {
                        result = JSON.parse(data)
                    } catch (e) {
                        result = data
                    }

                    if (succHandle != null) {
                        succHandle(result)
                    }
                },
                error: function (xmlhttprequest, error) {
                    if (errHandle != null) {
                        errHandle(error)
                    }
                },
                complete: function () {}
            })

            window.runOuttimeAjax = 0
        }

        setTimeout(_run, window.runOuttimeAjax)
    }

    static bindUniqueEventHandle(id, type, handel, tag) {
        if (tag == null) {
            tag = false
        }

        this.removeUniqueEventHandle(id, type, tag)

        this.T0EventList.push({
            id: id,
            handel: handel
        })

        this.addEventHandle(this.o(id), type, handel, tag)
    }

    static removeUniqueEventHandle(id, type, tag) {
        if (tag == null) {
            tag = false
        }

        for (let item of T0EventList) {
            let formId = item.id

            if (formId == id) {
                this.removeEventHandle(this.o(formId), type, item['handel'], tag)

                this.T0EventList.splice(i, 1)

                return
            }
        }
    }

    static addEventHandle(obj, type, handel, tag) {
        if (tag == null) {
            tag = false
        }

        obj.addEventListener(type, handel, tag)
    }

    static removeEventHandle(obj, type, backFun, tag) {
        if (tag == null) {
            tag = false
        }

        obj.removeEventListener(type, backFun, tag)
    }

    static o(objId) {
        return document.getElementById(objId)
    }

    static getTimeZoneE8(i, timeInt) {
        if (typeof i !== 'number') {
            return
        }

        let d = new Date(timeInt)
        let len = d.getTime()
        let offset = d.getTimezoneOffset() * 60000
        let utcTime = len + offset

        return new Date(utcTime + 3600000 * i)
    }

    static setBtnOnTouchEventNoColor(obj, endHandle, startHandle, isStopEvent) {
        this.checkEvent()

        let startX, startY

        if (isStopEvent == null) {
            isStopEvent = false
        }

        // 开始
        obj.on(this.startEvent, function (e) {
            let x
            let y
            if (e.touches) {
                x = Number(e.touches[0].clientX)
                y = Number(e.touches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }
            startX = x
            startY = y

            if (startHandle != null) {
                startHandle(this)
            }

            if (isStopEvent) {
                e.stopPropagation()
            }
        })

        // 结束
        obj.on(this.endEvent, function (e) {
            let x
            let y

            if (e.changedTouches) {
                x = Number(e.changedTouches[0].clientX)
                y = Number(e.changedTouches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }

            if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
                if (endHandle != null) {
                    endHandle(this)
                }
            }

            if (isStopEvent) {
                e.stopPropagation()
            }

            e.preventDefault()

            return true
        })

        // 移动
        obj.on(this.moveEvent, function (e) {})

        if (this.startEvent == 'mousedown') {
            obj.on('click', function (e) {
                e.stopPropagation()
            })
        }
    }

    static setBtnOnTouchEvent(obj, endHandle, onPressColor, onEndColor, startHandle, isStopEvent) {
        this.checkEvent()

        let startX, startY
        let isEnd = false

        if (isStopEvent == null) {
            isStopEvent = false
        }

        if (onPressColor == null) {
            onPressColor = ''
        }

        if (onEndColor == null) {
            onEndColor = ''
        }

        // 开始
        obj.on(this.startEvent, function (e) {
            let x
            let y

            if (e.touches) {
                x = Number(e.touches[0].clientX)
                y = Number(e.touches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }

            startX = x
            startY = y

            obj.css('background', onPressColor)

            if (startHandle != null) {
                startHandle(this)
            }

            if (isStopEvent) {
                e.stopPropagation()
            }
        })

        // 结束
        obj.on(this.endEvent, function (e) {
            isEnd = true

            obj.css('background', onEndColor)

            let x
            let y

            if (e.changedTouches) {
                x = Number(e.changedTouches[0].clientX)
                y = Number(e.changedTouches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }

            if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
                if (endHandle != null) {
                    endHandle(this)
                }
            }

            if (isStopEvent) {
                e.stopPropagation()
            }

            e.preventDefault()

            return true
        })

        // 移动
        obj.on(this.moveEvent, function (e) {
            if (!isEnd) {
                obj.css('background', onEndColor)
            }
        })

        if (this.startEvent == 'mousedown') {
            obj.on('click', function (e) {
                e.stopPropagation()
            })
        }
    }

    static setBtnOnTouchEventForScale(obj, startScale, endScale, endHandle, startHandle, isStopEvent) {
        this.checkEvent()

        let startX, startY
        let isEnd = false

        if (isStopEvent == null) {
            isStopEvent = false
        }

        if (startScale == null) {
            startScale = '0.9'
        }

        if (endScale == null) {
            endScale = '1.0'
        }

        // 开始
        obj.on(this.startEvent, function (e) {
            let x
            let y

            if (e.touches) {
                x = Number(e.touches[0].clientX)
                y = Number(e.touches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }

            startX = x
            startY = y

            obj.css('transform', 'scale(' + startScale + ')')

            if (startHandle != null) {
                startHandle(this)
            }

            if (isStopEvent) {
                e.stopPropagation()
            }
        })

        // 结束
        obj.on(this.endEvent, function (e) {
            isEnd = true

            obj.css('transform', 'scale(' + endScale + ')')

            let x
            let y

            if (e.changedTouches) {
                x = Number(e.changedTouches[0].clientX)
                y = Number(e.changedTouches[0].clientY)
            } else {
                x = Number(e.clientX)
                y = Number(e.clientY)
            }

            if ((Math.abs(startX - x) < 10) && (Math.abs(startY - y) < 10)) {
                if (endHandle != null) {
                    endHandle(this)
                }
            }

            if (isStopEvent) {
                e.stopPropagation()
            }

            e.preventDefault()

            return true
        })

        // 移动
        obj.on(this.moveEvent, function (e) {
            if (!isEnd) {
                obj.css('transform', 'scale(' + endScale + ')')
            }
        })

        if (this.startEvent == 'mousedown') {
            obj.on('click', function (e) {
                e.stopPropagation()
            })
        }
    }

    static queryParameForURL(name, url) {
        let searchIndex = 0
        for (let i = 0; i < url.length; i++) {
            if (url[i] == '?') {
                searchIndex = i

                break
            }
        }

        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')

        let r = url.substr(searchIndex).substr(1).match(reg)

        if (r != null) return unescape(r[2])

        return null
    }

    static onEmit(theme, han) {
        return this.mEventBusObj.subscribeForce(theme, han)
    }

    static emit(event) {
        return this.mEventBusObj.releaseEvent(event)
    }

    static emitList(eventList) {
        return this.mEventBusObj.releaseEventList(eventList)
    }

    /**
     * 对象赋值
     * _opts : 属性接收对象
     * _newopts : 属性赋值对象
     */
    static structureAssignment(_opts, _newopts, isIdentical) {
        console.log('structureAssignment opts', _opts, ' nweopts', _newopts)

        if (_newopts == null) {
            return _opts
        }

        if (isIdentical == null) {
            isIdentical = true
        }

        if (_newopts instanceof Array) {
            return _opts
        } else if (_newopts instanceof Object) {
            Object.keys(_newopts).forEach(function (key) {
                if (key in _opts) { // 判断是否存在该属性
                    if (isIdentical) {
                        if (_opts[key] == null) {
                            _opts[key] = _newopts[key]
                        } else if (typeof (_opts[key]) == typeof (_newopts[key])) {
                            _opts[key] = _newopts[key]
                        }
                    } else {
                        _opts[key] = _newopts[key]
                    }
                }
            })

            return _opts
        } else {
            return _opts
        }
    }
}