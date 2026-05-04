import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, timezone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const result = await AuthService.register({ email, password, name, timezone });
    
    res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error: any) {
    if (error.message === 'User already exists with this email') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.login({ email, password });
    
    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};
