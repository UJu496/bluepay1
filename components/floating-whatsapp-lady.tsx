import Image from "next/image"

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/DPZZJcKR6kC6rc8MANyTa9?s=cl&p=a&mlu=4&ilr=4&iam=2"

export function FloatingWhatsappLady() {
  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the BluePay WhatsApp group"
      className="group fixed bottom-4 right-4 z-50 flex items-end gap-2 sm:bottom-6 sm:right-6"
    >
      <span className="mb-2 hidden rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-transform group-hover:-translate-y-1 sm:block">
        Join our WhatsApp group
      </span>
      <span className="relative block h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-xl transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
        <Image
          src="/support-lady.png"
          alt="Friendly BluePay support lady"
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </span>
    </a>
  )
}
