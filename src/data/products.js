const defaultProducts = [
  {
    id: "bactrikiller",
    name: "BACTRIKILLER",
    category: "fungicides",
    tagline: { mr: "सर्व प्रकारच्या बुरशीवर प्रभावी बुरशीनाशक", en: "Broad Spectrum Systemic Fungicide" },
    shortDescription: {
      mr: "पिकांवरील करपा, भुरी आणि मूळकुज यांसारख्या गंभीर बुरशीजन्य रोगांचे जलद नियंत्रण.",
      en: "Rapid control of leaf spots, blight, powdery mildew, and root rots in all crops."
    },
    description: {
      mr: "बॅक्ट्रीकिलर हे एक प्रगत सिस्टीमिक बुरशीनाशक आहे जे पिकाच्या आत शोषले जाते आणि रोगाचा नायनाट करते. हे पिकांना अंतर्गत प्रतिकारशक्ती देखील देते जेणेकरून नवीन बुरशीजन्य हल्ला रोखता येईल.",
      en: "BACTRIKILLER is an advanced systemic and contact fungicide formulation designed to control leaf spots, anthracnose, blast, downy and powdery mildews."
    },
    basePrice: 320,
    originalPrice: 420,
    packSizes: [
      { size: "250 ml", price: 320 },
      { size: "500 ml", price: 580 },
      { size: "1 L", price: 1050 }
    ],
    image: "/assets/products/nice_png.png",
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewsCount: 142,
    crops: {
      mr: "टोमॅटो, मिरची, द्राक्षे, डाळिंब, ऊस, कापूस, सोयाबीन आणि भाजीपाला पिके.",
      en: "Tomato, Chilli, Grapes, Pomegranate, Sugarcane, Cotton, Soybean and Vegetables."
    },
    benefits: {
      mr: [
        "बुरशीच्या पेशींची वाढ रोखते आणि पुढील प्रसार तात्काळ थांबवते.",
        "झाडांची नैसर्गिक रोगप्रतिकारक शक्ती मजबूत करून नवीन फुटवा निरोगी ठेवते."
      ],
      en: [
        "Stops spore germination and mycelial growth, preventing disease spread.",
        "Improves greening effect and overall crop foliage health."
      ]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून पानांवर व्यवस्थित फवारणी करावी.",
      en: "Mix 1.5 to 2 ml per liter of water and spray thoroughly on the crop foliage."
    }
  },
  {
    id: "magic-gold",
    name: "MAGIC GOLD",
    category: "plant-growth",
    tagline: { mr: "उत्कृष्ट वनस्पती वाढ प्रवर्तक", en: "Premium Plant Growth Promoter" },
    shortDescription: {
      mr: "पिकांची शाकीय वाढ जोमदार करण्यासाठी आणि फुलांची गळती रोखण्यासाठी विशेष टॉनिक.",
      en: "Advanced liquid promoter for vegetative growth, flowering, and fruit setting."
    },
    description: {
      mr: "मॅजिक गोल्ड हे नैसर्गिक वनस्पती संप्रेरक आणि अमिनो ऍसिडचे विशेष मिश्रण आहे. हे झाडाच्या चयापचय क्रियेला उत्तेजन देते, ज्यामुळे फुलधारणा व फळधारणा उत्कृष्ट होते.",
      en: "MAGIC GOLD is a high-potency bio-stimulant based on naturally derived amino acids, vitamins, and trace enzymes. It balances crop hormone activity to yield superior branch splitting and flower retention."
    },
    basePrice: 280,
    originalPrice: 350,
    packSizes: [
      { size: "250 ml", price: 280 },
      { size: "500 ml", price: 500 },
      { size: "1 L", price: 900 }
    ],
    image: "/assets/products/magic_gold_500.png",
    isPopular: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 198,
    crops: {
      mr: "कापूस, मिरची, टोमॅटो, हरभरा, सोयाबीन, वांगी, फळबागा आणि सर्व भाजीपाला.",
      en: "Cotton, Chilli, Tomato, Gram, Soybean, Brinjal, Orchards and all Vegetables."
    },
    benefits: {
      mr: [
        "फुलांची संख्या वाढवते आणि कळ्यांची गळती लक्षणीयरीत्या कमी करते.",
        "फळांचा आकार, रंग आणि चमक सुधारून बाजारात उत्तम भाव मिळवून देते."
      ],
      en: [
        "Stimulates heavy flower budding and controls premature flower/bud dropping.",
        "Enhances size, weight, and shelf-life of fruits and vegetables."
      ]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाणी या प्रमाणात पिकाच्या फूल येण्याच्या आणि फळ धारणेच्या काळात फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray during vegetative growth and pre-flowering stages."
    }
  },
  {
    id: "mycrodifence",
    name: "MYCRODIFENCE",
    category: "micronutrients",
    tagline: { mr: "सर्व सूक्ष्म अन्नद्रव्यांचे संतुलित कॉम्बिनेशन", en: "Chelated Multi-Micronutrient Fertilizer" },
    shortDescription: {
      mr: "पिकांमधील अन्नद्रव्यांची कमतरता दूर करून पिका पिवळे पडण्यापासून वाचवते.",
      en: "Supplies essential chelated trace minerals (Zinc, Iron, Boron, Manganese) for high yields."
    },
    description: {
      mr: "मायक्रोडिफेन्स हे चिलेटेड स्वरूपातील सूक्ष्म अन्नद्रव्यांचे मिश्रण आहे. हे पाण्यात पूर्णपणे विरघळते आणि पिकाला झिंक, फेरस, बोरॉन, कॉपर आणि मॅंगनीज या घटकांचा तात्काळ पुरवठा करते.",
      en: "MYCRODIFENCE contains EDTA-chelated trace elements. It targets hidden nutrient deficiencies, ensuring efficient absorption through leaves, resulting in balanced nutrition and stronger crop metabolism."
    },
    basePrice: 220,
    originalPrice: 290,
    packSizes: [
      { size: "250 gm", price: 220 },
      { size: "500 gm", price: 390 },
      { size: "1 kg", price: 700 }
    ],
    image: "/assets/products/microdefence-front.jpg",
    isPopular: true,
    isNew: false,
    rating: 4.7,
    reviewsCount: 95,
    crops: {
      mr: "ऊस, हळद, केळी, द्राक्षे, डाळिंब, लिंबूवर्गीय फळे आणि भाजीपाला पिके.",
      en: "Sugarcane, Turmeric, Banana, Grapes, Pomegranate, Citrus and Vegetables."
    },
    benefits: {
      mr: [
        "पिकांमधील पिवळेपणा दूर करतो आणि प्रकाश संश्लेषण क्रिया वेगवान करतो.",
        "पिकांना थंडी, दुष्काळ आणि रोगांशी लढण्याची अतिरिक्त ताकद देते."
      ],
      en: [
        "Prevents leaf chlorosis (yellowing) and boosts overall photosynthesis efficiency.",
        "Ensures firm root penetration and robust plant skeletal strength."
      ]
    },
    usage: {
      mr: "१ ते १.५ ग्रॅम प्रति लिटर पाणी या प्रमाणात पानांवर फवारणी करावी किंवा ठिबक सिंचनाद्वारे द्यावे.",
      en: "Mix 1 to 1.5 gm per liter of water for foliar spray, or apply via drip irrigation."
    }
  },
  {
    id: "srpf",
    name: "SRPF",
    category: "silicon-based",
    tagline: { mr: "सिलिकॉन आधारित पीक संरक्षण शक्ती", en: "Silicon-Based Protective Shield" },
    shortDescription: {
      mr: "पिकाची बाह्य त्वचा मजबूत करून कीड आणि रोगांना नैसर्गिकरीत्या रोखणारे विशेष उत्पादन.",
      en: "Strengthens cell walls to naturally repel insects and fungal penetrations."
    },
    description: {
      mr: "एसआरपीएफ हे ऑर्थो-सिलिसिक ऍसिडवर आधारित उत्पादन आहे. हे झाडाच्या पानांमध्ये साठून एक कडक बाह्य कवच तयार करते, ज्यामुळे रस शोषणाऱ्या किडी आणि बुरशी पिकाला इजा करू शकत नाहीत.",
      en: "SRPF is a concentrated bio-available silicon formulation. It deposits a micro-silica layer on leaves, increasing structural resistance against sap-sucking pests and heat-stress transpiration."
    },
    basePrice: 350,
    originalPrice: 450,
    packSizes: [
      { size: "250 ml", price: 350 },
      { size: "500 ml", price: 650 }
    ],
    image: "/assets/products/srpf.png",
    isPopular: false,
    isNew: true,
    rating: 4.6,
    reviewsCount: 78,
    crops: {
      mr: "भात (धान), ऊस, मिरची, टोमॅटो, द्राक्षे, भाजीपाला आणि फुलझाडे.",
      en: "Paddy, Sugarcane, Chilli, Tomato, Grapes, Vegetables and Floriculture."
    },
    benefits: {
      mr: [
        "पानांवर कडक संरक्षक थर बनवून रस शोषक किडींचा प्रादुर्भाव कमी करतो.",
        "पिकांची पाणी धरून ठेवण्याची क्षमता वाढवतो, ज्यामुळे पाण्याचा ताण सहन होतो."
      ],
      en: [
        "Forms a protective silica layer to naturally lower thrips, mite and aphid feeding.",
        "Reduces crop lodging (bending) in high winds and improves drought tolerance."
      ]
    },
    usage: {
      mr: "१ ते १.५ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी (इतर औषधांसोबत देता येते).",
      en: "Mix 1 to 1.5 ml per liter of water and spray. Compatible with major bio-pesticides."
    }
  },
  {
    id: "nutri-grow",
    name: "NUTRI GROW-50",
    category: "micronutrients",
    tagline: { mr: "पीक पोषणासाठी उत्कृष्ट वॉटर सोल्यूबल खत", en: "Premium Water Soluble Crop Nutrient" },
    shortDescription: {
      mr: "नत्र, स्फुरद, पालाश आणि सूक्ष्म अन्नद्रव्यांचे संतुलित मिश्रण.",
      en: "Balanced formulation for drip irrigation and foliar application."
    },
    description: {
      mr: "नुट्री ग्रो-५० हे पिकांची पांढरी मुळी वेगाने वाढवण्यासाठी आणि पानांच्या संतुलित विकासासाठी डिझाइन केलेले आहे.",
      en: "NUTRI GROW-50 is a fast-acting water soluble nutrient mix designed for rapid vegetative development and quality yields."
    },
    basePrice: 240,
    originalPrice: 300,
    packSizes: [
      { size: "500 gm", price: 240 },
      { size: "1 kg", price: 450 }
    ],
    image: "/assets/products/nutri_grow.png",
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewsCount: 110,
    crops: {
      mr: "डाळिंब, हळद, भाजीपाला, फळबागा आणि सर्व पिके.",
      en: "Pomegranate, Turmeric, Vegetables, Orchards and all cash crops."
    },
    benefits: {
      mr: ["मुळांचा आणि पांढऱ्या मुळीचा वेगवान विकास.", "फळांचे वजन आणि बाजारातील गुणवत्ता सुधारते."],
      en: ["Stimulates fast feeder root system development.", "Improves fruit weight, size, and shelf-life."]
    },
    usage: {
      mr: "३ ते ५ ग्रॅम प्रति लिटर पाणी किंवा ठिबकद्वारे ३-५ किलो प्रति एकर.",
      en: "3 to 5 gm per liter for foliar spray, or 3-5 kg per acre via drip."
    }
  },
  {
    id: "bhooratna",
    name: "BHOORATNA",
    category: "plant-growth",
    tagline: { mr: "जमिनीची सुपीकता वाढवणारे सेंद्रिय खत", en: "Soil Enriching Organic Granules" },
    shortDescription: {
      mr: "मातीमधील जिवाणू वाढवून सेंद्रिय कर्ब सुधारण्यासाठी उपयुक्त दाणेदार खत.",
      en: "Rich humic and organic soil conditioner granules for strong root hold."
    },
    description: {
      mr: "भूरत्न हे दाणेदार स्वरूपातील सेंद्रिय खत आहे जे पिकांना दीर्घकाळ अन्नद्रव्यांचा पुरवठा करते आणि जमिनीचा पोत सुधारते.",
      en: "BHOORATNA granules enrich the soil with humic substances, amino acids, and trace elements to maintain crop strength."
    },
    basePrice: 480,
    originalPrice: 600,
    packSizes: [
      { size: "10 kg", price: 480 },
      { size: "20 kg", price: 900 }
    ],
    image: "/assets/products/bhooratna_mockup.png",
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 165,
    crops: {
      mr: "ऊस, कापूस, सोयाबीन, भाजीपाला, फळबागा.",
      en: "Sugarcane, Cotton, Soybean, Vegetables, Fruit Orchards."
    },
    benefits: {
      mr: ["जमिनीची जलधारण क्षमता वाढते.", "सेंद्रिय कर्बाचे प्रमाण वाढवून पांढऱ्या मुळीची वाढ निरोगी होते."],
      en: ["Improves soil water-retention capacity.", "Increases organic carbon and beneficial soil microbes."]
    },
    usage: {
      mr: "१० ते २० किलो प्रति एकर बेसल डोस म्हणून द्यावे.",
      en: "Apply 10 to 20 kg per acre as basal dose during sowing or weeding."
    }
  },
  {
    id: "bhusavardhan",
    name: "BHUSAVARDHAN",
    category: "plant-growth",
    tagline: { mr: "माती सुधारक आणि मुळांची वाढ करणारे टॉनिक", en: "Soil Conditioner & Root Developer" },
    shortDescription: {
      mr: "माती भुसभुशीत करून मुळांना हवा आणि पाणी खेळती ठेवते.",
      en: "Maintains optimal soil aeration and accelerates crop root development."
    },
    description: {
      mr: "भूसंवर्धन मुळांच्या कार्यक्षमतेत वाढ करून खतांचा अपव्यय टाळते आणि पिकांची शाश्वत वाढ घडवून आणते.",
      en: "BHUSAVARDHAN enhances nutrient uptake from the soil, preventing wastage of NPK and promoting balanced crop growth."
    },
    basePrice: 380,
    originalPrice: 480,
    packSizes: [
      { size: "1 L", price: 380 },
      { size: "5 L", price: 1750 }
    ],
    image: "/assets/products/bhusavardhan_(2).png",
    isPopular: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 112,
    crops: {
      mr: "द्राक्षे, डाळिंब, ऊस, आले, हळद आणि भाजीपाला पिके.",
      en: "Grapes, Pomegranate, Sugarcane, Ginger, Turmeric and Vegetables."
    },
    benefits: {
      mr: ["मुळांच्या जवळ हवा खेळती ठेवून माती भुसभुशीत करते.", "पिकाची अन्न शोषण्याची क्षमता वाढते."],
      en: ["Aerates the soil around root zone.", "Improves overall fertilizer absorption efficiency."]
    },
    usage: {
      mr: "१ ते २ लिटर प्रति एकर ठिबकद्वारे किंवा आळवणीद्वारे द्यावे.",
      en: "Apply 1 to 2 liters per acre through drip irrigation or drenching."
    }
  },
  {
    id: "cotton-special",
    name: "COTTON SPECIAL",
    category: "plant-growth",
    tagline: { mr: "कापूस पिकासाठी विशेष वाढ संप्रेरक", en: "Special Growth Promoter for Cotton" },
    shortDescription: {
      mr: "कापसाचे पाते गळणे थांबवून बोंडांची संख्या आणि आकार वाढवणारे टॉनिक.",
      en: "Special formulation to prevent flower drop and increase cotton boll weight."
    },
    description: {
      mr: "कापूस पिकाच्या गरजेनुसार तयार केलेले हे टॉनिक कापसाची वाढ निरोगी ठेवते आणि कापसाचा दर्जा सुधारते.",
      en: "COTTON SPECIAL provides vital micro-elements and vegetative growth enhancers customized for high-yield cotton farming."
    },
    basePrice: 340,
    originalPrice: 420,
    packSizes: [
      { size: "250 ml", price: 340 },
      { size: "500 ml", price: 620 }
    ],
    image: "/assets/products/cotton.png",
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 220,
    crops: {
      mr: "कापूस (Cotton).",
      en: "Cotton crop."
    },
    benefits: {
      mr: ["पातेगळ रोखते आणि बोंडांचा आकार वाढवते.", "कापसाच्या धाग्याची लांबी आणि चमक सुधारते."],
      en: ["Controls square and boll dropping.", "Improves fiber length, strength, and brightness."]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
      en: "Mix 1.5 to 2 ml per liter of water and spray during flowering and boll formation."
    }
  },
  {
    id: "corn-special",
    name: "CORN SPECIAL",
    category: "plant-growth",
    tagline: { mr: "मका पिकासाठी विशेष अन्नद्रव्य टॉनिक", en: "Special Nutrient Tonic for Maize/Corn" },
    shortDescription: {
      mr: "मक्याच्या कणसाचा दाणेदार भरवदारपणा आणि वजन वाढवण्यासाठी उपयुक्त.",
      en: "Improves grain filling, cob size, and chlorophyll content in maize."
    },
    description: {
      mr: "मका पिकासाठी विशेष रीतीने तयार केलेले हे टॉनिक पानांचा हिरवेगारपणा राखते आणि कणसाचा आकार वाढवते.",
      en: "CORN SPECIAL delivers targeted micronutrients to prevent yellowing and ensure complete grain filling in cobs."
    },
    basePrice: 320,
    originalPrice: 400,
    packSizes: [
      { size: "250 ml", price: 320 },
      { size: "500 ml", price: 580 }
    ],
    image: "/assets/products/corn.png",
    isPopular: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 88,
    crops: {
      mr: "मका, बाजरी, ज्वारी आणि तृणधान्ये.",
      en: "Maize, Pearl Millet, Sorghum and Cereal Crops."
    },
    benefits: {
      mr: ["कणसामध्ये दाणे शेवटपर्यंत पूर्णपणे भरतात.", "पानांमध्ये हरितद्रव्याची वाढ होऊन मका जोमदार वाढतो."],
      en: ["Ensures complete grain filling till the cob tip.", "Boosts chlorophyll content for healthier vegetative yield."]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून ३० ते ४५ दिवसांच्या पिकावर फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray on 30-45 days old crop."
    }
  },
  {
    id: "fast-result",
    name: "FAST RESULT",
    category: "plant-growth",
    tagline: { mr: "जलद वनस्पती वाढ आणि फुलांची संख्या वाढवणारे टॉनिक", en: "Instant Plant Growth & Bloom Stimulator" },
    shortDescription: {
      mr: "फवारणीनंतर अवघ्या ४८ तासांत पिकांवर हिरवेगारपणा आणि फुटवे आणते.",
      en: "Shows visible greening and vegetative shooting within 48 hours."
    },
    description: {
      mr: "फास्ट रिझल्ट हे अत्यंत जलद गतीने काम करणारे ग्रोथ टॉनिक आहे जे पिकाचे पोषण चक्र गतिमान करते.",
      en: "FAST RESULT triggers rapid cell division and shoot extension, making it ideal for recovery after stress."
    },
    basePrice: 650,
    originalPrice: 800,
    packSizes: [
      { size: "1 L", price: 650 },
      { size: "5 L", price: 2900 }
    ],
    image: "/assets/products/fast_5ltr.png",
    isPopular: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 310,
    crops: {
      mr: "सोयाबीन, कापूस, हरभरा, ऊस, भाजीपाला आणि फळबागा.",
      en: "Soybean, Cotton, Gram, Sugarcane, Vegetables and Horticulture."
    },
    benefits: {
      mr: ["पानांची प्रकाशसंश्लेषण क्रिया अत्यंत जलद गतीने वाढते.", "नवीन फुटवे आणि फांद्यांची संख्या झपाट्याने वाढते."],
      en: ["Visible greening effect and photosynthetic boost.", "Stimulates multiple branching and vegetative nodes."]
    },
    usage: {
      mr: "२ ते २.५ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
      en: "Mix 2 to 2.5 ml per liter of water and spray thoroughly."
    }
  },
  {
    id: "krushi-kranti",
    name: "KRUSHI KRANTI",
    category: "plant-growth",
    tagline: { mr: "पिकांच्या निरोगी वाढीसाठी सेंद्रिय टॉनिक", en: "Organic Crop Vigor Tonic" },
    shortDescription: {
      mr: "उत्कृष्ट फूल धारणा आणि फळ पोषणासाठी सेंद्रिय संजीवकांचे संतुलित मिश्रण.",
      en: "Multi-nutrient bio-stimulant for complete vegetative protection."
    },
    description: {
      mr: "कृषी क्रांती पिकांना पोषक घटकांचा पुरवठा करून विविध हवामान बदलांमध्ये तग धरण्याची ताकद देते.",
      en: "KRUSHI KRANTI increases crop stamina to withstand temperature swings while maintaining fruit size."
    },
    basePrice: 290,
    originalPrice: 380,
    packSizes: [
      { size: "250 ml", price: 290 },
      { size: "500 ml", price: 520 }
    ],
    image: "/assets/products/krushi_kranti_moc.png",
    isPopular: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 125,
    crops: {
      mr: "मिरची, टोमॅटो, द्राक्षे, कांदा, बटाटा, ऊस आणि कडधान्ये.",
      en: "Chilli, Tomato, Grapes, Onion, Potato, Sugarcane and Pulses."
    },
    benefits: {
      mr: ["फुलांचे फळांत रूपांतर करण्याची क्षमता सुधारते.", "झाडांना नैसर्गिक चकाकी आणि अन्न पुरवठा प्रदान करते."],
      en: ["Improves flower retention and conversion to fruits.", "Supplies organic trace elements to keep the crop robust."]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाणी पानांवर फवारणी.",
      en: "Mix 1.5 to 2 ml per liter of water for foliar application."
    }
  },
  {
    id: "krushivardan",
    name: "KRUSHI VARDHAN",
    category: "plant-growth",
    tagline: { mr: "पिकांची प्रतिकारशक्ती वाढवणारे टॉनिक", en: "Crop Immunity & Growth Booster" },
    shortDescription: {
      mr: "रोग आणि किडींविरुद्ध पिकाची नैसर्गिक संरक्षण यंत्रणा कार्यरत करते.",
      en: "Strengthens cellular defense systems against common pathogens."
    },
    description: {
      mr: "कृषीवर्धन पिकाला आतून बळकट करते, ज्यामुळे कीड व रोगाचा प्रादुर्भाव कमी होतो आणि झाडे निरोगी राहतात.",
      en: "KRUSHI VARDHAN stimulates structural defense responses in host plants, preventing pathogen colonization."
    },
    basePrice: 310,
    originalPrice: 400,
    packSizes: [
      { size: "250 ml", price: 310 },
      { size: "500 ml", price: 560 }
    ],
    image: "/assets/products/krushivardan.png",
    isPopular: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 94,
    crops: {
      mr: "कापूस, मिरची, टोमॅटो, फळे and भाजीपाला पिके.",
      en: "Cotton, Chilli, Tomato, Fruits and all vegetable varieties."
    },
    benefits: {
      mr: ["झाडांची अंतर्गत प्रतिकारशक्ती प्रचंड वाढते.", "पानांचा आकार आणि खोडाची मजबुती सुधारते."],
      en: ["Boosts internal plant defense mechanism.", "Improves leaf span and stem mechanical strength."]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray thoroughly."
    }
  },
  {
    id: "neem-shakti",
    name: "NEEM SHAKTI",
    category: "plant-growth",
    tagline: { mr: "नैसर्गिक कडुनिंब आधारित पीक संरक्षक", en: "Natural Neem-Based Crop Protector" },
    shortDescription: {
      mr: "रस शोषणाऱ्या किडी आणि अळ्यांना अंडी घालण्यापासून रोखणारे जैविक कडुनिंब औषध.",
      en: "Organic pest repellent containing highly active Azadirachtin compound."
    },
    description: {
      mr: "नीम शक्ती हे नैसर्गिक लिंबोळी अर्क आणि कडुनिंब तेलापासून बनवलेले सेंद्रिय कीटकनाशक आहे जे सुरक्षित शेतीसाठी पूरक आहे.",
      en: "NEEM SHAKTI repels chewing and sucking pests by disrupting their feeding and reproductive cycle."
    },
    basePrice: 260,
    originalPrice: 340,
    packSizes: [
      { size: "250 ml", price: 260 },
      { size: "500 ml", price: 480 },
      { size: "1 L", price: 850 }
    ],
    image: "/assets/products/neem_new.png",
    isPopular: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 140,
    crops: {
      mr: "सर्व फळझाडे, भाजीपाला, फुलझाडे, कापूस आणि ऊस.",
      en: "All fruit crops, vegetables, flowers, cotton and sugarcane."
    },
    benefits: {
      mr: ["रस शोषणाऱ्या किडींवर अत्यंत प्रभावी प्रतिबंधक.", "पूर्णपणे सेंद्रिय असल्यामुळे मानवाला आणि मित्रकिडींना सुरक्षित."],
      en: ["Effective repeller against aphids, whiteflies, and thrips.", "Eco-friendly, safe for beneficial insects and predators."]
    },
    usage: {
      mr: "२ ते ३ मिली प्रति लिटर पाणी या प्रमाणात सुरुवातीपासून दर १५ दिवसांनी फवारणी करावी.",
      en: "Mix 2 to 3 ml per liter of water and spray every 15 days preventively."
    }
  },
  {
    id: "kanda-special",
    name: "KANDA SPECIAL",
    category: "plant-growth",
    tagline: { mr: "कांदा पिकाचा आकार आणि गुणवत्ता वाढवणारे विशेष टॉनिक", en: "Onion Bulb Size & Quality Enhancer" },
    shortDescription: {
      mr: "कांद्याची पात हिरवीगार ठेवून कांद्याची फुगवण व वजन वाढवण्यासाठी सर्वोत्तम.",
      en: "Optimizes bulb sizing and improves onion leaf structure strength."
    },
    description: {
      mr: "कांदा स्पेशल कांद्याची फुगवण क्षमता वाढवून त्याला आकर्षक रंग आणि चमकदार त्वचा प्रदान करते.",
      en: "KANDA SPECIAL contains potassium-rich and sulfur-friendly micronutrients to maximize onion bulb weight."
    },
    basePrice: 330,
    originalPrice: 420,
    packSizes: [
      { size: "250 ml", price: 330 },
      { size: "500 ml", price: 600 }
    ],
    image: "/assets/products/pnd_kanda.png",
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 185,
    crops: {
      mr: "कांदा, लसूण, बटाटा आणि इतर कंदपिके.",
      en: "Onion, Garlic, Potato and other tuber crops."
    },
    benefits: {
      mr: ["कांद्याचा आकार आणि वजन वाढवते.", "कांद्याची साठवणूक क्षमता (टिकवण) सुधारते."],
      en: ["Increases bulb circumference and density.", "Enhances storage shelf-life of harvested onions."]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून ३५ व्या आणि ५५ व्या दिवशी फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray at 35 and 55 days of crop age."
    }
  },
  {
    id: "kuber",
    name: "KUBER",
    category: "plant-growth",
    tagline: { mr: "भरघोस उत्पन्नासाठी समृद्ध वनस्पती टॉनिक", en: "Wealth Yielding Organic Stimulator" },
    shortDescription: {
      mr: "उत्पादनात भरघोस वाढ घडवून आणणारे विशेष सेंद्रिय संजीवक.",
      en: "Organic yield booster formulation for high grade cash crops."
    },
    description: {
      mr: "कुबेर वनस्पतींच्या पेशींना उत्तेजित करून पानांची आणि फांद्यांची संतुलित शाकीय वाढ घडवून आणते.",
      en: "KUBER stimulates biological pathways to optimize carbohydrate and protein synthesis inside crops."
    },
    basePrice: 420,
    originalPrice: 550,
    packSizes: [
      { size: "250 ml", price: 420 },
      { size: "500 ml", price: 780 }
    ],
    image: "/assets/products/png_kuber.png",
    isPopular: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 104,
    crops: {
      mr: "ऊस, कापूस, मिरची, हळद, केळी, द्राक्षे आणि भाजीपाला.",
      en: "Sugarcane, Cotton, Chilli, Turmeric, Banana, Grapes and Vegetables."
    },
    benefits: {
      mr: ["पिकांची वाढ निरोगी आणि सुदृढ होते.", "फळांची फुगवण आणि प्रत उत्तम सुधारते."],
      en: ["Promotes deep green and disease-resistant vocabulary.", "Enhances crop sizing, uniformity, and premium weight."]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
      en: "Mix 1.5 to 2 ml per liter of water and spray."
    }
  },
  {
    id: "agri-sulf",
    name: "AGRI SULF",
    category: "micronutrients",
    tagline: { mr: "पिकांसाठी सल्फरयुक्त सूक्ष्म अन्नद्रव्य खत", en: "Sulphur Nutrient Crop Fertilizer" },
    shortDescription: {
      mr: "पिकांमध्ये तेल व प्रथिनांचे प्रमाण वाढवून जमिनीत ओलावा टिकवून ठेवते.",
      en: "Delivers essential Sulphur to boost oil and protein content."
    },
    description: {
      mr: "ॲग्री सल्फर हे पिकांसाठी एक आवश्यक पोषण घटक आहे जे जमिनीचा पीएच (pH) संतुलित करण्यास मदत करते.",
      en: "AGRI SULF supplies highly absorbable sulphur to correct nutrient blockages and improve oil content in oilseeds."
    },
    basePrice: 190,
    originalPrice: 250,
    packSizes: [
      { size: "500 gm", price: 190 },
      { size: "1 kg", price: 350 }
    ],
    image: "/assets/products/agri_salf.png",
    isPopular: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 76,
    crops: {
      mr: "सोयाबीन, भुईमूग, मोहरी, कांदा, लसूण आणि कडधान्ये.",
      en: "Soybean, Groundnut, Mustard, Onion, Garlic and oilseed crops."
    },
    benefits: {
      mr: ["तेलबिया पिकांमध्ये तेलाचे प्रमाण लक्षणीय वाढते.", "कांदा व लसूण पिकात तिखटपणा आणि रंग चांगला येतो."],
      en: ["Significantly increases oil yield in peanuts and soybeans.", "Improves typical pungency and skin color of onions."]
    },
    usage: {
      mr: "३ ते ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करावी.",
      en: "Mix 3 to 5 gm per liter of water and spray."
    }
  },
  {
    id: "balram",
    name: "BALRAM",
    category: "plant-growth",
    tagline: { mr: "केळी आणि इतर पिकांच्या शाकीय वाढीसाठी सर्वोत्तम", en: "Banana & Vegetative Growth Specialist" },
    shortDescription: {
      mr: "खोडाची जाडी आणि पानांची रुंदी वाढवणारे विशेष केळी स्पेशल टॉनिक.",
      en: "Promotes thick pseudostems and broad leaves in banana fields."
    },
    description: {
      mr: "बलराम केळी पिकाच्या वाढीच्या विविध टप्प्यांवर पोषण पुरवून पानांमधील अन्न निर्मितीचा वेग वाढवते.",
      en: "BALRAM provides high-grade natural enzymes and organic minerals to stimulate solid pseudostems in banana."
    },
    basePrice: 360,
    originalPrice: 450,
    packSizes: [
      { size: "250 ml", price: 360 },
      { size: "500 ml", price: 680 }
    ],
    image: "/assets/products/balram-mock_(1).png",
    isPopular: false,
    isNew: false,
    rating: 4.9,
    reviewsCount: 115,
    crops: {
      mr: "केळी, पपई, ऊस आणि वेलवर्गीय पिके.",
      en: "Banana, Papaya, Sugarcane and trellis crops."
    },
    benefits: {
      mr: ["केळीच्या खोडाला जाडी येते व पाने रुंद होतात.", "घडाचा आकार वाढून फळे समान लांबीची होतात."],
      en: ["Increases stem diameter and leaves surface area.", "Promotes uniform finger development and large banana bunches."]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाण्यात मिसळून फवारणी किंवा आळवणी करावी.",
      en: "Mix 2 ml per liter of water for foliar spray or drenching."
    }
  },
  {
    id: "white-kill",
    name: "WHITE KILL",
    category: "fungicides",
    tagline: { mr: "पांढऱ्या माशी आणि बुरशीचा तात्काळ नायनाट", en: "Broad Spectrum Whitefly & Fungus Destroyer" },
    shortDescription: {
      mr: "मिरची व कापसावरील तेल्या, करपा आणि कीड यांचा वेगाने बंदोबस्त.",
      en: "Provides quick knock-down action against whiteflies and leaf-spots."
    },
    description: {
      mr: "व्हाईट कील हे झाडाच्या पानांमध्ये खोलवर पसरून रोगकारक बुरशी आणि कीटक नियंत्रित करते.",
      en: "WHITE KILL is an advanced crop wellness formulation containing organic insect repellents and active fungicides."
    },
    basePrice: 480,
    originalPrice: 600,
    packSizes: [
      { size: "250 ml", price: 480 },
      { size: "500 ml", price: 900 }
    ],
    image: "/assets/products/white_kill.png",
    isPopular: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 130,
    crops: {
      mr: "मिरची, कापूस, टोमॅटो, द्राक्षे आणि भाजीपाला पिके.",
      en: "Chilli, Cotton, Tomato, Grapes and all vegetables."
    },
    benefits: {
      mr: ["पांढऱ्या माशीचा प्रादुर्भाव पूर्ण थांबवतो.", "बुरशीजन्य करपा व पानावरील डाग तात्काळ आटोक्यात आणतो."],
      en: ["Drives out stubborn whitefly populations safely.", "Arrests severe leaf rust and anthracnose spread."]
    },
    usage: {
      mr: "१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून पानांवर फवारणी करावी.",
      en: "Mix 1.5 to 2 ml per liter of water and spray on infested leaves."
    }
  },
  {
    id: "top-10",
    name: "TOP 10",
    category: "plant-growth",
    tagline: { mr: "उत्कृष्ट उत्पादन आणि फुलांसाठी १०-इन-१ टॉनिक", en: "10-in-1 Premium Plant Tonic" },
    shortDescription: {
      mr: "पिकांच्या निरोगी पानांसाठी १० हून अधिक सेंद्रिय पोषण द्रव्यांचे मिश्रण.",
      en: "10-in-1 organic liquid nutrients formulation for bumper crops."
    },
    description: {
      mr: "टॉप १० पिकाच्या पानांचा आकार, चकाकी आणि फळांचे पोषण सुधारणारे सर्वसमावेशक संजीवक आहे.",
      en: "TOP 10 integrates seaweed extract, vitamins, fulvic acid, and chelated minerals to keep crops yielding at peak."
    },
    basePrice: 390,
    originalPrice: 500,
    packSizes: [
      { size: "250 ml", price: 390 },
      { size: "500 ml", price: 720 }
    ],
    image: "/assets/products/top_10.png",
    isPopular: false,
    isNew: true,
    rating: 4.9,
    reviewsCount: 205,
    crops: {
      mr: "सर्व तृणधान्ये, भाजीपाला, फळबागा आणि गळित धान्ये.",
      en: "All cereal crops, vegetables, fruit orchards and cash crops."
    },
    benefits: {
      mr: ["झाडांना १० पट वेगाने पोषण प्रदान करते.", "पाती आणि फुलांची गळती थांबवून फळांची चमक सुधारते."],
      en: ["Accelerates nutrient transportation 10x faster.", "Stops bud drop and gives glossy premium look to fruits."]
    },
    usage: {
      mr: "२ मिली प्रति लिटर पाणी या प्रमाणात पिकाच्या शाकीय वाढीच्या काळात फवारणी करावी.",
      en: "Mix 2 ml per liter of water and spray during active growth nodes."
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
