import type { Category } from "@prisma/client";
import type { ICategoryRepository } from "../repository/category.repository.ts";

export interface ICategoryService {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category>;
}

export class CategoryService implements ICategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepo.getAll();
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new Error("Kategori tidak ditemukan");
    }

    return category;
  }
}