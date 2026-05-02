'use client'

import { Phone } from 'lucide-react'

interface WhatsAppButtonProps {
  customerName: string
  tourTitle: string
  date: string
  people: number
  price: number
  customerPhone: string
  status: string
}

export default function WhatsAppButton({ 
  customerName, 
  tourTitle, 
  date, 
  people, 
  price, 
  customerPhone,
  status
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const isPending = status === 'pending'
    
    const message = encodeURIComponent(
      `${isPending ? '⏳ *Booking Received (Pending)* ⏳' : '✅ *Booking Confirmed!* ✅'}\n\n` +
      `Hello *${customerName}*,\n` +
      `Thank you for booking with *Rawat Tours & Travels*!\n\n` +
      `*Tour:* ${tourTitle}\n` +
      `📅 *Date:* ${new Date(date).toLocaleDateString()}\n` +
      `👥 *Travelers:* ${people}\n` +
      `💰 *Total Amount:* ₹${(price * people).toLocaleString()}\n\n` +
      `${isPending 
        ? 'Your booking is currently *pending*. To secure your spot, please follow the payment instructions below.' 
        : 'Your booking is *officially confirmed*! We are excited to have you with us.'}\n\n` +
      `${isPending ? '💳 *Payment Instructions:* \nTo confirm your booking, please pay the total amount using our QR code and send a screenshot of the payment here.\n\n' : ''}` +
      `Thank you for choosing *Rawat Tours & Travels*!`
    )
    window.open(`https://wa.me/${customerPhone?.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
      title="Confirm on WhatsApp"
    >
      <Phone className="h-4 w-4" />
    </button>
  )
}
