const defaultProducts = [
  {
    id: "bactrikiller",
    name: "BACTRIKILLER",
    category: "fungicides",
    tagline: { mr: "SYSTEMIC FUNGICIDE", en: "SYSTEMIC FUNGICIDE" },
    shortDescription: {
      mr: "सर्व प्रकारच्या बुरशीवर प्रभावी आणि खात्रीशीर बुरशीनाशक.",
      en: "Highly effective systemic fungicide for controlling all types of fungal diseases."
    },
    description: {
      mr: "बॅक्ट्रीकिलर हे एक प्रगत प्रणालीगत (Systemic) बुरशीनाशक आहे जे पिकांवरील विविध बुरशीजन्य रोगांना मुळापासून नष्ट करते. हे पिकांच्या अंतर्गत भागात पसरून दीर्घकाळ संरक्षण प्रदान करते.",
      en: "BACTRIKILLER is an advanced systemic fungicide that targets and controls broad-spectrum fungal diseases in crops. It is absorbed rapidly by the plant tissues and offers long-lasting protection."
    },
    basePrice: 450,
    originalPrice: 550,
    packSizes: [
      { size: "250 ml", price: 450 },
      { size: "500 ml", price: 800 },
      { size: "1 L", price: 1500 }
    ],
    image: "/assets/products/bactrikiller.svg",
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewsCount: 124,
    crops: {
      mr: "सोयाबीन, कापूस, मिरची, टोमॅटो, द्राक्षे, डाळिंब, कांदा आणि इतर फळभाज्या.",
      en: "Soybean, Cotton, Chilli, Tomato, Grapes, Pomegranate, Onion and other vegetables."
    },
    benefits: {
      mr: [
        "सर्व प्रकारच्या बुरशीजन्य रोगांवर (उदा. तांबेरा, करपा, भुरी) अत्यंत प्रभावी.",
        "पिकामध्ये जलद गतीने शोषले जाते, ज्यामुळे पावसातही काम करते.",
        "पिकाची रोगप्रतिकारक शक्ती वाढवून निरोगी वाढीस मदत करते."
      ],
      en: [
        "Highly effective against downy mildew, powdery mildew, blight, and rust diseases.",
        "Quick absorption rate ensures effectiveness even if it rains shortly after application.",
        "Enhances overall plant immunity and promotes healthy green foliage."
      ]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून पिकावर फवारणी करावी. (वापरण्यापूर्वी बाटली चांगली हलवावी)",
      en: "Mix 1.5 to 2 ml per liter of water and spray thoroughly on the crop canopy. (Shake well before use)"
    }
  },
  {
    id: "magic-gold",
    name: "MAGIC GOLD",
    category: "plant-growth",
    tagline: { mr: "PLANT GROWTH PROMOTER", en: "PLANT GROWTH PROMOTER" },
    shortDescription: {
      mr: "पिकांच्या निरोगी वाढीसाठी आणि अधिक उत्पादनासाठी सर्वोत्तम वाढ प्रवर्तक.",
      en: "Premium plant growth promoter for robust growth, flowering, and high yield."
    },
    description: {
      mr: "मॅजिक गोल्ड हे पिकांच्या चयापचय क्रियेला गती देणारे एक प्रगत वनस्पती वाढ प्रवर्तक आहे. हे झाडांची मुळे मजबूत करते, फांद्यांची संख्या वाढवते आणि फुलांचे फळात रूपांतर करण्यास मदत करते.",
      en: "MAGIC GOLD is a high-potency plant growth promoter containing essential growth hormones and amino acids. It stimulates cell division, enhances root establishment, and increases flowering and fruit retention."
    },
    basePrice: 350,
    originalPrice: 420,
    packSizes: [
      { size: "250 ml", price: 350 },
      { size: "500 ml", price: 620 },
      { size: "1 L", price: 1150 }
    ],
    image: "/assets/products/magic_gold.svg",
    isPopular: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 198,
    crops: {
      mr: "कापूस, मिरची, टोमॅटो, वांगी, वेलवर्गीय पिके, डाळिंब आणि सर्व फळझाडे.",
      en: "Cotton, Chilli, Tomato, Brinjal, Cucurbits, Pomegranate, and all horticultural crops."
    },
    benefits: {
      mr: [
        "पिकांच्या फांद्या आणि पानांची संख्या वाढवून झाड टवटवीत ठेवते.",
        "फूलगळ आणि फळगळ रोखण्यासाठी अत्यंत फायदेशीर.",
        "फळांचा आकार, रंग आणि गुणवत्ता सुधारते, ज्यामुळे बाजारात चांगला दर मिळतो."
      ],
      en: [
        "Stimulates shoot elongation and increases number of active branches.",
        "Significantly reduces flower drop and immature fruit shedding.",
        "Improves fruit size, color, shine, and shelf life, fetching higher market rates."
      ]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून सकाळी किंवा संध्याकाळी फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray during early morning or late evening hours."
    }
  },
  {
    id: "mycrodifence",
    name: "MYCRODIFENCE",
    category: "micronutrients",
    tagline: { mr: "MICRONUTRIENT", en: "MICRONUTRIENT" },
    shortDescription: {
      mr: "सर्व महत्त्वाच्या सूक्ष्म अन्नद्रव्यांचे (मायक्रो-न्यूट्रिएंट्स) संतुलित मिश्रण.",
      en: "A comprehensive and balanced combination of all essential micronutrients."
    },
    description: {
      mr: "मायक्रोडिफेन्स हे पिकांमधील अन्नद्रव्यांची कमतरता भरून काढण्यासाठी तयार केलेले विशेष मिश्रण आहे. यामध्ये लोह, जस्त, तांबे, मॅंगनीज, बोरॉन आणि मॉलिब्डेनम योग्य प्रमाणात उपलब्ध आहेत.",
      en: "MYCRODIFENCE is a scientifically formulated micronutrient mixture that prevents and cures nutrient deficiencies in crops. It delivers highly bioavailable chelated metals including Zinc, Iron, Manganese, Copper, Boron, and Molybdenum."
    },
    basePrice: 280,
    originalPrice: 350,
    packSizes: [
      { size: "500 gm", price: 280 },
      { size: "1 kg", price: 500 },
      { size: "5 kg", price: 2300 }
    ],
    image: "/assets/products/mycrodifence.svg",
    isPopular: true,
    isNew: false,
    rating: 4.7,
    reviewsCount: 86,
    crops: {
      mr: "ऊस, हळद, केळी, सोयाबीन, कापूस, मिरची, लिंबूवर्गीय फळे आणि भाजीपाला पिके.",
      en: "Sugarcane, Turmeric, Banana, Soybean, Cotton, Chilli, Citrus fruits, and vegetable crops."
    },
    benefits: {
      mr: [
        "पिकांवरील पिवळेपणा दूर करून पाने गर्द हिरवी बनवते.",
        "प्रकाशसंश्लेषण क्रिया सुधारून पिकाची अन्न तयार करण्याची क्षमता वाढवते.",
        "कमतरतेमुळे होणारी झाडांची खुंटलेली वाढ त्वरित पुनरुज्जीवित करते."
      ],
      en: [
        "Prevents leaf chlorosis (yellowing) and gives crops a deep green, healthy appearance.",
        "Enhances chlorophyll synthesis and accelerates photosynthesis rate.",
        "Corrects developmental stagnation caused by zinc or iron deficiencies."
      ]
    },
    usage: {
      mr: "१.५ ते २ ग्रॅम प्रति लिटर पाणी या प्रमाणात पिकांवर फवारणी करावी किंवा ड्रिपद्वारे द्यावे.",
      en: "Apply 1.5 to 2 grams per liter of water as foliar spray or fertigate through drip irrigation."
    }
  },
  {
    id: "srpf",
    name: "SRPF",
    category: "silicon-based",
    tagline: { mr: "SILICON RAPID PROTECTION FORMULA", en: "SILICON RAPID PROTECTION FORMULA" },
    shortDescription: {
      mr: "सिलिकॉन आधारित विशेष संरक्षण सूत्र जे पिकांना देईल नैसर्गिक ताकद.",
      en: "Silicon-based rapid protection formula that provides structural strength and immunity."
    },
    description: {
      mr: "एसआरपीएफ (SRPF) हे सिलिकॉन आधारित एक नाविन्यपूर्ण उत्पादन आहे. हे पिकांच्या बाह्य थराला मजबूत करते, ज्यामुळे पिकांचे उष्णता, थंडी, दुष्काळ आणि कीड-रोगांपासून नैसर्गिकरित्या संरक्षण होते.",
      en: "SRPF (Silicon Rapid Protection Formula) is a premium silicon formulation. It builds a protective silica layer under the cuticle of plant leaves, improving mechanical resistance to pests, pathogens, and environmental stress."
    },
    basePrice: 500,
    originalPrice: 650,
    packSizes: [
      { size: "1 kg", price: 500 },
      { size: "5 kg", price: 2200 }
    ],
    image: "/assets/products/srpf.svg",
    isPopular: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 112,
    crops: {
      mr: "भात, ऊस, कापूस, मिरची, टोमॅटो, द्राक्षे, टरबूज आणि इतर भाजीपाला पिके.",
      en: "Paddy, Sugarcane, Cotton, Chilli, Tomato, Grapes, Watermelon and vegetable crops."
    },
    benefits: {
      mr: [
        "पिकांची पाने आणि खोड टणक बनवून रसशोषक किडींचा प्रादुर्भाव कमी करते.",
        "अति उष्णता आणि दुष्काळाच्या परिस्थितीत पाण्याचे बाष्पीभवन रोखते.",
        "झाडांची फांदी सरळ ठेवते, ज्यामुळे सूर्यप्रकाश पानांवर चांगल्या प्रकारे पडतो."
      ],
      en: [
        "Strengthens plant cell walls, rendering leaves tough against sucking pests.",
        "Reduces transpiration rate under high temperatures, saving water during dry spells.",
        "Keeps stems erect, ensuring maximum light interception and photosynthesis."
      ]
    },
    usage: {
      mr: "२ ते ३ ग्रॅम प्रति लिटर पाण्यात मिसळून पानांवर फवारणी करावी किंवा खतातून द्यावे.",
      en: "Mix 2 to 3 grams per liter of water and apply as foliar spray, or apply via soil application."
    }
  },
  {
    id: "fast-result",
    name: "FAST RESULT",
    category: "plant-growth",
    tagline: { mr: "FOR GROWTH & BUDS DEVELOPMENT", en: "FOR GROWTH & BUDS DEVELOPMENT" },
    shortDescription: {
      mr: "झटपट वाढ आणि फुलांची संख्या दुप्पट करण्यासाठी विशेष फॉर्म्युला.",
      en: "Specialized formulation for rapid vegetative growth and double the flower buds."
    },
    description: {
      mr: "फास्ट रिझल्ट हे अत्यंत सक्रिय पोषक घटकांचे मिश्रण आहे जे पिकांच्या शाकीय वाढीच्या टप्प्यात विशेष कार्य करते. हे त्वरित कार्य सुरू करते आणि कमी कालावधीत जास्त कळ्या आणि फुले आणते.",
      en: "FAST RESULT is a fast-acting vegetative and bloom booster. Rich in bio-active organic complexes, it triggers rapid response in plants to produce maximum buds, reducing the vegetative cycle time."
    },
    basePrice: 390,
    originalPrice: 480,
    packSizes: [
      { size: "250 ml", price: 390 },
      { size: "500 ml", price: 720 },
      { size: "1 L", price: 1350 }
    ],
    image: "/assets/products/fast_result.svg",
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 145,
    crops: {
      mr: "मिरची, टोमॅटो, झेंडू, कापूस, सोयाबीन, वांगी, भाजीपाला आणि फुलशेती.",
      en: "Chilli, Tomato, Marigold, Cotton, Soybean, Brinjal, Leafy Vegetables, and Floriculture."
    },
    benefits: {
      mr: [
        "पिकांमध्ये जलद वाढ घडवून आणते आणि हिरवेगारपणा वाढवते.",
        "फुलांची संख्या वाढवते आणि कळ्या गळण्यापासून रोखते.",
        "अत्यंत कमी दिवसात दृश्य परिणाम दाखवते."
      ],
      en: [
        "Triggers immediate cellular growth and enhances leaf greenness within days.",
        "Increases flower bud density and prevents early drop of flowers.",
        "Provides fast and visible development results under challenging climates."
      ]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून फुलोऱ्याच्या आधी आणि फुलोऱ्याच्या काळात फवारावे.",
      en: "Mix 2 ml per liter of water and spray before flowering and during the blooming period."
    }
  },
  {
    id: "nutri-grow-50",
    name: "NUTRI GROW-50",
    category: "fertilizers",
    tagline: { mr: "BIOTIC GROWTH PROMOTER", en: "BIOTIC GROWTH PROMOTER" },
    shortDescription: {
      mr: "सर्व पिकांसाठी सुरक्षित आणि नैसर्गिक सेंद्रिय जैविक वाढ प्रवर्तक.",
      en: "Organic biotic growth promoter suitable for comprehensive nutrition of all crops."
    },
    description: {
      mr: "न्यूट्रि ग्रो-५० हे ५०% सेंद्रिय घटकांसह बनवलेले नैसर्गिक पोषक उत्पादन आहे. हे जमिनीत असलेल्या जिवाणूंची क्रिया वाढवते आणि झाडांना पोषक घटक सहज शोषून घेण्यास मदत करते.",
      en: "NUTRI GROW-50 is a high-grade biotic supplement formulated with organic plant extracts. It enriches soil microbiology and stimulates nutrient absorption pathways in roots for structural crop vigor."
    },
    basePrice: 320,
    originalPrice: 400,
    packSizes: [
      { size: "250 ml", price: 320 },
      { size: "500 ml", price: 580 },
      { size: "1 L", price: 1050 }
    ],
    image: "/assets/products/nutri_grow_50.svg",
    isPopular: true,
    isNew: true,
    rating: 4.6,
    reviewsCount: 73,
    crops: {
      mr: "ऊस, हळद, आल्याची शेती, बटाटा, डाळिंब, लिंबू, संत्री आणि मोसंबी.",
      en: "Sugarcane, Turmeric, Ginger, Potato, Pomegranate, Citrus, Orange and Sweet Lime."
    },
    benefits: {
      mr: [
        "१००% नैसर्गिक आणि सेंद्रिय उत्पादन, पिकांवर किंवा पर्यावरणावर कोणताही दुष्परिणाम नाही.",
        "पांढऱ्या मुळांची वाढ वेगाने वाढवते, ज्यामुळे अन्नद्रव्यांचे शोषण वाढते.",
        "पिकाची गुणवत्ता, चमक आणि चव सुधारून वजन वाढवते."
      ],
      en: [
        "100% organic formulation with zero residues, safe for soil structure.",
        "Drastically accelerates white feeder root growth, improving water uptake.",
        "Improves crop yield size, luster, flavor, and crop weight."
      ]
    },
    usage: {
      mr: "२.५ मिली प्रति लिटर पाण्यात मिसळून फवारावे किंवा ५०० मिली प्रति एकर ठिबक सिंचनाद्वारे द्यावे.",
      en: "Mix 2.5 ml per liter of water for foliar spray, or apply 500 ml per acre through drip irrigation."
    }
  },
  {
    id: "neem-shakti",
    name: "NEEM SHAKTI",
    category: "insecticides",
    tagline: { mr: "ORGANIC INSECTICIDE", en: "ORGANIC INSECTICIDE" },
    shortDescription: {
      mr: "रसशोषक किडींवर प्रभावी नियंत्रणासाठी नैसर्गिक कडुनिंब अर्क युक्त कीटकनाशक.",
      en: "Neem-based organic insecticide for controlling sucking pests naturally."
    },
    description: {
      mr: "नीम शक्ती हे उच्च दर्जाचे सेंद्रिय कीटकनाशक आहे ज्यामध्ये अझाडिराक्टिन (Azadirachtin) मुबलक प्रमाणात आहे. हे किडींची अंडी उबवण्याची क्षमता रोखते आणि त्यांना पिकापासून दूर ठेवते.",
      en: "NEEM SHAKTI is a biological insecticide derived from pure neem seeds. Standardized with active Azadirachtin, it disrupts insect feeding, mating, and reproduction cycles safely."
    },
    basePrice: 220,
    originalPrice: 280,
    packSizes: [
      { size: "250 ml", price: 220 },
      { size: "500 ml", price: 400 },
      { size: "1 L", price: 750 }
    ],
    image: "/assets/products/placeholder.svg",
    isPopular: false,
    isNew: true,
    rating: 4.5,
    reviewsCount: 52,
    crops: {
      mr: "मिरची, भाजीपाला पिके, कापूस, सोयाबीन, हरभरा आणि फळझाडे.",
      en: "Chilli, Leafy Vegetables, Cotton, Soybean, Chickpea and Fruits."
    },
    benefits: {
      mr: [
        "नैसर्गिक व सेंद्रिय असल्याने मित्रकिडींना आणि मधमाश्यांना धोका नाही.",
        "रसशोषक किडी जसे की मावा, तुडतुडे, फुलकिडे (Thrips) आणि पांढरी माशी यांवर नियंत्रण.",
        "किडींमध्ये प्रतिकारशक्ती तयार होऊ देत नाही."
      ],
      en: [
        "Eco-friendly formula that is safe for beneficial predators and pollinators.",
        "Effectively repels sucking pests like aphids, jassids, thrips, and whiteflies.",
        "Does not allow target insects to build chemical resistance over time."
      ]
    },
    usage: {
      mr: "३ ते ५ मिली प्रति लिटर पाण्यात मिसळून संध्याकाळी फवारणी करावी.",
      en: "Mix 3 to 5 ml per liter of water and spray thoroughly during evening hours."
    }
  },
  {
    id: "root-booster",
    name: "ROOT BOOSTER",
    category: "bio-products",
    tagline: { mr: "BIO MYCORRHIZAL FERTILIZER", en: "BIO MYCORRHIZAL FERTILIZER" },
    shortDescription: {
      mr: "पिकांच्या मुळांच्या जोमदार वाढीसाठी उत्कृष्ट मायकोरायझल जैविक खत.",
      en: "High-grade mycorrhizal formulation for extensive root growth and soil health."
    },
    description: {
      mr: "रूट बूस्टर हे जैविक घटकांवर आधारित उत्पादन आहे जे मुळांभोवती उपयुक्त बुरशीचे जाळे तयार करते. हे जमिनीतील विरघळणारे फॉस्फरस आणि इतर घटक मुळांपर्यंत पोहोचवण्यास मदत करते.",
      en: "ROOT BOOSTER is a bio-fertilizer containing endo and ecto mycorrhizae. It establishes a symbiotic relationship with plant roots, effectively increasing the root absorption surface area for minerals."
    },
    basePrice: 180,
    originalPrice: 240,
    packSizes: [
      { size: "500 gm", price: 180 },
      { size: "1 kg", price: 320 }
    ],
    image: "/assets/products/placeholder.svg",
    isPopular: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 65,
    crops: {
      mr: "ऊस, हळद, केळी, पपई, मिरची, टोमॅटो, फळझाडे आणि रोपवाटिका (Nursery).",
      en: "Sugarcane, Turmeric, Banana, Papaya, Chilli, Tomato, Orchards and Nursery beds."
    },
    benefits: {
      mr: [
        "मुळांची लांबी आणि संख्या वाढवून झाडाची जमिनीवर मजबूत पकड निर्माण करते.",
        "जमिनीतील फॉस्फरस, पालाश आणि सूक्ष्म अन्नद्रव्यांचे शोषण वाढवते.",
        "पाण्याचा ताण सहन करण्याची वनस्पतीची क्षमता वाढवते."
      ],
      en: [
        "Drastically expands lateral root length and branching for firm soil grip.",
        "Improves assimilation of insoluble soil phosphorus, potassium, and trace minerals.",
        "Enhances crop drought resistance by retaining water moisture in the root zone."
      ]
    },
    usage: {
      mr: "१ ते २ किलो प्रति एकर या प्रमाणात शेणखतामध्ये किंवा रासायनिक खतासोबत जमिनीत मिसळावे.",
      en: "Mix 1 to 2 kg per acre with farmyard manure or chemical fertilizers and apply in soil."
    }
  }
];

export const getProducts = async () => {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend offline. Falling back to localStorage for products.");
  }
  const data = localStorage.getItem('prachi_products');
  if (!data) {
    localStorage.setItem('prachi_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(data);
};

export const saveProducts = async (array) => {
  try {
    localStorage.setItem('prachi_products', JSON.stringify(array));
  } catch (err) {}
};

export const addProduct = async (product) => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      return await getProducts();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getProducts();
  const newProduct = {
    ...product,
    id: product.id || product.name.toLowerCase().replace(/\s+/g, '-')
  };
  list.push(newProduct);
  await saveProducts(list);
  return list;
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    if (res.ok) {
      return await getProducts();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getProducts();
  const index = list.findIndex(p => p.id === id);
  if (index > -1) {
    list[index] = { ...list[index], ...updatedProduct };
    await saveProducts(list);
  }
  return list;
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      return await getProducts();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getProducts();
  const filtered = list.filter(p => p.id !== id);
  await saveProducts(filtered);
  return filtered;
};
