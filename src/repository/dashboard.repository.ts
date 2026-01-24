import { PrismaClient } from "@prisma/client";
import { getStartOfDate, getEndOfDate, getTodayRange } from "../utils/timeUtils.js";

export class DashboardRepository {
  constructor(private prisma: PrismaClient) {}
  
  // GET Dashboard utama
  async getDashboard(userId: string) {
    // 1. Hitung total habits user
    const totalHabits = await this.prisma.habit.count({
      where: { userId }
    });
    
    // 2. Hitung habits aktif
    const activeHabits = await this.prisma.habit.count({
      where: { userId, isActive: true }
    });
    
    // 3. Hitung total check-ins user
    const totalCheckIns = await this.prisma.checkIn.count({
      where: { userId }
    });
    
    // 4. Hitung streak
    const streak = await this.calculateStreak(userId);
    
    return {
      totalHabits,
      activeHabits,
      totalCheckIns,
      streak
    };
  }
  
  // GET Habits untuk hari ini
  async getTodayHabits(userId: string) {
    const { start, end } = getTodayRange();
    
    const habits = await this.prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        category: true,
        checkIn: {
          where: {
            date: {
              gte: start,
              lte: end
            }
          }
        }
      }
    });
    
    return habits.map(habit => ({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      category: habit.category?.name || 'No category',
      isCompleted: habit.checkIn.length > 0,
      checkInTime: habit.checkIn[0]?.date || null
    }));
  }
  
  // GET Stats detail
  async getStats(userId: string) {
    // 1. Habits per kategori
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      include: { category: true }
    });
    
    const habitsByCategory: Record<string, number> = {};
    habits.forEach(habit => {
      const categoryName = habit.category?.name || 'Uncategorized';
      habitsByCategory[categoryName] = (habitsByCategory[categoryName] || 0) + 1;
    });
    
    // 2. Progress 7 hari terakhir
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const startOfDay = getStartOfDate(date);
      const endOfDay = getEndOfDate(date);
      
      const checkIns = await this.prisma.checkIn.count({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        dateDisplay: date.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }),
        checkIns
      });
    }
    
    // 3. Completion rate bulan ini
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = getStartOfDate(firstDayOfMonth);
    
    const activeHabits = await this.prisma.habit.count({
      where: { userId, isActive: true }
    });
    
    const daysInMonth = today.getDate();
    const possibleCheckIns = activeHabits * daysInMonth;
    
    const actualCheckIns = await this.prisma.checkIn.count({
      where: {
        userId,
        date: { gte: startOfMonth }
      }
    });
    
    const completionRate = possibleCheckIns > 0 
      ? Math.round((actualCheckIns / possibleCheckIns) * 100)
      : 0;
    
    return {
      habitsByCategory,
      last7Days,
      monthlyCompletion: completionRate
    };
  }
  
  // Helper: Hitung streak - OPTIMIZED VERSION
  private async calculateStreak(userId: string): Promise<number> {
    // Ambil 30 hari terakhir sekaligus (lebih efisien)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo }
      },
      select: { date: true },
      orderBy: { date: 'desc' }
    });
    
    // Kelompokkan check-in per hari
    const checkInDates = new Set(
      checkIns.map(checkIn => {
        const date = new Date(checkIn.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );
    
    // Hitung streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      if (checkInDates.has(currentDate.getTime())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }
}