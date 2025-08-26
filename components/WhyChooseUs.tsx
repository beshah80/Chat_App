import { motion } from 'framer-motion';
import { Palette, UserCheck, Eye, Star } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Palette,
    title: 'Personalized Designs',
    description: 'Every event is unique. We create custom decorations that perfectly match your vision, style, and budget.',
    color: '#D32F2F'
  },
  {
    id: 2,
    icon: UserCheck,
    title: 'Stress-Free Planning',
    description: 'From concept to completion, we handle every detail so you can focus on enjoying your special moment.',
    color: '#FFD700'
  },
  {
    id: 3,
    icon: Eye,
    title: 'Detail Perfection',
    description: 'We believe the magic is in the details. Every element is carefully chosen and perfectly placed.',
    color: '#FF69B4'
  },
  {
    id: 4,
    icon: Star,
    title: 'Satisfaction Guaranteed',
    description: 'Your happiness is our priority. We work tirelessly until every detail exceeds your expectations.',
    color: '#4169E1'
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#FFF3EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6 font-['Playfair_Display']">
            Why Choose <span className="text-[#D32F2F]">Sara Decor</span>
          </h2>
          <p className="text-lg text-[#555555] max-w-2xl mx-auto">
            We're not just decorators — we're storytellers who bring emotion and elegance to every event setup.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={feature.id}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Icon Container */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                  style={{ backgroundColor: `${feature.color}15` }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: feature.color }}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Decorative Ring */}
                  <motion.div
                    className="absolute inset-0 border-2 rounded-full opacity-0 group-hover:opacity-100"
                    style={{ borderColor: feature.color }}
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4 font-['Playfair_Display']">
                  {feature.title}
                </h3>
                <p className="text-[#555555] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quote */}
        <motion.div
          className="text-center mt-16 p-8 bg-white rounded-2xl sara-shadow-card max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-4xl text-[#D32F2F] mb-4">💫</div>
          <blockquote className="text-xl md:text-2xl font-medium text-[#1A1A1A] mb-4 font-['Playfair_Display'] italic">
            "We design with purpose. We decorate with heart."
          </blockquote>
          <cite className="text-[#555555] font-medium">— Sara Mekdes, Founder</cite>
        </motion.div>
      </div>
    </section>
  );
}