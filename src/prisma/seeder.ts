import { Frequency, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import {
  parseDateFromFE,
  getTodayDateString,
  getYesterdayDateString,
} from "../utils/timeUtils.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.checkIn.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany(); // Clear categories (we'll recreate)

  // 1. Seed SYSTEM Categories (5 fixed categories)
  console.log("📂 Seeding system categories...");

  const systemCategories = [
    {
      id: "cat-healthy",
      name: "HEALTHY",
      color: "#10B981",
      icon: "💊",
      description: "Kebiasaan untuk kesehatan fisik & mental",
    },
    {
      id: "cat-finance",
      name: "FINANCE",
      color: "#EF4444",
      icon: "💰",
      description: "Kebiasaan pengelolaan keuangan",
    },
    {
      id: "cat-work",
      name: "WORK",
      color: "#F59E0B",
      icon: "💼",
      description: "Kebiasaan produktivitas & pekerjaan",
    },
    {
      id: "cat-learning",
      name: "LEARNING",
      color: "#8B5CF6",
      icon: "📚",
      description: "Kebiasaan belajar & pengembangan diri",
    },
    {
      id: "cat-social",
      name: "SOCIAL",
      color: "#3B82F6",
      icon: "👥",
      description: "Kebiasaan hubungan sosial & keluarga",
    },
  ];

  // Create categories with explicit IDs
  for (const category of systemCategories) {
    await prisma.category.create({
      data: category,
    });
  }

  // 2. Seed Users
  console.log("👤 Seeding users...");

  const password = await hash("password123", 10);

  const john = await prisma.user.create({
    data: {
      id: "user-john",
      email: "john@example.com",
      username: "johndoe",
      password: password,
      profile: {
        create: {
          fullName: "John Doe",
          bio: "Suka olahraga dan belajar hal baru",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
      },
    },
  });

  const jane = await prisma.user.create({
    data: {
      id: "user-jane",
      email: "jane@example.com",
      username: "janesmith",
      password: password,
      profile: {
        create: {
          fullName: "Jane Smith",
          bio: "Fokus pada kesehatan dan produktivitas",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
      },
    },
  });

  // 3. Get categories for reference
  const categories = await prisma.category.findMany();
  const getCategory = (name: string) => categories.find((c) => c.name === name);

  // 4. Seed Habits
  console.log("🎯 Seeding habits...");

  const habitsData = [
    // John's habits
    {
      id: "habit-john-001",
      title: "Minum Air 8 Gelas",
      description: "Minum minimal 8 gelas air setiap hari",
      startDate: parseDateFromFE("2024-01-01"),
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: getCategory("HEALTHY")!.id, // ! karena pasti ada
    },
    {
      id: "habit-john-002",
      title: "Baca Buku",
      description: "Baca minimal 10 halaman buku setiap hari",
      startDate: parseDateFromFE("2024-01-03"),
      frequency: Frequency.DAILY,
      userId: john.id,
      categoryId: getCategory("LEARNING")!.id,
    },
    // Jane's habits
    {
      id: "habit-jane-001",
      title: "Meditasi Pagi",
      description: "Meditasi 10 menit setiap pagi",
      startDate: parseDateFromFE("2024-01-04"),
      frequency: Frequency.DAILY,
      userId: jane.id,
      categoryId: getCategory("HEALTHY")!.id,
    },
    {
      id: "habit-jane-002",
      title: "Catat Pengeluaran",
      description: "Mencatat semua pengeluaran harian",
      startDate: parseDateFromFE("2024-01-05"),
      frequency: Frequency.WEEKLY,
      userId: jane.id,
      categoryId: getCategory("FINANCE")!.id,
    },
  ];

  for (const habit of habitsData) {
    await prisma.habit.create({
      data: habit,
    });
  }

  // 5. Seed Check-ins
  console.log("✅ Seeding check-ins...");

  const today = new Date(getTodayDateString());
  const yesterday = new Date(getYesterdayDateString());

  await prisma.checkIn.createMany({
    data: [
      {
        habitId: "habit-john-001",
        userId: john.id,
        date: today,
        note: "Sudah minum 8 gelas hari ini",
      },
      {
        habitId: "habit-john-002",
        userId: john.id,
        date: today,
        note: "Baca chapter 5",
      },
      {
        habitId: "habit-john-001",
        userId: john.id,
        date: yesterday,
        note: null,
      },
      {
        habitId: "habit-jane-001",
        userId: jane.id,
        date: today,
        note: "Meditasi pagi hari",
      },
    ],
  });

  // 6. Print Summary
  console.log("\n✨ Seed completed!");
  console.log("====================");
  console.log(`📂 Categories: ${systemCategories.length} system categories`);
  console.log(`👤 Users: 2`);
  console.log(`🎯 Habits: ${habitsData.length} habits`);
  console.log(`✅ Check-ins: 4 check-ins`);
  console.log("\n🔑 Login credentials:");
  console.log("- Email: john@example.com / jane@example.com");
  console.log("- Password: password123");
}

// Timezone setting
if (!process.env.TZ) {
  process.env.TZ = "Asia/Jakarta";
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
