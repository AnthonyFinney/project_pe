import {
  Pen,
  ImageIcon,
  ShoppingCart,
  Code,
  Briefcase,
  Heart,
  Zap,
  Globe,
} from "lucide-react";
import { PromptType } from "@/types";

export const categories = [
  {
    id: "writing",
    title: "Writing",
    description: "Creative writing, copywriting, and content creation prompts",
    icon: Pen,
    promptCount: 150,
  },
  {
    id: "image",
    title: "Image Generation",
    description: "AI art, photography, and visual content prompts",
    icon: ImageIcon,
    promptCount: 120,
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Product descriptions, marketing copy, and sales prompts",
    icon: ShoppingCart,
    promptCount: 85,
  },
  {
    id: "coding",
    title: "Coding",
    description: "Programming, debugging, and technical documentation prompts",
    icon: Code,
    promptCount: 95,
  },
  {
    id: "business",
    title: "Business",
    description: "Strategy, planning, and professional communication prompts",
    icon: Briefcase,
    promptCount: 110,
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    description: "Health, fitness, travel, and personal development prompts",
    icon: Heart,
    promptCount: 75,
  },
  {
    id: "productivity",
    title: "Productivity",
    description: "Task management, goal setting, and efficiency prompts",
    icon: Zap,
    promptCount: 65,
  },
  {
    id: "social-media",
    title: "Social Media",
    description: "Content creation, engagement, and marketing prompts",
    icon: Globe,
    promptCount: 90,
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with AI prompts",
    features: [
      "Access to 5 free prompts",
      "Basic prompt categories",
      "Copy and edit functionality",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 9,
    period: "month",
    description: "Unlock the full potential of AI prompting",
    features: [
      "Access to 500+ premium prompts",
      "All prompt categories",
      "Advanced prompt editor",
      "Priority support",
      "New prompts added weekly",
      "Export prompts to various formats",
      "Custom prompt collections",
      "API access",
    ],
    buttonText: "Subscribe Now",
    buttonVariant: "default" as const,
    popular: true,
  },
];

export const prompts: PromptType[] = [
  {
    id: "1",
    title: "Creative Blog Post Writer",
    content:
      "Write a compelling blog post about [TOPIC] that engages readers and provides valuable insights. Include an attention-grabbing headline, introduction, main points, and conclusion.",
    category: "writing",
    categoryName: "Writing",
    isLocked: false,
    thumbnail: null,
    description:
      "Generate engaging blog posts with structured content that captivates readers and delivers value.",
    useCases: ["Blog content", "Article writing", "Content marketing"],
    variables: [
      {
        name: "TOPIC",
        type: "text",
        label: "Blog Topic",
        placeholder: "Artificial Intelligence Trends",
        required: true,
        description: "The subject of your blog post.",
      },
    ],
    exampleValues: {
      TOPIC: "The Future of Artificial Intelligence",
    },
  },
  {
    id: "2",
    title: "Product Description Generator",
    content:
      "Create a persuasive product description for [PRODUCT] that highlights key features, benefits, and appeals to the target audience. Focus on emotional triggers and clear value propositions.",
    category: "ecommerce",
    categoryName: "E-commerce",
    isLocked: false,
    thumbnail: null,
    description:
      "Craft compelling product descriptions that highlight benefits and drive conversions.",
    useCases: ["Product listings", "E-commerce sites", "Marketing materials"],
    variables: [
      {
        name: "PRODUCT",
        type: "text",
        label: "Product Name",
        placeholder: "Eco-Friendly Water Bottle",
        required: true,
        description: "Name or type of the product.",
      },
    ],
    exampleValues: {
      PRODUCT: "Smart Stainless Steel Water Bottle",
    },
  },
  {
    id: "3",
    title: "Social Media Caption Creator",
    content:
      "Generate engaging social media captions for [PLATFORM] about [TOPIC]. Include relevant hashtags, call-to-action, and maintain brand voice consistency.",
    category: "social-media",
    categoryName: "Social Media",
    isLocked: false,
    thumbnail: null,
    description:
      "Create platform-specific captions that engage followers and drive interaction.",
    useCases: ["Instagram posts", "Twitter content", "LinkedIn updates"],
    variables: [
      {
        name: "PLATFORM",
        type: "select",
        label: "Social Platform",
        options: ["Instagram", "Twitter", "LinkedIn", "Facebook"],
        required: true,
        description: "Select the target social platform.",
      },
      {
        name: "TOPIC",
        type: "text",
        label: "Caption Topic",
        placeholder: "Morning Productivity Tips",
        required: true,
        description: "The main theme of your caption.",
      },
    ],
    exampleValues: {
      PLATFORM: "Instagram",
      TOPIC: "Monday Motivation",
    },
  },
  {
    id: "4",
    title: "Code Review Assistant",
    content:
      "Review the following code and provide constructive feedback on performance, readability, and best practices: [CODE]. Suggest improvements and explain reasoning.",
    category: "coding",
    categoryName: "Coding",
    isLocked: false,
    thumbnail: null,
    description:
      "Get expert code reviews with actionable feedback to improve your programming.",
    useCases: [
      "Code improvement",
      "Learning programming",
      "Technical documentation",
    ],
    variables: [
      {
        name: "CODE",
        type: "textarea",
        label: "Code to Review",
        placeholder: "// Paste your code here",
        required: true,
        description: "Insert the code you want reviewed.",
      },
    ],
    exampleValues: {
      CODE: "function add(a, b) { return a + b; }",
    },
  },
  {
    id: "5",
    title: "Email Marketing Template",
    content:
      "Create a professional email marketing campaign for [PRODUCT/SERVICE] that includes subject line, personalized greeting, value proposition, and clear CTA.",
    category: "business",
    categoryName: "Business",
    isLocked: false,
    thumbnail: null,
    description:
      "Design effective email campaigns that engage subscribers and drive conversions.",
    useCases: ["Newsletter creation", "Sales emails", "Customer outreach"],
    variables: [
      {
        name: "PRODUCT/SERVICE",
        type: "text",
        label: "Product or Service",
        placeholder: "Online Language Course",
        required: true,
        description: "The main product or service being promoted.",
      },
    ],
    exampleValues: {
      "PRODUCT/SERVICE": "Premium Yoga Mat",
    },
  },
  {
    id: "6",
    title: "Advanced SEO Content Strategy",
    content:
      "Develop a comprehensive SEO content strategy for [KEYWORD] including content pillars, topic clusters, and optimization techniques...",
    category: "writing",
    categoryName: "Writing",
    isLocked: true,
    thumbnail: null,
    description:
      "Build a complete SEO content strategy to improve rankings and organic traffic.",
    variables: [
      {
        name: "KEYWORD",
        type: "text",
        label: "Main Keyword",
        placeholder: "Organic Skin Care",
        required: true,
        description: "Focus keyword for your SEO strategy.",
      },
    ],
    exampleValues: {
      KEYWORD: "Sustainable Living",
    },
  },
  {
    id: "7",
    title: "Fantasy Landscape Generator",
    content:
      "Create a breathtaking fantasy landscape featuring floating islands with ethereal lighting and mystical atmosphere...",
    category: "image",
    categoryName: "Image Generation",
    isLocked: false,
    thumbnail: "/placeholder.jpg",
    description:
      "Generate stunning fantasy landscapes for creative projects and visual inspiration.",
    useCases: ["Game design", "Book covers", "Creative inspiration"],
    variables: [
      {
        name: "STYLE",
        type: "select",
        label: "Art Style",
        options: ["Digital Art", "Watercolor", "Oil Painting"],
        required: true,
        description: "Choose your preferred art style.",
      },
      {
        name: "MAIN_SUBJECT",
        type: "text",
        label: "Main Subject",
        placeholder: "floating islands",
        required: true,
      },
      {
        name: "LIGHTING",
        type: "text",
        label: "Lighting",
        placeholder: "Golden Hour",
        required: false,
      },
      {
        name: "ATMOSPHERE",
        type: "text",
        label: "Atmosphere",
        placeholder: "Mystical",
        required: false,
      },
      {
        name: "ELEMENTS",
        type: "textarea",
        label: "Extra Elements",
        placeholder: "cascading waterfalls, glowing crystals",
        required: false,
      },
      {
        name: "QUALITY",
        type: "select",
        label: "Quality",
        options: ["4K", "8K Ultra-detailed", "HD"],
        required: false,
      },
      {
        name: "COLOR_PALETTE",
        type: "text",
        label: "Color Palette",
        placeholder: "warm purples, blues, and gold",
        required: false,
      },
      {
        name: "MAGICAL_EFFECTS",
        type: "textarea",
        label: "Magical Effects",
        placeholder: "floating particles of light, aurora-like energy",
        required: false,
      },
      {
        name: "CAMERA_ANGLE",
        type: "text",
        label: "Camera Angle",
        placeholder: "Wide Shot",
        required: false,
      },
      {
        name: "COMPOSITION",
        type: "text",
        label: "Composition",
        placeholder: "Rule of Thirds",
        required: false,
      },
      {
        name: "REFERENCE_URL",
        type: "url",
        label: "Reference Image URL",
        placeholder: "https://example.com/your-image.jpg",
        required: false,
      },
    ],
    exampleValues: {
      STYLE: "Digital Art",
      MAIN_SUBJECT: "floating islands connected by magical bridges",
      LIGHTING: "Golden Hour",
      ATMOSPHERE: "Mystical",
      ELEMENTS: "cascading waterfalls, ancient ruins, glowing crystals",
      QUALITY: "8K Ultra-detailed",
      COLOR_PALETTE: "warm purples, blues, and gold",
      MAGICAL_EFFECTS:
        "floating particles of light, aurora-like energy streams",
      CAMERA_ANGLE: "Wide Shot",
      COMPOSITION: "Rule of Thirds",
      REFERENCE_URL: "",
    },
  },
  {
    id: "8",
    title: "Portrait Photography Prompt",
    content:
      "Generate a stunning portrait with professional lighting setup and cinematic mood...",
    category: "image",
    categoryName: "Image Generation",
    isLocked: true,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Create professional-quality portrait images with cinematic lighting and mood.",
    variables: [],
    exampleValues: {},
  },
  {
    id: "9",
    title: "Business Plan Generator",
    content:
      "Create a comprehensive business plan for [BUSINESS TYPE] including executive summary, market analysis, financial projections, and growth strategy...",
    category: "business",
    categoryName: "Business",
    isLocked: true,
    thumbnail: null,
    description:
      "Generate complete business plans ready for investors and strategic planning.",
    variables: [
      {
        name: "BUSINESS TYPE",
        type: "text",
        label: "Business Type",
        placeholder: "Online Retail Startup",
        required: true,
      },
    ],
    exampleValues: {
      "BUSINESS TYPE": "EdTech Platform",
    },
  },
  {
    id: "10",
    title: "Lifestyle Blog Content",
    content:
      "Write engaging lifestyle content about [TOPIC] that resonates with your audience and provides practical tips and inspiration...",
    category: "lifestyle",
    categoryName: "Lifestyle",
    isLocked: true,
    thumbnail: null,
    description:
      "Create engaging lifestyle content that connects with readers and provides value.",
    variables: [
      {
        name: "TOPIC",
        type: "text",
        label: "Topic",
        placeholder: "Healthy Morning Routines",
        required: true,
      },
    ],
    exampleValues: {
      TOPIC: "Minimalist Living",
    },
  },
  {
    id: "11",
    title: "Productivity System Setup",
    content:
      "Design a personalized productivity system for [PROFESSION/ROLE] that includes task management, goal setting, and time blocking strategies...",
    category: "productivity",
    categoryName: "Productivity",
    isLocked: false,
    thumbnail: null,
    description:
      "Build custom productivity systems tailored to specific roles and work styles.",
    useCases: [
      "Personal organization",
      "Team productivity",
      "Work-life balance",
    ],
    variables: [
      {
        name: "PROFESSION/ROLE",
        type: "text",
        label: "Profession or Role",
        placeholder: "Freelance Designer",
        required: true,
      },
    ],
    exampleValues: {
      "PROFESSION/ROLE": "Project Manager",
    },
  },
  {
    id: "12",
    title: "E-commerce Product Launch",
    content:
      "Plan and execute a successful product launch for [PRODUCT] including pre-launch marketing, launch day activities, and post-launch follow-up...",
    category: "ecommerce",
    categoryName: "E-commerce",
    isLocked: true,
    thumbnail: null,
    description:
      "Create comprehensive product launch strategies for maximum market impact.",
    variables: [
      {
        name: "PRODUCT",
        type: "text",
        label: "Product",
        placeholder: "Wireless Earbuds",
        required: true,
      },
    ],
    exampleValues: {
      PRODUCT: "Bamboo Fiber T-Shirt",
    },
  },
];
