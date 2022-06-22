const Users = require('./../models/userModels');

const log = (args) => {
    console.log(args);
}

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

exports.deleteUser = async(req, res, next) => {

    try {
        const id = req.params.id;
        const document = await Users.findByIdAndDelete(id);

        if (!document)
        {
            res.status(404).json({
                status: 'failed',
                message: 'Document not found'
            })
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
    }
    
    catch (err) {
        res.status(400).json({
            status: 'failed',
            data: err
        })
    }

    next();
}

exports.addWorkspace = async(req, res, next) => {
    try {
        const nameNewWorkspace = req.body.name;
        const userId = req.body.id;

        let newObj = {
            name: nameNewWorkspace,
            container: []
        }


        const userDocument = await Users.findById(userId);
        if (userDocument.spaces.nameNewWorkspace) {
            throw new Error("This workspace already exists");
        } else {
            userDocument.spaces.push(newObj);

            await userDocument.save();

            res.status(200).json({
                status: "success",
                data: `Inserted new workspace : ${nameNewWorkspace}`
            })
        }

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            data: err
        })
    }
}