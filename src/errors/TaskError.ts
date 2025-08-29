import CustomError from "./customError";

class TaskError extends CustomError<ErrorCode> {
    static alreadyCompleted(taskName: string, completedDate: Date): TaskError {
        return new TaskError({
            message: `Task '${taskName}' is already completed on ${completedDate.toDateString()}`,
            statusCode: 409,
            code: "TASK_ALREADY_COMPLETED",
        });
    }

    static notFound(taskId: string): TaskError {
        return new TaskError({
            message: `Task with ID '${taskId}' not found`,
            statusCode: 404,
            code: "ERR_NF",
        });
    }
}

export default TaskError;
