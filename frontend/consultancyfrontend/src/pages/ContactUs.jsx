import React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { TbWorldWww } from "react-icons/tb";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="mt-4 text-xl text-gray-600">
            We're here to help! Reach out to us through any of the methods
            below.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-5">
          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:support@example.com"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      consultancy@svnit.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a
                      href="tel:+18005551234"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      +1 (800) 555-12345
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Links
              </h2>

              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Having issues on ongoing project</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>FAQ and Knowledge Base</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.svnit.ac.in"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <TbWorldWww color={"blue"} size={22} className="mr-1" />
                    <span>Visit SVNIT homepage</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Office Hours</h3>
            <p className="text-sm text-gray-600 mt-1">
              Monday - Friday: 9:00 AM - 6:00 PM | Saturday: 10:00 AM - 2:00 PM
              | Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
