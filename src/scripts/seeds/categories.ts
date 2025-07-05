import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

const categoryNames = [
  "Cars",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film",
  "How-to",
  "Music",
  "News",
  "People",
  "Pets",
  "Technology",
  "Sports",
  "Travel",
];

async function main() {
  console.warn("Seeding categories...");

  try {
    const values = categoryNames.map(name => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await db.insert(categoriesTable).values(values);

    // console.warn("Categories seeded successfully!");
  }
  catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
