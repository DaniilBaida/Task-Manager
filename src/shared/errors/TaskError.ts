import CustomError from "./customError";
import { ErrorCode } from "./types";

class TaskError extends CustomError<ErrorCode> {
    static alreadyCompleted(taskName: string, completedDate: Date): TaskError {
        return new TaskError({
            message: `Task "${taskName}" was already completed on ${completedDate.toDateString()}`,
            statusCode: 400,
            code: "TASK_ALREADY_COMPLETED",
        });
    }
}

export default TaskError;
