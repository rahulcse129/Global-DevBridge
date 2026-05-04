import { Request, Response, NextFunction } from 'express';
import { RagService } from '../ai/rag.service';

export const indexStandupsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await RagService.indexStandups();
    res.status(200).json({ message: `Successfully indexed ${count} standups into vector store.` });
  } catch (error) {
    next(error);
  }
};

export const generateSummaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await RagService.generateSummary();
    res.status(200).json({ summary });
  } catch (error) {
    console.error("AI SUMMARY GENERATION ERROR:", error);
    next(error);
  }
};
