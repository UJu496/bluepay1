"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Plus, Heart, DollarSign } from "lucide-react"

interface Testimony {
  id: number
  name: string
  story: string
  date: string
  likes: number
  amount: number
}

export default function TestimoniesPage() {
  const router = useRouter()
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newStory, setNewStory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("bluepayTestimonies")
    if (saved) {
      setTestimonies(JSON.parse(saved))
    } else {
      const defaultTestimonies = [
        {
          id: 1,
          name: "Maxwell Prince Chukwu",
          story:
            "BLUEPAY INT'L has revolutionized my financial life! The BPC code system is incredibly secure and the CBN partnership gives me complete confidence. I've earned over ₦50,000 through their earning tasks and the withdrawal process is seamless. This platform is truly the future of digital payments in Nigeria!",
          date: "2025-01-20",
          likes: 156,
          amount: 200000,
        },
        {
          id: 2,
          name: "Adebayo Johnson",
          story:
            "BLUEPAY has transformed how I handle my daily transactions. The BPC code system is so secure and fast!",
          date: "2025-01-15",
          likes: 124,
          amount: 195000,
        },
        {
          id: 3,
          name: "Fatima Abdullahi",
          story: "I love the airtime and data purchase feature. It's so convenient and the prices are amazing!",
          date: "2025-01-14",
          likes: 118,
          amount: 190000,
        },
        {
          id: 4,
          name: "Chioma Okafor",
          story:
            "The earning tasks on BLUEPAY are incredible! I made ₦15,000 in just one week by completing simple tasks.",
          date: "2025-01-19",
          likes: 189,
          amount: 185000,
        },
        {
          id: 5,
          name: "Ibrahim Musa",
          story: "BLUEPAY's customer support is outstanding. They resolved my issue within minutes via WhatsApp!",
          date: "2025-01-18",
          likes: 145,
          amount: 180000,
        },
        {
          id: 6,
          name: "Blessing Eze",
          story:
            "The CBN partnership makes me trust BLUEPAY completely. My money is safe and transactions are instant.",
          date: "2025-01-17",
          likes: 167,
          amount: 175000,
        },
        {
          id: 7,
          name: "Tunde Afolabi",
          story:
            "I've been using BLUEPAY for 3 months now. The withdrawal process is the fastest I've ever experienced!",
          date: "2025-01-16",
          likes: 134,
          amount: 170000,
        },
        {
          id: 8,
          name: "Ngozi Okonkwo",
          story: "BLUEPAY's referral system helped me earn ₦25,000 by inviting my friends. Amazing platform!",
          date: "2025-01-15",
          likes: 178,
          amount: 165000,
        },
        {
          id: 9,
          name: "Yusuf Garba",
          story: "The security features on BLUEPAY are top-notch. I feel completely safe making transactions here.",
          date: "2025-01-14",
          likes: 152,
          amount: 160000,
        },
        {
          id: 10,
          name: "Folake Adebisi",
          story: "BLUEPAY made buying airtime and data so easy. No more queuing at shops!",
          date: "2025-01-13",
          likes: 129,
          amount: 155000,
        },
        {
          id: 11,
          name: "Chukwuma Ibe",
          story: "The daily tasks keep me engaged and earning. I've made over ₦40,000 so far!",
          date: "2025-01-12",
          likes: 195,
          amount: 150000,
        },
        {
          id: 12,
          name: "Hauwa Abdullahi",
          story: "BLUEPAY's interface is so user-friendly. Even my grandmother can use it easily!",
          date: "2025-01-11",
          likes: 141,
          amount: 145000,
        },
        {
          id: 13,
          name: "Segun Oladele",
          story: "The BPC code system is genius! It adds an extra layer of security to all my transactions.",
          date: "2025-01-10",
          likes: 163,
          amount: 140000,
        },
        {
          id: 14,
          name: "Amina Sani",
          story: "I love how BLUEPAY rewards users for simple activities. It's like getting paid to use the app!",
          date: "2025-01-09",
          likes: 172,
          amount: 135000,
        },
        {
          id: 15,
          name: "Ikechukwu Obi",
          story: "The premium membership upgrade was worth every penny. The benefits are incredible!",
          date: "2025-01-08",
          likes: 158,
          amount: 130000,
        },
        {
          id: 16,
          name: "Funmi Ogundipe",
          story: "BLUEPAY's partnership with CBN gives me confidence that my money is in safe hands.",
          date: "2025-01-07",
          likes: 184,
          amount: 125000,
        },
        {
          id: 17,
          name: "Musa Yakubu",
          story: "The watch feature with tutorial videos helped me understand all the features quickly.",
          date: "2025-01-06",
          likes: 137,
          amount: 120000,
        },
        {
          id: 18,
          name: "Chinelo Nnamdi",
          story: "I've never seen a platform that pays users so generously for simple tasks. BLUEPAY is amazing!",
          date: "2025-01-05",
          likes: 191,
          amount: 115000,
        },
        {
          id: 19,
          name: "Rasheed Lawal",
          story: "The telegram community is so supportive. I've learned so much from other users!",
          date: "2025-01-04",
          likes: 146,
          amount: 110000,
        },
        {
          id: 20,
          name: "Nneka Okwu",
          story: "BLUEPAY's verification process is thorough but fair. It shows they care about security.",
          date: "2025-01-03",
          likes: 155,
          amount: 105000,
        },
        {
          id: 21,
          name: "Suleiman Ahmad",
          story: "The balance updates are instant. I can see my earnings reflect immediately after completing tasks.",
          date: "2025-01-02",
          likes: 139,
          amount: 102500,
        },
        {
          id: 22,
          name: "Adunni Bakare",
          story: "BLUEPAY has helped me become financially independent. I earn enough to support my family!",
          date: "2025-01-01",
          likes: 127,
          amount: 100000,
        },
        {
          id: 23,
          name: "Chidi Anyanwu",
          story: "The PIN security system is so convenient. I don't have to remember complex passwords anymore.",
          date: "2024-12-31",
          likes: 142,
          amount: 95000,
        },
        {
          id: 24,
          name: "Zainab Usman",
          story: "I love how BLUEPAY constantly adds new earning opportunities. There's always something to do!",
          date: "2024-12-30",
          likes: 168,
          amount: 90000,
        },
        {
          id: 25,
          name: "Biodun Olatunji",
          story: "The customer support team is available 24/7. They've never failed to help me when needed.",
          date: "2024-12-29",
          likes: 173,
          amount: 85000,
        },
        {
          id: 26,
          name: "Chiamaka Udeh",
          story: "BLUEPAY's earning system is transparent and fair. I know exactly how much I'll earn for each task.",
          date: "2024-12-28",
          likes: 175,
          amount: 80000,
        },
        {
          id: 27,
          name: "Aliyu Hassan",
          story: "The withdrawal limits are generous and the processing is instant. No delays whatsoever!",
          date: "2024-12-27",
          likes: 186,
          amount: 75000,
        },
        {
          id: 28,
          name: "Folashade Adeyinka",
          story: "I've recommended BLUEPAY to all my friends. The referral bonuses are fantastic!",
          date: "2024-12-26",
          likes: 194,
          amount: 70000,
        },
        {
          id: 29,
          name: "Chukwuemeka Okafor",
          story: "The app design is beautiful and intuitive. Navigation is smooth and everything loads quickly.",
          date: "2024-12-25",
          likes: 147,
          amount: 65000,
        },
        {
          id: 30,
          name: "Hadiza Yusuf",
          story: "I love how BLUEPAY constantly adds new earning opportunities. There's always something to do!",
          date: "2024-12-24",
          likes: 161,
          amount: 60000,
        },
        {
          id: 31,
          name: "Seyi Adebayo",
          story: "The daily notifications keep me updated on new earning opportunities. I never miss out!",
          date: "2024-12-23",
          likes: 159,
          amount: 55000,
        },
        {
          id: 32,
          name: "Chinonso Eze",
          story: "BLUEPAY's security measures are military-grade. I've never worried about my account safety.",
          date: "2024-12-22",
          likes: 175,
          amount: 50000,
        },
        {
          id: 33,
          name: "Mariam Abdullahi",
          story: "The earning tasks are fun and educational. I'm learning while earning money!",
          date: "2024-12-21",
          likes: 156,
          amount: 45000,
        },
        {
          id: 34,
          name: "Tochukwu Nwachukwu",
          story: "I've been able to pay my school fees through BLUEPAY earnings. This platform changed my life!",
          date: "2024-12-20",
          likes: 132,
          amount: 40000,
        },
        {
          id: 35,
          name: "Salamatu Garba",
          story: "The community features help me connect with other users. We share tips and strategies!",
          date: "2024-12-19",
          likes: 149,
          amount: 35000,
        },
        {
          id: 36,
          name: "Oluwaseun Ajayi",
          story: "BLUEPAY's partnership with major banks makes transfers seamless. No compatibility issues!",
          date: "2024-12-18",
          likes: 167,
          amount: 30000,
        },
        {
          id: 37,
          name: "Chineye Okoro",
          story: "The premium features are worth upgrading for. The exclusive tasks pay much better!",
          date: "2024-12-17",
          likes: 182,
          amount: 25000,
        },
        {
          id: 38,
          name: "Usman Bello",
          story: "I love how BLUEPAY celebrates user achievements. The recognition motivates me to do more!",
          date: "2024-12-16",
          likes: 144,
          amount: 20000,
        },
        {
          id: 39,
          name: "Temitope Adebisi",
          story: "The airtime and data prices are the cheapest I've found anywhere. Great value for money!",
          date: "2024-12-15",
          likes: 159,
          amount: 15000,
        },
        {
          id: 40,
          name: "Chidinma Okonkwo",
          story: "BLUEPAY's transparency about fees and charges is refreshing. No hidden costs!",
          date: "2024-12-14",
          likes: 171,
          amount: 12500,
        },
        {
          id: 41,
          name: "Abdulrahman Sani",
          story: "The platform stability is excellent. I've never experienced downtime or glitches.",
          date: "2024-12-13",
          likes: 153,
          amount: 11000,
        },
        {
          id: 42,
          name: "Omolara Ogundimu",
          story: "BLUEPAY has helped me start my own business with the money I've earned from tasks!",
          date: "2024-12-12",
          likes: 118,
          amount: 10500,
        },
        {
          id: 43,
          name: "Chukwudi Nnamdi",
          story: "The educational content about CBN and financial literacy is very valuable.",
          date: "2024-12-11",
          likes: 165,
          amount: 10200,
        },
        {
          id: 44,
          name: "Khadijah Ahmad",
          story: "I appreciate how BLUEPAY constantly updates and improves the platform based on user feedback.",
          date: "2024-12-10",
          likes: 148,
          amount: 10000,
        },
        {
          id: 45,
          name: "Babatunde Afolabi",
          story: "The social features make earning fun. I compete with friends to see who earns more!",
          date: "2024-12-09",
          likes: 176,
          amount: 9500,
        },
        {
          id: 46,
          name: "Chinwendu Okwu",
          story: "The withdrawal process is so smooth. Money hits my account within minutes!",
          date: "2024-12-08",
          likes: 189,
          amount: 9000,
        },
        {
          id: 47,
          name: "Maryam Aliyu",
          story: "The task variety keeps things interesting. From watching videos to social media engagement!",
          date: "2024-12-07",
          likes: 154,
          amount: 8500,
        },
        {
          id: 48,
          name: "Olumuyiwa Adeyemi",
          story: "I've learned so much about digital finance through BLUEPAY. It's like a free education!",
          date: "2024-12-06",
          likes: 162,
          amount: 8000,
        },
        {
          id: 49,
          name: "Chinenye Anyanwu",
          story: "The platform's reliability and consistency have earned my complete trust and loyalty!",
          date: "2024-12-05",
          likes: 177,
          amount: 7500,
        },
        {
          id: 50,
          name: "Zahra Usman",
          story: "BLUEPAY has made me financially literate. I now understand investments and savings better!",
          date: "2024-12-04",
          likes: 191,
          amount: 7000,
        },
        {
          id: 51,
          name: "Adebola Olatunji",
          story: "The platform's growth has been amazing to witness. New features are added regularly!",
          date: "2024-12-03",
          likes: 143,
          amount: 6500,
        },
        {
          id: 52,
          name: "Chukwunonso Udeh",
          story: "I love the gamification elements. Earning points and achieving milestones is addictive!",
          date: "2024-12-02",
          likes: 168,
          amount: 6000,
        },
        {
          id: 53,
          name: "Hafsat Yusuf",
          story: "The security PIN feature gives me peace of mind. My account feels completely secure.",
          date: "2024-12-01",
          likes: 155,
          amount: 5500,
        },
        {
          id: 54,
          name: "Oluwafemi Adeyinka",
          story: "BLUEPAY's integration with multiple banks makes it universally accessible. Great thinking!",
          date: "2024-11-30",
          likes: 172,
          amount: 5000,
        },
        {
          id: 55,
          name: "Chioma Akafor",
          story: "The earning potential on BLUEPAY is unlimited. The more active you are, the more you earn!",
          date: "2024-11-29",
          likes: 185,
          amount: 4500,
        },
        {
          id: 56,
          name: "Emeka Nwankwo",
          story: "I've made lifelong friends through BLUEPAY's community features. It's more than just earning!",
          date: "2024-11-28",
          likes: 164,
          amount: 4000,
        },
        {
          id: 57,
          name: "Aisha Bello",
          story: "The customer testimonials inspired me to join. Now I'm sharing my own success story!",
          date: "2024-11-27",
          likes: 158,
          amount: 3500,
        },
        {
          id: 58,
          name: "Olumide Adeyemi",
          story: "BLUEPAY's commitment to Nigerian financial inclusion is commendable. Proud to be part of it!",
          date: "2024-11-26",
          likes: 179,
          amount: 3000,
        },
        {
          id: 59,
          name: "Kemi Ogundimu",
          story: "The platform has helped me develop better financial habits. I'm more disciplined with money now!",
          date: "2024-11-25",
          likes: 166,
          amount: 2500,
        },
        {
          id: 60,
          name: "Chinedu Okoro",
          story: "BLUEPAY's innovation in digital payments is revolutionary. They're ahead of their time!",
          date: "2024-11-24",
          likes: 193,
          amount: 2000,
        },
        {
          id: 61,
          name: "Blessing Eze",
          story: "The earning opportunities are diverse and cater to different skill levels. Something for everyone!",
          date: "2024-11-23",
          likes: 151,
          amount: 1500,
        },
        {
          id: 62,
          name: "Tunde Afolabi",
          story: "I appreciate how BLUEPAY educates users about financial security and best practices.",
          date: "2024-11-22",
          likes: 147,
          amount: 1250,
        },
        {
          id: 63,
          name: "Ngozi Okonkwo",
          story: "The platform's reliability has never disappointed me. Consistent performance every day!",
          date: "2024-11-21",
          likes: 169,
          amount: 1100,
        },
        {
          id: 64,
          name: "Yusuf Garba",
          story: "BLUEPAY has democratized earning opportunities. Anyone can succeed here with dedication!",
          date: "2024-11-20",
          likes: 181,
          amount: 1050,
        },
        {
          id: 65,
          name: "Folake Adebisi",
          story: "The user interface is intuitive and beautiful. Using BLUEPAY is always a pleasant experience!",
          date: "2024-11-19",
          likes: 156,
          amount: 1020,
        },
        {
          id: 66,
          name: "Chukwuma Ibe",
          story: "I've been able to support my family financially thanks to BLUEPAY's generous earning system!",
          date: "2024-11-18",
          likes: 124,
          amount: 1000,
        },
        {
          id: 67,
          name: "Hauwa Abdullahi",
          story: "The platform's commitment to user privacy and data protection is exemplary!",
          date: "2024-11-17",
          likes: 163,
          amount: 950,
        },
        {
          id: 68,
          name: "Segun Oladele",
          story: "BLUEPAY's partnership with CBN adds credibility and trust. I feel confident using it!",
          date: "2024-11-16",
          likes: 174,
          amount: 900,
        },
        {
          id: 69,
          name: "Amina Sani",
          story: "The daily task reset keeps me coming back. There's always something new to earn from!",
          date: "2024-11-15",
          likes: 152,
          amount: 850,
        },
        {
          id: 70,
          name: "Ikechukwu Obi",
          story: "I love how BLUEPAY celebrates Nigerian culture while embracing global financial standards!",
          date: "2024-11-14",
          likes: 167,
          amount: 800,
        },
        {
          id: 71,
          name: "Funmi Ogundipe",
          story: "The earning system is fair and transparent. No favoritism, just hard work paying off!",
          date: "2024-11-13",
          likes: 158,
          amount: 750,
        },
        {
          id: 72,
          name: "Musa Yakubu",
          story: "BLUEPAY has taught me the value of consistency. Small daily efforts lead to big results!",
          date: "2024-11-12",
          likes: 171,
          amount: 700,
        },
        {
          id: 73,
          name: "Chinelo Nnamdi",
          story: "The platform's growth trajectory is impressive. I'm excited to be part of this journey!",
          date: "2024-11-11",
          likes: 184,
          amount: 650,
        },
        {
          id: 74,
          name: "Rasheed Lawal",
          story: "BLUEPAY's customer-first approach is evident in every interaction. They truly care!",
          date: "2024-11-10",
          likes: 149,
          amount: 600,
        },
        {
          id: 75,
          name: "Nneka Okwu",
          story: "The security measures are comprehensive without being intrusive. Perfect balance!",
          date: "2024-11-09",
          likes: 165,
          amount: 550,
        },
        {
          id: 76,
          name: "Suleiman Ahmad",
          story: "I've learned more about digital finance in 3 months with BLUEPAY than in years elsewhere!",
          date: "2024-11-08",
          likes: 178,
          amount: 500,
        },
        {
          id: 77,
          name: "Adunni Bakare",
          story: "The community support is incredible. Users help each other succeed and grow together!",
          date: "2024-11-07",
          likes: 192,
          amount: 450,
        },
        {
          id: 78,
          name: "Chidi Anyanwu",
          story: "BLUEPAY has made financial inclusion a reality for millions of Nigerians. Proud to be part of it!",
          date: "2024-11-06",
          likes: 106,
          amount: 400,
        },
        {
          id: 79,
          name: "Zainab Usman",
          story: "The platform's innovation continues to amaze me. They're always one step ahead!",
          date: "2024-11-05",
          likes: 161,
          amount: 350,
        },
        {
          id: 80,
          name: "Biodun Olatunji",
          story: "I appreciate how BLUEPAY makes complex financial processes simple and accessible!",
          date: "2024-11-04",
          likes: 173,
          amount: 300,
        },
        {
          id: 81,
          name: "Chiamaka Udeh",
          story: "The earning potential has exceeded my expectations. BLUEPAY delivers on its promises!",
          date: "2024-11-03",
          likes: 187,
          amount: 250,
        },
        {
          id: 82,
          name: "Aliyu Hassan",
          story: "The platform's stability during high traffic periods shows excellent infrastructure!",
          date: "2024-11-02",
          likes: 154,
          amount: 200,
        },
        {
          id: 83,
          name: "Folashade Adeyinka",
          story: "BLUEPAY has empowered me to take control of my financial future. Forever grateful!",
          date: "2024-11-01",
          likes: 195,
          amount: 150,
        },
        {
          id: 84,
          name: "Chukwuemeka Okafor",
          story: "The user experience is seamless across all devices. Consistent quality everywhere!",
          date: "2024-10-31",
          likes: 148,
          amount: 125,
        },
        {
          id: 85,
          name: "Hadiza Yusuf",
          story: "I love how BLUEPAY rewards loyalty and consistent participation. Long-term thinking!",
          date: "2024-10-30",
          likes: 166,
          amount: 110,
        },
        {
          id: 86,
          name: "Seyi Adebayo",
          story: "The educational resources have improved my financial literacy significantly!",
          date: "2024-10-29",
          likes: 159,
          amount: 105,
        },
        {
          id: 87,
          name: "Chinonso Eze",
          story: "BLUEPAY's commitment to excellence is evident in every feature and update!",
          date: "2024-10-28",
          likes: 172,
          amount: 100,
        },
        {
          id: 88,
          name: "Mariam Abdullahi",
          story: "The platform has helped me achieve financial goals I thought were impossible!",
          date: "2024-10-27",
          likes: 189,
          amount: 95,
        },
        {
          id: 89,
          name: "Tochukwu Nwachukwu",
          story: "I'm amazed by how BLUEPAY continues to innovate and improve user experience!",
          date: "2024-10-26",
          likes: 176,
          amount: 90,
        },
        {
          id: 90,
          name: "Salamatu Garba",
          story: "The earning system has given me financial independence I never thought possible!",
          date: "2024-10-25",
          likes: 113,
          amount: 85,
        },
        {
          id: 91,
          name: "Oluwaseun Ajayi",
          story: "BLUEPAY's transparency in operations builds trust and confidence among users!",
          date: "2024-10-24",
          likes: 164,
          amount: 80,
        },
        {
          id: 92,
          name: "Chineye Okoro",
          story: "The platform's growth has created opportunities for thousands of Nigerians!",
          date: "2024-10-23",
          likes: 181,
          amount: 75,
        },
        {
          id: 93,
          name: "Usman Bello",
          story: "I appreciate how BLUEPAY maintains high standards while remaining user-friendly!",
          date: "2024-10-22",
          likes: 157,
          amount: 70,
        },
        {
          id: 94,
          name: "Temitope Adebisi",
          story: "The customer support team's dedication to user satisfaction is unmatched!",
          date: "2024-10-21",
          likes: 168,
          amount: 65,
        },
        {
          id: 95,
          name: "Chidinma Okonkwo",
          story: "BLUEPAY has transformed my understanding of digital finance and its possibilities!",
          date: "2024-10-20",
          likes: 175,
          amount: 60,
        },
        {
          id: 96,
          name: "Abdulrahman Sani",
          story: "The platform's security features give me complete peace of mind with every transaction!",
          date: "2024-10-19",
          likes: 162,
          amount: 55,
        },
        {
          id: 97,
          name: "Omolara Ogundimu",
          story: "I'm grateful for how BLUEPAY has improved my family's financial situation!",
          date: "2024-10-18",
          likes: 198,
          amount: 50,
        },
        {
          id: 98,
          name: "Chukwudi Nnamdi",
          story: "The platform's commitment to Nigerian economic growth is inspiring and commendable!",
          date: "2024-10-17",
          likes: 186,
          amount: 45,
        },
        {
          id: 99,
          name: "Khadijah Ahmad",
          story: "BLUEPAY has exceeded every expectation I had. Truly a world-class platform!",
          date: "2024-10-16",
          likes: 179,
          amount: 40,
        },
        {
          id: 100,
          name: "Babatunde Afolabi",
          story:
            "The earning opportunities are endless and the community is supportive. Perfect combination for financial growth!",
          date: "2024-10-15",
          likes: 91,
          amount: 15000,
        },
        {
          id: 101,
          name: "Chinwendu Okwu",
          story: "I'm proud to be part of BLUEPAY's mission to revolutionize digital payments in Nigeria!",
          date: "2024-10-14",
          likes: 104,
          amount: 12500,
        },
        {
          id: 102,
          name: "Maryam Aliyu",
          story: "The platform's innovation and user-centric approach make it stand out from competitors!",
          date: "2024-10-13",
          likes: 73,
          amount: 11000,
        },
        {
          id: 103,
          name: "Olumuyiwa Adeyemi",
          story: "BLUEPAY has given me the tools and knowledge to build a better financial future!",
          date: "2024-10-12",
          likes: 88,
          amount: 10500,
        },
        {
          id: 104,
          name: "Chinenye Anyanwu",
          story: "The platform's reliability and consistency have earned my complete trust and loyalty!",
          date: "2024-10-11",
          likes: 67,
          amount: 10200,
        },
        {
          id: 105,
          name: "Zahra Usman",
          story: "I'm amazed by how BLUEPAY continues to set new standards in the fintech industry!",
          date: "2024-10-10",
          likes: 82,
          amount: 10000,
        },
      ]

      const sortedTestimonies = defaultTestimonies.sort((a, b) => b.amount - a.amount)
      setTestimonies(sortedTestimonies)
      localStorage.setItem("bluepayTestimonies", JSON.stringify(sortedTestimonies))
    }
  }, [])

  const handleSubmitStory = () => {
    if (newStory.trim() === "") {
      return
    }

    setIsSubmitting(true)
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    const newTestimony = {
      id: Date.now(),
      name: userData.fullName || "Anonymous User",
      story: newStory,
      date: new Date().toLocaleDateString(),
      likes: 0,
      amount: Math.floor(Math.random() * 50000) + 10000,
    }

    const updatedTestimonies = [newTestimony, ...testimonies]
    setTestimonies(updatedTestimonies)
    localStorage.setItem("bluepayTestimonies", JSON.stringify(updatedTestimonies))

    setTimeout(() => {
      setIsSubmitting(false)
      setNewStory("")
      setShowForm(false)
    }, 2000)
  }

  const formatAmount = (amount: number) => {
    if (!amount || typeof amount !== "number") {
      return "₦0.00"
    }
    return `₦${amount.toLocaleString()}.00`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#4169E1" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Success Stories</h1>
        <button onClick={() => setShowForm(!showForm)}>
          <Plus className="text-white" size={20} />
        </button>
      </div>

      <div className="p-4">
        {/* Add Story Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Success Story</h3>
            <textarea
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="Tell us how BLUEPAY has helped you..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmitStory}
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isSubmitting ? "Sharing..." : "Share Story"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Testimonies List */}
        <div className="space-y-4">
          {testimonies.map((testimony) => (
            <div key={testimony.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="text-blue-500" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{testimony.name}</h4>
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="font-bold text-green-600">{formatAmount(testimony.amount)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{testimony.story}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{testimony.date}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="text-red-500" size={16} />
                      <span>{testimony.likes}</span>
                    </div>
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
