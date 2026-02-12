import type { Tank, TankPlant } from "@prisma/client";

interface GeneratedTask {
  title: string;
  description: string;
  category: string;
  frequencyDays: number;
}

export function generateMaintenanceSchedule(
  tank: Tank & { plants: TankPlant[] }
): GeneratedTask[] {
  const tasks: GeneratedTask[] = [];
  const isNano = tank.tankType === "NANO";
  const isHighTech = tank.tankType === "HIGH_TECH";
  const hasPlants = tank.plants.length > 0;

  // Water change
  const wcFreq = isNano ? 4 : isHighTech ? 7 : 10;
  tasks.push({
    title: "Water Change",
    description: `Perform a ${isHighTech ? "50%" : "25-30%"} water change.`,
    category: "WATER_CHANGE",
    frequencyDays: wcFreq,
  });

  // Glass cleaning
  tasks.push({
    title: "Glass Cleaning",
    description: "Clean algae from glass walls using a scraper or magnet cleaner.",
    category: "GLASS_CLEAN",
    frequencyDays: 7,
  });

  // Filter cleaning
  if (tank.filterType) {
    const ft = tank.filterType.toLowerCase();
    let freq = 30;
    if (ft.includes("sponge")) freq = 14;
    else if (ft.includes("canister")) freq = 90;
    else if (ft.includes("hob") || ft.includes("hang")) freq = 30;

    tasks.push({
      title: "Filter Maintenance",
      description: `Clean or rinse ${tank.filterType} filter media in tank water.`,
      category: "FILTER_CLEAN",
      frequencyDays: freq,
    });
  }

  // CO2 refill check
  if (tank.hasCO2) {
    tasks.push({
      title: "CO2 Refill Check",
      description: "Check CO2 cylinder pressure and refill if needed.",
      category: "CO2_REFILL",
      frequencyDays: 42,
    });
  }

  // Water testing
  const testFreq = isNano ? 3 : 7;
  tasks.push({
    title: "Water Testing",
    description: "Test ammonia, nitrite, nitrate, pH, and other parameters.",
    category: "WATER_TEST",
    frequencyDays: testFreq,
  });

  // Plant trimming
  if (hasPlants) {
    tasks.push({
      title: "Plant Trimming",
      description: "Trim overgrown plants and remove dead leaves.",
      category: "TRIMMING",
      frequencyDays: isHighTech ? 7 : 14,
    });
  }

  // Equipment check
  tasks.push({
    title: "Equipment Check",
    description: "Inspect heater, filter, lights, and CO2 system for proper operation.",
    category: "EQUIPMENT_CHECK",
    frequencyDays: 30,
  });

  return tasks;
}
