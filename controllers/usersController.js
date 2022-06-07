exports.testServer = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "ok",
            data: "works"
        })
    }

    catch (e) {
        res.status(400).json({
            status: "failed",
            data: "It has failed !!!"
        })
    }

    next();
}