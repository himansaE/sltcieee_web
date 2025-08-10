/*
  One-off maintenance script to migrate legacy HeroAnnouncement.backgroundType
  from 'GRADIENT' to 'IMAGE' after schema change (image-only hero).

  Usage:
    node scripts/fix-hero-enum.js
*/

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    // For MongoDB: use raw command to update documents with legacy value
    const result = await prisma.$runCommandRaw({
      update: "heroAnnouncement",
      updates: [
        {
          q: { backgroundType: "GRADIENT" },
          u: {
            $set: { backgroundType: "IMAGE" },
            $unset: { gradientStyle: "", mobileImageUrl: "" },
          },
          multi: true,
          upsert: false,
        },
      ],
      ordered: true,
    });
    console.log("Update result:", JSON.stringify(result));

    // Optionally, ensure any null/empty backgroundType are set to IMAGE
    const result2 = await prisma.$runCommandRaw({
      update: "heroAnnouncement",
      updates: [
        {
          q: { $or: [ { backgroundType: { $exists: false } }, { backgroundType: null } ] },
          u: { $set: { backgroundType: "IMAGE" } },
          multi: true,
          upsert: false,
        },
      ],
      ordered: true,
    });
    console.log("Normalize missing backgroundType:", JSON.stringify(result2));
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
