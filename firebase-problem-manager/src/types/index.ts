export interface Problem {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProblemRequest {
    title: string;
    description: string;
}

export interface UpdateProblemRequest {
    title?: string;
    description?: string;
}

export interface ProblemResponse {
    problem: Problem;
}

export interface ProblemsResponse {
    problems: Problem[];
}