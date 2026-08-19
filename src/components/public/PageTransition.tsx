import { ReactNode } from 'react';
import { motion } from 'motion/react';

export function PageTransition({ children }: { children: ReactNode }) {
  return <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3,ease:'easeOut'}} className="flex flex-col flex-grow w-full">{children}</motion.div>;
}
