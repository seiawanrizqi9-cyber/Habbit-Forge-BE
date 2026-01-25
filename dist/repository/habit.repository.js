export class HabitRepository {
    prismaInstance;
    constructor(prismaInstance) {
        this.prismaInstance = prismaInstance;
    }
    get prisma() {
        return this.prismaInstance;
    }
    async list(skip, take, where, orderBy) {
        return await this.prismaInstance.habit.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                category: true,
                user: true,
            },
        });
    }
    async countAll(where) {
        return await this.prismaInstance.habit.count({ where });
    }
    async findById(id) {
        return await this.prismaInstance.habit.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
                user: true,
                checkIn: true,
            },
        });
    }
    async create(data) {
        return await this.prismaInstance.habit.create({ data });
    }
    async update(id, data) {
        return await this.prismaInstance.habit.update({
            where: {
                id,
            },
            data,
        });
    }
    async softDelete(id) {
        return await this.prismaInstance.habit.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
    async toggleActive(id) {
        const habit = await this.prismaInstance.habit.findUnique({
            where: {
                id,
            },
            select: { isActive: true },
        });
        if (!habit) {
            throw new Error("Habit tidak ditemukan");
        }
        return await this.prismaInstance.habit.update({
            where: {
                id,
            },
            data: {
                isActive: !habit.isActive,
            },
        });
    }
}
