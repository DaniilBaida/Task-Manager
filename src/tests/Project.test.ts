import { Project } from "@/core/domain/entities/Project";
import { IProject } from "@/infrastructure/database/repositories/types";

function createProject(overrides: Partial<IProject> = {}): Project {
    const now = new Date();

    const defaults: IProject = {
        id: "project-1",
        user_id: "user-1",
        name: "Test Project",
        description: "Test Description",
        created_at: now,
        ...overrides,
    };
    return Project.mapProject(defaults);
}

describe("Project", () => {
    describe("mapProject", () => {
        it("creates Project instance from IProject data", () => {
            const now = new Date();
            const projectData: IProject = {
                id: "proj-123",
                user_id: "user-456",
                name: "My Project",
                description: null,
                created_at: now,
            };

            const project = Project.mapProject(projectData);

            expect(project).toBeInstanceOf(Project);
            expect(project.id).toBe("proj-123");
            expect(project.name).toBe("My Project");
            expect(project.description).toBeNull();
        });
    });

    describe("asDto", () => {
        it("converts project to DTO format", () => {
            const project = createProject({
                name: "DTO Test Project",
                description: "DTO Description",
            });

            const dto = project.asDto();

            expect(dto.name).toBe("DTO Test Project");
            expect(dto.description).toBe("DTO Description");
            expect(dto.id).toBeDefined();
            expect(dto.user_id).toBeDefined();
        });

        it("handles null description in DTO", () => {
            const project = createProject({ description: null });

            const dto = project.asDto();

            expect(dto.description).toBeNull();
        });
    });
});
