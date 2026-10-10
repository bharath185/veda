import { PrismaClient, UserRole, DeliveryAgentStatus, CouponType } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to hash password matching the auth service Argon2id/crypto fallback
function hashPasswordMock(password: string): string {
  const salt = 'shopflow_static_salt_for_dev_seed';
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

async function main() {
  console.log('🌱 Starting ShopFlow Database Seed...');

  // Clean existing data
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `).catch(() => {
    console.log('Skipping truncate if tables not yet created or non-postgres');
  });

  // 1. Seed Users
  const passwordHash = hashPasswordMock('ShopFlow@1234');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopflow.io' },
    update: {},
    create: {
      email: 'admin@shopflow.io',
      name: 'ShopFlow Super Admin',
      passwordHash,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      phone: '+919876543210',
    },
  });

  const deliveryUser = await prisma.user.upsert({
    where: { email: 'delivery@shopflow.io' },
    update: {},
    create: {
      email: 'delivery@shopflow.io',
      name: 'Ramesh Express Delivery',
      passwordHash,
      role: UserRole.DELIVERY,
      isEmailVerified: true,
      phone: '+919876543211',
    },
  });

  await prisma.deliveryAgent.upsert({
    where: { userId: deliveryUser.id },
    update: {},
    create: {
      userId: deliveryUser.id,
      vehicleType: 'EV Scooter',
      vehicleNumber: 'KA-01-EQ-9988',
      status: DeliveryAgentStatus.AVAILABLE,
      currentOrders: 0,
      rating: 4.95,
      totalDeliveries: 342,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@shopflow.io' },
    update: {},
    create: {
      email: 'customer@shopflow.io',
      name: 'Priya Sharma',
      passwordHash,
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      phone: '+919876543212',
    },
  });

  const customerAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      phone: '+919876543212',
      street: '124, 4th Main, Indiranagar 100ft Road',
      apartment: 'Prestige Heights Apt #402',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'IN',
      latitude: 12.9716,
      longitude: 77.6412,
      isDefault: true,
    },
  });

  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@shopflow.io' },
    update: {},
    create: {
      email: 'vendor@shopflow.io',
      name: 'UrbanStyle Brands Ltd',
      passwordHash,
      role: UserRole.VENDOR,
      isEmailVerified: true,
      phone: '+919876543213',
    },
  });

  console.log('✅ Users & Roles created: Admin, Delivery, Customer, Vendor');

  // 2. Seed 10 Categories
  const categoryDefs = [
    { name: 'Smartphones & Accessories', slug: 'smartphones-accessories', description: 'Next-gen flagship phones, cases, chargers and wireless audio.' },
    { name: 'Laptops & Computing', slug: 'laptops-computing', description: 'Ultrabooks, gaming rigs, mechanical keyboards, and 4K monitors.' },
    { name: 'Audio & Headphones', slug: 'audio-headphones', description: 'Audiophile headphones, noise-cancelling earbuds, and smart home speakers.' },
    { name: 'Smart Wearables', slug: 'smart-wearables', description: 'Fitness bands, titanium smartwatches, and bio-tracking rings.' },
    { name: 'Men Fashion & Apparel', slug: 'men-fashion', description: 'Premium streetwear, breathable linen shirts, and tailor-fit denim.' },
    { name: 'Women Fashion & Luxury', slug: 'women-fashion', description: 'Contemporary ethnic wear, designer dresses, and organic cotton essentials.' },
    { name: 'Home & Smart Living', slug: 'home-smart-living', description: 'Robot vacuums, ergonomic standing desks, and ambient IoT lighting.' },
    { name: 'Fitness & Sports', slug: 'fitness-sports', description: 'Adjustable dumbbells, yoga mats, resistance bands, and hydration packs.' },
    { name: 'Beauty & Skincare', slug: 'beauty-skincare', description: 'Dermatologist-tested serums, sunscreen, and botanical cleansers.' },
    { name: 'Books & Stationery', slug: 'books-stationery', description: 'Bestselling paperbacks, fountain pens, and bullet journals.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoryDefs) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80`,
      },
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log('✅ 10 Categories seeded');

  // 3. Seed 50 Products with Variants & Inventory
  const productSamples = [
    // Category 1: Smartphones & Accessories (5 items)
    { title: 'Aura Pro 5G Flagship Smartphone', slug: 'aura-pro-5g-smartphone', cat: 'smartphones-accessories', price: 69999, compare: 79999, tags: ['flagship', '5g', 'oled', 'camera'], stock: 45 },
    { title: 'UltraShield Magnetic Kevlar Case', slug: 'ultrashield-kevlar-case', cat: 'smartphones-accessories', price: 1999, compare: 2499, tags: ['magsafe', 'phone-case', 'carbon'], stock: 150 },
    { title: 'HyperCharge 120W GaN Fast Charger', slug: 'hypercharge-120w-gan-charger', cat: 'smartphones-accessories', price: 3499, compare: 4299, tags: ['gan', 'fast-charger', 'usbc'], stock: 80 },
    { title: 'MagGrip Wireless Car Mount & Qi2', slug: 'maggrip-qi2-wireless-car-mount', cat: 'smartphones-accessories', price: 2899, compare: 3500, tags: ['wireless', 'car-mount', 'qi2'], stock: 65 },
    { title: 'OptiClear Privacy Glass Screen Protector (2-Pack)', slug: 'opticlear-privacy-glass-pack', cat: 'smartphones-accessories', price: 899, compare: 1299, tags: ['screen-protector', 'tempered-glass'], stock: 300 },

    // Category 2: Laptops & Computing (5 items)
    { title: 'Zenith Titan 16" Creator Laptop (M3 Max, 64GB)', slug: 'zenith-titan-16-creator-laptop', cat: 'laptops-computing', price: 219999, compare: 239999, tags: ['laptop', 'workstation', 'creator'], stock: 15 },
    { title: 'Vortex Mechanical Wireless Keyboard RGB', slug: 'vortex-mechanical-wireless-keyboard', cat: 'laptops-computing', price: 8499, compare: 9999, tags: ['keyboard', 'rgb', 'mechanical', 'wireless'], stock: 90 },
    { title: 'Apex Ergo Precision Wireless Mouse', slug: 'apex-ergo-precision-mouse', cat: 'laptops-computing', price: 5499, compare: 6499, tags: ['mouse', 'ergonomic', 'bluetooth'], stock: 120 },
    { title: 'UltraView 34" Curved QD-OLED Monitor 175Hz', slug: 'ultraview-34-curved-qdoled-monitor', cat: 'laptops-computing', price: 74999, compare: 89999, tags: ['monitor', 'curved', 'oled', 'gaming'], stock: 22 },
    { title: 'ThunderDock 14-in-1 Thunderbolt 4 Docking Station', slug: 'thunderdock-14-in-1-docking-station', cat: 'laptops-computing', price: 15999, compare: 18999, tags: ['dock', 'thunderbolt4', 'usb-hub'], stock: 40 },

    // Category 3: Audio & Headphones (5 items)
    { title: 'SonicWave ANC Over-Ear Hi-Fi Headphones', slug: 'sonicwave-anc-over-ear-headphones', cat: 'audio-headphones', price: 24999, compare: 29999, tags: ['anc', 'headphones', 'hifi', 'audiophile'], stock: 55 },
    { title: 'PulseBuds Pro Spatial Audio Wireless Earbuds', slug: 'pulsebuds-pro-spatial-audio', cat: 'audio-headphones', price: 12999, compare: 15999, tags: ['earbuds', 'spatial-audio', 'tws'], stock: 140 },
    { title: 'SoundSphere 360 Room-Filling Smart Speaker', slug: 'soundsphere-360-smart-speaker', cat: 'audio-headphones', price: 16999, compare: 19999, tags: ['speaker', 'smart-home', 'dolby'], stock: 35 },
    { title: 'BassPod Portable Waterproof Bluetooth Speaker IP67', slug: 'basspod-portable-waterproof-speaker', cat: 'audio-headphones', price: 4499, compare: 5999, tags: ['waterproof', 'bluetooth', 'speaker'], stock: 85 },
    { title: 'StudioCraft XLR Dynamic Podcast Microphone', slug: 'studiocraft-xlr-dynamic-microphone', cat: 'audio-headphones', price: 9999, compare: 12499, tags: ['microphone', 'podcast', 'studio'], stock: 30 },

    // Category 4: Smart Wearables (5 items)
    { title: 'Chronos Horizon Titanium Smartwatch 46mm', slug: 'chronos-horizon-titanium-smartwatch', cat: 'smart-wearables', price: 34999, compare: 39999, tags: ['smartwatch', 'titanium', 'gps', 'ecg'], stock: 45 },
    { title: 'VitalRing Gen 3 Sleep & Readiness Smart Ring', slug: 'vitalring-gen-3-smart-ring', cat: 'smart-wearables', price: 19999, compare: 22999, tags: ['smart-ring', 'sleep-tracker', 'biometrics'], stock: 60 },
    { title: 'AeroBand Pro Lightweight GPS Fitness Tracker', slug: 'aeroband-pro-fitness-tracker', cat: 'smart-wearables', price: 4999, compare: 6499, tags: ['fitness-tracker', 'waterproof', 'heart-rate'], stock: 110 },
    { title: 'PulseGlow Hydro-Proof Braided Watch Strap 22mm', slug: 'pulseglow-braided-watch-strap', cat: 'smart-wearables', price: 1499, compare: 1999, tags: ['strap', 'accessories', 'braided'], stock: 200 },
    { title: 'CardioBeat Wireless Chest Strap HRM Sensor', slug: 'cardiobeat-chest-strap-hrm', cat: 'smart-wearables', price: 3299, compare: 3999, tags: ['hrm', 'sensor', 'training'], stock: 75 },

    // Category 5: Men Fashion & Apparel (5 items)
    { title: 'TerraBreeze Organic Supima Heavyweight Tee', slug: 'terrabreeze-supima-heavyweight-tee', cat: 'men-fashion', price: 1899, compare: 2499, tags: ['tshirt', 'organic', 'minimal', 'cotton'], stock: 250 },
    { title: 'Nomad Tech All-Weather Waterproof Trench Coat', slug: 'nomad-tech-waterproof-trench-coat', cat: 'men-fashion', price: 9999, compare: 12999, tags: ['jacket', 'waterproof', 'outerwear'], stock: 40 },
    { title: 'UrbanKnit Merino Wool Relaxed Quarter-Zip', slug: 'urbanknit-merino-wool-quarter-zip', cat: 'men-fashion', price: 5499, compare: 6999, tags: ['sweater', 'merino-wool', 'winter'], stock: 60 },
    { title: 'AeroFlex 4-Way Stretch Performance Chino', slug: 'aeroflex-stretch-performance-chino', cat: 'men-fashion', price: 3499, compare: 4499, tags: ['pants', 'chinos', 'stretch'], stock: 115 },
    { title: 'Legacy Handcrafted Italian Leather Oxford Shoes', slug: 'legacy-handcrafted-leather-oxford', cat: 'men-fashion', price: 8999, compare: 11999, tags: ['footwear', 'formal', 'leather'], stock: 35 },

    // Category 6: Women Fashion & Luxury (5 items)
    { title: 'Aurelia Mulberry Silk Evening Wrap Dress', slug: 'aurelia-mulberry-silk-wrap-dress', cat: 'women-fashion', price: 11499, compare: 14999, tags: ['dress', 'silk', 'luxury', 'evening'], stock: 28 },
    { title: 'Solstice Handwoven Chanderi Floral Saree', slug: 'solstice-handwoven-chanderi-saree', cat: 'women-fashion', price: 7999, compare: 9999, tags: ['saree', 'ethnic', 'handwoven'], stock: 45 },
    { title: 'CloudStep Ultra-Cushioned Leather Loafers', slug: 'cloudstep-leather-loafers', cat: 'women-fashion', price: 4499, compare: 5499, tags: ['shoes', 'loafers', 'comfort'], stock: 70 },
    { title: 'Lumina Vegan Saffiano Leather Structured Tote', slug: 'lumina-vegan-saffiano-tote', cat: 'women-fashion', price: 5999, compare: 7499, tags: ['bag', 'tote', 'vegan-leather'], stock: 50 },
    { title: 'Breeze Linen Oversized Resort Shirt', slug: 'breeze-linen-oversized-resort-shirt', cat: 'women-fashion', price: 2699, compare: 3299, tags: ['shirt', 'linen', 'casual'], stock: 120 },

    // Category 7: Home & Smart Living (5 items)
    { title: 'RoboClean Lidar Omni Self-Emptying Vacuum & Mop', slug: 'roboclean-lidar-omni-vacuum-mop', cat: 'home-smart-living', price: 48999, compare: 58999, tags: ['vacuum', 'smart-home', 'robotics'], stock: 20 },
    { title: 'AuraGlow Smart Gradient Floor Lamp Matter-Ready', slug: 'auraglow-smart-gradient-floor-lamp', cat: 'home-smart-living', price: 7999, compare: 9999, tags: ['lighting', 'smart-home', 'matter'], stock: 65 },
    { title: 'ErgoRise Dual-Motor Electric Standing Desk 140x70', slug: 'ergorise-dual-motor-standing-desk', cat: 'home-smart-living', price: 26999, compare: 31999, tags: ['desk', 'ergonomic', 'furniture'], stock: 25 },
    { title: 'AeroPure Smart HEPA H13 Air Purifier with AQI Display', slug: 'aeropure-smart-hepa-air-purifier', cat: 'home-smart-living', price: 13999, compare: 16999, tags: ['air-purifier', 'hepa', 'health'], stock: 45 },
    { title: 'HydroPure Countertop UV Reverse Osmosis Purifier', slug: 'hydropure-countertop-uv-ro-purifier', cat: 'home-smart-living', price: 18499, compare: 21999, tags: ['water-purifier', 'kitchen', 'uv'], stock: 30 },

    // Category 8: Fitness & Sports (5 items)
    { title: 'PowerDial 24kg Quick-Adjust Dumbbell Pair', slug: 'powerdial-quick-adjust-dumbbell-pair', cat: 'fitness-sports', price: 18999, compare: 22999, tags: ['dumbbell', 'home-gym', 'strength'], stock: 35 },
    { title: 'GripLock High-Density Natural Rubber Yoga Mat 6mm', slug: 'griplock-natural-rubber-yoga-mat', cat: 'fitness-sports', price: 2999, compare: 3999, tags: ['yoga', 'mat', 'pilates'], stock: 150 },
    { title: 'Velocity Pro High-Speed Bearing Jump Rope', slug: 'velocity-pro-speed-jump-rope', cat: 'fitness-sports', price: 999, compare: 1499, tags: ['crossfit', 'cardio', 'jump-rope'], stock: 180 },
    { title: 'HydraFlow Insulated 1.2L Stainless Steel Bottle', slug: 'hydraflow-insulated-steel-bottle', cat: 'fitness-sports', price: 1499, compare: 1999, tags: ['water-bottle', 'insulated', 'outdoor'], stock: 220 },
    { title: 'RecoveryGun Pro Deep Tissue Percussion Massager', slug: 'recoverygun-pro-deep-tissue-massager', cat: 'fitness-sports', price: 6999, compare: 8999, tags: ['massager', 'recovery', 'therapy'], stock: 55 },

    // Category 9: Beauty & Skincare (5 items)
    { title: 'Radiance Boost 15% Vitamin C + Ferulic Acid Serum', slug: 'radiance-boost-vitamin-c-serum', cat: 'beauty-skincare', price: 1299, compare: 1699, tags: ['serum', 'skincare', 'vitamin-c'], stock: 320 },
    { title: 'HydraBarrier Ceramide & Hyaluronic Moisture Cream', slug: 'hydrabarrier-ceramide-moisture-cream', cat: 'beauty-skincare', price: 999, compare: 1399, tags: ['moisturizer', 'ceramide', 'dry-skin'], stock: 280 },
    { title: 'SolarShield Invisible Aqua Gel Sunscreen SPF 50+ PA++++', slug: 'solarshield-invisible-aqua-sunscreen', cat: 'beauty-skincare', price: 799, compare: 999, tags: ['sunscreen', 'spf50', 'matte'], stock: 400 },
    { title: 'GlowPeel 10% AHA + 2% BHA Exfoliating Facial Peeling', slug: 'glowpeel-aha-bha-exfoliating-peeling', cat: 'beauty-skincare', price: 849, compare: 1199, tags: ['exfoliant', 'aha', 'bha'], stock: 210 },
    { title: 'GentleZen Centella Balancing Cleansing Oil 200ml', slug: 'gentlezen-centella-cleansing-oil', cat: 'beauty-skincare', price: 1099, compare: 1499, tags: ['cleanser', 'k-beauty', 'centella'], stock: 190 },

    // Category 10: Books & Stationery (5 items)
    { title: 'The Architectural Mindset: Systems & Scalability', slug: 'architectural-mindset-systems-scalability', cat: 'books-stationery', price: 1499, compare: 1799, tags: ['book', 'tech', 'architecture'], stock: 100 },
    { title: 'ZenWrite Hand-Turned Brass Fountain Pen (Fine Nib)', slug: 'zenwrite-brass-fountain-pen', cat: 'books-stationery', price: 3499, compare: 4299, tags: ['pen', 'fountain-pen', 'brass'], stock: 65 },
    { title: 'A5 Dotted Hardcover 160gsm Bullet Planner Notebook', slug: 'a5-dotted-hardcover-bullet-planner', cat: 'books-stationery', price: 1199, compare: 1599, tags: ['journal', 'stationery', 'planner'], stock: 210 },
    { title: 'Vintage Italian Top-Grain Leather Pen Sleeve', slug: 'vintage-leather-pen-sleeve', cat: 'books-stationery', price: 1699, compare: 2199, tags: ['accessories', 'leather', 'desk'], stock: 85 },
    { title: 'DeskZen Magnetic Walnut Cable Organizer & Block', slug: 'deskzen-walnut-cable-organizer', cat: 'books-stationery', price: 1899, compare: 2499, tags: ['desk-setup', 'wood', 'organization'], stock: 95 },

    // Extra items to make exactly 50 total products
    { title: 'SonicWave Wireless ANC Earbuds Compact', slug: 'sonicwave-compact-wireless-earbuds', cat: 'audio-headphones', price: 5999, compare: 7999, tags: ['earbuds', 'anc', 'wireless'], stock: 130 },
    { title: 'AuraView MagSafe Foldable Desk Stand', slug: 'auraview-magsafe-foldable-desk-stand', cat: 'smartphones-accessories', price: 1699, compare: 2199, tags: ['magsafe', 'stand', 'aluminum'], stock: 140 },
    { title: 'Zenith Sleeve 16" Water-Repellent Neoprene Case', slug: 'zenith-sleeve-16-inch-neoprene-case', cat: 'laptops-computing', price: 1899, compare: 2499, tags: ['laptop-case', 'sleeve', 'protective'], stock: 120 },
    { title: 'BioTrack Sleep Companion Smart Alarm Clock', slug: 'biotrack-sleep-companion-alarm-clock', cat: 'smart-wearables', price: 6499, compare: 7999, tags: ['alarm-clock', 'smart-home', 'sleep'], stock: 50 },
    { title: 'TerraBreeze Relaxed French Terry Hoodie', slug: 'terrabreeze-french-terry-hoodie', cat: 'men-fashion', price: 3899, compare: 4899, tags: ['hoodie', 'organic-cotton', 'streetwear'], stock: 80 },
    { title: 'AuraGold 18k Vermeil Dainty Chain Pendant', slug: 'auragold-18k-vermeil-chain-pendant', cat: 'women-fashion', price: 6499, compare: 7999, tags: ['jewelry', 'gold', 'pendant'], stock: 40 },
    { title: 'BrewMaster Smart Temperature Gooseneck Kettle', slug: 'brewmaster-smart-gooseneck-kettle', cat: 'home-smart-living', price: 7499, compare: 8999, tags: ['coffee', 'kettle', 'smart-kitchen'], stock: 45 },
    { title: 'IsoGrip Hex Neoprene Coated Kettlebell 16kg', slug: 'isogrip-kettlebell-16kg', cat: 'fitness-sports', price: 3499, compare: 4299, tags: ['kettlebell', 'crossfit', 'weights'], stock: 60 },
    { title: 'Bakuchiol 2% Age-Defense Retinol-Alternative Elixir', slug: 'bakuchiol-age-defense-elixir', cat: 'beauty-skincare', price: 1499, compare: 1899, tags: ['anti-aging', 'bakuchiol', 'clean-beauty'], stock: 150 },
    { title: 'Minimalist Walnut Monitor Riser with USB-C Pass-through', slug: 'walnut-monitor-riser-usbc-passthrough', cat: 'books-stationery', price: 4999, compare: 5999, tags: ['desk-setup', 'woodwork', 'ergonomics'], stock: 40 },
  ];

  console.log(`Creating ${productSamples.length} full e-commerce products with variants and inventories...`);

  for (let i = 0; i < productSamples.length; i++) {
    const p = productSamples[i];
    const categoryId = categoryMap.get(p.cat);
    if (!categoryId) continue;

    const imageUrl = `https://images.unsplash.com/photo-${1500000000000 + (i * 12345678 % 100000000)}?w=1000&auto=format&fit=crop&q=80`;

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: `Experience supreme engineering and refined aesthetics with the ${p.title}. Crafted from high-grade materials with uncompromising attention to detail, precision ergonomics, and peak endurance for daily use. Fully backed by ShopFlow 1-year warranty and express replacement service.`,
        categoryId,
        tags: p.tags,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80',
        ],
        featured: i < 8,
        isPublished: true,
        metaTitle: `${p.title} | ShopFlow Official Store`,
        metaDescription: `Buy ${p.title} online at best price with express shipping, genuine warranty, and instant discounts on ShopFlow.`,
        avgRating: 4.5 + ((i % 5) * 0.1),
        reviewCount: 12 + (i * 7),
      },
    });

    // Create 2 variants per product
    const variant1 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `SF-${p.slug.toUpperCase().slice(0, 8)}-STD`,
        size: 'Standard',
        color: 'Space Grey',
        price: p.price,
        compareAtPrice: p.compare,
        stock: p.stock,
        weight: 0.5,
      },
    });

    const variant2 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `SF-${p.slug.toUpperCase().slice(0, 8)}-PRO`,
        size: 'Deluxe',
        color: 'Midnight Black',
        price: p.price * 1.15,
        compareAtPrice: p.compare * 1.15,
        stock: Math.floor(p.stock * 0.7),
        weight: 0.6,
      },
    });

    // Create inventory entries
    await prisma.inventory.createMany({
      data: [
        {
          variantId: variant1.id,
          warehouse: 'MAIN_HUB_BANGALORE',
          quantity: p.stock,
          lowStockThreshold: 10,
        },
        {
          variantId: variant2.id,
          warehouse: 'MAIN_HUB_BANGALORE',
          quantity: Math.floor(p.stock * 0.7),
          lowStockThreshold: 8,
        },
      ],
    });

    // Seed customer cart with first item
    if (i === 0) {
      const cart = await prisma.cart.create({
        data: {
          userId: customer.id,
        },
      });

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variant1.id,
          quantity: 1,
        },
      });
    }
  }

  // 4. Seed Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME500',
        description: 'Flat ₹500 discount on first order above ₹2,000',
        discountType: CouponType.FLAT,
        discountValue: 500,
        minOrderValue: 2000,
        isActive: true,
      },
      {
        code: 'SUPERFEST20',
        description: '20% discount up to ₹3,000 during festival sale',
        discountType: CouponType.PERCENTAGE,
        discountValue: 20,
        minOrderValue: 1500,
        maxDiscount: 3000,
        isActive: true,
      },
    ],
  });

  console.log('✅ Coupons created: WELCOME500, SUPERFEST20');
  console.log('🎉 Seed completed successfully! 50 products, 10 categories, complete user roles & inventory ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error in database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
