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

    next();
}

exports.deleteWorkspace = async(req, res, next) => {
    try {
        const wsToDelete = req.body.spaceName;
        const mongooseDocument = await Users.findOne({email: req.body.email});
        let newSpaces = [];
        console.log(mongooseDocument)
        mongooseDocument.spaces.forEach(el => {
            if (el.name !== wsToDelete) {
                newSpaces.push(el)
            }
        })
        mongooseDocument.spaces = newSpaces;
        mongooseDocument.save();

        res.status(200).json({
            status: 'success',
            message: `Sucessfully deleted document ${wsToDelete}`
        })
    } catch(e) {
        console.log(e.message);

        res.status(400).json({
            status: 'failed',
            message: `Error message : ${e.message}`
        })
    }
    next();
}

exports.addContainer = async(req, res, next) => {
    try {
        const currentWorkspace = req.body.currentWorkspace;
        const userId = req.body.id;
        const containerName = req.body.containerName;

        console.log("container name : ", containerName)

        let newObj = {
            title: containerName,
            cards: []
        }
        const userDocument = await Users.findById(userId);
        console.log(userDocument)

        
        userDocument.spaces.forEach(el => {
            if (el.name === currentWorkspace) {
                el.containers.push(newObj);
            }
        })

        await userDocument.save();

        res.status(200).json({
            status: "success",
            data: `Inserted new container : ${containerName}`,
            check: userDocument
        })
        

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            data: err.message
        })
    }

    next();
}

exports.deleteContainer = async(req, res, next) => {
    try {
        const currentWorkspace = req.body.currentWorkspace;
        const userId = req.body.id;
        const containerName = req.body.containerName;

        console.log("Deleting container name : ", containerName)

        const userDocument = await Users.findById(userId);

        // filter
        let filtered = [];

        
        userDocument.spaces.forEach(space => {
            if (space.name === currentWorkspace) {
                console.log('currentWorkspace', space)
                // let filtered = el.containers.filter(container => {
                //     container.title !== containerName
                // })
                
                console.log("1111 ------------------- ")
                space.containers.forEach(el => {
                    console.log("in containers --------------", el)
                    if (el.title !== containerName) {
                        filtered.push(el);
                    }
                })



                space.containers = filtered;
                console.log("setted filter")
                console.log("filter : \n", space.containers)
            }
        })

        await userDocument.save();

        res.status(200).json({
            status: "success",
            data: filtered,
            check: userDocument
        })
        

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            data: err.message
        })
    }

    next();
}

exports.addCard = async(req, res, next) => {
    try {
        const currentWorkspace = req.body.currentWorkspace;
        const userId = req.body.id;
        const containerName = req.body.containerName;
        const cardName = req.body.cardName;

        console.log("Adding card : ", cardName);

        let newObj = {
            title: containerName,
            cards: []
        }
        const userDocument = await Users.findById(userId);
        
        userDocument.spaces.forEach(el => {
            if (el.name === currentWorkspace) {
                el.containers.push(newObj);
            }
        })

        await userDocument.save();

        res.status(200).json({
            status: "success",
            data: `Inserted new container : ${containerName}`,
            check: userDocument
        })
        

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            data: err.message
        })
    }

    next();
}






