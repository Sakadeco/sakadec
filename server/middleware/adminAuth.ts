import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';

export interface AdminRequest extends Request {
  admin?: any;
}

export const adminAuth = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin-secret-key') as any;
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Administrateur non trouvé ou inactif' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification admin:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const requireSuperAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Accès réservé aux super administrateurs' });
  }
  next();
};
