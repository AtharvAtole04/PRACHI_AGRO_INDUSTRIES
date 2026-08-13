import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import Models
import Product from './models/Product.js';
import Video from './models/Video.js';
import Blog from './models/Blog.js';
import Review from './models/Review.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prachi_agro';

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
      en: "BACTRIKILLER is a advanced systemic and contact fungicide formulation designed to control leaf spots, anthracnose, blast, downy and powdery mildews. It is absorbed rapidly by plant tissue to arrest fungal growth."
    },
    basePrice: 320,
    originalPrice: 420,
    packSizes: [
      { size: "250 ml", price: 320 },
      { size: "500 ml", price: 580 },
      { size: "1 L", price: 1050 }
    ],
    image: "/assets/products/bactrikiller.svg",
    rating: 4.8,
    reviewsCount: 142,
    crops: {
      mr: "टोमॅटो, मिरची, द्राक्षे, डाळिंब, ऊस, कापूस, सोयाबीन आणि भाजीपाला पिके.",
      en: "Tomato, Chilli, Grapes, Pomegranate, Sugarcane, Cotton, Soybean and Vegetables."
    },
    benefits: {
      mr: [
        "फवारणीनंतर तातडीने पिकाच्या पानांमध्ये शोषले जाते, ज्यामुळे पावसाने वाहून जात नाही.",
        "बुरशीच्या पेशींची वाढ रोखते आणि पुढील प्रसार तात्काळ थांबवते.",
        "झाडांची नैसर्गिक रोगप्रतिकारक शक्ती मजबूत करून नवीन फुटवा निरोगी ठेवते."
      ],
      en: [
        "Rapidly absorbed by foliage within 2 hours of application, making it rain-fast.",
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
      mr: "मॅजिक गोल्ड हे नैसर्गिक वनस्पती संप्रेरक आणि अमिनो ॲसिडचे विशेष मिश्रण आहे. हे झाडाच्या चयापचय क्रियेला उत्तेजन देते, ज्यामुळे फुलधारणा व फळधारणा उत्कृष्ट होते.",
      en: "MAGIC GOLD is a high-potency bio-stimulant based on naturally derived amino acids, vitamins, and trace enzymes. It balances crop hormone activity to yield superior branch splitting and flower retention."
    },
    basePrice: 280,
    originalPrice: 350,
    packSizes: [
      { size: "250 ml", price: 280 },
      { size: "500 ml", price: 500 },
      { size: "1 L", price: 900 }
    ],
    image: "/assets/products/magic_gold.svg",
    rating: 4.9,
    reviewsCount: 198,
    crops: {
      mr: "कापूस, मिरची, टोमॅटो, हरभरा, सोयाबीन, वांगी, फळबागा आणि सर्व भाजीपाला.",
      en: "Cotton, Chilli, Tomato, Gram, Soybean, Brinjal, Orchards and all Vegetables."
    },
    benefits: {
      mr: [
        "फुलांची संख्या वाढवते आणि कळ्यांची गळती लक्षणीयरीत्या कमी करते.",
        "अन्नाची निर्मिती आणि पानांमधील क्लोरोफिल (हरितद्रव्य) चे प्रमाण वाढवते.",
        "फळांचा आकार, रंग आणि चमक सुधारून बाजारात उत्तम भाव मिळवून देते."
      ],
      en: [
        "Stimulates heavy flower budding and controls premature flower/bud dropping.",
        "Increases chlorophyll synthesis leading to darker, healthier leaves.",
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
    image: "/assets/products/mycrodifence.svg",
    rating: 4.7,
    reviewsCount: 95,
    crops: {
      mr: "ऊस, हळद, केळी, द्राक्षे, डाळिंब, लिंबूवर्गीय फळे आणि भाजीपाला पिके.",
      en: "Sugarcane, Turmeric, Banana, Grapes, Pomegranate, Citrus and Vegetables."
    },
    benefits: {
      mr: [
        "पिकांमधील पिवळेपणा दूर करतो आणि प्रकाश संश्लेषण क्रिया वेगवान करतो.",
        "फुलांचे फळात रूपांतर होण्याचे प्रमाण सुधारते.",
        "पिकांना थंडी, दुष्काळ आणि रोगांशी लढण्याची अतिरिक्त ताकद देते."
      ],
      en: [
        "Prevents leaf chlorosis (yellowing) and boosts overall photosynthesis efficiency.",
        "Improves assimilation of main fertilizers (NPK) in the crop system.",
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
    image: "/assets/products/srpf.svg",
    rating: 4.6,
    reviewsCount: 78,
    crops: {
      mr: "भात (धान), ऊस, मिरची, टोमॅटो, द्राक्षे, भाजीपाला आणि फुलझाडे.",
      en: "Paddy, Sugarcane, Chilli, Tomato, Grapes, Vegetables and Floriculture."
    },
    benefits: {
      mr: [
        "पानांवर कडक संरक्षक थर बनवून रस शोषक किडींचा प्रादुर्भाव कमी करतो.",
        "झाडांची पाने ताठ ठेवतो, ज्यामुळे सूर्यप्रकाश अधिक चांगला शोषला जातो.",
        "पिकांची पाणी धरून ठेवण्याची क्षमता वाढवतो, ज्यामुळे पाण्याचा ताण सहन होतो."
      ],
      en: [
        "Forms a protective silica layer to naturally lower thrips, mite and aphid feeding.",
        "Increases leaf erectness, facilitating maximum solar capture and growth.",
        "Reduces crop lodging (bending) in high winds and improves drought tolerance."
      ]
    },
    usage: {
      mr: "१ ते १.५ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी (इतर औषधांसोबत देता येते).",
      en: "Mix 1 to 1.5 ml per liter of water and spray. Compatible with major bio-pesticides."
    }
  }
];

const defaultVideos = [
  {
    id: "sugarcane-100-tons",
    title: {
      mr: "ऊस पिकाचे भरघोस उत्पादन - एकरी १०० टन ध्येय नियोजन व खत व्यवस्थापन",
      en: "Sugarcane Crop High Yield - 100 Tons Per Acre Fertilizer Planning"
    },
    crop: { mr: "ऊस (Sugarcane)", en: "Sugarcane" },
    category: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" },
    duration: "10:45",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "tomato-magic-gold",
    title: {
      mr: "टोमॅटो पिकातील करपा व ठिपके नियंत्रण - मॅजिक गोल्ड मार्गदर्शक",
      en: "Tomato Crop Disease Control - How to use Magic Gold"
    },
    crop: { mr: "टोमॅटो (Tomato)", en: "Tomato" },
    category: { mr: "प्राची अॅग्रो उत्पादने", en: "Prachi Agro Products" },
    duration: "8:20",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "bio-fulvic-roots",
    title: {
      mr: "मुळांच्या जोमदार विकासासाठी बायो फल्व्हिक (Bio Fulvic) चे फायदे आणि वापर",
      en: "Benefits and Application of Bio Fulvic for Vigorous Root Development"
    },
    crop: { mr: "सर्व पिके (All Crops)", en: "All Crops" },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    duration: "6:15",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400"
  }
];

const defaultBlogs = [
  {
    id: "identifying-crop-diseases",
    title: {
      mr: "पिकांवरील बुरशीजन्य रोग ओळखण्याची सोपी पद्धत",
      en: "Easy Ways to Identify Fungal Diseases in Crops"
    },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    date: "2026-08-10",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400",
    excerpt: {
      mr: "पिकांवर बुरशीजन्य रोग आल्यास पानांवर डाग पडणे, पाने पिवळी पडणे किंवा वाळणे अशी लक्षणे दिसतात. या लेखात आपण बुरशीजन्य रोगांचे वेळेवर निदान कसे करावे हे पाहू.",
      en: "Fungal diseases present symptoms like spots on leaves, yellowing, or drying of plants. Learn how to identify these diseases early to protect your yields."
    },
    content: {
      mr: "पिकांवरील बुरशीजन्य रोग हे पिकाच्या नुकसानीचे सर्वात मोठे कारण ठरतात. जर वेळेवर नियंत्रण केले नाही, तर पूर्ण पीक उद्ध्वस्त होऊ शकते.\n\n१. पानांवरील लक्षणे:\nपानांवर काळे, तपकिरी किंवा पिवळे ठिपके (Spots) पडतात. पानांच्या खालच्या बाजूला बुरशीचा पांढरा किंवा करडा थर दिसतो (उदा. तांबेरा किंवा भुरी रोग).\n\n२. खोडावरील लक्षणे:\nखोडा काळे पडणे, सडणे किंवा खोडावर जखमा तयार होणे.\n\n३. नियंत्रणाचे उपाय:\n- शेत स्वच्छ ठेवावे आणि पिकांची फेरपालट करावी.\n- रोगाची सुरुवातीची लक्षणे दिसताच 'BACTRIKILLER' सारख्या सिस्टीमिक बुरशीनाशकाची फवारणी करावी.\n- अतिरिक्त पाणी देणे टाळावे कारण दमट वातावरण बुरशीच्या वाढीला पोषक असते.",
      en: "Fungal diseases in crops are a major cause of crop damage. If not controlled on time, they can lead to complete yield loss.\n\n1. Symptoms on Leaves:\nBlack, brown, or yellow spots appear on the leaves. A white or grey powdery growth can be seen on the underside of the leaves (e.g. rust or powdery mildew).\n\n2. Symptoms on Stems:\nBrowning, rotting, or cankers on the main stem.\n\n3. Control Measures:\n- Maintain field hygiene and follow crop rotation.\n- At the very first sign of disease, spray a systemic fungicide like 'BACTRIKILLER'.\n- Avoid over-watering, as high humidity promotes fungal spores propagation."
    }
  }
];

const defaultReviews = [
  {
    name: "रामचंद्र पाटील",
    location: "नाशिक",
    crop: { mr: "द्राक्षे", en: "Grapes" },
    rating: 5,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "माझ्या द्राक्ष बागेवर मागील वर्षी मोठ्या प्रमाणावर बुरशीचा प्रादुर्भाव झाला होता. मी प्राची अॅग्रोचे 'BACTRIKILLER' वापरले, आणि अगदी २ फवारण्यांमध्ये उत्कृष्ट परिणाम मिळाला. बुरशी पूर्णपणे आटोक्यात आली.",
      en: "Last year, my grape orchard suffered a heavy fungal outbreak. I sprayed Prachi Agro's 'BACTRIKILLER' and observed amazing results in just two applications. The fungus was completely controlled."
    }
  },
  {
    name: "संजय देशमुख",
    location: "सांगली",
    crop: { mr: "हळद व मिरची", en: "Turmeric & Chilli" },
    rating: 5,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "मिरचीच्या झाडांची पाने बोकडल्यासारखी (आकसलेली) झाली होती. कृषी तज्ज्ञांच्या सल्ल्यानुसार मी 'MYCRODIFENCE' आणि 'FAST RESULT' फवारले. मिरचीची पाने आता सुंदर व हिरवीगार झाली आहेत आणि फुलांची संख्याही वाढली आहे.",
      en: "My chilli plants had severe leaf curling issues. Following recommendations, I sprayed 'MYCRODIFENCE' and 'FAST RESULT'. The foliage is now lush green and healthy, and the number of flower buds has doubled."
    }
  }
];

async function seed() {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Cleaning collections...');

    await Product.deleteMany({});
    await Video.deleteMany({});
    await Blog.deleteMany({});
    await Review.deleteMany({});

    console.log('Inserting default products...');
    await Product.insertMany(defaultProducts);

    console.log('Inserting default videos...');
    await Video.insertMany(defaultVideos);

    console.log('Inserting default blogs...');
    await Blog.insertMany(defaultBlogs);

    console.log('Inserting default reviews...');
    await Review.insertMany(defaultReviews);

    console.log('🎉 Seeding successfully completed! All tables reset and pre-populated.');
  } catch (err) {
    console.error('❌ Error during seeding database:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

seed();
