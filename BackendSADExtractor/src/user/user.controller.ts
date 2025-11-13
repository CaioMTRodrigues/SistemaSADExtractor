import { Request, Response } from "express";
import { inactivateUser, updateUser } from "./user.service.js";

class UserController {
  /**
   * Admin features
   */
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, role, email } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const updatedUser = {
        name,
        role,
        email,
      };
      const result = await updateUser(id, updatedUser);
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User updated successfully", result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user", error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const result = await inactivateUser(id);
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User inactivated successfully", result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error inactivating user", error });
    }
  }
}

export default UserController;
