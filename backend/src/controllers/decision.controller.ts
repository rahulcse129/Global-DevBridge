import { Request, Response, NextFunction } from 'express';
import { DecisionService } from '../services/decision.service';

export const createDecisionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problem, options, finalDecision } = req.body;
    if (!problem || !finalDecision) {
      return res.status(400).json({ error: 'Problem and Final Decision are required' });
    }
    const decision = await DecisionService.createDecision({ problem, options, finalDecision });
    res.status(201).json({ message: 'Decision logged successfully', decision });
  } catch (error) {
    next(error);
  }
};

export const getAllDecisionsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decisions = await DecisionService.getAllDecisions();
    res.status(200).json({ decisions });
  } catch (error) {
    next(error);
  }
};

export const deleteDecisionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await DecisionService.deleteDecision(id);
    res.status(200).json({ message: 'Decision deleted successfully' });
  } catch (error) {
    next(error);
  }
};
