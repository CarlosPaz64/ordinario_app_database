const { updateTask, markTaskAsDone, deleteTask, getTaskById } = require('../database/tasks');

module.exports = {
    updateTask,
    markTaskAsDone,
    deleteTask,
    getTaskById
};