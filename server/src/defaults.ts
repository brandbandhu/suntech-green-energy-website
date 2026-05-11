import { fallbackGoogleReviewUrl } from "../../shared/google-review-fallback.js";

export const defaultProjects = [
  {
    title: "Villa Rooftop Solar",
    location: "Pune, MH",
    capacity: "10 kW",
    co2Savings: "15T/yr",
    category: "Residential",
    description: "Premium rooftop solar installation for a modern villa with strong energy savings.",
    imageUrl: "/assets/project/DJI_20250609152806_0157_D.JPG.jpeg",
    sortOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    title: "Apartment Complex",
    location: "Mumbai, MH",
    capacity: "25 kW",
    co2Savings: "37T/yr",
    category: "Residential",
    description: "Common-area solar project designed to reduce operating costs for a housing society.",
    imageUrl: "/assets/project/DJI_20250609152835_0158_D.JPG.jpeg",
    sortOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    title: "IT Office Campus",
    location: "Bangalore, KA",
    capacity: "500 kW",
    co2Savings: "750T/yr",
    category: "Industrial",
    description: "High-output solar solution for a large office campus focused on ROI and ESG targets.",
    imageUrl: "/assets/project/DJI_20250609152847_0159_D.JPG.jpeg",
    sortOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    title: "Shopping Mall",
    location: "Hyderabad, TS",
    capacity: "300 kW",
    co2Savings: "450T/yr",
    category: "Industrial",
    description: "Commercial solar deployment built to offset daytime demand at a retail destination.",
    imageUrl: "/assets/project/DJI_20250609153027_0162_D.JPG.jpeg",
    sortOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
  {
    title: "Factory Rooftop",
    location: "Nashik, MH",
    capacity: "2 MW",
    co2Savings: "3000T/yr",
    category: "Rooftop",
    description: "Large-format factory rooftop system with long-term savings and reliable generation.",
    imageUrl: "/assets/project/DJI_20250609153034_0163_D.JPG.jpeg",
    sortOrder: 5,
    isFeatured: true,
    isPublished: true,
  },
  {
    title: "Warehouse Solar",
    location: "Chennai, TN",
    capacity: "1 MW",
    co2Savings: "1500T/yr",
    category: "Rooftop",
    description: "Warehouse rooftop installation optimized for stable operations and lower energy costs.",
    imageUrl: "/assets/project/DJI_20250609154417_0168_D.JPG.jpeg",
    sortOrder: 6,
    isFeatured: true,
    isPublished: true,
  },
];

export const defaultTestimonials = [
  {
    name: "Rajesh Kumar",
    role: "Homeowner, Pune",
    text: "Suntech installed a 5kW system on our rooftop. Our electricity bill dropped dramatically and the team was excellent to work with.",
    rating: 5,
    initials: "RK",
    sortOrder: 1,
    isPublished: true,
  },
  {
    name: "Priya Sharma",
    role: "Business Owner, Mumbai",
    text: "The ROI has been phenomenal. We recovered our investment quickly and now enjoy major long-term savings.",
    rating: 5,
    initials: "PS",
    sortOrder: 2,
    isPublished: true,
  },
  {
    name: "Amit Patel",
    role: "Factory Manager, Nashik",
    text: "Professional team, strong product quality, and dependable after-sales support throughout the project.",
    rating: 5,
    initials: "AP",
    sortOrder: 3,
    isPublished: true,
  },
];

export const defaultCompanyProfile = {
  name: "SUNTECH GREEN ENERGY SOLAR",
  shortName: "SUNTECH",
  yearEstablished: 2020,
  phone: "+91 7387085530",
  alternatePhone: "+91 7020405530",
  email: "suntechgreenes@gmail.com",
  notificationsEmail: "suntechgreenes@gmail.com",
  whatsapp: "+91 7387085530",
  address:
    "Manjari Farm, Solapur - Pune Hwy, behind MAHALAXMI FORCE MOTORS, Shewalewadi, Pune, Maharashtra 412307",
  workingHours: "Mon-Sat: 9:00 AM - 6:00 PM",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Manjari%20Farm%2C%20Solapur%20-%20Pune%20Hwy%2C%20behind%20MAHALAXMI%20FORCE%20MOTORS%2C%20Shewalewadi%2C%20Pune%2C%20Maharashtra%20412307&output=embed",
  footerBlurb:
    "Established in 2020, SUNTECH GREEN ENERGY SOLAR delivers reliable residential, commercial, and industrial solar solutions across Pune and surrounding regions.",
  googleReviewUrl: fallbackGoogleReviewUrl,
};

export const defaultAboutPage = {
  storyTitle: "Solar Excellence Since 2020",
  storyParagraph1:
    "Founded in 2020, SUNTECH GREEN ENERGY SOLAR has been helping homes, businesses, and industrial clients transition to dependable solar energy solutions with a practical, service-first approach.",
  storyParagraph2:
    "Our mission is simple: make clean, affordable solar energy accessible to every home and business through honest guidance, quality execution, and long-term support.",
};

export const defaultSocialLinks = {
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
};
