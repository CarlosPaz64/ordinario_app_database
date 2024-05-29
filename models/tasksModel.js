const { updateIdTask, toggleTaskStatus, deleteTask, getTaskById, getRecentTasks, getTasksByStatus } = require('../database/tasks');

module.exports = {
    updateIdTask,
    toggleTaskStatus,
    deleteTask,
    getTaskById,
    getRecentTasks,
    getTasksByStatus
};