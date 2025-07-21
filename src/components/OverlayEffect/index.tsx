import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const OverlayEffect = ({ isChangingRoute }: { isChangingRoute: boolean }) => {
    return (
        <>
            {/* Overlay effect to change route */}
            <AnimatePresence>
                {isChangingRoute && (
                    <motion.div
                        initial={{ opacity: 1, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-0 left-0 w-full h-full bg-white z-[999]"
                    ></motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default OverlayEffect;
