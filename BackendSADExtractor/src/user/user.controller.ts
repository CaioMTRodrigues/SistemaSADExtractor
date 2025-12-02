import { Request, Response } from "express";
import {
  createExportacao,
  createExtracao,
  createLaudo,
  deleteLaudo,
  getAllUsers,
  getEdicoes,
  getLaudosByIds,
  getOneUser,
  inactivateUser,
  updateUser,
} from "./user.service.js";

class UserController {
  /**
   * Admin features
   */
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const user = await getOneUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving user", error });
    }
  }

  async getUsers(req: Request, res: Response) {
    // Paginação: page e limit via query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    try {
      // getAllUsers pode precisar ser adaptado para aceitar skip e limit
      const users = await getAllUsers({ skip, take: limit });
      return res.status(200).json({
        page,
        limit,
        users,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving users", error });
    }
  }

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
      return res.status(500).json({ message: "Error updating user", error });
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

  /**
   * Gestor features
   */
  async getEdicoes(req: Request, res: Response) {
    // Implementar lógica para obter laudos
    try {
      const edicoes = await getEdicoes();
      return res.status(200).json(edicoes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving edicoes", error });
    }
  }

  /**
   * Cadastro features
   */
  async getLaudosByIds(req: Request, res: Response) {
    const idsParam = req.query.ids as string;
    if (!idsParam) {
      return res.status(400).json({ message: "Laudo IDs are required" });
    }
    const ids = idsParam.split(",").filter(Boolean);
    try {
      const laudos = await getLaudosByIds(ids);
      return res.status(200).json(laudos);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving laudos", error });
    }
  }

  async createLaudo(req: Request, res: Response) {
    const laudoData = req.body;
    if (!laudoData.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const laudo = await createLaudo(laudoData);
      return res.status(201).json({
        message: "Laudo created successfully",
        laudo,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error creating laudo", error });
    }
  }

  async deleteLaudo(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Laudo ID is required" });
    }
    try {
      const result = await deleteLaudo(id);
      if (!result) {
        return res.status(404).json({ message: "Laudo not found" });
      }
      return res
        .status(200)
        .json({ message: "Laudo deleted successfully", result });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting laudo", error });
    }
  }

  async createExtracao(req: Request, res: Response) {
    const extracaoData = req.body;
    if (!extracaoData.userId || !extracaoData.laudoId) {
      return res
        .status(400)
        .json({ message: "User ID and Laudo ID are required" });
    }
    try {
      const extracao = await createExtracao(extracaoData);
      return res.status(201).json({
        message: "Extracao created successfully",
        extracao,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating extracao", error });
    }
  }

  async createExportacao(req: Request, res: Response) {
    const exportacaoData = req.body;
    if (!exportacaoData.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const exportacao = await createExportacao(exportacaoData);
      return res.status(201).json({
        message: "Exportacao created successfully",
        exportacao,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating exportacao", error });
    }
  }
}

export default UserController;
