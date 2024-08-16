"use client";

import { motion } from "framer-motion";

interface TemplateProps {
    children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                ease: "easeInOut",
                duration: 0.5,
            }}
        >
            {children}
        </motion.div>
    );
}
