import { Link } from "react-router";

import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useRef } from "react";

import useAuthStore from "../store/useAuthStore.js";

//utils
import { getUser } from "../utils/apiAuth.js";
import { useEffect } from "react";

export default function HomePage() {
  const { user, setUser } = useAuthStore();
  const featuresRef = useRef(null);

  const fetchUser = () => {
    getUser()
      .then((user) => {
        // Check if user data exists, otherwise set it to null
        setUser(user || null);
      })
      .catch((error) => {
        console.error("Failed to get user:", error.message);
        setUser(null);
      });
  };

  const handleLearnMore = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="absolute right-0 p-4">
        <Link to={user ? "/app/dashboard" : "/app/login"}>
          <button className="group flex items-center text-gray-300 hover:text-white transition-colors">
            {user ? "App" : "Log in"}
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>
      </div>
      <section className="min-h-[90vh] w-full bg-gradient-to-br from-[#4971bb]  to-[#2d57a4] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center flex-col gap-4 sm:flex-row">
            <div className="m-auto">
              <img src="/sentinel-text-lg.png" className="w-[374px]" />
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Experience hassle-free document tracking. <br /> Securely, track
            progress, and control access all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/contact-us">
              <button className="px-6 py-2 bg-[#82f4e5]  text-gray-700 font-bold rounded-tl-3xl transition-colors">
                Contact us
              </button>
            </Link>
            <button
              className="group flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={handleLearnMore}
            >
              Learn more
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div className=" bg-background text-foreground" ref={featuresRef}>
        <div className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mt-2 mb-4 text-[#4971bb]">
                Tracking made easy
              </h1>
              <p className="text-[#404040]">
                Submit securely, track progress in real-time, and control access
                with ease, ensuring smooth and organized document management.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="rounded-lg p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#4971bb"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#283f69]">
                    Secure Submissions
                  </h3>
                  <p className="text-[#404040]">
                    Submit documents safely through a secured portal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="rounded-lg p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#4971bb"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#283f69]">
                    Progress Tracking
                  </h3>
                  <p className="text-[#404040]">
                    Track the status and progress of documents throughout the
                    process.
                  </p>
                </div>
              </div>

              {/* Database backups */}
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="rounded-lg p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#4971bb"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#283f69]">
                    Controlled Access
                  </h3>
                  <p className="text-[#404040]">
                    Manage permissions to ensure only authorized users can view
                    or approve documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/features.jpg"
              alt="feature"
              className="w-full h-auto rounded-tr-[200px] object-cover"
            />
          </div>
        </div>
      </div>

      <footer className="w-full bg-[#0B0F17] text-white">
        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-medium mb-4 max-w-2xl mx-auto">
            Take control of your <br />
            documents
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Secure, accessible, and reliable document tracking system.
          </p>
          <button className="px-6 py-2 bg-[#82f4e5]  text-gray-700 font-bold rounded-tl-3xl transition-colors">
            Get started
          </button>
        </div>

        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Solutions Column */}
            <div>
              <h3 className="font-medium mb-6">Features</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Secure tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Real-time updates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Workflow automation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Seamless collaboration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-medium mb-6">Our company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="font-medium mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Submit ticket
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-medium mb-6">Terms and Policies</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Sentinel, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaFacebook />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaInstagramSquare />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaXTwitter />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaGithub />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaYoutube />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
