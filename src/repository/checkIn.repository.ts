import type { Prisma, PrismaClient, CheckIn } from "@prisma/client";
import { getStartOfDay } from "../utils/timeUtils.js";

export interface ICheckInRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.CheckInWhereInput,
    orderBy: Prisma.CheckInOrderByWithRelationInput,
  ): Promise<CheckIn[]>;
  findById(id: string): Promise<CheckIn | null>;
  findByDate(habitId: string, dateString: string): Promise<CheckIn | null>;
  create(data: Prisma.CheckInCreateInput): Promise<CheckIn>;
  update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn>;
  delete(id: string): Promise<CheckIn>;
}

export class CheckInRepository implements ICheckInRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.CheckInWhereInput,
    orderBy: Prisma.CheckInOrderByWithRelationInput,
  ): Promise<CheckIn[]> {
    return await this.prisma.checkIn.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async findById(id: string): Promise<CheckIn | null> {
    return await this.prisma.checkIn.findUnique({
      where: { id },
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async findByDate(habitId: string, dateString: string): Promise<CheckIn | null> {
    const date = getStartOfDay(dateString);
    
    return await this.prisma.checkIn.findFirst({
      where: {
        habitId,
        date,
      },
    });
  }

  async create(data: Prisma.CheckInCreateInput): Promise<CheckIn> {
    return await this.prisma.checkIn.create({ data });
  }

  async update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn> {
    return await this.prisma.checkIn.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<CheckIn> {
    return await this.prisma.checkIn.delete({
      where: { id },
    });
  }
}