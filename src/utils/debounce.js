const debounce = (func, delay) => {
    let timer
    return (...args) => {
        let context = this
        let isImmediately = !timer
        clearTimeout(timer)
        timer = setTimeout(() => timer = null , delay)
        isImmediately && func.apply(context, args)
    }
}

export default debounce
