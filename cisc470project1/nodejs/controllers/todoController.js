const db = require('../models');

exports.createTodo = async (req, res) => {
    try {
        const {text} = req.body;
        const userId = req.userId;
        const todo = await db["Todo"].create({user_id: userId, text: text, done: false});
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({error: 'Failed to create todo'});
    }
};

exports.getTodos = async (req, res) => {
    try {
        const todos = await db["Todo"].findAll({
            where: {user_id: req.userId}
        });

        return res.json(todos);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

exports.shareTodoList = async (req, res) => {
    try {
        const {email} = req.body;
        const userId = req.userId;
        const sharedWithUser = await db["User"].findOne({where: {email: email}});

        if (!sharedWithUser) {
            return res.status(404).json({error: 'User not found'});
        }

        await db["SharedList"].create({owner_id: userId, shared_with_id: sharedWithUser.id});
        res.status(201).json({message: 'Todo list shared successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to share todo list'});
    }
};

exports.getSharedWith = async (req, res) => {
    try {
        const userId = req.userId;
        const sharedWith = await db["SharedList"].findAll({where: {owner_id: userId}});
        const sharedEmails = await Promise.all(sharedWith.map(async (item) => {
            const user = await db["User"].findByPk(item.shared_with_id);
            return { email: user.email};
        }));
        res.json(sharedEmails);
    } catch (error) {
        res.status(500).json({error: 'Failed to get shared users'});
    }
};

exports.getAccessibleLists = async (req, res) => {
    try {
        const userId = req.userId;
        const accessibleLists = await db["SharedList"].findAll({where: {shared_with_id: userId}});
        const ownerEmails = await Promise.all(accessibleLists.map(async (item) => {
            const owner = await db["User"].findByPk(item.owner_id);
            return {email: owner.email};
        }));
        res.json(ownerEmails);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch accessible lists'});
    }
};

exports.getTodoListForSharedUser = async (req, res) => {
    try {
        const {ownerEmail} = req.params;
        const userId = req.userId;
        const owner = await db["User"].findOne({where: {email: ownerEmail}});

        if (!owner) {
            return res.status(404).json({error: 'Owner not found'});
        }

        const sharedEntry = await db["SharedList"].findOne({where: {owner_id: owner.id, shared_with_id: userId}});
        if (!sharedEntry) {
            return res.status(403).json({error: 'Access denied'});
        }

        const todos = await db["Todo"].findAll({where: {user_id: owner.id}});
        res.json(todos);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch shared todo list'});
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const {todoId} = req.params;
        const todo = await db["Todo"].findOne({where: {id: todoId}});

        if (!todo) {
            return res.status(404).json({error: 'Todo not found'});
        }

        await todo.destroy();
        res.json({message: 'Todo deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete todo'});
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const {todoId} = req.params;
        const {text, done} = req.body;
        const userId = req.userId;
        const todo = await db["Todo"].findOne({where: {id: todoId}});

        if (!todo) {
            return res.status(404).json({error: 'Todo not found'});
        }

        todo.text = text !== undefined ? text : todo.text;
        todo.done = done !== undefined ? done : todo.done;
        await todo.save();

        res.json({message: 'Todo updated successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to update todo'});
    }
};

exports.unshare = async (req, res) => {
    try {
        const {email} = req.body;
        const userId = req.userId;
        const sharedWithUser = await db["User"].findOne({where: {email: email}});

        if (!sharedWithUser) {
            return res.status(404).json({error: 'User not found'});
        }

        await db["SharedList"].destroy({where: {owner_id: userId, shared_with_id: sharedWithUser.id}} );
        res.status(201).json({message: 'Todo list shared successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to share todo list'});
    }
};
