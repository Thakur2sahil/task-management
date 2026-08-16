import { prisma } from "../config/db.js";

export const allUsers = async (req, res, next) => {
    try {
        const allUser = await prisma.user.findMany({
            where: {
                email: {
                    not: req.user.email,
                },
            },
            select: { user_name: true, id: true, email: true }
        });

        return res.status(200).json({
            success: true,
            data: allUser,
        });
    } catch (error) {
        next(error);
    }
};

export const userDashboard = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        const { status, priority } = req.query;

        // Always restrict to logged-in user's tasks
        const where = {
            assignedTo: userId,
        };

        // Optional filters
        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        console.log(where)

        const [
            tasks,
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        ] = await Promise.all([
            prisma.task.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    assignedTo: true,
                    dueDate: true,
                    priority: true,
                    status: true,
                    assignee: {
                        select: {
                            user_name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),

            // Summary should NOT depend on filters
            prisma.task.count({
                where: {
                    assignedTo: userId,
                },
            }),

            prisma.task.count({
                where: {
                    assignedTo: userId,
                    status: "PENDING",
                },
            }),

            prisma.task.count({
                where: {
                    assignedTo: userId,
                    status: "IN_PROGRESS",
                },
            }),

            prisma.task.count({
                where: {
                    assignedTo: userId,
                    status: "COMPLETED",
                },
            }),
        ]);

        // Flatten assignee name
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            assignee_user_name: task.assignee?.user_name || "Unassigned",
            dueDate: task.dueDate
                ? new Date(task.dueDate)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : null,
            priority: task.priority,
            status: task.status,
        }));

        console.log("formattedTasks",formattedTasks)

        return res.status(200).json({
            success: true,

            summary: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,

                taskColumns: [
                    { key: "id", label: "ID" },
                    { key: "title", label: "Task" },
                    { key: "priority", label: "Priority" },
                    { key: "status", label: "Status" },
                    { key: "dueDate", label: "Due Date" },
                ],
            },

            tasks: formattedTasks,
        });
    } catch (error) {
        next(error);
    }
};