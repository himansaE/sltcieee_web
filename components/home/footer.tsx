import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Events", href: "#events" },
    { label: "Organization Units", href: "#organization-units" },
    { label: "Join Us", href: "#join" },
    { label: "Contact", href: "#contact" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "ieeestudentbranch@sltc.ac.lk",
      href: "mailto:ieeestudentbranch@sltc.ac.lk",
    },
    { icon: Phone, text: "+94 11 234 5678", href: "tel:+94112345678" },
    { icon: MapPin, text: "Colombo, Sri Lanka", href: "#" },
  ];

  return (
    <footer className="bg-[#111] text-white border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/sb-logo-color.webp"
                alt="IEEE Student Branch Logo"
                width={309}
                height={60}
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Empowering the next generation of technology leaders through
              innovation, education, and professional development in the field
              of electrical and electronic engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 delay-200 duration-300 hover:translate-x-1 inline-block transition-all "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Contact Info
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <contact.icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <Link
                    href={contact.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                  >
                    {contact.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                Copyright © IEEE Design and Development, {currentYear}
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
