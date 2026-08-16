import { prisma } from "../config/db.js";

export const allTask = async (req, res, next) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: {
                    select: {
                        id: true,
                        user_name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const taskById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tasks = await prisma.task.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        user_name: true,
                        email: true,
                    },
                },
                comments: true,
            },
        });

        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const formateTask = {
            ...tasks,
            assignee_user_name: tasks.assignee.user_name
        }

        return res.status(200).json({
            success: true,
            tasks:formateTask,
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const taskUser = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const tasks = await prisma.task.findMany({
            where: {
                assignedTo: userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                assignedTo: true,
                dueDate: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });

    } catch (error) {
        next(error);
    }
};

export const addTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            deadline,
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || "PENDING",
                priority: priority || "MEDIUM",
                assignedTo: assignedTo ? Number(assignedTo) : null,
                dueDate: deadline ? new Date(deadline) : null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const updatedTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            dueDate,
        } = req.body;

        const taskId = Number(id);

        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        // Check if task exists
        const existingTask = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const task = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && {
                    description: description?.trim() || null,
                }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
                ...(assignedTo !== undefined && {
                    assignedTo: assignedTo ? Number(assignedTo) : null,
                }),
                ...(dueDate !== undefined && {
                    dueDate: dueDate ? new Date(dueDate) : null,
                }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const taskId = Number(id);

        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const existingTask = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        await prisma.task.delete({
            where: {
                id: taskId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const status = async (req, res, next) => {
    try {
        const taskId = Number(req.params.id);
        const { status } = req.body;

        const allowedStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: "Task ID is required",
            });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        // Make sure the task belongs to the logged-in user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                assignedTo: req.user.id,
            },
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or not assigned to you",
            });
        }

        const task = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                status,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task,
        });

    } catch (error) {

        next(error);
    }
};