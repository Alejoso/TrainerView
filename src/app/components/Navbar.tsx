"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 w-full z-50 px-8 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
          {/* Logo Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:shadow-cyan-500/30"
          >
            <span className="text-white font-bold text-sm">TV</span>
          </motion.div>

          {/* Logo Text */}
          <span className="text-white font-semibold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:brightness-125 transition">
            TrainerView
          </span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;