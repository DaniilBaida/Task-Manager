import { z } from "zod";

const taskSchema = z.object({
    project_id: z
        .string({ message: "Project ID must be a string." })
        .min(1, "Project ID cannot be empty.")
        .nullable()
        .optional(),
    name: z
        .string({ message: "Task name must be a string." })
        .min(1, "Task name cannot be empty.")
        .max(255, "Task name must not exceed 255 characters."),
    description: z
        .string({ message: "Description must be a string." })
        .min(1, "Description cannot be empty when provided.")
        .max(1000, "Description must not exceed 1000 characters.")
        .nullable()
        .optional(),
    due_date: z
        .date({ message: "Due date must be a valid date." })
        .refine((date: Date) => date > new Date(), {
            message: "Due date must be in the future.",
        })
        .nullable()
        .optional(),
    completed_on: z
        .date({ message: "Completed date must be a valid date." })
        .refine((date: Date) => date <= new Date(), {
            message: "Completed date cannot be in the future.",
        })
        .nullable()
        .optional(),
});

export const createTaskSchema = taskSchema;

export const updateTaskSchema = taskSchema.partial().refine(
    (data) => {
        const allowedFields = [
            "project_id",
            "name",
            "description",
            "due_date",
            "completed_on",
        ];
        return Object.keys(data).some((key) => allowedFields.includes(key));
    },
    {
        message:
            "At least one field must be provided for update. Valid fields: project_id, name, description, due_date, completed_on.",
    }
);

const projectSchema = z.object({
    name: z
        .string({ message: "Project name must be a string." })
        .min(1, "Project name cannot be empty.")
        .max(50, "Project name must not exceed 50 characters."),
    description: z
        .string({ message: "Description must be a string." })
        .min(1, "Description cannot be empty when provided.")
        .max(1000, "Description must not exceed 1000 characters.")
        .nullable()
        .optional(),
});

export const createProjectSchema = projectSchema;

export const updateProjectSchema = projectSchema.partial().refine(
    (data) => {
        const allowedFields = ["name", "description"];
        return Object.keys(data).some((key) => allowedFields.includes(key));
    },
    {
        message:
            "At least one field must be provided for update. Valid fields: name, description.",
    }
);
