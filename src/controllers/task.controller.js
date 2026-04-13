const taskModel = require("../models/task.model.js");
const userModel = require("../models/user.model.js");

async function createTask(req, res) {

    const {title, description, status, priority, dueDate, assignedTo} = req.body;

    if(!title || !description || !status || !priority || !dueDate || !assignedTo){
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // if (!assignedTo) {
    //     return res.status(400).json({
    //         message: "assignedTo is required" 
    //     });
    // }

    const userExists = await userModel.findById(assignedTo);

    if(!userExists){
        return res.status(404).json({
            message: "Assigned user not found"
        })
    }

    const task = await taskModel.create({
        title,
        description,
        status,
        priority,
        dueDate,
        createdBy: req.user.id,
        assignedTo
    })

    await task.populate("createdBy", "username");
    await task.populate("assignedTo", "username");

    res.status(201).json({
        message: "Task created successfully",
        task
    })
};



async function getTasks(req, res) {
    const {status, priority, search, sort, page = 1, limit = 10} = req.query;

    const query = {isDeleted: false};

    if(status){
        query.status = status;
    }

    if(priority){
        query.priority = priority;
    }

    if(search){
        query.$or = [
            {title: {$regex: search, $options: "i"}},
            {description: {$regex: search, $options: "i"}}
        ]
    }

    const tasks = await taskModel.find(query)
        .sort(sort ? {[sort]: -1} : {createdAt: -1}) //1 low to high and -1 high to low
        .skip((page - 1) * limit)
        .limit(parseInt(limit));


    res.status(200).json({
        message: "Tasks fetched successfully",
        tasks
    })
}   



async function updateTask(req, res) {

    const task = await taskModel.findById(req.params.id);
    
    if(!task){
        return res.status(404).json({
            message: "Task not found"
        })
    }
    
    //const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const userID = req.user.id;


    if(task.createdBy.toString() !== userID && task.assignedTo.toString() !== userID){
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const {title, description, status, priority, dueDate, assignedTo} = req.body;

    if(assignedTo){
        const userExists = await userModel.findById(assignedTo);
        if(!userExists){
            return res.status(404).json({
                message: "Assigned user not found"
            })
        }
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
        req.params.id,
        {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            updatedAt: Date.now()
        },
        {returnDocument: "after"}
    );

    res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask
    })
}


async function deleteTask(req, res) {
    const task = await taskModel.findById(req.params.id);

    if(!task){
        return res.status(404).json({
            message: "Task not found"
        })
    }

    //const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    const userID = req.user.id;

    if(task.createdBy.toString() !== userID && task.assignedTo.toString() !== userID){
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await taskModel.findByIdAndUpdate(
        req.params.id,
        {
            isDeleted: true,
            updatedAt: Date.now()
        },
        {returnDocument: "after"}
    );

    return res.status(200).json({
        message: "Task deleted successfully"
    })
}

module.exports = { createTask, getTasks, updateTask, deleteTask };