import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
    { name: 'Book Now', href: '#booking' }
  ];

  const services = [
    { name: 'Wedding Decorations', href: '#services' },
    { name: 'Birthday Parties', href: '#services' },
    { name: 'Baby Showers', href: '#services' },
    { name: 'Engagement Events', href: '#services' },
    { name: 'Traditional Ceremonies', href: '#services' }
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-[#FFD700] mb-4 font-['Playfair_Display']">
              Sara Decor
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transforming events into magical experiences with elegant decorations and personalized styling across Addis Ababa, Ethiopia.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center hover:bg-[#B71C1C] transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center hover:bg-[#B71C1C] transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#D32F2F] rounded-full flex items-center justify-center hover:bg-[#B71C1C] transition-colors duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-[#FFD700] transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href}
                    className="text-gray-300 hover:text-[#FFD700] transition-colors duration-300"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-[#FFD700] mb-4">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#D32F2F] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+251 911 123 456</p>
                  <p className="text-gray-400 text-sm">Call or WhatsApp</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#D32F2F] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@saradecor.com</p>
                  <p className="text-gray-400 text-sm">24/7 Support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#D32F2F] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Bole, Addis Ababa</p>
                  <p className="text-gray-400 text-sm">Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#D32F2F] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Mon - Sat: 8AM - 8PM</p>
                  <p className="text-gray-400 text-sm">Sunday: By Appointment</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <motion.div
        className="border-t border-gray-700 py-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-[#FFD700] mb-2 font-['Playfair_Display']">
              Stay Updated
            </h4>
            <p className="text-gray-300">
              Get the latest decoration trends and exclusive offers delivered to your inbox.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors duration-300"
            />
            <Button className="sara-btn-primary px-6 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Sara Decor. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#FFD700] text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFD700] text-sm transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}