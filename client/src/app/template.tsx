"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export interface RootTemplateProps {
    children: React.ReactNode;
}

export default function Template({ children }: RootTemplateProps) {
    const controls = useAnimation();

    useEffect(() => {
        const onLoad = async () => {
            await controls.start({ width: "100%" });
            await controls.start({ opacity: 0 });
        };

        onLoad();
    }, [controls]);

    return (
        <div>
            <motion.div
                className="p-0.5 bg-primary absolute top-0 left-0"
                onLoad={() => controls.start({ width: "100%" })}
                initial={{ width: "0%" }}
                animate={controls}
                transition={{ duration: 0.5 }}
            />
            {children}
        </div>
    );
}
