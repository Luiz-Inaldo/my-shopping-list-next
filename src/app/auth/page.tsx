"use client";
import LogInForm from "@/components/Auth/Login";
import RegisterForm from "@/components/Auth/Register";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export default function AuthPage() {
  const [currentForm, setCurrentForm] = useState<string>("login");

  return (
    <div className="bg-[#e9e9e9] max-w-[430px] h-screen flex flex-col items-center overflow-hidden space-y-5">
      <ul className="w-[240px] rounded-full flex items-center justify-between p-2 mt-4 shadow-md bg-white">
        <motion.li
          key="login"
          initial={false}
          onClick={() => setCurrentForm("login")}
          className={`w-1/2 relative text-center rounded-full px-5 py-1`}
        >
          <span className={`${currentForm === "login" ? "!text-snow" : "text-[#212121]"} relative z-[2] transition-colors delay-100`}>Entrar</span>
          {currentForm === "login" ? (
            <motion.div
              layoutId="background"
              id="background"
              className="absolute w-[112px] h-[32px] rounded-full top-0 z-[0] left-0 bg-default-green"
            />
          ) : null}
        </motion.li>
        <motion.li
          key="register"
          initial={false}
          onClick={() => setCurrentForm("register")}
          className={`relative w-1/2 text-center rounded-full px-5 py-1`}
        >
          <span className={`${currentForm === "register" ? "!text-snow" : "text-[#212121]"} relative z-[2] transition-colors delay-100`}>Cadastrar</span>
          {currentForm === "register" ? (
            <motion.div
              layoutId="background"
              id="background"
              className="absolute w-[112px] h-[32px] rounded-full top-0 z-[0] right-0 bg-default-green"
            />
          ) : null}
        </motion.li>
      </ul>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl leading-[1] px-20 text-center text-[#212121] font-semibold">
          {currentForm === "login"
            ? "Comece a organizar suas compras"
            : "Crie sua conta"}
        </h1>
        {currentForm === "login" ? (
          <p className="text-gray-500 text-sm">Faça login com sua conta</p>
        ) : (
          <p className="text-sm text-center text-gray-500">
            Já possui uma conta?{" "}
            <span
              onClick={() => setCurrentForm("login")}
              className="text-default-green cursor-pointer"
            >
              Faça login
            </span>
          </p>
        )}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {currentForm === "login" && (
          <motion.div
            key="login"
            transition={{
              duration: 0.5,
              delay: currentForm === "login" ? 0 : 0.6,
            }}
            initial={{ y: "50%" }}
            animate={{ y: "0%" }}
            exit={{ y: "50%" }}
            style={{
              width: "100%",
              minHeight: "900px",
            }}
          >
            <LogInForm setCurrentForm={setCurrentForm} />
          </motion.div>
        )}
        {currentForm === "register" && (
          <motion.div
            key="register"
            transition={{
              duration: 0.5,
              delay: currentForm === "register" ? 0 : 0.6,
            }}
            initial={{ y: "50%" }}
            animate={{ y: "0%" }}
            exit={{ y: "50%" }}
            style={{
              width: "100%",
              minHeight: "900px",
            }}
          >
            <RegisterForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
