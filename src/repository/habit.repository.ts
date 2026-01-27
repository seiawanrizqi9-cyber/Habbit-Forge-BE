import type { Prisma, PrismaClient, Habit } from "@prisma/client";

export interface IHabitRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.HabitWhereInput,
    orderBy: Prisma.HabitOrderByWithRelationInput,
  ): Promise<Habit[]>;
  countAll(where: Prisma.HabitWhereInput): Promise<number>;
  findById(
    id: string,
  ): Promise<(Habit & { user?: any; checkIn?: any[] }) | null>;
  create(data: Prisma.HabitCreateInput): Promise<Habit>;
  update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit>;
  hardDelete(id: string): Promise<Habit>;
  toggleActive(id: string): Promise<Habit>;
  getHabitsWithTodayCheckIns(
    userId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<any[]>;
}

export class HabitRepository implements IHabitRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.HabitWhereInput,
    orderBy: Prisma.HabitOrderByWithRelationInput,
  ): Promise<Habit[]> {
    return await this.prisma.habit.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        frequency: true,
        userId: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async countAll(where: Prisma.HabitWhereInput): Promise<number> {
    return await this.prisma.habit.count({ where });
  }

  async findById(
    id: string,
  ): Promise<(Habit & { user?: any; checkIn?: any[] }) | null> {
    return await this.prisma.habit.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        frequency: true,
        userId: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        checkIn: {
          orderBy: { date: "desc" },
          take: 30,
          select: {
            id: true,
            date: true,
            note: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.HabitCreateInput): Promise<Habit> {
    return await this.prisma.habit.create({ data });
  }

  async update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit> {
    return await this.prisma.habit.update({
      where: { id },
      data,
    });
  }

  async hardDelete(id: string): Promise<Habit> {
    return await this.prisma.habit.delete({
      where: { id },
    });
  }

  async toggleActive(id: string): Promise<Habit> {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!habit) {
      throw new Error("Habit tidak ditemukan");
    }

    return await this.prisma.habit.update({
      where: { id },
      data: {
        isActive: !habit.isActive,
      },
    });
  }

  async getHabitsWithTodayCheckIns(
    userId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<any[]> {
    return await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        frequency: true,
        isActive: true,
        startDate: true,
        createdAt: true,
        category: true,
        checkIn: {
          where: {
            date: {
              gte: dateRange.start,
              lte: dateRange.end,
            },
          },
          select: {
            id: true,
            date: true,
            note: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
