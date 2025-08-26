import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Button } from './ui/button';

interface PDFGeneratorProps {
  targetRef: React.RefObject<HTMLElement>;
  filename?: string;
}

export function PDFGenerator({ targetRef, filename = 'AGOS-Postpartum-Care-Packages' }: PDFGeneratorProps) {
  
  // Generate optimized PDF via print dialog with proper page breaks
  const generateOptimizedPDF = async () => {
    try {
      const element = targetRef.current;
      if (!element) {
        throw new Error('Content not found');
      }

      // Create optimized print window
      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups and try again.');
      }

      // Enhanced HTML for PDF generation with perfect page breaks
      const optimizedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    /* CSS Custom Properties */
    :root {
      --ethiopian-green: #009E60;
      --ethiopian-yellow: #FFCD00;
      --ethiopian-red: #DA020E;
      --pastel-blue: #AED9E0;
      --warm-gold: #D4A017;
      --light-pink: #F8E1E9;
      --deep-green: #4A7043;
      --neutral-white: #FFFFFF;
      --text-dark: #2D3748;
      --text-gray: #4A5568;
    }

    /* PDF Optimization Styles */
    @page {
      size: A3 portrait;
      margin: 0.2in;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Inter', 'Noto Sans Ethiopic', system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 1.4;
      background: white;
    }
    
    /* Page Break Controls */
    .print-avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    /* Ensure each poster gets its own page */
    [style*="pageBreakAfter: 'always'"] {
      page-break-after: always !important;
      break-after: page !important;
    }
    
    /* Ethiopian Colors - Direct styles for PDF compatibility */
    .ethiopian-gradient {
      background: linear-gradient(135deg, var(--ethiopian-green) 0%, var(--ethiopian-yellow) 50%, var(--ethiopian-red) 100%) !important;
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    .poster-gradient {
      background: linear-gradient(135deg, var(--pastel-blue) 0%, var(--light-pink) 100%) !important;
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    .ethiopian-pattern {
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='0' r='4'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3Ccircle cx='30' cy='0' r='2'/%3E%3Ccircle cx='60' cy='30' r='2'/%3E%3Ccircle cx='0' cy='30' r='2'/%3E%3Ccircle cx='30' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !important;
      background-size: 60px 60px !important;
    }
    
    .ethiopian-text-shadow {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
    }
    
    .poster-shadow {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Hide interactive elements */
    .no-print,
    .print\\:hidden,
    button:not(.print-include),
    .fixed {
      display: none !important;
      visibility: hidden !important;
    }
    
    /* Reset animations */
    * {
      animation: none !important;
      transition: none !important;
    }
    
    /* Ensure colors are preserved */
    [style*="background:"] {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    [style*="backgroundColor"] {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    [style*="borderColor"] {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    /* Print button for the new window */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(to right, var(--ethiopian-green), var(--ethiopian-red));
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      font-size: 16px;
    }
    
    .print-button:hover {
      opacity: 0.9;
    }
    
    @media print {
      .print-button { display: none !important; }
      
      /* Force all colors to print */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Ensure proper page breaks */
      .print-avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <!-- Print Button -->
  <button class="print-button" onclick="window.print()">📄 Generate PDF (One Page Per Package)</button>
  
  <!-- Content -->
  ${element.outerHTML}
  
  <script>
    // Auto-trigger print after content loads
    window.addEventListener('load', function() {
      // Ensure fonts are loaded
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() {
          console.log('All fonts loaded for PDF - One page per package');
          setTimeout(function() {
            console.log('Auto-triggering print dialog...');
            window.print();
          }, 2000);
        });
      } else {
        setTimeout(function() {
          console.log('Auto-triggering print dialog...');
          window.print();
        }, 2000);
      }
    });
    
    // Handle after print
    window.addEventListener('afterprint', function() {
      setTimeout(function() {
        if (confirm('PDF generation complete! Each package is on its own page. Close this window?')) {
          window.close();
        }
      }, 1000);
    });
  </script>
</body>
</html>`;

      // Write content and focus
      printWindow.document.write(optimizedHTML);
      printWindow.document.close();
      printWindow.focus();

      console.log('PDF window created successfully with one poster per page');

    } catch (error) {
      console.error('PDF Generation Error:', error);
      
      let errorMessage = 'Could not generate PDF. ';
      if (error instanceof Error) {
        if (error.message.includes('Pop-up blocked')) {
          errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site and try again.';
        } else if (error.message.includes('Content not found')) {
          errorMessage = 'Poster content not found. Please refresh the page and try again.';
        } else {
          errorMessage += 'Please try the Print option instead.';
        }
      }
      
      alert(errorMessage);
    }
  };

  // Generate downloadable HTML file with enhanced styles
  const generateDownloadableHTML = () => {
    try {
      const element = targetRef.current;
      if (!element) {
        throw new Error('Content not found');
      }

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename} - One Page Per Package</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    :root {
      --ethiopian-green: #009E60;
      --ethiopian-yellow: #FFCD00;
      --ethiopian-red: #DA020E;
      --pastel-blue: #AED9E0;
      --warm-gold: #D4A017;
      --light-pink: #F8E1E9;
      --deep-green: #4A7043;
      --neutral-white: #FFFFFF;
      --text-dark: #2D3748;
      --text-gray: #4A5568;
    }

    @page {
      size: A3 portrait;
      margin: 0.2in;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    body {
      font-family: 'Inter', 'Noto Sans Ethiopic', system-ui, sans-serif;
      margin: 0;
      padding: 0;
      background: white;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    .ethiopian-gradient {
      background: linear-gradient(135deg, var(--ethiopian-green) 0%, var(--ethiopian-yellow) 50%, var(--ethiopian-red) 100%);
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    .poster-gradient {
      background: linear-gradient(135deg, var(--pastel-blue) 0%, var(--light-pink) 100%);
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
    
    .ethiopian-pattern {
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='0' r='4'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3Ccircle cx='30' cy='0' r='2'/%3E%3Ccircle cx='60' cy='30' r='2'/%3E%3Ccircle cx='0' cy='30' r='2'/%3E%3Ccircle cx='30' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      background-size: 60px 60px;
    }
    
    .poster-shadow {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .ethiopian-text-shadow {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .print-controls {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: flex;
      gap: 10px;
    }
    
    .print-btn {
      background: linear-gradient(to right, var(--ethiopian-green), var(--ethiopian-red));
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
    }
    
    .print-btn:hover {
      opacity: 0.9;
    }
    
    .instructions {
      background: #f0f9ff;
      border: 2px solid #0ea5e9;
      border-radius: 8px;
      padding: 10px;
      margin: 10px 0;
      font-size: 14px;
      color: #0369a1;
    }
    
    .print-avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    [style*="pageBreakAfter: 'always'"] {
      page-break-after: always !important;
      break-after: page !important;
    }
    
    @media print {
      .print-controls,
      .instructions {
        display: none !important;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-controls">
    <button class="print-btn" onclick="window.print()">📄 Print / Save as PDF</button>
    <button class="print-btn" onclick="toggleInstructions()" style="background: #6b7280;">ℹ️ Help</button>
  </div>
  
  <div id="instructions" class="instructions" style="display: none;">
    <strong>One Page Per Package PDF Instructions:</strong><br>
    1. Click "Print / Save as PDF" button<br>
    2. In print dialog, select "Save as PDF"<br>
    3. Choose A3 paper size for best results<br>
    4. Enable "Background graphics" (CRITICAL for colors!)<br>
    5. Each package will be on its own page with large, readable text<br>
    6. Contact information will be on the final page<br>
    7. Click Save to download your multi-page PDF!
  </div>
  
  ${element.outerHTML}
  
  <script>
    function toggleInstructions() {
      const instructions = document.getElementById('instructions');
      instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
    }
    
    // Show instructions for 7 seconds on load
    window.addEventListener('load', function() {
      const instructions = document.getElementById('instructions');
      instructions.style.display = 'block';
      setTimeout(() => {
        instructions.style.display = 'none';
      }, 7000);
      
      // Ensure fonts are loaded
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          console.log('All fonts loaded for HTML version - One page per package');
        });
      }
    });
  </script>
</body>
</html>`;

      // Create and download the HTML file
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-One-Page-Per-Package.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Enhanced HTML file downloaded successfully - One page per package');

    } catch (error) {
      console.error('HTML Generation Error:', error);
      alert('Could not generate HTML file. Please try again.');
    }
  };

  // Simple print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button 
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button 
          onClick={generateOptimizedPDF}
          className="bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white shadow-lg transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button 
          onClick={generateDownloadableHTML}
          variant="outline"
          className="border-2 border-green-600 text-green-600 hover:bg-green-50 shadow-lg transition-all duration-200"
        >
          <FileText className="w-4 h-4 mr-2" />
          HTML
        </Button>
      </div>
    </div>
  );
}