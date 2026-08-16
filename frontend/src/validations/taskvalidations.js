import * as Yup from "yup";

export const TaskValidation = Yup.object({
    title: Yup.string()
        .trim()
        .required("Task title is required.")
        .max(100, "Task title cannot exceed 100 characters."),

    description: Yup.string()
        .trim(),

    assignedTo: Yup.string()
        .required("Please select a user."),

    priority: Yup.string()
        .oneOf(["LOW", "MEDIUM", "HIGH"], "Invalid priority.")
        .required("Priority is required."),

    status: Yup.string()
        .oneOf(
            ["PENDING", "IN_PROGRESS", "COMPLETED"],
            "Invalid status.",
        )
        .required("Status is required."),

    deadline: Yup.string()
        .required("Deadline is required.")
        .test(
            "future-date",
            "Deadline cannot be before today.",
            function (value) {
                if (!value) return true;

                const today = new Date();

                const todayString = `${today.getFullYear()}-${String(
                    today.getMonth() + 1,
                ).padStart(2, "0")}-${String(
                    today.getDate(),
                ).padStart(2, "0")}`;

                return value >= todayString;
            },
        ),
});