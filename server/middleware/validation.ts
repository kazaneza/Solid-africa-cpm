import { Request, Response, NextFunction } from 'express';

export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: `Required fields: ${missing.join(', ')}`
      });
    }
    
    next();
  };
};

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }
  
  next();
};

export const validatePositiveNumber = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      const value = req.body[field];
      if (value !== undefined && (isNaN(value) || value < 0)) {
        return res.status(400).json({
          error: `${field} must be a positive number`
        });
      }
    }
    next();
  };
};

export const validateDate = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];
    if (value && isNaN(Date.parse(value))) {
      return res.status(400).json({
        error: `${field} must be a valid date`
      });
    }
    next();
  };
};