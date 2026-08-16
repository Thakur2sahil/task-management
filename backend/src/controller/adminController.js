import { prisma } from "../config/db.js"

export const adminDashboard = async (req, res, next) => {
    try {
        const { status, priority, assignedTo } = req.query;

        // Build Prisma filter
        const where = {};

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        if (assignedTo) {
            where.assignedTo = Number(assignedTo);
        }

        const [
            tasks,
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        ] = await Promise.all([
            // Filtered tasks
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

            // Overall total
            prisma.task.count(),

            // Overall pending
            prisma.task.count({
                where: {
                    status: "PENDING",
                },
            }),

            // Overall in progress
            prisma.task.count({
                where: {
                    status: "IN_PROGRESS",
                },
            }),

            // Overall completed
            prisma.task.count({
                where: {
                    status: "COMPLETED",
                },
            }),
        ]);

        // Convert nested assignee into flat field
        const formattedTasks = tasks.map(({ assignee, ...task }) => ({
            ...task,
            assignee_user_name: assignee?.user_name || null,
            dueDate: task.dueDate
                ? new Date(task.dueDate)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : null,
        }));

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