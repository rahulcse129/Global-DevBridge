import { Request, Response, NextFunction } from 'express';
import { StandupService } from '../services/standup.service';

export const createStandupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { didToday, doNext, blockers } = req.body;

    if (!didToday || !doNext) {
      return res.status(400).json({ error: 'didToday and doNext are required fields' });
    }

    const standup = await StandupService.createStandup(userId, { didToday, doNext, blockers });
    
    res.status(201).json({
      message: 'Standup created successfully',
      standup,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStandupsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const standups = await StandupService.getAllStandups();
    res.status(200).json({ standups });
  } catch (error) {
    next(error);
  }
};

export const getMyStandupsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const standups = await StandupService.getStandupsByUser(userId);
    res.status(200).json({ standups });
  } catch (error) {
    next(error);
  }
};

export const updateStandupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const standup = await StandupService.updateStandup(id, userId, updateData);
    
    res.status(200).json({
      message: 'Standup updated successfully',
      standup,
    });
  } catch (error: any) {
    if (error.message === 'Standup not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized to update this standup') return res.status(403).json({ error: error.message });
    next(error);
  }
};

export const deleteStandupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await StandupService.deleteStandup(id, userId);
    
    res.status(200).json({ message: 'Standup deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Standup not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized to delete this standup') return res.status(403).json({ error: error.message });
    next(error);
  }
};
