/**
 * Idempotent database seed script for SUNN Foods.
 * Run with: npx tsx scripts/seed.ts   (requires a real MONGODB_URI in .env.local)
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import Admin from "../models/Admin";
import Category from "../models/Category";
import Product from "../models/Product";
import FAQ from "../models/FAQ";
import SiteSettings from "../models/SiteSettings";
import PageContent from "../models/PageContent";
import Discount from "../models/Discount";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local before running the seed script.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Admin
  const adminEmail = "admin@sunfoodsinc.com";
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
    await Admin.create({ name: "Kumar Padmanabhuni", email: adminEmail, passwordHash });
    console.log(`Created admin user: ${adminEmail} / ChangeMe123! (change this immediately)`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  // Categories
  const categoryDefs = [
    { name: "Protein Bars", slug: "protein-bars", description: "Plant-based protein bars for everyday energy.", image: "/cat1.png" },
    { name: "Sunnundalu", slug: "sunnundalu", description: "Traditional South Indian urad dal and ghee sweets.", image: "/cat2.png" },
    { name: "Kids Bars", slug: "kids-bars", description: "Family-friendly bars made with kids in mind.", image: "/cat3.png" },
  ];
  const categoryDocs: Record<string, mongoose.Types.ObjectId> = {};
  for (const c of categoryDefs) {
    const existing = await Category.findOne({ slug: c.slug }).lean();
    if (existing && !existing.image) {
      await Category.updateOne({ slug: c.slug }, { $set: { image: c.image } });
    }
    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      { $setOnInsert: c },
      { upsert: true, new: true }
    );
    categoryDocs[c.slug] = doc._id;
  }
  console.log("Categories seeded.");

  // Products
  const productDefs = [
    {
      name: "Protein Bar Single",
      slug: "protein-bar-single",
      shortDescription: "One plant-based protein bar, perfect for on the go.",
      price: 1.99,
      category: categoryDocs["protein-bars"],
      stock: 200,
      packSize: "1 bar",
      featured: true,
      badges: ["New"],
      mainImage: "/pro1.png",
    },
    {
      name: "Protein Bar Box (6-Pack)",
      slug: "protein-bar-box-6-pack",
      shortDescription: "Six plant-based protein bars, great value for the week.",
      price: 10,
      category: categoryDocs["protein-bars"],
      stock: 120,
      packSize: "6 bars",
      featured: true,
      badges: ["Best Value"],
      mainImage: "/pro2.png",
    },
    {
      name: "Traditional Sunnundalu (10pc)",
      slug: "traditional-sunnundalu-10pc",
      shortDescription: "Ten traditional South Indian urad dal and ghee sweets.",
      price: 15,
      category: categoryDocs["sunnundalu"],
      stock: 80,
      packSize: "10 pieces",
      featured: true,
      badges: ["Family Favorite"],
      mainImage: "/pro3.png",
      ingredients:
        "Originally made from urad dal, ghee and sugar. Variants may include peanuts, sugar cane juice sugar or dates paste in place of refined sugar, and peanut, cashew or almond additions.",
    },
    {
      name: "Kids Bars (8pc)",
      slug: "kids-bars-8pc",
      shortDescription: "Eight kid-friendly bars made for growing families.",
      price: 15,
      category: categoryDocs["kids-bars"],
      stock: 100,
      packSize: "8 bars",
      featured: true,
      badges: ["Kid Approved"],
      mainImage: "/pro4.png",
    },
  ];

  for (const p of productDefs) {
    const existing = await Product.findOne({ slug: p.slug }).lean();
    if (existing && !existing.mainImage) {
      await Product.updateOne({ slug: p.slug }, { $set: { mainImage: p.mainImage } });
    }
    await Product.findOneAndUpdate(
      { slug: p.slug },
      { $setOnInsert: p },
      { upsert: true, new: true }
    );
  }
  console.log("Products seeded.");

  // FAQs
  const faqDefs = [
    {
      question: "Where do you currently ship?",
      answer: "We currently serve the Greater Toronto Area. Wider shipping is coming soon.",
      category: "Shipping",
      order: 1,
    },
    {
      question: "Are your products vegan or gluten-free?",
      answer: "Detailed ingredient and dietary information is listed on each product page and is updated as our recipes are finalized.",
      category: "Ingredients",
      order: 2,
    },
    {
      question: "How do I place a bulk or wholesale order?",
      answer: "Please reach out through our Contact page and our team will get back to you about wholesale options.",
      category: "Ordering",
      order: 3,
    },
  ];
  for (const f of faqDefs) {
    await FAQ.findOneAndUpdate(
      { question: f.question },
      { $setOnInsert: f },
      { upsert: true, new: true }
    );
  }
  console.log("FAQs seeded.");

  // Site settings
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({});
    console.log("Default site settings created.");
  }

  // Page content
  for (const page of ["home", "about", "contact"]) {
    const existing = await PageContent.findOne({ page });
    if (!existing) {
      await PageContent.create({ page });
    }
  }
  console.log("Page content scaffolding created.");

  // Early bird discount example
  const existingDiscount = await Discount.findOne({ title: "Early Bird: Buy 3 Boxes, Save 30%" });
  if (!existingDiscount) {
    await Discount.create({
      title: "Early Bird: Buy 3 Boxes, Save 30%",
      description: "Buy 3 or more boxes and save 30% automatically at checkout.",
      type: "percentage",
      value: 30,
      minQuantity: 3,
      active: true,
    });
    console.log("Early bird discount seeded.");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
