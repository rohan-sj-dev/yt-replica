const asyncHandler = (requestHandler) => {
    return (req , res, mw) => {
        Promise.resolve(requestHandler(req, res, mw)).catch((err) => mw(err))
    }
}


export { asyncHandler }