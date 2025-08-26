import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amina Kedir',
    event: 'Baby Shower',
    rating: 5,
    text: 'Sara Decor made my baby shower absolutely magical! Every detail was perfect, and the setup was more beautiful than I could have imagined. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Dawit Tesfaye',
    event: 'Wedding',
    rating: 5,
    text: 'Our wedding decoration was stunning! Six months later, our guests still talk about how beautiful everything looked. Sara\'s team was professional and creative.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Hiwot Mengistu',
    event: 'Engagement Party',
    rating: 5,
    text: 'Working with Sara Decor was the best decision we made for our engagement party. They were kind, creative, and delivered everything on time. Amazing service!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4,
    name: 'Yonas Bekele',
    event: 'Birthday Celebration',
    rating: 5,
    text: 'They transformed our venue into something incredible for my wife\'s birthday. The attention to detail and creative touches made it an unforgettable celebration.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 5,
    name: 'Meron Assefa',
    event: 'Graduation Party',
    rating: 5,
    text: 'Sara Decor exceeded all our expectations for our graduation celebration. The decorations were elegant and perfectly captured the joy of the achievement.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6,
    name: 'Fasil Teshome',
    event: 'Traditional Ceremony',
    rating: 5,
    text: 'For our traditional coffee ceremony, Sara Decor beautifully honored our Ethiopian heritage while adding modern elegance. It was perfect!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

export function Testimonials() {
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
            What Our <span className="text-[#D32F2F]">Clients Say</span>
          </h2>
          <p className="text-lg text-[#555555] max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with Sara Decor.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl sara-shadow-card hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-[#FFD700] fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-[#555555] mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-[#1A1A1A]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#555555]">
                    {testimonial.event}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-6">
            <div className="text-3xl font-bold text-[#D32F2F] mb-2 font-['Playfair_Display']">
              500+
            </div>
            <div className="text-[#555555]">Happy Clients</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-[#D32F2F] mb-2 font-['Playfair_Display']">
              98%
            </div>
            <div className="text-[#555555]">Customer Satisfaction</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-[#D32F2F] mb-2 font-['Playfair_Display']">
              5★
            </div>
            <div className="text-[#555555]">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}