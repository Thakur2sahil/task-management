import { prisma } from "../config/db.js";

// Add comment
export const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userId, comment } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const newComment = await prisma.comment.create({
      data: {
        taskId: Number(taskId),
        userId: Number(userId),
        comment: comment.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a task
export const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        taskId: Number(taskId),
      },
      include: {
        user: {
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
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await prisma.comment.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};