import type { Prisma, PrismaClient, Habit } from "@prisma/client";

export interface IHabitRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.HabitWhereInput,
    orderBy: Prisma.HabitOrderByWithRelationInput,
  ): Promise<Habit[]>;

  countAll(where: Prisma.HabitWhereInput): Promise<number>;

  findById(id: string): Promise<
    | (Habit & {
        category?: any;
        user?: any;
        checkIn?: any[];
      })
    | null
  >;

  create(data: Prisma.HabitCreateInput): Promise<Habit>;

  update(id: string, data: Prisma.HabitUpdateInput): Promise<Habit>;

  hardDelete(id: string): Promise<Habit>; // ✅ Ganti dari softDelete

  toggleActive(id: string): Promise<Habit>;
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
      include: {
        category: true, // ✅ Masih ada, tapi category sekarang system-wide
        user: true,
      },
    });
  }

  async countAll(where: Prisma.HabitWhereInput): Promise<number> {
    return await this.prisma.habit.count({ where });
  }

  async findById(id: string): Promise<
    | (Habit & {
        category?: any;
        user?: any;
        checkIn?: any[];
      })
    | null
  > {
    return await this.prisma.habit.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
        checkIn: {
          orderBy: { date: "desc" },
          take: 30, // Last 30 check-ins
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
}
