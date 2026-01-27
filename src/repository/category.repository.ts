import type { PrismaClient, Category } from "@prisma/client";

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }
}