export const askAI = async (data) => {
  const {
    message,
    earnings,
    expenses,
    kmPerDay,
    fuelPrice,
    fuelConsumptionPerKm,
    bikeCondition
  } = data;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a SMART MOTARI BUSINESS ASSISTANT for Rwanda.

You MUST:
- Use simple English or Kinyarwanda
- Give short practical answers
- Help with money, fuel, and motorcycle health
- Think like a business advisor

You help with:
1. Income management
2. Fuel calculation
3. Motorcycle maintenance prediction
4. Profit advice
`
      },
      {
        role: "user",
        content: `
User question: ${message}

Business data:
- Earnings: ${earnings}
- Expenses: ${expenses}
- Km per day: ${kmPerDay}
- Fuel price per liter: ${fuelPrice}
- Fuel consumption per km: ${fuelConsumptionPerKm}
- Bike condition: ${bikeCondition}
`
      }
    ]
  });

  return response.choices[0].message.content;
};