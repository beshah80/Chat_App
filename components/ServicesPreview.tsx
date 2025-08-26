import { motion } from 'framer-motion';
import { Heart, Gift, Baby, Users, GraduationCap, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    id: 1,
    icon: Heart,
    title: 'Wedding Decorations',
    description: 'Create the perfect ambiance for your special day with elegant floral arrangements and sophisticated styling.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#D32F2F'
  },
  {
    id: 2,
    icon: Gift,
    title: 'Birthday Celebrations',
    description: 'From intimate gatherings to grand parties, we bring joy and color to every birthday celebration.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FFD700'
  },
  {
    id: 3,
    icon: Baby,
    title: 'Baby Showers',
    description: 'Celebrate new beginnings with soft, beautiful decorations that welcome your little bundle of joy.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FFB6C1'
  },
  {
    id: 4,
    icon: Users,
    title: 'Engagement Parties',
    description: 'Mark this milestone with romantic decorations that celebrate your love story and future together.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FF69B4'
  },
  {
    id: 5,
    icon: GraduationCap,
    title: 'Graduation Events',
    description: 'Honor achievements with proud, celebratory decorations that mark this important milestone.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#4169E1'
  },
  {
    id: 6,
    icon: Coffee,
    title: 'Traditional Ceremonies',
    description: 'Honor Ethiopian traditions with authentic decorations for coffee ceremonies and cultural celebrations.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#8B4513'
  }
];

export function ServicesPreview() {
  return (
    <section className="py-20 bg-white">
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
            Our <span className="text-[#D32F2F]">Services</span>
          </h2>
          <p className="text-lg text-[#555555] max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we specialize in creating memorable experiences 
            that reflect your unique style and vision.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <motion.div
                key={service.id}
                className="group bg-white rounded-2xl overflow-hidden sara-shadow-card hover:shadow-xl transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={`${service.title} decoration setup`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Icon Overlay */}
                  <div 
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: service.color }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3 font-['Playfair_Display']">
                    {service.title}
                  </h3>
                  <p className="text-[#555555] leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-[#D32F2F] group-hover:text-white group-hover:border-[#D32F2F] transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-lg text-[#555555] mb-6">
            Ready to transform your event into something magical?
          </p>
          <Button className="sara-btn-primary text-lg px-8 py-4">
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}