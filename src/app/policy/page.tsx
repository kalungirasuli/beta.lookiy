'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const sections = [
    {
      title: 'Acceptance of Terms',
      content:
        'By accessing or using this website, you agree to follow all terms, conditions, and policies outlined here. If you do not agree, do not use this site. This website is private digital property. Unauthorized use, misuse, or access for unlawful purposes is strictly prohibited.',
    },
    {
      title: 'Ownership & Intellectual Property',
      content:
        'All content, designs, code, branding, features, and materials on this site are the exclusive property of the owner. You may not copy, reproduce, distribute, modify, reverse-engineer, or use any part of this platform for any purpose not explicitly authorized.',
    },
    {
      title: 'User Responsibilities',
      content:
        'Users agree not to use this site in any manner that is illegal or harmful. Do not attempt to hack, exploit, or disrupt system operations. Do not submit false or misleading information, use any automated tools without permission, or interfere with the privacy or rights of other users. Any violation may result in denial of access or legal action.',
      bullets: [
        'Use this site in any manner that is illegal or harmful',
        'Attempt to hack, exploit, or disrupt system operations',
        'Submit false or misleading information',
        'Use any automated tools, bots, or scripts without permission',
        'Interfere with the privacy or rights of other users',
      ],
    },
    {
      title: ' Waiting List Registration',
      content:
        'By joining the waiting list, you agree to provide accurate information and allow the platform to contact you regarding updates, access, or product announcements. Do not impersonate any person or entity. Joining the waiting list does not guarantee immediate access or service availability.',
    },
    {
      title: 'Data Collection & Privacy',
      content:
        'We collect basic information that you voluntarily submit when joining the waiting list (such as your name, email address, or preferences). Your data will not be shared, sold, or exposed to any third party that is not part of the core application infrastructure.',
    },
    {
      title: ' How Your Data Is Used',
      content:
        'Your data may be used strictly for improving user experience, understanding user demand, communicating updates about the platform, and enhancing product development.',
      bullets: [
        'Improving user experience',
        'Understanding user demand',
        'Communicating updates about the platform',
        'Enhancing product development',
      ],
    },
    {
      title: ' Third-Party Components',
      content:
        'Some parts of the site may use secure infrastructure or hosting services. These components only process data as required to operate the platform and do not own, access, or claim rights to your information.',
    },
    {
      title: ' Security',
      content:
        'We implement reasonable safeguards to protect your data. However, no online system is 100% secure, and users accept that risk when submitting information.',
    },
    {
      title: ' Modifications to This Policy',
      content:
        'We may update these terms at any time. Continued use of the site after changes means you accept the new terms.',
    },
    {
      title: ' Contact',
      content:
        'For any questions or concerns about these terms or your data, please contact us through the information provided on our website.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 opacity-40 -z-10"></div>

      {/* Grid background */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 grid-rows-12 opacity-10 gap-0">
          {Array.from({ length: 72 }).map((_, index) => (
            <div key={index} className="border border-gray-200 flex items-center justify-center bg-white bg-opacity-5"></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {/* Hero Section */}
        <motion.section
          className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-black tracking-tight"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Terms of Use & <span className="text-purple-100 bg-purple-600 px-3 py-2 rounded-md mx-2 inline-block">Privacy Policy</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-4"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Last Updated: November 19, 2025
            </motion.p>
            <motion.p
              className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Please read our complete terms of use and privacy policy below. Your privacy and trust are important to us.
            </motion.p>
          </div>
        </motion.section>

        {/* Policy Content */}
        <motion.section
          className="w-full py-8 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="mb-12 p-6 md:p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-300"
                variants={itemVariants}
                whileHover={{ translateY: -4 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 flex items-center">
                  <span className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-lg font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>

                <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">{section.content}</p>

                {section.bullets && (
                  <ul className="space-y-3 ml-4">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <motion.li
                        key={bulletIndex}
                        className="flex items-start text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: bulletIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-purple-600 font-bold mr-3 mt-1">•</span>
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Important Notice */}
            <motion.div
              className="mt-16 p-8 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-600 rounded-xl"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-purple-900 mb-4">🔒 Your Privacy is Protected</h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                We take your privacy seriously. Your data will never be sold, shared with external parties, or used for advertising purposes. We collect only what is necessary to provide our services and communicate updates to you.
              </p>
              <p className="text-gray-800 leading-relaxed">
                If you have any questions about how we handle your data or our policies, please reach out to us directly. We&apos;re here to help and ensure your trust.
              </p>
            </motion.div>

            {/* Acknowledgment */}
            <motion.div
              className="mt-12 p-6 bg-gray-50 border-l-4 border-orange-600 rounded"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-gray-700 italic">
                By using this website, you acknowledge that you have read, understood, and agreed to all terms stated above.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Decorative Section */}
        <motion.section
          className="w-full py-8 px-4 relative text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 text-sm">
            Last Updated: November 19, 2025 • For questions, please contact us
          </p>
        </motion.section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
