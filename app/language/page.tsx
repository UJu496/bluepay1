"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
]

const regions = [
  { code: "NG", name: "Nigeria", currency: "NGN", timezone: "WAT" },
  { code: "US", name: "United States", currency: "USD", timezone: "EST" },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "GMT" },
  { code: "FR", name: "France", currency: "EUR", timezone: "CET" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", timezone: "AST" },
  { code: "CN", name: "China", currency: "CNY", timezone: "CST" },
  { code: "IN", name: "India", currency: "INR", timezone: "IST" },
]

const translations: Record<string, Record<string, string>> = {
  en: {
    title: "Language & Region",
    subtitle: "Customize your language and regional preferences",
    languageSection: "Language Preferences",
    languageDesc: "Select your preferred language for the app",
    regionSection: "Region Settings",
    regionDesc: "Choose your region for currency and timezone",
    dateFormat: "Date Format",
    timeFormat: "Time Format",
    currency: "Currency",
    timezone: "Timezone",
    applyChanges: "Apply Changes",
    changesSaved: "Changes saved successfully!",
  },
  yo: {
    title: "Èdè àti Agbègbè",
    subtitle: "Ṣe àtúnṣe èdè àti agbègbè rẹ",
    languageSection: "Àṣàyàn Èdè",
    languageDesc: "Yan èdè tí o fẹ́ fún app náà",
    regionSection: "Ètò Agbègbè",
    regionDesc: "Yan agbègbè rẹ fún owó àti àkókò",
    dateFormat: "Ọ̀nà Ọjọ́",
    timeFormat: "Ọ̀nà Àkókò",
    currency: "Owó",
    timezone: "Àkókò Agbègbè",
    applyChanges: "Lo Àyípadà",
    changesSaved: "Àyípadà ti wa ní ìfipamọ́!",
  },
  ig: {
    title: "Asụsụ na Mpaghara",
    subtitle: "Hazie asụsụ na mpaghara gị",
    languageSection: "Nhọrọ Asụsụ",
    languageDesc: "Họrọ asụsụ ị chọrọ maka ngwa a",
    regionSection: "Ntọala Mpaghara",
    regionDesc: "Họrọ mpaghara gị maka ego na oge",
    dateFormat: "Ụdị Ụbọchị",
    timeFormat: "Ụdị Oge",
    currency: "Ego",
    timezone: "Oge Mpaghara",
    applyChanges: "Tinye Mgbanwe",
    changesSaved: "Echekwara mgbanwe nke ọma!",
  },
  ha: {
    title: "Harshe da Yanki",
    subtitle: "Saita harshe da yankin ka",
    languageSection: "Zaɓin Harshe",
    languageDesc: "Zaɓi harshen da kake so don app",
    regionSection: "Saitunan Yanki",
    regionDesc: "Zaɓi yankin ka don kuɗi da lokaci",
    dateFormat: "Tsarin Kwanan Wata",
    timeFormat: "Tsarin Lokaci",
    currency: "Kuɗi",
    timezone: "Lokacin Yanki",
    applyChanges: "Yi Amfani da Canje-canje",
    changesSaved: "An adana canje-canje cikin nasara!",
  },
  fr: {
    title: "Langue et Région",
    subtitle: "Personnalisez vos préférences linguistiques et régionales",
    languageSection: "Préférences Linguistiques",
    languageDesc: "Sélectionnez votre langue préférée pour l'application",
    regionSection: "Paramètres Régionaux",
    regionDesc: "Choisissez votre région pour la devise et le fuseau horaire",
    dateFormat: "Format de Date",
    timeFormat: "Format d'Heure",
    currency: "Devise",
    timezone: "Fuseau Horaire",
    applyChanges: "Appliquer les Modifications",
    changesSaved: "Modifications enregistrées avec succès!",
  },
  es: {
    title: "Idioma y Región",
    subtitle: "Personaliza tus preferencias de idioma y región",
    languageSection: "Preferencias de Idioma",
    languageDesc: "Selecciona tu idioma preferido para la aplicación",
    regionSection: "Configuración Regional",
    regionDesc: "Elige tu región para moneda y zona horaria",
    dateFormat: "Formato de Fecha",
    timeFormat: "Formato de Hora",
    currency: "Moneda",
    timezone: "Zona Horaria",
    applyChanges: "Aplicar Cambios",
    changesSaved: "¡Cambios guardados exitosamente!",
  },
  pt: {
    title: "Idioma e Região",
    subtitle: "Personalize suas preferências de idioma e região",
    languageSection: "Preferências de Idioma",
    languageDesc: "Selecione seu idioma preferido para o aplicativo",
    regionSection: "Configurações Regionais",
    regionDesc: "Escolha sua região para moeda e fuso horário",
    dateFormat: "Formato de Data",
    timeFormat: "Formato de Hora",
    currency: "Moeda",
    timezone: "Fuso Horário",
    applyChanges: "Aplicar Alterações",
    changesSaved: "Alterações salvas com sucesso!",
  },
  ar: {
    title: "اللغة والمنطقة",
    subtitle: "تخصيص تفضيلات اللغة والمنطقة",
    languageSection: "تفضيلات اللغة",
    languageDesc: "اختر لغتك المفضلة للتطبيق",
    regionSection: "إعدادات المنطقة",
    regionDesc: "اختر منطقتك للعملة والمنطقة الزمنية",
    dateFormat: "تنسيق التاريخ",
    timeFormat: "تنسيق الوقت",
    currency: "العملة",
    timezone: "المنطقة الزمنية",
    applyChanges: "تطبيق التغييرات",
    changesSaved: "تم حفظ التغييرات بنجاح!",
  },
  zh: {
    title: "语言和地区",
    subtitle: "自定义您的语言和地区偏好",
    languageSection: "语言偏好",
    languageDesc: "选择您的应用程序首选语言",
    regionSection: "地区设置",
    regionDesc: "选择您的货币和时区地区",
    dateFormat: "日期格式",
    timeFormat: "时间格式",
    currency: "货币",
    timezone: "时区",
    applyChanges: "应用更改",
    changesSaved: "更改已成功保存！",
  },
  hi: {
    title: "भाषा और क्षेत्र",
    subtitle: "अपनी भाषा और क्षेत्रीय प्राथमिकताएं अनुकूलित करें",
    languageSection: "भाषा प्राथमिकताएं",
    languageDesc: "ऐप के लिए अपनी पसंदीदा भाषा चुनें",
    regionSection: "क्षेत्र सेटिंग्स",
    regionDesc: "मुद्रा और समय क्षेत्र के लिए अपना क्षेत्र चुनें",
    dateFormat: "तिथि प्रारूप",
    timeFormat: "समय प्रारूप",
    currency: "मुद्रा",
    timezone: "समय क्षेत्र",
    applyChanges: "परिवर्तन लागू करें",
    changesSaved: "परिवर्तन सफलतापूर्वक सहेजे गए!",
  },
}

export default function LanguagePage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedRegion, setSelectedRegion] = useState("NG")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [timeFormat, setTimeFormat] = useState("24h")
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage") || "en"
    const savedRegion = localStorage.getItem("appRegion") || "NG"
    const savedDateFormat = localStorage.getItem("dateFormat") || "DD/MM/YYYY"
    const savedTimeFormat = localStorage.getItem("timeFormat") || "24h"

    setSelectedLanguage(savedLanguage)
    setSelectedRegion(savedRegion)
    setDateFormat(savedDateFormat)
    setTimeFormat(savedTimeFormat)
  }, [])

  const t = translations[selectedLanguage] || translations.en

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code)
    localStorage.setItem("appLanguage", code)
  }

  const handleRegionChange = (code: string) => {
    setSelectedRegion(code)
    localStorage.setItem("appRegion", code)
  }

  const handleApplyChanges = () => {
    localStorage.setItem("appLanguage", selectedLanguage)
    localStorage.setItem("appRegion", selectedRegion)
    localStorage.setItem("dateFormat", dateFormat)
    localStorage.setItem("timeFormat", timeFormat)

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      window.location.reload()
    }, 1500)
  }

  const selectedRegionData = regions.find((r) => r.code === selectedRegion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <Globe className="h-8 w-8 text-blue-600" />
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="p-4 mb-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">{t.changesSaved}</span>
            </div>
          </Card>
        )}

        {/* Language Selection */}
        <Card className="p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">{t.languageSection}</h2>
          <p className="text-sm text-gray-600 mb-4">{t.languageDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-sm text-gray-600">{lang.nativeName}</div>
                </div>
                {selectedLanguage === lang.code && <Check className="h-5 w-5 text-blue-600" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Region Selection */}
        <Card className="p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">{t.regionSection}</h2>
          <p className="text-sm text-gray-600 mb-4">{t.regionDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {regions.map((region) => (
              <button
                key={region.code}
                onClick={() => handleRegionChange(region.code)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedRegion === region.code
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium">{region.name}</div>
                  <div className="text-sm text-gray-600">
                    {region.currency} • {region.timezone}
                  </div>
                </div>
                {selectedRegion === region.code && <Check className="h-5 w-5 text-blue-600" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Format Settings */}
        <Card className="p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.dateFormat}</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.timeFormat}</label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Current Settings Summary */}
        {selectedRegionData && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h3 className="font-semibold mb-3">Current Settings</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="opacity-80">{t.currency}</div>
                <div className="font-medium">{selectedRegionData.currency}</div>
              </div>
              <div>
                <div className="opacity-80">{t.timezone}</div>
                <div className="font-medium">{selectedRegionData.timezone}</div>
              </div>
              <div>
                <div className="opacity-80">{t.dateFormat}</div>
                <div className="font-medium">{dateFormat}</div>
              </div>
              <div>
                <div className="opacity-80">{t.timeFormat}</div>
                <div className="font-medium">{timeFormat === "12h" ? "12-hour" : "24-hour"}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Apply Button */}
        <Button
          onClick={handleApplyChanges}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 text-lg font-semibold"
        >
          {t.applyChanges}
        </Button>
      </div>
    </div>
  )
}
