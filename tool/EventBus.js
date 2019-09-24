export default class EventBus {
    subList = []

    constructor() {
        this.subList = []
    }

    // 事件发布
    releaseEvent(_event) {
        if (_event == null) {
            return false
        }

        let tem = _event['theme']
        if (tem == null || tem == '') {
            tem = 'all'
        }

        let isRelse = false

        for (let i = 0; i < this.subList.length; i++) {
            let objItem = this.subList[i]

            if (objItem['theme'] == tem) {
                let han = objItem['callBack']

                if (han != null) {
                    han(_event)

                    isRelse = true
                }
            }
        }

        return isRelse
    }

    // 事件组发布
    releaseEventList(_eventList) {
        if (_eventList == null || _eventList.length == 0) {
            return
        }

        for (let i = 0; i < _eventList.length; i++) {
            this.releaseEvent(_eventList[i])
        }
    }

    // 事件订阅,index唯一标识
    subscribe(theme, index, han) {
        if (han == null || index == null || index == '' || this._checkIndex(index) >= 0) {
            return false
        }

        let tem = theme
        if (tem == null || tem == '') {
            tem = 'all'
        }

        console.log('sub theme:' + tem, 'index:' + index)

        this.subList.push({
            theme: tem,
            index: index,
            callBack: han
        })

        return true
    }

    subscribeForce(theme, han) {
        if (han == null) {
            return
        }

        let index = this._uuid()

        let tem = theme

        if (tem == null || tem == '') {
            tem = 'all'
        }

        console.log('subForce theme:' + tem, 'index:' + index)

        this.subList.push({
            theme: tem,
            index: index,
            callBack: han
        })

        return index
    }

    // 取消订阅
    unsubscribe(index) {
        if (this.subList.length == 0 || index == null || index == '') {
            return false
        }

        let pos = this._checkIndex(index)

        if (pos >= 0) {
            this.subList.splice(pos, 1)

            return true
        } else {
            return false
        }
    }

    // 订阅标识检查
    _checkIndex(index) {
        if (index == null || index == '') {
            return -2
        }

        // 无效标识
        for (let i = 0; i < this.subList.length; i++) {
            let objItem = this.subList[i]
            if (objItem['index'] == index) {
                return i // 已存在的标识
            }
        }

        return -1 // 该标识不存在
    }

    _uuid() {
        let s = []
        let hexDigits = '0123456789abcdef'

        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }

        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'

        let uuid = s.join('')

        return uuid
    }
}
