const sendReqTime = (req, res, next) => {
    req.requestTime = Date.now()
    next()
}

const displayMethod = (req, res, next) => {
    console.log(`Method: ${req.method}`)
    next()
}

const displayUrl = (req, res, next) => {
    console.log(`Url: ${req.originalUrl}`)
    next()
}

module.exports = {sendReqTime, displayMethod, displayUrl}