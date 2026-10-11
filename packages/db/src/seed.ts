import { PrismaClient, UserRole, DeliveryAgentStatus, CouponType } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPasswordMock(password: string): string {
  const salt = 'shopflow_static_salt_for_dev_seed';
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

async function main() {
  console.log('🌿 Starting ShopFlow Veda - Authentic Ayurveda & Herbal Wellness Seed...');

  // 1. Seed Core Accounts
  const passwordHash = hashPasswordMock('ShopFlow@1234');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopflow.io' },
    update: {},
    create: {
      email: 'admin@shopflow.io',
      name: 'Vaidya R. K. Sharma (Chief Ayurvedic Officer)',
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
      name: 'Ramesh Express Delivery (Herbal Logistics)',
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
      vehicleType: 'EV Scooter (Eco Delivery)',
      vehicleNumber: 'KA-01-EQ-9988',
      status: DeliveryAgentStatus.AVAILABLE,
      currentOrders: 0,
      rating: 4.96,
      totalDeliveries: 420,
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

  await prisma.address.create({
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
      name: 'Kerala Ayurveda Botanical Gardens Ltd',
      passwordHash,
      role: UserRole.VENDOR,
      isEmailVerified: true,
      phone: '+919876543213',
    },
  });

  console.log('✅ Ayurvedic Practitioners, Admin & Test Users Seeded');

  // 2. Seed 10 Classical Ayurveda & Non-Pharma Wellness Categories
  const categoryDefs = [
    { name: 'Classical Rasayanas & Chyawanprash', slug: 'classical-rasayanas', description: 'Ancient restorative revitalizers, A2 cow ghee Chyawanprash, and herbal jams for vitality and longevity.' },
    { name: 'Pure Herbal Supplements & Capsules', slug: 'herbal-supplements', description: 'Standardized KSM-66 Ashwagandha, Himalayan Shilajit resin, Curcumin 95%, and pure botanicals.' },
    { name: 'Organic Churnas & Single Herb Powders', slug: 'churnas-kwath', description: 'Stone-ground Triphala, Ashwagandha, Trikatu, Amla, and Shatavari fine medicinal churnas.' },
    { name: 'Medicated Thailams & Classical Oils', slug: 'ayurvedic-thailams', description: 'Authentic Tailams brewed for 21 days: Mahanarayan, Ksheerabala 101, Anu Tailam Nasya, and pain relief oils.' },
    { name: 'Ayurvedic Botanical Skincare', slug: 'botanical-skincare', description: 'Kashmiri Kumkumadi Tailam, Nalpamradi glow oils, Sandalwood ubtans, and pure saffron face elixirs.' },
    { name: 'Classical Hair Care & Bhringraj', slug: 'hair-nourishment', description: 'Neelibhringadi cold-pressed hair tonics, Bhringraj infused oils, and herbal Reetha scalp cleansers.' },
    { name: 'Digestive & Gut Health Tonics', slug: 'digestive-gut-health', description: 'Hingwashtak, Triphala detox, Isabgol, and classical fermented Asava-Arishta digestive tonics.' },
    { name: 'Immunity Kadhas & Herbal Drops', slug: 'immunity-kadhas', description: 'Ayush Kwath decoction concentrates, Pancha Tulsi drops, Giloy Ghanvati, and throat-soothing syrups.' },
    { name: 'Mind, Sleep & Stress Tonics', slug: 'stress-sleep-tonics', description: 'Brahmi Medhya Rasayana, Shankhpushpi elixirs, Jatamansi calming sleep drops, and Saraswatarishta.' },
    { name: 'Detox Herbal Teas & Infusions', slug: 'wellness-herbal-teas', description: 'Cumin-Coriander-Fennel CCF tri-dosha tea, Spiced Tulsi ginger brew, and caffeine-free evening tisanes.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoryDefs) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      },
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log('✅ 10 Classical Ayurveda Categories Seeded');

  // 3. Seed 50 Authentic Ayurvedic & Herbal Health Products (Non-Pharma)
  const ayurvedaProducts = [
    // Category 1: Classical Rasayanas & Chyawanprash (5 items)
    { title: 'Swarna Bhasma Amrit Chyawanprash with Wild Forest Amla (1kg)', slug: 'swarna-bhasma-chyawanprash-1kg', cat: 'classical-rasayanas', price: 1499, compare: 1799, tags: ['chyawanprash', 'swarna-bhasma', 'immunity', 'amla', 'rasayana'], stock: 85 },
    { title: 'Brahma Rasayana Brain & Longevity Elixir (500g)', slug: 'brahma-rasayana-brain-elixir', cat: 'classical-rasayanas', price: 649, compare: 799, tags: ['medhya', 'rasayana', 'memory', 'brahmi', 'shankhpushpi'], stock: 60 },
    { title: 'Ashwagandha Avaleha Vitality Herbal Jam (400g)', slug: 'ashwagandha-avaleha-vitality-jam', cat: 'classical-rasayanas', price: 549, compare: 699, tags: ['ashwagandha', 'avaleha', 'stamina', 'strength'], stock: 95 },
    { title: 'Shatavari Gulam Classical Hormonal Harmony Rasayana (500g)', slug: 'shatavari-gulam-hormonal-harmony', cat: 'classical-rasayanas', price: 599, compare: 749, tags: ['shatavari', 'women-health', 'vitality', 'ayurveda'], stock: 70 },
    { title: 'Agastya Haritaki Rasayana Respiratory Wellness Jam (250g)', slug: 'agastya-haritaki-rasayana-respiratory', cat: 'classical-rasayanas', price: 380, compare: 480, tags: ['lungs', 'haritaki', 'cough-relief', 'herbal'], stock: 110 },

    // Category 2: Pure Herbal Supplements & Capsules (5 items)
    { title: 'Pure Himalayan Shilajit Resin (Gold Grade with Fulvic Acid 75%) 20g', slug: 'pure-himalayan-shilajit-resin-20g', cat: 'herbal-supplements', price: 1299, compare: 1699, tags: ['shilajit', 'fulvic-acid', 'testosterone', 'energy', 'himalayan'], stock: 120 },
    { title: 'KSM-66 Organic Ashwagandha Root Extract 600mg (60 Veg Capsules)', slug: 'ksm66-organic-ashwagandha-capsules', cat: 'herbal-supplements', price: 799, compare: 999, tags: ['ashwagandha', 'ksm66', 'stress-relief', 'cortisol'], stock: 240 },
    { title: 'Turmeric Curcumin 95% with Piperine Black Pepper Extract (60 Veg Capsules)', slug: 'turmeric-curcumin-95-piperine-capsules', cat: 'herbal-supplements', price: 699, compare: 899, tags: ['curcumin', 'turmeric', 'anti-inflammatory', 'joint-health'], stock: 180 },
    { title: 'Pure Brahmi Gotu Kola Cognitive Enhancer 500mg (60 Capsules)', slug: 'pure-brahmi-cognitive-enhancer-capsules', cat: 'herbal-supplements', price: 549, compare: 699, tags: ['brahmi', 'memory', 'focus', 'clarity'], stock: 130 },
    { title: 'Guduchi Giloy (Tinospora Cordifolia) Pure Extract 500mg (60 Capsules)', slug: 'guduchi-giloy-immunity-capsules', cat: 'herbal-supplements', price: 449, compare: 599, tags: ['giloy', 'guduchi', 'platelet-support', 'immunity'], stock: 210 },

    // Category 3: Organic Churnas & Single Herb Powders (5 items)
    { title: 'Stone-Ground Organic Triphala Churna Digestive Detox (250g)', slug: 'organic-triphala-churna-digestive-detox', cat: 'churnas-kwath', price: 299, compare: 399, tags: ['triphala', 'churna', 'amla', 'haritaki', 'bibhitaki', 'gut-cleanse'], stock: 350 },
    { title: 'Avipattikar Churna Hyper-Acidity & Pitta Balancing Powder (200g)', slug: 'avipattikar-churna-hyperacidity-pitta', cat: 'churnas-kwath', price: 249, compare: 320, tags: ['avipattikar', 'acidity', 'pitta-dosha', 'indigestion'], stock: 160 },
    { title: 'Trikatu Churna Metabolism & Agni Ignition Formula (100g)', slug: 'trikatu-churna-metabolism-agni', cat: 'churnas-kwath', price: 220, compare: 290, tags: ['trikatu', 'ginger', 'black-pepper', 'pippali', 'digestion'], stock: 140 },
    { title: 'Organic Shade-Dried Shatavari Root Churna (200g)', slug: 'organic-shatavari-root-churna', cat: 'churnas-kwath', price: 349, compare: 450, tags: ['shatavari', 'women-vitality', 'cooling-herb'], stock: 180 },
    { title: 'Raw Wild Moringa Leaf Powder Superfood Churna (250g)', slug: 'raw-wild-moringa-leaf-powder', cat: 'churnas-kwath', price: 320, compare: 420, tags: ['moringa', 'iron-rich', 'superfood', 'multivitamin'], stock: 220 },

    // Category 4: Medicated Thailams & Classical Oils (5 items)
    { title: 'Mahanarayan Taila Classical Medicated Joint & Muscle Pain Oil (200ml)', slug: 'mahanarayan-taila-joint-pain-oil', cat: 'ayurvedic-thailams', price: 499, compare: 650, tags: ['mahanarayan', 'joint-pain', 'arthritis', 'vata-balance', 'massage'], stock: 140 },
    { title: 'Ksheerabala 101 Avarthi Concentrated Nervous System Drops (10ml)', slug: 'ksheerabala-101-avarthi-drops', cat: 'ayurvedic-thailams', price: 420, compare: 550, tags: ['ksheerabala', 'nerve-care', 'insomnia', 'neuropathy'], stock: 90 },
    { title: 'Anu Thailam Classical Nasya Nasal Drops for Sinus & Head Clarity (20ml)', slug: 'anu-thailam-classical-nasya-drops', cat: 'ayurvedic-thailams', price: 210, compare: 280, tags: ['anu-tailam', 'nasya', 'sinusitis', 'migraine', 'prana'], stock: 260 },
    { title: 'Dhanwantharam Thailam Pre & Post-Natal Rejuvenating Body Oil (200ml)', slug: 'dhanwantharam-thailam-body-oil', cat: 'ayurvedic-thailams', price: 460, compare: 580, tags: ['dhanwantharam', 'maternity', 'vata-relief', 'abhyanga'], stock: 80 },
    { title: 'Murivenna Classical Healing & Sprain Herbal Oil (100ml)', slug: 'murivenna-classical-healing-oil', cat: 'ayurvedic-thailams', price: 240, compare: 310, tags: ['murivenna', 'wound-healing', 'sprain', 'bone-health'], stock: 130 },

    // Category 5: Ayurvedic Botanical Skincare (5 items)
    { title: 'Kashmiri Saffron 26-Herb Kumkumadi Miraculous Night Glow Oil (30ml)', slug: 'kashmiri-saffron-kumkumadi-night-oil', cat: 'botanical-skincare', price: 1299, compare: 1699, tags: ['kumkumadi', 'saffron', 'facial-oil', 'pigmentation', 'glow'], stock: 175 },
    { title: 'Nalpamradi Thailam Skin Brightening & Tan Reversal Oil (200ml)', slug: 'nalpamradi-thailam-skin-brightening-oil', cat: 'botanical-skincare', price: 599, compare: 799, tags: ['nalpamradi', 'turmeric', 'de-tan', 'bridal-glow', 'skin'], stock: 150 },
    { title: 'Raktachandan Pure Red Sandalwood & Rose Petal Face Ubtan (100g)', slug: 'raktachandan-red-sandalwood-ubtan', cat: 'botanical-skincare', price: 449, compare: 599, tags: ['sandalwood', 'ubtan', 'blemish-care', 'cooling-lepa'], stock: 190 },
    { title: 'Shata Dhauta Ghrita (100-Times Washed A2 Cow Ghee) Moisture Cream 50g', slug: 'shata-dhauta-ghrita-washed-ghee-cream', cat: 'botanical-skincare', price: 799, compare: 999, tags: ['washed-ghee', 'eczema', 'barrier-repair', 'deep-hydration'], stock: 110 },
    { title: 'Wild Neem & Lodhra Anti-Acne Clarifying Herbal Lepa (100g)', slug: 'wild-neem-lodhra-anti-acne-lepa', cat: 'botanical-skincare', price: 380, compare: 480, tags: ['neem', 'acne', 'detox', 'pitta-lepa'], stock: 165 },

    // Category 6: Classical Hair Care & Bhringraj (5 items)
    { title: 'Neelibhringadi Kerathailam Classical Hair Fall Defense Oil (200ml)', slug: 'neelibhringadi-kerathailam-hair-oil', cat: 'hair-nourishment', price: 499, compare: 650, tags: ['neelibhringadi', 'hair-growth', 'dandruff', 'ayurvedic-oil'], stock: 220 },
    { title: 'Mahabhringraj Scalp Revitalizer with 16 Wild Forest Herbs (200ml)', slug: 'mahabhringraj-scalp-revitalizer-oil', cat: 'hair-nourishment', price: 449, compare: 580, tags: ['bhringraj', 'premature-greying', 'scalp-health'], stock: 190 },
    { title: 'Traditional Reetha, Shikakai & Methi Gentle Scalp Wash (300ml)', slug: 'traditional-reetha-shikakai-scalp-wash', cat: 'hair-nourishment', price: 399, compare: 499, tags: ['shikakai', 'reetha', 'no-sulphates', 'herbal-shampoo'], stock: 170 },
    { title: 'Brahmi & Amla Cooling Hair Pack & Follicle Tonic (150g)', slug: 'brahmi-amla-cooling-hair-pack', cat: 'hair-nourishment', price: 320, compare: 420, tags: ['hair-pack', 'amla', 'cooling', 'thickening'], stock: 140 },
    { title: 'Japa Pushpa (Hibiscus) & Fenugreek Hair Butter Conditioning Mask (150g)', slug: 'japa-pushpa-hibiscus-hair-butter', cat: 'hair-nourishment', price: 480, compare: 620, tags: ['hibiscus', 'hair-mask', 'frizz-control', 'conditioning'], stock: 115 },

    // Category 7: Digestive & Gut Health Tonics (5 items)
    { title: 'Hingwashtak Churna Gas, Bloating & Agni Digestive Powder (100g)', slug: 'hingwashtak-churna-bloating-relief', cat: 'digestive-gut-health', price: 210, compare: 280, tags: ['hingwashtak', 'bloating', 'gas-relief', 'digestion', 'hing'], stock: 250 },
    { title: 'Pure Sat Isabgol (Psyllium Husk) Organic Colon Cleanser (200g)', slug: 'pure-sat-isabgol-organic-psyllium-husk', cat: 'digestive-gut-health', price: 280, compare: 360, tags: ['isabgol', 'fiber', 'constipation', 'gut-cleanse'], stock: 310 },
    { title: 'Jeerakarishtam Classical Fermented Postpartum & Digestive Arishta (450ml)', slug: 'jeerakarishtam-digestive-arishta', cat: 'digestive-gut-health', price: 260, compare: 340, tags: ['arishta', 'cumin', 'gut-ferment', 'postpartum'], stock: 140 },
    { title: 'Kalmegh & Bhumi Amla Liver Detox & Hepato-Protective Syrup (200ml)', slug: 'kalmegh-bhumi-amla-liver-syrup', cat: 'digestive-gut-health', price: 340, compare: 440, tags: ['liver-care', 'kalmegh', 'fatty-liver', 'detox'], stock: 180 },
    { title: 'Pudina & Ajwain Concentrated Digestive Elixir Drops (30ml)', slug: 'pudina-ajwain-digestive-drops', cat: 'digestive-gut-health', price: 199, compare: 250, tags: ['ajwain', 'pudina', 'quick-relief', 'stomach-ache'], stock: 270 },

    // Category 8: Immunity Kadhas & Herbal Drops (5 items)
    { title: 'Ayush Kwath Concentrated Kadha Decoction (Tulsi, Cinnamon, Sunthi, Marich) 200g', slug: 'ayush-kwath-concentrated-kadha', cat: 'immunity-kadhas', price: 349, compare: 450, tags: ['kadha', 'ayush-kwath', 'immunity', 'cough-cold', 'decoction'], stock: 290 },
    { title: 'Pancha Tulsi 5-Species Pure Herbal Extract Drops (30ml)', slug: 'pancha-tulsi-herbal-extract-drops', cat: 'immunity-kadhas', price: 249, compare: 320, tags: ['tulsi', 'respiratory', 'antiviral', 'drops'], stock: 380 },
    { title: 'Yashtimadhu (Mulethi Licorice) Soothing Throat & Vocal Elixir (100ml)', slug: 'yashtimadhu-mulethi-throat-elixir', cat: 'immunity-kadhas', price: 220, compare: 290, tags: ['mulethi', 'sore-throat', 'singers', 'licorice'], stock: 200 },
    { title: 'Vasaka & Kantakari Bronchial Relief Herbal Syrup (200ml)', slug: 'vasaka-kantakari-bronchial-syrup', cat: 'immunity-kadhas', price: 280, compare: 360, tags: ['lungs', 'vasaka', 'asthma-support', 'bronchial'], stock: 160 },
    { title: 'Haldi Doodh Golden Milk Spiced Mix with Saffron & Black Pepper (150g)', slug: 'haldi-doodh-golden-milk-spiced-mix', cat: 'immunity-kadhas', price: 380, compare: 480, tags: ['golden-milk', 'turmeric', 'bedtime-drink', 'healing'], stock: 190 },

    // Category 9: Mind, Sleep & Stress Tonics (5 items)
    { title: 'Saraswatarishta Classical Memory, Speech & Focus Arishta with Gold (450ml)', slug: 'saraswatarishta-memory-speech-arishta', cat: 'stress-sleep-tonics', price: 360, compare: 460, tags: ['saraswatarishta', 'brahmi', 'speech', 'intellect', 'arishta'], stock: 120 },
    { title: 'Shankhpushpi Herbal Syrup for Concentration & Academic Vitality (200ml)', slug: 'shankhpushpi-concentration-syrup', cat: 'stress-sleep-tonics', price: 240, compare: 310, tags: ['shankhpushpi', 'students', 'exam-focus', 'brain-tonic'], stock: 230 },
    { title: 'Jatamansi & Tagara Restful Deep Sleep Drops (30ml)', slug: 'jatamansi-tagara-deep-sleep-drops', cat: 'stress-sleep-tonics', price: 449, compare: 580, tags: ['jatamansi', 'tagara', 'sleep', 'insomnia-aid', 'calm'], stock: 140 },
    { title: 'Brahmi Ghritham Classical Medicated A2 Cow Ghee for Mental Clarity (200g)', slug: 'brahmi-ghritham-mental-clarity-ghee', cat: 'stress-sleep-tonics', price: 590, compare: 750, tags: ['ghee', 'brahmi-ghee', 'adhd-support', 'brain-food'], stock: 85 },
    { title: 'Ashwagandha & Vacha Anti-Anxiety Aromatherapy Pulse Point Oil (10ml)', slug: 'ashwagandha-vacha-pulse-point-oil', cat: 'stress-sleep-tonics', price: 299, compare: 380, tags: ['aromatherapy', 'anxiety-relief', 'pulse-point', 'stress'], stock: 160 },

    // Category 10: Detox Herbal Teas & Infusions (5 items)
    { title: 'Classical CCF Tea (Cumin, Coriander, Fennel) Tridoshic Gut Detox (150g)', slug: 'classical-ccf-cumin-coriander-fennel-tea', cat: 'wellness-herbal-teas', price: 299, compare: 380, tags: ['ccf-tea', 'detox', 'tridosha', 'caffeine-free', 'pitta-cooler'], stock: 240 },
    { title: 'Krishna Tulsi & Lemongrass Calming Evening Tisane (100g Loose Leaf)', slug: 'krishna-tulsi-lemongrass-tisane', cat: 'wellness-herbal-teas', price: 260, compare: 340, tags: ['tulsi-tea', 'lemongrass', 'herbal-infusion', 'antioxidants'], stock: 210 },
    { title: 'Kashmiri Kahwa Green Tea with Crushed Almonds, Saffron & Cardamom (100g)', slug: 'kashmiri-kahwa-saffron-almonds-tea', cat: 'wellness-herbal-teas', price: 499, compare: 650, tags: ['kahwa', 'saffron-tea', 'warming', 'luxury-blend'], stock: 160 },
    { title: 'Digestive Ajwain, Mulethi & Peppermint Post-Meal Herbal Infusion (20 Tea Bags)', slug: 'ajwain-mulethi-peppermint-tea-bags', cat: 'wellness-herbal-teas', price: 280, compare: 350, tags: ['tea-bags', 'post-meal', 'bloating-tea', 'organic'], stock: 190 },
    { title: 'Organic Hibiscus Petal & Brahmi Cellular Rejuvenation Tea (100g)', slug: 'hibiscus-petal-brahmi-rejuvenation-tea', cat: 'wellness-herbal-teas', price: 320, compare: 400, tags: ['hibiscus', 'blood-pressure-support', 'vitamin-c', 'ruby-tea'], stock: 175 },
  ];

  console.log(`Creating ${ayurvedaProducts.length} certified Ayurvedic formulations with variants and inventories...`);

  for (let i = 0; i < ayurvedaProducts.length; i++) {
    const p = ayurvedaProducts[i];
    const categoryId = categoryMap.get(p.cat);
    if (!categoryId) continue;

    const botanicalImage = [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    ][i % 5];

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: `Authentic non-pharma Ayurvedic formulation: ${p.title}. Crafted according to classical Charaka & Sushruta Samhita guidelines using wild-harvested, pesticide-free botanicals. Formulated under strict GMP & AYUSH Premium guidelines, verified for zero heavy metals and peak therapeutic active phytocompounds. Suitable for daily holistic wellness.`,
        categoryId,
        tags: p.tags,
        images: [
          botanicalImage,
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        ],
        featured: i < 8,
        isPublished: true,
        metaTitle: `${p.title} | Certified Pure Ayurveda & Herbal Remedies`,
        metaDescription: `Buy 100% genuine ${p.title} online. AYUSH certified, zero chemicals, pure botanical extracts with fast doorstep courier delivery.`,
        avgRating: 4.8 + ((i % 3) * 0.1),
        reviewCount: 35 + (i * 12),
      },
    });

    // Create 2 size/pack variants per herbal product
    const variant1 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `VD-${p.slug.toUpperCase().slice(0, 8)}-STD`,
        size: 'Standard Pack',
        color: 'Glass Jar / Sealed Tin',
        price: p.price,
        compareAtPrice: p.compare,
        stock: p.stock,
        weight: 0.35,
      },
    });

    const variant2 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `VD-${p.slug.toUpperCase().slice(0, 8)}-ECO`,
        size: 'Value Pack (2x Quantity)',
        color: 'Eco Refill Pouch',
        price: Math.round(p.price * 1.8),
        compareAtPrice: Math.round(p.compare * 1.8),
        stock: Math.floor(p.stock * 0.6),
        weight: 0.65,
      },
    });

    // Create inventory record
    await prisma.inventory.createMany({
      data: [
        {
          variantId: variant1.id,
          warehouse: 'AYURVEDA_HERBAL_CENTRAL_HUB',
          quantity: p.stock,
          lowStockThreshold: 10,
        },
        {
          variantId: variant2.id,
          warehouse: 'AYURVEDA_HERBAL_CENTRAL_HUB',
          quantity: Math.floor(p.stock * 0.6),
          lowStockThreshold: 8,
        },
      ],
    });

    // Preload cart for customer with first item
    if (i === 0) {
      const cart = await prisma.cart.create({
        data: { userId: customer.id },
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

  // 4. Seed Ayurveda Wellness Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'VEDA500',
        description: 'Flat ₹500 off on Ayurvedic health orders above ₹1,999',
        discountType: CouponType.FLAT,
        discountValue: 500,
        minOrderValue: 1999,
        isActive: true,
      },
      {
        code: 'HERBAL20',
        description: '20% off up to ₹2,500 on all organic rasayanas & thailams',
        discountType: CouponType.PERCENTAGE,
        discountValue: 20,
        minOrderValue: 999,
        maxDiscount: 2500,
        isActive: true,
      },
    ],
  });

  console.log('✅ Ayurveda Wellness Coupons Seeded: VEDA500, HERBAL20');
  console.log('🎉 Seed completed successfully! 50 Certified Ayurvedic herbal remedies ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error in database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
