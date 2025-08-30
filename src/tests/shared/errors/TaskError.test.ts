import TaskError from "@/shared/errors/TaskError";

describe("TaskError", () => {
    describe("alreadyCompleted", () => {
        it("creates error with correct message format", () => {
            const taskName = "My Important Task";
            const completedDate = new Date("2023-01-15T10:30:00.000Z");
            
            const error = TaskError.alreadyCompleted(taskName, completedDate);
            
            expect(error).toBeInstanceOf(TaskError);
            expect(error.message).toContain(taskName);
            expect(error.message).toContain("already completed on");
            expect(error.message).toContain(completedDate.toDateString());
        });

        it("sets correct status code and error code", () => {
            const error = TaskError.alreadyCompleted("Test Task", new Date());
            
            expect(error.statusCode).toBe(400);
            expect(error.code).toBe("TASK_ALREADY_COMPLETED");
        });

        it("handles different task names and dates", () => {
            const error1 = TaskError.alreadyCompleted("Task A", new Date("2023-01-01"));
            const error2 = TaskError.alreadyCompleted("Task B", new Date("2023-12-31"));
            
            expect(error1.message).toContain("Task A");
            expect(error2.message).toContain("Task B");
            expect(error1.message).not.toBe(error2.message);
        });
    });
});