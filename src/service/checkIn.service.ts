import type { CheckIn } from "../generated";
import type { ICheckInRepository } from "../repository/checkIn.repository";
import prisma from "../database";

export interface ICheckInService {
  getCheckInById(id: string): Promise<CheckIn>;
  getCheckInByIdForUser(id: string, userId: string): Promise<CheckIn>;
  createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
  }): Promise<CheckIn>;
  updateCheckIn(id: string, data: Partial<CheckIn>, userId?: string): Promise<CheckIn>;
  deleteCheckIn(id: string, userId?: string): Promise<CheckIn>;
}

export class CheckInService implements ICheckInService {
  constructor(private checkInRepo: ICheckInRepository) {}

  async getCheckInById(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInRepo.findById(id);
    if (!checkIn) {
      throw new Error("CheckIn tidak ditemukan");
    }

    return checkIn;
  }

  async getCheckInByIdForUser(id: string, userId: string): Promise<CheckIn> {
    const checkIn = await this.checkInRepo.findById(id);
    
    if (!checkIn) {
      throw new Error("CheckIn tidak ditemukan");
    }

    if (checkIn.userId !== userId) {
      throw new Error("Akses ditolak: CheckIn bukan milik Anda");
    }

    return checkIn;
  }

  async createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
  }): Promise<CheckIn> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ⭐ CEK APAKAH HABIT MILIK USER INI DAN AKTIF
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId: data.userId,
        isActive: true
      }
    });

    if (!habit) {
      throw new Error("Habit tidak ditemukan, tidak aktif, atau bukan milik Anda");
    }

    const existingCheckIn = await this.checkInRepo.findTodayCheckIn(
      data.habitId,
      today
    );
    
    if (existingCheckIn) {
      throw new Error("Sudah check-in hari ini");
    }

    const input: any = {
      date: today,
      note: data.note,
      habit: { connect: { id: data.habitId } },
      user: { connect: { id: data.userId } },
    };

    return await this.checkInRepo.create(input);
  }

  async updateCheckIn(id: string, data: Partial<CheckIn>, userId?: string): Promise<CheckIn> {
    // Validasi ownership jika userId disediakan
    if (userId) {
      await this.getCheckInByIdForUser(id, userId);
    } else {
      await this.getCheckInById(id);
    }

    return await this.checkInRepo.update(id, data);
  }

  async deleteCheckIn(id: string, userId?: string): Promise<CheckIn> {
    if (userId) {
      await this.getCheckInByIdForUser(id, userId);
    }
    
    return await this.checkInRepo.softDelete(id);
  }
}