export class HabitRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
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
    async countAll(where) {
        return await this.prisma.habit.count({ where });
    }
    async findById(id) {
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
    async create(data) {
        return await this.prisma.habit.create({ data });
    }
    async update(id, data) {
        return await this.prisma.habit.update({
            where: { id },
            data,
        });
    }
    async hardDelete(id) {
        return await this.prisma.habit.delete({
            where: { id },
        });
    }
    async toggleActive(id) {
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
    async getHabitsWithTodayCheckIns(userId, dateRange) {
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
