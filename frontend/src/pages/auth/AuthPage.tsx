import { motion } from "framer-motion";
import BaseAuth from "./Base";

export default function AuthPage() {
  return (
    <>
      <motion.div
        dir="rtl"
        transition={{ duration: 1 }}
        className="flex flex-col pargarX w-full md:p-10  rounded-4xl shadow-lg z-[90] relative overflow-hidden h-screen bg-content1 "
      >
        <BaseAuth bar={true} />
      </motion.div>
    </>
  );
}
