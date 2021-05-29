function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            message: 'You are not authenticated!'
        });
    }

    if(err.name === 'ValidationError') {
        res.status(401).json({
            success: false,
            message: err
        });
    }

    return res.status(500).json({
        success: false,
        message: err
    });
}

module.exports = errorHandler;