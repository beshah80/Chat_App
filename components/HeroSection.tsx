import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { unsplash_tool } from '../utils/unsplash';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center sara-gradient-hero pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Elegant wedding decoration with floral arrangements and lighting"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8E7]/90 to-[#FFF3EB]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 font-['Playfair_Display']"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Elegant. Memorable.{' '}
              <span className="text-[#D32F2F]">Timeless.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-[#555555] mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your event with Sara Decor's signature style. Weddings, birthdays, showers — made magical.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button className="sara-btn-primary text-lg px-8 py-4">
                Our Services
              </Button>
              <Button className="sara-btn-secondary text-lg px-8 py-4">
                Book Us Now
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D32F2F] font-['Playfair_Display']">500+</div>
                <div className="text-sm text-[#555555]">Events Decorated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D32F2F] font-['Playfair_Display']">5+</div>
                <div className="text-sm text-[#555555]">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D32F2F] font-['Playfair_Display']">100%</div>
                <div className="text-sm text-[#555555]">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative lg:order-last"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                alt="Beautiful wedding ceremony decoration with white flowers and elegant setup"
                className="w-full h-96 md:h-[500px] object-cover rounded-2xl sara-shadow-card"
              />
              
              {/* Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl sara-shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D32F2F] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">★</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Top Rated</div>
                    <div className="text-sm text-[#555555]">Event Decorator in Addis Ababa</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}