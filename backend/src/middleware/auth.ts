import { Role } from "@prisma/client";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

// allowRoles: array ของ Role
export const authenticateJWT = (allowRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        name: string;
        email: string;
        role: Role;
      };

      if (!allowRoles.includes(payload.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: You don't have access" });
      }

      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};
