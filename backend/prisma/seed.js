import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  { name: "Jollof Rice", category: "Mains", price: 6500, prepTime: 25, image: "https://i.pinimg.com/736x/29/90/5b/29905b5e366cf1301132177b032beebc.jpg", description: "Smoky party jollof with chicken" },
  { name: "Suya Platter", category: "Starters", price: 4500, prepTime: 15, image: "https://i.pinimg.com/736x/81/b5/c9/81b5c93ed13eab65c4c696ab1b19af68.jpg", description: "Spicy grilled beef suya" },
  { name: "Chapman", category: "Drinks", price: 2500, prepTime: 5, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop", description: "Classic Nigerian mocktail" },
  { name: "Asun Pasta", category: "Mains", price: 7500, prepTime: 20, image: "https://i.pinimg.com/1200x/90/c6/50/90c6509610719c74e38634af77ee4cc0.jpg", description: "Spicy goat meat pasta" },
  { name: "Pepper Soup", category: "Starters", price: 4000, prepTime: 18, image: "https://i.pinimg.com/736x/11/52/b1/1152b1830bdea1bd1a77c1c999370b07.jpg", description: "Catfish pepper soup" },
  { name: "Zobo", category: "Drinks", price: 1500, prepTime: 3, image: "https://i.pinimg.com/736x/e1/be/f7/e1bef7c4a8e6b95a9e62b3dadf5206bb.jpg", description: "Hibiscus drink with fruits" },
];

const staff = [
  { name: "Grace Idowu", role: "Chef" },
  { name: "Shibola Ayomide", role: "Chef" },
  { name: "Kofi Mensah", role: "Bartender" },
  { name: "Ama Boateng", role: "Bartender" },
];

async function main() {
  await prisma.menuItem.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.menuItem.createMany({ data: menuItems });
  await prisma.staff.createMany({ data: staff });
  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());