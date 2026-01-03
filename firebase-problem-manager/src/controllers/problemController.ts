import { Request, Response } from 'express';
import { ProblemService } from '../services/problemService';
import { Problem } from '../types';

const problemService = new ProblemService();

export const createProblem = async (req: Request, res: Response) => {
    try {
        const problemData: Problem = req.body;
        const newProblem = await problemService.createProblem(problemData);
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating problem', error });
    }
};

export const getProblems = async (req: Request, res: Response) => {
    try {
        const problems = await problemService.getProblems();
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problems', error });
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        const problemId = req.params.id;
        const problemData: Problem = req.body;
        const updatedProblem = await problemService.updateProblem(problemId, problemData);
        res.status(200).json(updatedProblem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating problem', error });
    }
};

export const deleteProblem = async (req: Request, res: Response) => {
    try {
        const problemId = req.params.id;
        await problemService.deleteProblem(problemId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting problem', error });
    }
};