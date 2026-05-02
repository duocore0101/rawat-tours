'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ExportRevenueButtonProps {
  bookings: any[]
  totalRevenue: number
}

export default function ExportRevenueButton({ bookings, totalRevenue }: ExportRevenueButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      const doc = new jsPDF() as any
      const timestamp = new Date().toLocaleDateString()
      
      // -- Header --
      doc.setFillColor(28, 100, 242) // Brand Blue
      doc.rect(0, 0, 210, 40, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('RAWAT TOURS & TRAVELS', 15, 25)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('REVENUE STATEMENT', 15, 33)
      doc.text(`Generated on: ${timestamp}`, 160, 33)
      
      // -- Summary Section --
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.text('Financial Summary', 15, 55)
      
      doc.setDrawColor(230, 230, 230)
      doc.line(15, 58, 195, 58)
      
      doc.setFontSize(10)
      doc.text('Total Revenue Generated:', 15, 68)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(`INR ${totalRevenue.toLocaleString()}`, 15, 75)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('Total Confirmed Bookings:', 80, 68)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(`${bookings.length}`, 80, 75)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('Average Booking Value:', 145, 68)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(`INR ${(totalRevenue / (bookings.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 145, 75)
      
      // -- Table Section --
      doc.setFontSize(14)
      doc.text('Transaction Details', 15, 95)
      
      const tableRows = bookings.map((b: any) => [
        new Date(b.created_at).toLocaleDateString(),
        b.tour?.title || 'Unknown Tour',
        b.customer_name || 'N/A',
        b.people.toString(),
        `INR ${((b.tour?.price || 0) * b.people).toLocaleString()}`
      ])
      
      autoTable(doc, {
        startY: 100,
        head: [['Date', 'Tour Title', 'Customer', 'Pax', 'Amount']],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [28, 100, 242],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4
        },
        columnStyles: {
          4: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
      })
      
      // -- Footer --
      const pageCount = doc.internal.getNumberOfPages()
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Rawat Tours & Travels - Confidential Revenue Report`, 15, 285)
        doc.text(`Page ${i} of ${pageCount}`, 185, 285)
      }
      
      doc.save(`Rawat_Revenue_Statement_${timestamp.replace(/\//g, '-')}.pdf`)
    } catch (error) {
      console.error('PDF Generation Error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={generatePDF}
      disabled={isGenerating}
      className="w-full bg-white text-primary py-3 rounded-2xl font-black text-sm hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          <span>Export Statement</span>
        </>
      )}
    </button>
  )
}
