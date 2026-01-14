import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;