export const generateMotariReport = (data) => {
  const {
    earnings = 0,
    expenses = 0,
    kmPerDay = 0,
    fuelConsumptionPerKm = 0,
    fuelPrice = 0
  } = data;

  // 🔥 CALCULATIONS
  const profit = earnings - expenses;

  const dailyFuel = kmPerDay * fuelConsumptionPerKm;
  const weeklyFuel = dailyFuel * 7;
  const monthlyFuel = dailyFuel * 30;

  const weeklyFuelCost = weeklyFuel * fuelPrice;
  const monthlyFuelCost = monthlyFuel * fuelPrice;

  const performanceScore =
    profit > 0 ? Math.min(100, (profit / 1000) + 50) : 20;

  return {
    profit,
    fuel: {
      dailyFuel,
      weeklyFuel,
      monthlyFuel,
      weeklyFuelCost,
      monthlyFuelCost
    },
    performanceScore
  };
};