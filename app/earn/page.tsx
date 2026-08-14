"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Play,
  Share2,
  Users,
  Star,
  CheckCircle,
  Clock,
  Gift,
  MessageSquare,
  Heart,
  BookOpen,
  Shield,
  Zap,
  Target,
  Award,
  TrendingUp,
  ImageIcon,
  Globe,
  Coins,
  Trophy,
  Gamepad2,
  Calendar,
  Phone,
  CreditCard,
  Wallet,
  Settings,
  Lock,
  UserPlus,
  FileText,
  Search,
  Map,
  ShoppingCart,
  Headphones,
  Video,
  Coffee,
  Briefcase,
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  reward: number
  icon: React.ReactNode
  category: string
  timeRequired: string
  completed: boolean
  action: string
  isRecurring?: boolean
}

const taskSets = [
  // Day 1 Tasks - Basic Introduction & Social Media
  [
    {
      id: "watch-video",
      title: "Watch BLUEPAY Tutorial",
      description: "Watch our complete tutorial video to learn all features",
      reward: 3000,
      icon: <Play className="text-red-500" size={20} />,
      category: "Video",
      timeRequired: "5 mins",
      completed: false,
      action: "Watch Now",
    },
    {
      id: "share-app",
      title: "Share BLUEPAY with Friends",
      description: "Share BLUEPAY app link on your social media platforms",
      reward: 3000,
      icon: <Share2 className="text-blue-500" size={20} />,
      category: "Social",
      timeRequired: "2 mins",
      completed: false,
      action: "Share Now",
    },
    {
      id: "take-selfie-bluepay",
      title: "Take Selfie with BLUEPAY",
      description: "Take a selfie showing BLUEPAY app and post on social media",
      reward: 3000,
      icon: <ImageIcon className="text-purple-500" size={20} />,
      category: "Social",
      timeRequired: "3 mins",
      completed: false,
      action: "Take Photo",
    },
    {
      id: "create-bluepay-story",
      title: "Create BLUEPAY Story",
      description: "Create an Instagram/WhatsApp story about your BLUEPAY experience",
      reward: 3000,
      icon: <ImageIcon className="text-pink-500" size={20} />,
      category: "Social",
      timeRequired: "4 mins",
      completed: false,
      action: "Create Story",
    },
    {
      id: "join-telegram",
      title: "Join BLUEPAY Telegram",
      description: "Join our official Telegram channel for updates and exclusive offers",
      reward: 3000,
      icon: <MessageSquare className="text-blue-400" size={20} />,
      category: "Community",
      timeRequired: "1 min",
      completed: false,
      action: "Join Now",
    },
    {
      id: "listen-bluepay-podcast",
      title: "Listen to BLUEPAY Podcast",
      description: "Listen to our founder's interview about digital payments in Nigeria",
      reward: 3000,
      icon: <Headphones className="text-green-500" size={20} />,
      category: "Audio",
      timeRequired: "15 mins",
      completed: false,
      action: "Listen Now",
    },
    {
      id: "create-bluepay-meme",
      title: "Create BLUEPAY Meme",
      description: "Design a funny meme about digital payments and share it online",
      reward: 3000,
      icon: <ImageIcon className="text-yellow-500" size={20} />,
      category: "Creative",
      timeRequired: "8 mins",
      completed: false,
      action: "Create Meme",
    },
    {
      id: "rate-app-store",
      title: "Rate on App Store",
      description: "Give BLUEPAY a 5-star rating on your device's app store",
      reward: 3000,
      icon: <Star className="text-orange-500" size={20} />,
      category: "Review",
      timeRequired: "3 mins",
      completed: false,
      action: "Rate Now",
    },
    {
      id: "follow-bluepay-twitter",
      title: "Follow BLUEPAY on Twitter",
      description: "Follow our official Twitter account for latest updates",
      reward: 3000,
      icon: <Users className="text-blue-400" size={20} />,
      category: "Social",
      timeRequired: "2 mins",
      completed: false,
      action: "Follow Now",
    },
  ],
  // Day 2 Tasks - Community & Engagement
  [
    {
      id: "invite-friends",
      title: "Invite 5 Friends",
      description: "Invite 5 friends to join BLUEPAY and earn bonus rewards",
      reward: 3000,
      icon: <Users className="text-green-500" size={20} />,
      category: "Referral",
      timeRequired: "10 mins",
      completed: false,
      action: "Invite Now",
    },
    {
      id: "write-google-review",
      title: "Write Google Review",
      description: "Leave a detailed review about BLUEPAY on Google Play Store",
      reward: 3000,
      icon: <Star className="text-yellow-500" size={20} />,
      category: "Review",
      timeRequired: "5 mins",
      completed: false,
      action: "Review Now",
    },
    {
      id: "create-tiktok-video",
      title: "Create TikTok Video",
      description: "Make a creative TikTok video showing BLUEPAY features",
      reward: 3000,
      icon: <Video className="text-red-400" size={20} />,
      category: "Social",
      timeRequired: "10 mins",
      completed: false,
      action: "Create Video",
    },
    {
      id: "participate-quiz",
      title: "Take BLUEPAY Knowledge Quiz",
      description: "Test your knowledge about BLUEPAY features and CBN partnership",
      reward: 3000,
      icon: <Trophy className="text-gold-500" size={20} />,
      category: "Education",
      timeRequired: "8 mins",
      completed: false,
      action: "Take Quiz",
    },
    {
      id: "join-whatsapp-group",
      title: "Join WhatsApp Community",
      description: "Join our active WhatsApp community for daily tips and support",
      reward: 3000,
      icon: <MessageSquare className="text-green-600" size={20} />,
      category: "Community",
      timeRequired: "2 mins",
      completed: false,
      action: "Join Group",
    },
    {
      id: "play-bluepay-game",
      title: "Play BLUEPAY Trivia Game",
      description: "Play our fun trivia game about Nigerian banking and win rewards",
      reward: 3000,
      icon: <Gamepad2 className="text-indigo-500" size={20} />,
      category: "Game",
      timeRequired: "12 mins",
      completed: false,
      action: "Play Game",
    },
    {
      id: "share-payment-screenshot",
      title: "Share Payment Success",
      description: "Share a screenshot of successful payment (hide sensitive info)",
      reward: 3000,
      icon: <ImageIcon className="text-green-400" size={20} />,
      category: "Social",
      timeRequired: "5 mins",
      completed: false,
      action: "Share Screenshot",
    },
    {
      id: "comment-on-posts",
      title: "Engage with BLUEPAY Posts",
      description: "Like and comment on 5 BLUEPAY social media posts",
      reward: 3000,
      icon: <Heart className="text-red-500" size={20} />,
      category: "Social",
      timeRequired: "10 mins",
      completed: false,
      action: "Engage Now",
    },
    {
      id: "create-payment-playlist",
      title: "Create Payment Music Playlist",
      description: "Create a Spotify playlist themed around money and success",
      reward: 3000,
      icon: <Headphones className="text-purple-500" size={20} />,
      category: "Creative",
      timeRequired: "15 mins",
      completed: false,
      action: "Create Playlist",
    },
  ],
  // Day 3 Tasks - Learning & Features
  [
    {
      id: "learn-bpc-codes",
      title: "Master BPC Code System",
      description: "Complete our comprehensive course on BPC codes and their benefits",
      reward: 3000,
      icon: <BookOpen className="text-orange-500" size={20} />,
      category: "Education",
      timeRequired: "15 mins",
      completed: false,
      action: "Learn Now",
    },
    {
      id: "explore-dashboard",
      title: "Explore Dashboard Features",
      description: "Navigate through all dashboard features and complete mini-tasks",
      reward: 3000,
      icon: <Search className="text-blue-600" size={20} />,
      category: "Feature",
      timeRequired: "10 mins",
      completed: false,
      action: "Explore",
    },
    {
      id: "setup-spending-tracker",
      title: "Setup Spending Tracker",
      description: "Configure your personal spending tracker and set monthly goals",
      reward: 3000,
      icon: <TrendingUp className="text-emerald-500" size={20} />,
      category: "Feature",
      timeRequired: "7 mins",
      completed: false,
      action: "Setup Tracker",
    },
    {
      id: "learn-cbn-partnership",
      title: "Learn CBN Partnership Benefits",
      description: "Discover exclusive benefits of BLUEPAY's partnership with CBN",
      reward: 3000,
      icon: <Shield className="text-green-700" size={20} />,
      category: "Education",
      timeRequired: "8 mins",
      completed: false,
      action: "Learn More",
    },
    {
      id: "complete-financial-literacy",
      title: "Complete Financial Literacy Course",
      description: "Take our free course on digital financial literacy in Nigeria",
      reward: 3000,
      icon: <Briefcase className="text-navy-600" size={20} />,
      category: "Education",
      timeRequired: "20 mins",
      completed: false,
      action: "Start Course",
    },
    {
      id: "create-budget-plan",
      title: "Create Personal Budget",
      description: "Use BLUEPAY tools to create your monthly budget and savings plan",
      reward: 3000,
      icon: <Calendar className="text-purple-600" size={20} />,
      category: "Feature",
      timeRequired: "12 mins",
      completed: false,
      action: "Create Budget",
    },
    {
      id: "complete-security-checklist",
      title: "Complete Security Checklist",
      description: "Go through our comprehensive account security checklist",
      reward: 3000,
      icon: <Shield className="text-red-600" size={20} />,
      category: "Security",
      timeRequired: "12 mins",
      completed: false,
      action: "Check Security",
    },
    {
      id: "learn-cryptocurrency-basics",
      title: "Learn Crypto Basics",
      description: "Complete our beginner's guide to cryptocurrency in Nigeria",
      reward: 3000,
      icon: <Coins className="text-bitcoin-orange" size={20} />,
      category: "Education",
      timeRequired: "18 mins",
      completed: false,
      action: "Learn Crypto",
    },
    {
      id: "customize-dashboard",
      title: "Customize Your Dashboard",
      description: "Personalize your dashboard layout and preferences",
      reward: 3000,
      icon: <Settings className="text-gray-600" size={20} />,
      category: "Feature",
      timeRequired: "8 mins",
      completed: false,
      action: "Customize Now",
    },
  ],
  // Day 4 Tasks - Transactions & Advanced Features
  [
    {
      id: "make-first-transaction",
      title: "Complete First Transaction",
      description: "Make your first airtime, data, or bill payment using BLUEPAY",
      reward: 3000,
      icon: <CreditCard className="text-blue-600" size={20} />,
      category: "Transaction",
      timeRequired: "5 mins",
      completed: false,
      action: "Transact Now",
    },
    {
      id: "setup-auto-payments",
      title: "Setup Auto-Payments",
      description: "Configure automatic payments for your recurring bills",
      reward: 3000,
      icon: <Settings className="text-gray-600" size={20} />,
      category: "Feature",
      timeRequired: "8 mins",
      completed: false,
      action: "Setup Auto-Pay",
    },
    {
      id: "refer-business-owner",
      title: "Refer a Business Owner",
      description: "Invite a business owner to use BLUEPAY for their transactions",
      reward: 3000,
      icon: <Briefcase className="text-orange-600" size={20} />,
      category: "Referral",
      timeRequired: "15 mins",
      completed: false,
      action: "Refer Business",
    },
    {
      id: "test-withdrawal-speed",
      title: "Test Lightning Withdrawal",
      description: "Experience our ultra-fast withdrawal system with instant processing",
      reward: 3000,
      icon: <Zap className="text-yellow-600" size={20} />,
      category: "Transaction",
      timeRequired: "3 mins",
      completed: false,
      action: "Test Speed",
    },
    {
      id: "create-payment-link",
      title: "Create Payment Link",
      description: "Generate a custom payment link for receiving money from others",
      reward: 3000,
      icon: <Globe className="text-teal-500" size={20} />,
      category: "Feature",
      timeRequired: "6 mins",
      completed: false,
      action: "Create Link",
    },
    {
      id: "join-vip-program",
      title: "Join VIP Rewards Program",
      description: "Enroll in our exclusive VIP program for premium benefits",
      reward: 3000,
      icon: <Award className="text-gold-600" size={20} />,
      category: "Premium",
      timeRequired: "4 mins",
      completed: false,
      action: "Join VIP",
    },
    {
      id: "test-bill-payment",
      title: "Pay Utility Bill",
      description: "Use BLUEPAY to pay electricity, water, or cable TV bill",
      reward: 3000,
      icon: <Zap className="text-yellow-500" size={20} />,
      category: "Transaction",
      timeRequired: "7 mins",
      completed: false,
      action: "Pay Bill",
    },
    {
      id: "create-qr-code",
      title: "Generate Payment QR Code",
      description: "Create your personal QR code for receiving payments",
      reward: 3000,
      icon: <ImageIcon className="text-black" size={20} />,
      category: "Feature",
      timeRequired: "4 mins",
      completed: false,
      action: "Generate QR",
    },
    {
      id: "schedule-future-payment",
      title: "Schedule Future Payment",
      description: "Set up a scheduled payment for next week or month",
      reward: 3000,
      icon: <Calendar className="text-blue-600" size={20} />,
      category: "Feature",
      timeRequired: "6 mins",
      completed: false,
      action: "Schedule Payment",
    },
  ],
  // Day 5 Tasks - Security & Premium Features
  [
    {
      id: "enable-biometric-security",
      title: "Enable Biometric Security",
      description: "Secure your account with fingerprint or face recognition",
      reward: 3000,
      icon: <Lock className="text-red-600" size={20} />,
      category: "Security",
      timeRequired: "5 mins",
      completed: false,
      action: "Enable Security",
    },
    {
      id: "setup-emergency-contacts",
      title: "Setup Emergency Contacts",
      description: "Add trusted contacts for account recovery and emergency access",
      reward: 3000,
      icon: <Phone className="text-blue-500" size={20} />,
      category: "Security",
      timeRequired: "7 mins",
      completed: false,
      action: "Add Contacts",
    },
    {
      id: "create-savings-goal",
      title: "Create Savings Challenge",
      description: "Set up a savings goal and track your progress with BLUEPAY",
      reward: 3000,
      icon: <Target className="text-green-600" size={20} />,
      category: "Feature",
      timeRequired: "10 mins",
      completed: false,
      action: "Start Saving",
    },
    {
      id: "upgrade-account-tier",
      title: "Upgrade Account Tier",
      description: "Upgrade to premium tier for higher limits and exclusive features",
      reward: 3000,
      icon: <TrendingUp className="text-purple-600" size={20} />,
      category: "Premium",
      timeRequired: "5 mins",
      completed: false,
      action: "Upgrade Now",
    },
    {
      id: "setup-investment-plan",
      title: "Setup Investment Plan",
      description: "Start your investment journey with BLUEPAY's partner platforms",
      reward: 3000,
      icon: <Coins className="text-gold-500" size={20} />,
      category: "Investment",
      timeRequired: "15 mins",
      completed: false,
      action: "Start Investing",
    },
    {
      id: "become-bluepay-ambassador",
      title: "Become BLUEPAY Ambassador",
      description: "Apply to become an official BLUEPAY ambassador in your community",
      reward: 3000,
      icon: <UserPlus className="text-royal-blue" size={20} />,
      category: "Community",
      timeRequired: "12 mins",
      completed: false,
      action: "Apply Now",
    },
    {
      id: "backup-account-data",
      title: "Backup Account Data",
      description: "Create a secure backup of your account information",
      reward: 3000,
      icon: <Shield className="text-green-600" size={20} />,
      category: "Security",
      timeRequired: "10 mins",
      completed: false,
      action: "Backup Data",
    },
    {
      id: "explore-investment-options",
      title: "Explore Investment Options",
      description: "Learn about investment opportunities through BLUEPAY partners",
      reward: 3000,
      icon: <TrendingUp className="text-green-700" size={20} />,
      category: "Investment",
      timeRequired: "20 mins",
      completed: false,
      action: "Explore Investments",
    },
    {
      id: "set-spending-limits",
      title: "Set Daily Spending Limits",
      description: "Configure daily and monthly spending limits for better control",
      reward: 3000,
      icon: <Target className="text-red-500" size={20} />,
      category: "Feature",
      timeRequired: "5 mins",
      completed: false,
      action: "Set Limits",
    },
  ],
  // Day 6 Tasks - Content Creation & Community Building
  [
    {
      id: "write-blog-post",
      title: "Write BLUEPAY Blog Post",
      description: "Write a detailed blog post about your BLUEPAY experience",
      reward: 3000,
      icon: <FileText className="text-blue-700" size={20} />,
      category: "Content",
      timeRequired: "25 mins",
      completed: false,
      action: "Write Post",
    },
    {
      id: "host-bluepay-meetup",
      title: "Organize Local Meetup",
      description: "Organize a BLUEPAY meetup in your area to educate others",
      reward: 3000,
      icon: <Map className="text-red-500" size={20} />,
      category: "Community",
      timeRequired: "60 mins",
      completed: false,
      action: "Plan Meetup",
    },
    {
      id: "create-tutorial-video",
      title: "Create Tutorial Video",
      description: "Make a step-by-step tutorial video for new BLUEPAY users",
      reward: 3000,
      icon: <Video className="text-purple-500" size={20} />,
      category: "Content",
      timeRequired: "30 mins",
      completed: false,
      action: "Create Tutorial",
    },
    {
      id: "design-bluepay-poster",
      title: "Design Promotional Poster",
      description: "Create an attractive poster promoting BLUEPAY services",
      reward: 3000,
      icon: <ImageIcon className="text-pink-600" size={20} />,
      category: "Creative",
      timeRequired: "20 mins",
      completed: false,
      action: "Design Poster",
    },
    {
      id: "interview-bluepay-user",
      title: "Interview Another User",
      description: "Interview another BLUEPAY user and share their success story",
      reward: 3000,
      icon: <Headphones className="text-orange-500" size={20} />,
      category: "Content",
      timeRequired: "35 mins",
      completed: false,
      action: "Conduct Interview",
    },
    {
      id: "translate-bluepay-content",
      title: "Translate BLUEPAY Content",
      description: "Help translate BLUEPAY content to your local language",
      reward: 3000,
      icon: <Globe className="text-green-500" size={20} />,
      category: "Community",
      timeRequired: "40 mins",
      completed: false,
      action: "Start Translation",
    },
    {
      id: "create-infographic",
      title: "Design Payment Infographic",
      description: "Create an educational infographic about digital payments",
      reward: 3000,
      icon: <ImageIcon className="text-teal-500" size={20} />,
      category: "Creative",
      timeRequired: "25 mins",
      completed: false,
      action: "Design Infographic",
    },
    {
      id: "write-payment-tips",
      title: "Write Payment Safety Tips",
      description: "Share 10 tips for safe digital payments on social media",
      reward: 3000,
      icon: <FileText className="text-blue-600" size={20} />,
      category: "Content",
      timeRequired: "15 mins",
      completed: false,
      action: "Write Tips",
    },
    {
      id: "create-success-video",
      title: "Create Success Story Video",
      description: "Record a video sharing your BLUEPAY success story",
      reward: 3000,
      icon: <Video className="text-red-600" size={20} />,
      category: "Content",
      timeRequired: "20 mins",
      completed: false,
      action: "Record Video",
    },
  ],
  // Day 7 Tasks - Business & Entrepreneurship
  [
    {
      id: "start-bluepay-business",
      title: "Start BLUEPAY Business",
      description: "Use BLUEPAY to start your own digital payment business",
      reward: 3000,
      icon: <ShoppingCart className="text-blue-600" size={20} />,
      category: "Business",
      timeRequired: "45 mins",
      completed: false,
      action: "Start Business",
    },
    {
      id: "create-merchant-account",
      title: "Create Merchant Account",
      description: "Set up a merchant account to accept payments from customers",
      reward: 3000,
      icon: <Wallet className="text-green-600" size={20} />,
      category: "Business",
      timeRequired: "15 mins",
      completed: false,
      action: "Create Account",
    },
    {
      id: "attend-webinar",
      title: "Attend BLUEPAY Webinar",
      description: "Join our weekly webinar on digital financial literacy",
      reward: 3000,
      icon: <Calendar className="text-purple-600" size={20} />,
      category: "Education",
      timeRequired: "60 mins",
      completed: false,
      action: "Join Webinar",
    },
    {
      id: "mentor-new-user",
      title: "Mentor New User",
      description: "Help onboard and mentor a new BLUEPAY user",
      reward: 3000,
      icon: <Users className="text-teal-600" size={20} />,
      category: "Community",
      timeRequired: "30 mins",
      completed: false,
      action: "Start Mentoring",
    },
    {
      id: "create-business-plan",
      title: "Create Business Plan",
      description: "Develop a business plan using BLUEPAY's business tools",
      reward: 3000,
      icon: <FileText className="text-navy-600" size={20} />,
      category: "Business",
      timeRequired: "50 mins",
      completed: false,
      action: "Create Plan",
    },
    {
      id: "network-with-entrepreneurs",
      title: "Network with Entrepreneurs",
      description: "Connect with other entrepreneurs in the BLUEPAY community",
      reward: 3000,
      icon: <Coffee className="text-brown-500" size={20} />,
      category: "Networking",
      timeRequired: "25 mins",
      completed: false,
      action: "Start Networking",
    },
    {
      id: "calculate-business-roi",
      title: "Calculate Business ROI",
      description: "Use BLUEPAY tools to calculate your business return on investment",
      reward: 3000,
      icon: <TrendingUp className="text-blue-600" size={20} />,
      category: "Business",
      timeRequired: "12 mins",
      completed: false,
      action: "Calculate ROI",
    },
    {
      id: "setup-recurring-income",
      title: "Setup Recurring Income",
      description: "Configure recurring payment collection for your services",
      reward: 3000,
      icon: <Coins className="text-gold-600" size={20} />,
      category: "Business",
      timeRequired: "18 mins",
      completed: false,
      action: "Setup Income",
    },
    {
      id: "join-entrepreneur-network",
      title: "Join Entrepreneur Network",
      description: "Connect with BLUEPAY's network of successful entrepreneurs",
      reward: 3000,
      icon: <Users className="text-purple-600" size={20} />,
      category: "Networking",
      timeRequired: "15 mins",
      completed: false,
      action: "Join Network",
    },
  ],
  // Day 8 Tasks - Advanced Features & Analytics
  [
    {
      id: "analyze-spending-patterns",
      title: "Analyze Spending Patterns",
      description: "Review your spending analytics and identify saving opportunities",
      reward: 3000,
      icon: <TrendingUp className="text-blue-600" size={20} />,
      category: "Analytics",
      timeRequired: "15 mins",
      completed: false,
      action: "Analyze Spending",
    },
    {
      id: "setup-smart-notifications",
      title: "Setup Smart Notifications",
      description: "Configure intelligent notifications for better money management",
      reward: 3000,
      icon: <Settings className="text-purple-600" size={20} />,
      category: "Feature",
      timeRequired: "8 mins",
      completed: false,
      action: "Setup Notifications",
    },
    {
      id: "create-expense-categories",
      title: "Create Custom Expense Categories",
      description: "Set up personalized categories for tracking your expenses",
      reward: 3000,
      icon: <FileText className="text-orange-600" size={20} />,
      category: "Feature",
      timeRequired: "10 mins",
      completed: false,
      action: "Create Categories",
    },
    {
      id: "export-financial-report",
      title: "Export Financial Report",
      description: "Generate and download your monthly financial report",
      reward: 3000,
      icon: <FileText className="text-green-600" size={20} />,
      category: "Analytics",
      timeRequired: "5 mins",
      completed: false,
      action: "Export Report",
    },
    {
      id: "setup-family-account",
      title: "Setup Family Account",
      description: "Create a family account to manage household expenses together",
      reward: 3000,
      icon: <Users className="text-pink-600" size={20} />,
      category: "Feature",
      timeRequired: "20 mins",
      completed: false,
      action: "Setup Family",
    },
    {
      id: "learn-tax-management",
      title: "Learn Tax Management",
      description: "Complete course on managing taxes with digital payments",
      reward: 3000,
      icon: <BookOpen className="text-navy-600" size={20} />,
      category: "Education",
      timeRequired: "25 mins",
      completed: false,
      action: "Learn Taxes",
    },
  ],
  // Day 9 Tasks - Social Impact & Community Service
  [
    {
      id: "donate-to-charity",
      title: "Make Charitable Donation",
      description: "Use BLUEPAY to donate to a registered Nigerian charity",
      reward: 3000,
      icon: <Heart className="text-red-600" size={20} />,
      category: "Social Impact",
      timeRequired: "10 mins",
      completed: false,
      action: "Donate Now",
    },
    {
      id: "teach-digital-literacy",
      title: "Teach Digital Literacy",
      description: "Teach someone in your community about digital payments",
      reward: 3000,
      icon: <BookOpen className="text-blue-600" size={20} />,
      category: "Community",
      timeRequired: "30 mins",
      completed: false,
      action: "Start Teaching",
    },
    {
      id: "support-local-business",
      title: "Support Local Business",
      description: "Use BLUEPAY to pay a local business and share their story",
      reward: 3000,
      icon: <ShoppingCart className="text-green-600" size={20} />,
      category: "Community",
      timeRequired: "15 mins",
      completed: false,
      action: "Support Business",
    },
    {
      id: "organize-financial-workshop",
      title: "Organize Financial Workshop",
      description: "Host a workshop about financial literacy in your community",
      reward: 3000,
      icon: <Users className="text-purple-600" size={20} />,
      category: "Community",
      timeRequired: "60 mins",
      completed: false,
      action: "Organize Workshop",
    },
    {
      id: "create-educational-content",
      title: "Create Educational Content",
      description: "Develop content to educate others about financial inclusion",
      reward: 3000,
      icon: <FileText className="text-teal-600" size={20} />,
      category: "Education",
      timeRequired: "40 mins",
      completed: false,
      action: "Create Content",
    },
    {
      id: "volunteer-for-bluepay",
      title: "Volunteer for BLUEPAY",
      description: "Join our volunteer program to help expand financial access",
      reward: 3000,
      icon: <Heart className="text-orange-600" size={20} />,
      category: "Community",
      timeRequired: "45 mins",
      completed: false,
      action: "Volunteer Now",
    },
  ],
  // Day 10 Tasks - Innovation & Future Tech
  [
    {
      id: "test-ai-features",
      title: "Test AI-Powered Features",
      description: "Try out BLUEPAY's new AI-powered financial recommendations",
      reward: 3000,
      icon: <Zap className="text-purple-600" size={20} />,
      category: "Innovation",
      timeRequired: "12 mins",
      completed: false,
      action: "Test AI",
    },
    {
      id: "explore-blockchain-integration",
      title: "Explore Blockchain Features",
      description: "Learn about BLUEPAY's blockchain integration and benefits",
      reward: 3000,
      icon: <Coins className="text-gold-600" size={20} />,
      category: "Innovation",
      timeRequired: "18 mins",
      completed: false,
      action: "Explore Blockchain",
    },
    {
      id: "beta-test-new-features",
      title: "Beta Test New Features",
      description: "Join our beta program and test upcoming BLUEPAY features",
      reward: 3000,
      icon: <Settings className="text-blue-600" size={20} />,
      category: "Innovation",
      timeRequired: "25 mins",
      completed: false,
      action: "Join Beta",
    },
    {
      id: "provide-feature-feedback",
      title: "Provide Feature Feedback",
      description: "Share detailed feedback on BLUEPAY features and improvements",
      reward: 3000,
      icon: <MessageSquare className="text-green-600" size={20} />,
      category: "Feedback",
      timeRequired: "15 mins",
      completed: false,
      action: "Give Feedback",
    },
    {
      id: "suggest-new-features",
      title: "Suggest New Features",
      description: "Submit innovative ideas for new BLUEPAY features",
      reward: 3000,
      icon: <Zap className="text-yellow-600" size={20} />,
      category: "Innovation",
      timeRequired: "20 mins",
      completed: false,
      action: "Suggest Ideas",
    },
    {
      id: "participate-in-research",
      title: "Participate in User Research",
      description: "Join our user research study to improve BLUEPAY experience",
      reward: 3000,
      icon: <Search className="text-teal-600" size={20} />,
      category: "Research",
      timeRequired: "30 mins",
      completed: false,
      action: "Join Research",
    },
  ],
]

export default function EarnPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [totalEarned, setTotalEarned] = useState(0)
  const [isCompleting, setIsCompleting] = useState<string | null>(null)
  const [recurringTaskTimestamps, setRecurringTaskTimestamps] = useState<Record<string, number>>({})

  const checkRecurringTaskAvailability = (taskId: string): boolean => {
    const lastCompletedTime = recurringTaskTimestamps[taskId]
    if (!lastCompletedTime) return true // First time, always available

    const now = Date.now()
    const hoursPassed = (now - lastCompletedTime) / (1000 * 60 * 60)
    return hoursPassed >= 24
  }

  const checkAndResetDailyTasks = () => {
    const today = new Date().toDateString()
    const lastResetDate = localStorage.getItem("lastTaskResetDate")

    if (lastResetDate !== today) {
      // Calculate which task set to use based on day
      const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
      const taskSetIndex = daysSinceEpoch % taskSets.length
      const todaysTasks = taskSets[taskSetIndex]

      // Reset all tasks for new day
      localStorage.removeItem("completedTasks")
      localStorage.setItem("lastTaskResetDate", today)
      localStorage.setItem("currentTaskSet", taskSetIndex.toString())
      setCompletedTasks([])
      setTotalEarned(0)

      // Set today's task set
      setTasks(todaysTasks.map((task) => ({ ...task, completed: false })))

      return true // Tasks were reset
    }
    return false // No reset needed
  }

  useEffect(() => {
    const savedTimestamps = localStorage.getItem("recurringTaskTimestamps")
    if (savedTimestamps) {
      setRecurringTaskTimestamps(JSON.parse(savedTimestamps))
    }

    // Check for daily reset first
    const wasReset = checkAndResetDailyTasks()

    if (!wasReset) {
      // Load current task set and completed tasks
      const savedTaskSet = localStorage.getItem("currentTaskSet")
      const taskSetIndex = savedTaskSet ? Number.parseInt(savedTaskSet) : 0
      const currentTasks = taskSets[taskSetIndex] || taskSets[0]

      const saved = localStorage.getItem("completedTasks")
      if (saved) {
        const completed = JSON.parse(saved)
        setCompletedTasks(completed)
        setTotalEarned(completed.length * 3000)

        // Update tasks completion status
        setTasks(
          currentTasks.map((task) => ({
            ...task,
            completed: completed.includes(task.id),
          })),
        )
      } else {
        setTasks(currentTasks)
      }
    }

    // Set up interval to check for daily reset every hour
    const resetInterval = setInterval(
      () => {
        checkAndResetDailyTasks()
      },
      60 * 60 * 1000,
    ) // Check every hour

    return () => clearInterval(resetInterval)
  }, [])

  const handleCompleteTask = (taskId: string) => {
    const isRecurringTask = taskId === "invite-friends" || taskId === "join-whatsapp-group"
    if (isRecurringTask && completedTasks.includes(taskId)) {
      if (!checkRecurringTaskAvailability(taskId)) {
        alert("This task will be available again in 24 hours!")
        return
      }
    } else if (completedTasks.includes(taskId)) {
      return
    }

    if (taskId === "watch-video") {
      window.open("https://www.facebook.com/share/v/16oy7hLUV3/", "_blank")
    } else if (taskId === "join-telegram") {
      window.open("https://t.me/bluepay2", "_blank")
    } else if (taskId === "follow-social") {
      window.open("https://www.facebook.com/profile.php?id=61579213454861", "_blank")
    } else if (taskId === "share-app" || taskId === "invite-friends" || taskId === "refer-family") {
      // Generate referral link
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const referralCode = `BLUEPAY_${userData.fullName?.replace(/\s+/g, "").toUpperCase() || "USER"}_${Date.now().toString().slice(-6)}`
      const referralLink = `${window.location.origin}?ref=${referralCode}`

      // Copy to clipboard silently
      navigator.clipboard.writeText(referralLink)
    } else if (taskId === "buy-airtime-data" || taskId === "make-first-transaction") {
      router.push("/airtime")
    } else if (taskId === "write-review" || taskId === "write-google-review") {
      router.push("/reviews")
    } else if (taskId === "explore-features" || taskId === "explore-dashboard") {
      router.push("/features")
    } else if (taskId === "join-community-chat" || taskId === "join-whatsapp-group") {
      window.open("https://chat.whatsapp.com/CBNqoGML6jZ8qmxIeu9D16?s=cl&p=a&ilr=0", "_blank")
    } else if (taskId === "verify-account") {
      router.push("/verify-account")
    } else if (taskId === "setup-pin-security" || taskId === "enable-biometric-security") {
      router.push("/security-pin")
    } else if (taskId === "learn-cbn-partnership") {
      window.open("https://www.cbn.gov.ng/", "_blank")
    } else if (taskId === "share-success-story") {
      router.push("/testimonies")
    } else if (taskId === "test-customer-support") {
      router.push("/support")
    } else if (taskId === "upgrade-account-tier" || taskId === "upgrade-premium") {
      router.push("/profile")
    }

    setIsCompleting(taskId)

    // Simulate task completion time
    setTimeout(() => {
      const newCompletedTasks = [...completedTasks, taskId]
      setCompletedTasks(newCompletedTasks)
      setTotalEarned((prev) => prev + 3000)

      if (isRecurringTask) {
        const newTimestamps = { ...recurringTaskTimestamps, [taskId]: Date.now() }
        setRecurringTaskTimestamps(newTimestamps)
        localStorage.setItem("recurringTaskTimestamps", JSON.stringify(newTimestamps))
      }

      // Update localStorage
      localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks))

      // Update dashboard balance
      const currentBalance = localStorage.getItem("userBalance")
      const newBalance = (currentBalance ? Number.parseInt(currentBalance) : 200000) + 3000
      localStorage.setItem("userBalance", newBalance.toString())

      // Update tasks
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

      setIsCompleting(null)
    }, 3000)
  }

  const categories = [
    "All",
    "Video",
    "Social",
    "Referral",
    "Review",
    "Community",
    "App",
    "Profile",
    "Education",
    "Feature",
    "Transaction",
    "Security",
    "Support",
    "Settings",
    "Premium",
    "Audio",
    "Game",
    "Investment",
    "Content",
    "Creative",
    "Business",
    "Networking",
    "Analytics",
    "Social Impact",
    "Innovation",
    "Feedback",
    "Research",
  ]

  const [selectedCategory, setSelectedCategory] = useState("All")

  let filteredTasks = selectedCategory === "All" ? tasks : tasks.filter((task) => task.category === selectedCategory)

  const recurringTasks = [
    {
      id: "invite-friends",
      title: "Invite 5 Friends",
      description: "Invite 5 friends to join BLUEPAY and earn bonus rewards",
      reward: 3000,
      icon: <Users className="text-green-500" size={20} />,
      category: "Referral",
      timeRequired: "10 mins",
      completed: completedTasks.includes("invite-friends") && !checkRecurringTaskAvailability("invite-friends"),
      action: "Invite Now",
      isRecurring: true,
    },
    {
      id: "join-whatsapp-group",
      title: "Join WhatsApp Community",
      description: "Join our active WhatsApp community for daily tips and support",
      reward: 3000,
      icon: <MessageSquare className="text-green-600" size={20} />,
      category: "Community",
      timeRequired: "2 mins",
      completed:
        completedTasks.includes("join-whatsapp-group") && !checkRecurringTaskAvailability("join-whatsapp-group"),
      action: "Join Group",
      isRecurring: true,
    },
  ]

  recurringTasks.forEach((recurringTask) => {
    if (selectedCategory === "All" || selectedCategory === recurringTask.category) {
      const existsInFiltered = filteredTasks.some((t) => t.id === recurringTask.id)
      if (!existsInFiltered) {
        filteredTasks = [...filteredTasks, recurringTask]
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {isCompleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Completing task...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we verify your task</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Earn Money</h1>
        <div className="w-6"></div>
      </div>

      {/* Earnings Summary */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Earned Today</p>
              <p className="text-xl font-bold">₦{totalEarned.toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-1">{completedTasks.length} tasks completed</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="text-white" size={20} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-green-100 text-xs">
              New tasks available daily! Tasks rotate every 24 hours for fresh earning opportunities!
            </p>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => router.push("/testimonies")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <Heart size={20} />
            Share Your Testimonies & Read Success Stories
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 pb-20">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {task.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{task.timeRequired}</span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{task.category}</span>
                        {task.isRecurring && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                            Repeats Daily
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₦{task.reward.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      {task.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.completed || isCompleting === task.id}
                      className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                        task.completed
                          ? "bg-green-100 text-green-600 cursor-not-allowed"
                          : isCompleting === task.id
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {task.completed ? "Completed" : isCompleting === task.id ? "Processing..." : task.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
