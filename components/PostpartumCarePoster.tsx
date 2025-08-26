'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ServicePackage {
  id: number;
  title: string;
  titleAm: string;
  price: number;
  duration: string;
  durationAm: string;
  services: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  servicesAm: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const packages: ServicePackage[] = [
  {
    id: 1,
    title: "Full Postpartum Care Package (40 days)",
    titleAm: "ሙሉ የድህረ ወሊድ እንክብካቤ ጥቅል (40 ቀናት)",
    price: 85000,
    duration: "40 days",
    durationAm: "40 ቀናት",
    services: [
      {
        icon: "✨",
        title: "Welcome Surprise Decor",
        description: "Beautiful welcome decorations to celebrate your new arrival"
      },
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👶",
        title: "Certified Nanny",
        description: "Well-trained professional to assist with childcare."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "✨",
        title: "የመግቢያ ዲኮር",
        description: "ለአዲስ ልጅዎ ለማክበር የሚያገለግሉ ቆንጆ የመቀበያ ዲኮሬሽኖች"
      },
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👶",
        title: "ሞግዚት",
        description: "በህጻን እንክብካቤን በደንብ የሰለጠነች ባለሙያ"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 2,
    title: "Half Postpartum Care Package (30 days)",
    titleAm: "ግማሽ የድህረ ወሊድ እንክብካቤ ጥቅል (30 ቀናት)",
    price: 75000,
    duration: "30 days",
    durationAm: "30 ቀናት",
    services: [
      {
        icon: "✨",
        title: "Welcome Surprise Decor",
        description: "Beautiful welcome decorations to celebrate your new arrival"
      },
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👶",
        title: "Certified Nanny",
        description: "Well-trained professional to assist with childcare."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "✨",
        title: "የመግቢያ ዲኮር",
        description: "ለአዲስ ልጅዎ ለማክበር የሚያገለግሉ ቆንጆ የመቀበያ ዲኮሬሽኖች"
      },
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👶",
        title: "ሞግዚት",
        description: "በህጻን እንክብካቤን በደንብ የሰለጠነች ባለሙያ"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 3,
    title: "Full Postpartum Care Package (40 days)",
    titleAm: "ሙሉ የድህረ ወሊድ እንክብካቤ ጥቅል (40 ቀናት)",
    price: 75000,
    duration: "40 days",
    durationAm: "40 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👶",
        title: "Certified Nanny",
        description: "Well-trained professional to assist with childcare."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👶",
        title: "ሞግዚት",
        description: "በህጻን እንክብካቤን በደንብ የሰለጠነች ባለሙያ"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 4,
    title: "Half Postpartum Care Package (30 days)",
    titleAm: "ግማሽ የድህረ ወሊድ እንክብካቤ ጥቅል (30 ቀናት)",
    price: 65000,
    duration: "30 days",
    durationAm: "30 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👶",
        title: "Certified Nanny",
        description: "Well-trained professional to assist with childcare."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👶",
        title: "ሞግዚት",
        description: "በህጻን እንክብካቤን በደንብ የሰለጠነች ባለሙያ"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 5,
    title: "Full Postpartum Care Package (40 days)",
    titleAm: "ሙሉ የድህረ ወሊድ እንክብካቤ ጥቅል (40 ቀናት)",
    price: 65000,
    duration: "40 days",
    durationAm: "40 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 6,
    title: "Half Postpartum Care Package (30 days)",
    titleAm: "ግማሽ የድህረ ወሊድ እንክብካቤ ጥቅል (30 ቀናት)",
    price: 55000,
    duration: "30 days",
    durationAm: "30 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "👨‍🍳",
        title: "Personal Chef",
        description: "Prepares healthy meals that are designed by certified nutritionist—breakfast, lunch, dinner, juice, and Atmit exclusively for the mother, and Genfo for the guests."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "👨‍🍳",
        title: "የግል ሼፍ",
        description: "ለእናት ብቻ ከምግብ አማካሪ በተሰጠው እቅድ መሰረት ጤናማ ምግቦችን ቁርስ፣ ምሳ፣ እራት፣ ጭማቂ እና አጥሚት ያዘጋጃል እና ለእንግዶች Genfo ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 7,
    title: "Full Postpartum Care Package (40 days)",
    titleAm: "ሙሉ የድህረ ወሊድ እንክብካቤ ጥቅል (40 ቀናት)",
    price: 45000,
    duration: "40 days",
    durationAm: "40 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  },
  {
    id: 8,
    title: "Half Postpartum Care Package (30 days)",
    titleAm: "ግማሽ የድህረ ወሊድ እንክብካቤ ጥቅል (30 ቀናት)",
    price: 35000,
    duration: "30 days",
    durationAm: "30 ቀናት",
    services: [
      {
        icon: "🥗",
        title: "Certified Nutritionist",
        description: "Designs and oversees customized meal plans to ensure the mother's recovery, strength, and nourishment are fully supported during the postpartum period."
      },
      {
        icon: "💆‍♀️",
        title: "Professional Massager",
        description: "Whole body massage, facial treatment, and body treatment with natural mixtures once a week (4x a month)."
      },
      {
        icon: "🩺",
        title: "Nurse",
        description: "Health check-ups for mother and baby, counseling, and mental health support."
      }
    ],
    servicesAm: [
      {
        icon: "🥗",
        title: "የምግብ አማካሪ",
        description: "እናትየው የምትፈልገውን ክብደት ጠብቃ በተመሳሳይ ሰአት ሰውነቷ አንዲጠገን የሚነዱአትን ምግቦች ያዘጋጃል"
      },
      {
        icon: "💆‍♀️",
        title: "ፕሮፌሽናል ማሳጅ",
        description: "ሙሉ የሰውነት ማሳጅ፣ በተፈጥሮ ድብልቅ የተዘጋጀ የፊት ላይ እና የሰውነት እንክብካቤ በሳምንት አንድ ጊዜ (በወር 4 ጊዜ)።"
      },
      {
        icon: "🩺",
        title: "ነርስ",
        description: "የእናት እና የህፃን የጤና ምርመራ፣ የምክር እና የአእምሮ ጤና ድጋፍ።"
      }
    ]
  }
];

export function PostpartumCarePoster() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('pdf-content');
      if (!element) return;

      const pages = element.querySelectorAll('.print-page-break, .page-section');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          height: page.scrollHeight,
          width: page.scrollWidth
        });

        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save('agos-magical-postpartum-care-packages.pdf');
      showMessage('✨ Magical PDF generated successfully!', 'success');

    } catch (error) {
      console.error('Error generating PDF:', error);
      showMessage('❌ Error generating PDF. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pdf-safe-colors" style={{ backgroundColor: '#f8fafc' }}>
      {/* PDF Content Container */}
      <div id="pdf-content" className="pdf-safe-colors">
        
        {/* Magical Cover Page */}
        <div className="print-page-break page-section min-h-screen flex flex-col justify-center items-center text-white print:p-8 p-16 relative overflow-hidden"
             style={{ backgroundColor: '#1e293b' }}>
          
          {/* Magical Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20"
                 style={{ background: 'linear-gradient(135deg, #009E60 0%, #FFCD00 100%)' }}></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full opacity-20"
                 style={{ background: 'linear-gradient(135deg, #DA020E 0%, #FFCD00 100%)' }}></div>
            <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full opacity-15"
                 style={{ background: 'linear-gradient(135deg, #FFCD00 0%, #009E60 100%)' }}></div>
            <div className="absolute top-10 right-1/3 w-16 h-16 rounded-full opacity-15"
                 style={{ background: 'linear-gradient(135deg, #009E60 0%, #DA020E 100%)' }}></div>
          </div>

          <div className="text-center space-y-12 max-w-5xl mx-auto relative z-10">
            
            {/* Magical Company Logo */}
            <div className="mb-16">
              <div className="inline-block p-8 border-4 rounded-3xl relative"
                   style={{ 
                     backgroundColor: 'rgba(255,255,255,0.1)', 
                     backdropFilter: 'blur(4px)',
                     borderColor: 'rgba(255,255,255,0.3)',
                     boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.1)' 
                   }}>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden"
                       style={{ background: 'linear-gradient(135deg, #009E60 0%, #FFCD00 50%, #DA020E 100%)',
                                boxShadow: '0 0 30px rgba(255, 205, 0, 0.4)' }}>
                    <span className="text-3xl font-bold text-white relative z-10">A</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white opacity-20"></div>
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold text-white mb-2 ethiopian-text-shadow">AGOS</h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }} className="text-lg font-medium">
                      ✨ Magical Postpartum Care ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Magical Titles */}
            <div className="space-y-8">
              <div className="relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
                    style={{ 
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFCD00 50%, #FFFFFF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                  Postpartum Care Services
                </h1>
                <div className="absolute -top-4 -right-4 text-6xl opacity-60">🌟</div>
                <div className="absolute -bottom-2 -left-6 text-4xl opacity-40">✨</div>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
                  style={{ 
                    fontFamily: "'Noto Sans Ethiopic', sans-serif",
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    color: '#FFCD00'
                  }}>
                የድህረ ወሊድ እንክብካቤ አገልግሎቶች
              </h2>
              
              {/* Magical Separator */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-32 h-1 rounded-full"
                     style={{ background: 'linear-gradient(90deg, transparent, #009E60, transparent)' }}></div>
                <div className="text-4xl">💖</div>
                <div className="w-32 h-1 rounded-full"
                     style={{ background: 'linear-gradient(90deg, transparent, #DA020E, transparent)' }}></div>
              </div>
              
              <div className="relative">
                <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
                   style={{ color: 'rgba(255,255,255,0.95)' }}>
                  🌸 Professional Care for New Mothers 🌸
                </p>
                <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-2"
                   style={{ 
                     color: 'rgba(255,255,255,0.85)',
                     fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                   }}>
                  ለአዲስ እናቶች የሚደረግ ባለሙያ እንክብካቤ
                </p>
                <div className="absolute -top-2 left-1/4 text-2xl opacity-50">🦋</div>
                <div className="absolute -bottom-1 right-1/4 text-2xl opacity-50">🌺</div>
              </div>
            </div>

            {/* Magical Floating Elements */}
            <div className="flex justify-center items-center gap-8 mt-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                   style={{ backgroundColor: 'rgba(0, 158, 96, 0.2)', border: '2px solid rgba(0, 158, 96, 0.4)' }}>
                👶
              </div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                   style={{ backgroundColor: 'rgba(255, 205, 0, 0.2)', border: '2px solid rgba(255, 205, 0, 0.4)' }}>
                💝
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                   style={{ backgroundColor: 'rgba(218, 2, 14, 0.2)', border: '2px solid rgba(218, 2, 14, 0.4)' }}>
                🤱
              </div>
            </div>
          </div>
        </div>

        {/* Magical Package Pages */}
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="print-page-break page-section min-h-screen print:p-6 p-8 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #fef7cd 50%, #fce7f3 100%)' }}>
            
            {/* Background Magic Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 right-20 w-40 h-40 rounded-full opacity-5"
                   style={{ background: 'linear-gradient(135deg, #009E60, #FFCD00)' }}></div>
              <div className="absolute bottom-20 left-16 w-32 h-32 rounded-full opacity-5"
                   style={{ background: 'linear-gradient(135deg, #DA020E, #FFCD00)' }}></div>
              <div className="absolute top-1/2 right-10 text-8xl opacity-10">🌸</div>
              <div className="absolute top-32 left-10 text-6xl opacity-10">✨</div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col">
              
              {/* Magical Header */}
              <div className="text-white print:p-6 p-8 rounded-3xl mb-8 relative overflow-hidden"
                   style={{ 
                     backgroundColor: '#1e293b',
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                   }}>
                
                {/* Header Background Magic */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                       style={{ background: 'linear-gradient(135deg, #009E60, #FFCD00)' }}></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
                       style={{ background: 'linear-gradient(135deg, #DA020E, #FFCD00)' }}></div>
                </div>

                <div className="text-center space-y-6 relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-4xl">🌟</div>
                    <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                      {pkg.title}
                    </h3>
                    <div className="text-4xl">🌟</div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold leading-tight opacity-90"
                      style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                    {pkg.titleAm}
                  </h3>
                  
                  {/* Magical Price Badge */}
                  <div className="inline-block p-6 rounded-full border-4 relative"
                       style={{ 
                         background: 'linear-gradient(135deg, #009E60 0%, #FFCD00 50%, #DA020E 100%)',
                         borderColor: 'rgba(255,255,255,0.3)',
                         boxShadow: '0 0 40px rgba(255, 205, 0, 0.4)'
                       }}>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold leading-none">
                        {pkg.price.toLocaleString()}
                      </div>
                      <div className="text-xl font-medium opacity-90">ETB</div>
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl">💎</div>
                  </div>
                </div>
              </div>

              {/* Magical Services Content */}
              <div className="flex-1 space-y-8">
                
                {/* English Services - Magical Cards */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold flex items-center justify-center gap-3"
                        style={{ color: '#1e293b' }}>
                      <span className="text-3xl">🎯</span>
                      Services Included
                      <span className="text-3xl">🎯</span>
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pkg.services.map((service, idx) => (
                      <div key={idx} 
                           className="group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,244,0.9) 100%)',
                             borderColor: '#009E60',
                             boxShadow: '0 10px 25px -5px rgba(0, 158, 96, 0.1)'
                           }}>
                        
                        {/* Magical Icon Circle */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 relative overflow-hidden"
                               style={{ 
                                 backgroundColor: '#ffffff',
                                 borderColor: '#009E60',
                                 boxShadow: '0 4px 12px rgba(0, 158, 96, 0.2)'
                               }}>
                            {service.icon}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-100 opacity-30"></div>
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>
                              {service.title}
                            </h5>
                            <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                              {service.description}
                            </p>
                          </div>
                        </div>

                        {/* Magical Hover Effect */}
                        <div className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          ✨
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Magical Ethiopian Flag Separator */}
                <div className="flex items-center justify-center gap-4 py-6">
                  <div className="flex h-2 rounded-full overflow-hidden w-32">
                    <div className="flex-1" style={{ backgroundColor: '#009E60' }}></div>
                    <div className="flex-1" style={{ backgroundColor: '#FFCD00' }}></div>
                    <div className="flex-1" style={{ backgroundColor: '#DA020E' }}></div>
                  </div>
                  <div className="text-4xl">🇪🇹</div>
                  <div className="flex h-2 rounded-full overflow-hidden w-32">
                    <div className="flex-1" style={{ backgroundColor: '#009E60' }}></div>
                    <div className="flex-1" style={{ backgroundColor: '#FFCD00' }}></div>
                    <div className="flex-1" style={{ backgroundColor: '#DA020E' }}></div>
                  </div>
                </div>

                {/* Amharic Services - Magical Cards */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold flex items-center justify-center gap-3"
                        style={{ 
                          color: '#1e293b',
                          fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                        }}>
                      <span className="text-3xl">🌺</span>
                      የሚሰጡ አገልግሎቶች
                      <span className="text-3xl">🌺</span>
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pkg.servicesAm.map((service, idx) => (
                      <div key={idx} 
                           className="group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,242,242,0.9) 100%)',
                             borderColor: '#DA020E',
                             boxShadow: '0 10px 25px -5px rgba(218, 2, 14, 0.1)'
                           }}>
                        
                        {/* Magical Icon Circle */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 relative overflow-hidden"
                               style={{ 
                                 backgroundColor: '#ffffff',
                                 borderColor: '#DA020E',
                                 boxShadow: '0 4px 12px rgba(218, 2, 14, 0.2)'
                               }}>
                            {service.icon}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-100 opacity-30"></div>
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="text-lg font-bold mb-2" 
                                style={{ 
                                  color: '#1e293b',
                                  fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                                }}>
                              {service.title}
                            </h5>
                            <p className="text-sm leading-relaxed" 
                               style={{ 
                                 color: '#4a5568',
                                 fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                               }}>
                              {service.description}
                            </p>
                          </div>
                        </div>

                        {/* Magical Hover Effect */}
                        <div className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          🌟
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Magical Footer */}
              <div className="mt-8 p-6 rounded-2xl border-2"
                   style={{ 
                     backgroundColor: 'rgba(255,255,255,0.8)',
                     borderColor: '#FFCD00',
                     backdropFilter: 'blur(4px)'
                   }}>
                <div className="flex items-center justify-center gap-6 text-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <span className="font-semibold" style={{ color: '#1e293b' }}>
                      Duration: {pkg.duration}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFCD00' }}></div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <span className="font-semibold" 
                          style={{ 
                            color: '#1e293b',
                            fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                          }}>
                      የሚቆይበት ጊዜ: {pkg.durationAm}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Magical Contact & Working Hours Page */}
        <div className="print-page-break page-section min-h-screen print:p-6 p-8 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #fff3e0 50%, #f3e5f5 100%)' }}>
          
          {/* Background Magic Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-48 h-48 rounded-full opacity-5"
                 style={{ background: 'radial-gradient(circle, #009E60, transparent)' }}></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full opacity-5"
                 style={{ background: 'radial-gradient(circle, #DA020E, transparent)' }}></div>
            <div className="absolute top-1/3 right-1/4 text-9xl opacity-5">📞</div>
            <div className="absolute bottom-1/3 left-1/4 text-9xl opacity-5">💌</div>
          </div>

          <div className="relative z-10 h-full">
            
            {/* Magical Header */}
            <div className="text-white print:p-6 p-8 rounded-3xl mb-8 relative overflow-hidden"
                 style={{ 
                   backgroundColor: '#1e293b',
                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                 }}>
              
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl">📞</span>
                  <h2 className="text-3xl md:text-4xl font-bold ethiopian-text-shadow">
                    Contact & Schedule Information
                  </h2>
                  <span className="text-5xl">📧</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold ethiopian-text-shadow"
                    style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                  የመገናኛ እና የሰአት መረጃ
                </h2>
                
                {/* Magical Separator */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-24 h-1 rounded-full"
                       style={{ background: 'linear-gradient(90deg, transparent, #009E60, transparent)' }}></div>
                  <span className="text-3xl">💖</span>
                  <div className="w-24 h-1 rounded-full"
                       style={{ background: 'linear-gradient(90deg, transparent, #DA020E, transparent)' }}></div>
                </div>
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              
              {/* English Working Hours */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-center flex items-center justify-center gap-3"
                    style={{ color: '#1e293b' }}>
                  <span className="text-4xl">⏰</span>
                  Working Hours
                  <span className="text-4xl">⏰</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border-3 relative overflow-hidden"
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(236,254,235,0.9) 0%, rgba(220,252,231,0.9) 100%)',
                         borderColor: '#009E60',
                         boxShadow: '0 20px 25px -5px rgba(0, 158, 96, 0.1)'
                       }}>
                    <div className="absolute top-4 right-4 text-3xl opacity-20">👶</div>
                    <h4 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: '#1e293b' }}>
                      <span className="text-3xl">👶</span>
                      Nanny Service
                    </h4>
                    <p className="mb-3 text-lg" style={{ color: '#374151' }}>
                      <span className="font-bold text-xl">Daily:</span> 7:30 a.m. – 6:00 p.m.
                    </p>
                    <p className="text-base italic p-3 rounded-lg" 
                       style={{ 
                         color: '#059669',
                         backgroundColor: 'rgba(255,255,255,0.7)' 
                       }}>
                      ✨ Not working on Saturday afternoons and will be off duty the entire day on Sunday.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border-3 relative overflow-hidden"
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.9) 100%)',
                         borderColor: '#FFCD00',
                         boxShadow: '0 20px 25px -5px rgba(255, 205, 0, 0.1)'
                       }}>
                    <div className="absolute top-4 right-4 text-3xl opacity-20">👨‍🍳</div>
                    <h4 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: '#1e293b' }}>
                      <span className="text-3xl">👨‍🍳</span>
                      Chef Service
                    </h4>
                    <p className="mb-3 text-lg" style={{ color: '#374151' }}>
                      <span className="font-bold text-xl">Daily:</span> 7:00 a.m. – 5:00 p.m.
                    </p>
                    <div className="p-4 rounded-lg border-2"
                         style={{ 
                           backgroundColor: 'rgba(254,242,242,0.8)',
                           borderColor: '#DA020E' 
                         }}>
                      <p className="text-base font-semibold" style={{ color: '#DC2626' }}>
                        <span className="text-xl">‼️</span> Important: A minimum of one rest day per week is mandatory (usually Sunday, but adjustable by mutual agreement).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amharic Working Hours */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-center flex items-center justify-center gap-3"
                    style={{ 
                      color: '#1e293b',
                      fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                    }}>
                  <span className="text-4xl">⏰</span>
                  የስራ ሰዓት
                  <span className="text-4xl">⏰</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border-3 relative overflow-hidden"
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(236,254,235,0.9) 0%, rgba(220,252,231,0.9) 100%)',
                         borderColor: '#009E60',
                         boxShadow: '0 20px 25px -5px rgba(0, 158, 96, 0.1)'
                       }}>
                    <div className="absolute top-4 right-4 text-3xl opacity-20">👶</div>
                    <h4 className="text-2xl font-bold mb-4 flex items-center gap-3"
                        style={{ 
                          color: '#1e293b',
                          fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                        }}>
                      <span className="text-3xl">👶</span>
                      ሞግዚት
                    </h4>
                    <p className="mb-3 text-lg" 
                       style={{ 
                         color: '#374151',
                         fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                       }}>
                      <span className="font-bold text-xl">ከጠዋት:</span> 1፡30 እስከ ምሽቱ 12፡00 ሰአት
                    </p>
                    <p className="text-base italic p-3 rounded-lg" 
                       style={{ 
                         color: '#059669',
                         backgroundColor: 'rgba(255,255,255,0.7)',
                         fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                       }}>
                      ✨ ቅዳሜ ግማሽ ቀን እና እሁድ ሙሉ ቀን አይሰሩም
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border-3 relative overflow-hidden"
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.9) 100%)',
                         borderColor: '#FFCD00',
                         boxShadow: '0 20px 25px -5px rgba(255, 205, 0, 0.1)'
                       }}>
                    <div className="absolute top-4 right-4 text-3xl opacity-20">👨‍🍳</div>
                    <h4 className="text-2xl font-bold mb-4 flex items-center gap-3"
                        style={{ 
                          color: '#1e293b',
                          fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                        }}>
                      <span className="text-3xl">👨‍🍳</span>
                      ሼፍ
                    </h4>
                    <p className="mb-3 text-lg" 
                       style={{ 
                         color: '#374151',
                         fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                       }}>
                      <span className="font-bold text-xl">ከጠዋት:</span> 1፡00 እስከ ምሽቱ 11፡00 ሰአት
                    </p>
                    <div className="p-4 rounded-lg border-2"
                         style={{ 
                           backgroundColor: 'rgba(254,242,242,0.8)',
                           borderColor: '#DA020E' 
                         }}>
                      <p className="text-base font-semibold" 
                         style={{ 
                           color: '#DC2626',
                           fontFamily: "'Noto Sans Ethiopic', sans-serif" 
                         }}>
                        <span className="text-xl">‼️</span> አስፈላጊ: ሼፋችን በሳምንት አንድ ቀን ማረፍ ይኖርባቸዋል የሚያርፋበትን ቀን በስምምነት ከእሁድ ወደ ሌላ ቀን መቀየር ይቻላል
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Magical Contact Information */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4"
                    style={{ 
                      background: 'linear-gradient(135deg, #009E60 0%, #FFCD00 50%, #DA020E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                  <span className="text-5xl">🌟</span>
                  Book Your Care Package Today!
                  <span className="text-5xl">🌟</span>
                </h3>
                <h3 className="text-3xl font-semibold"
                    style={{ 
                      fontFamily: "'Noto Sans Ethiopic', sans-serif",
                      background: 'linear-gradient(135deg, #009E60 0%, #FFCD00 50%, #DA020E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                  የእንክብካቤ ጥቅልዎን ዛሬ ይያዙ!
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group relative p-8 rounded-3xl border-4 text-center transition-all duration-300 hover:scale-105"
                     style={{ 
                       background: 'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(220,252,231,0.9) 100%)',
                       borderColor: '#009E60',
                       boxShadow: '0 25px 50px -12px rgba(0, 158, 96, 0.2)'
                     }}>
                  <div className="absolute -top-4 -right-4 text-3xl">✨</div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                       style={{ 
                         backgroundColor: '#009E60',
                         boxShadow: '0 0 30px rgba(0, 158, 96, 0.4)' 
                       }}>
                    <span className="text-4xl relative z-10">📞</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-20"></div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3" style={{ color: '#009E60' }}>Phone</h4>
                  <p className="text-xl font-bold" style={{ color: '#1e293b' }}>+251967621545</p>
                </div>

                <div className="group relative p-8 rounded-3xl border-4 text-center transition-all duration-300 hover:scale-105"
                     style={{ 
                       background: 'linear-gradient(135deg, rgba(253,242,248,0.9) 0%, rgba(252,231,243,0.9) 100%)',
                       borderColor: '#ec4899',
                       boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.2)'
                     }}>
                  <div className="absolute -top-4 -right-4 text-3xl">🌸</div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                       style={{ 
                         backgroundColor: '#ec4899',
                         boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)' 
                       }}>
                    <span className="text-4xl relative z-10">📷</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-20"></div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3" style={{ color: '#be185d' }}>Instagram</h4>
                  <p className="text-xl font-bold" style={{ color: '#1e293b' }}>agos_postpartumcare</p>
                </div>

                <div className="group relative p-8 rounded-3xl border-4 text-center transition-all duration-300 hover:scale-105"
                     style={{ 
                       background: 'linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(219,234,254,0.9) 100%)',
                       borderColor: '#3b82f6',
                       boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2)'
                     }}>
                  <div className="absolute -top-4 -right-4 text-3xl">💎</div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                       style={{ 
                         backgroundColor: '#3b82f6',
                         boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' 
                       }}>
                    <span className="text-4xl relative z-10">📱</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-20"></div>
                  </div>
                  <h4 className="text-2xl font-bold mb-3" style={{ color: '#1d4ed8' }}>Telegram</h4>
                  <p className="text-xl font-bold" style={{ color: '#1e293b' }}>@Agosfashionfrenzy22</p>
                </div>
              </div>

              <div className="text-center mt-12 p-6 rounded-2xl"
                   style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                <p className="text-2xl flex items-center justify-center gap-4" style={{ color: '#64748b' }}>
                  <span className="text-3xl" style={{ color: '#DA020E' }}>📍</span>
                  <em className="font-medium">Professional postpartum care services in Ethiopia</em>
                  <span className="text-3xl" style={{ color: '#DA020E' }}>🇪🇹</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magical Download Button */}
      <div className="no-print fixed bottom-8 right-8 z-50">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="group relative font-bold py-6 px-10 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:scale-100 flex items-center gap-4 overflow-hidden"
          style={{
            backgroundColor: isGenerating ? '#64748b' : '#1e293b',
            color: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '2px solid rgba(255, 205, 0, 0.5)'
          }}
        >
          {/* Button Background Magic */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {isGenerating ? (
            <>
              <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
              <span className="text-lg">✨ Creating Magic...</span>
            </>
          ) : (
            <>
              <span className="text-3xl group-hover:animate-bounce">📄</span>
              <span className="text-lg">Download Magical PDF</span>
              <span className="text-2xl group-hover:animate-pulse">🌟</span>
            </>
          )}
        </button>
      </div>

      {/* Magical Message Notification */}
      {message && (
        <div className={`no-print fixed bottom-8 left-8 z-50 p-6 rounded-2xl text-white font-bold text-lg border-2`}
             style={{
               backgroundColor: message.type === 'success' ? '#16a34a' : '#dc2626',
               borderColor: message.type === 'success' ? '#22c55e' : '#ef4444',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
             }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{message.type === 'success' ? '✨' : '⚠️'}</span>
            {message.text}
            <span className="text-2xl">{message.type === 'success' ? '🎉' : '😞'}</span>
          </div>
        </div>
      )}
    </div>
  );
}