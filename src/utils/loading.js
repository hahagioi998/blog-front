import { Loading } from 'element-ui'

let loading = null
let loadingCount = 0

const startLoading = () => {
    loading =  Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.1)'
    })
}

const stopLoding = () => {
    loading.close()
}

/**
 * 没有loading状态就创建loading，在loading状态就让loadingCount + 1
 */
const showLoading = () => {
    if (loadingCount === 0) {
        startLoading()
    }
    loadingCount++
}

/**
 * 如果loading非空loadingCount--
 * 当<code>loadingCount < 1</code>时停止loading
 */
const hideLoading = () => {
    if (loading && loadingCount) {
        loadingCount--
        if (loadingCount < 1) {
            stopLoding()
        }
    }
}

/**
 * 当异常中断时使用, 直接停止loading
 */
const destoryLoading = () => {
    if (loading) {
        stopLoding()
        loadingCount = 0
    }
}

export { showLoading, hideLoading, destoryLoading }
