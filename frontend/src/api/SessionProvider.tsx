import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { addToast, Image } from "@heroui/react";
import SessionContext, { type Session } from "./SessionContext";
import { APPLICATION_TITLE } from "./Setting";
import apiClient from "./ApiClient";

interface Props {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  name?: string;
  email?: string;
  image?: string;
}

const SessionProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const location = useLocation();
  const fetchSessionData = async () => {
    try {
      const res = await apiClient.get("/auth/verify");
      if (res.status === 200) {
        if (res.data.state == "Paid") {
          const res2 = await apiClient.get("/evidence");
          setSession({ ...res.data, evidenceStatus: res2.data.status });
        } else {
          setSession(res.data);
        }
      } else {
        // Optional: handle non-200 responses
        localStorage.removeItem("access");
        nav(
          `/auth?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        );
      }
    } catch (err) {
      // Redirect if error occurs
      localStorage.removeItem("access");
      nav(`/auth?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    session?.state && fetchSessionData();
  }, [location.pathname]);
  useEffect(() => {
    if (!loading && session) {
      if (session.role === "ADMIN") {
        // admin فقط می‌تونه تو /admin باشه
        if (location.pathname !== "/admin") {
          nav("/admin", { replace: true });
        }
      } else {
        // user عادی نباید دسترسی به /admin داشته باشه
        if (location.pathname.startsWith("/admin")) {
          nav("/", { replace: true }); // یا یه صفحه 403/NotAllowed
        }
      }
    }
  }, [session, location.pathname, loading]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          fetchSessionData();
        } else {
          addToast({
            title: APPLICATION_TITLE,
            description: "توکن امتینی شما منقضی شده دوباره وارد شوید.",
            color: "warning",
          });
          localStorage.removeItem("access");
          nav(
            `/auth?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          );
        }
      } catch (err) {
        nav(
          `/auth?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        );
      }
    } else {
      if (location.pathname !== "auth")
        nav(
          `/auth?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        );
    }
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Image
          src={Logo}
          classNames={{ wrapper: "max-h-full object-cover !max-w-full" }}
          alt={`لوگوی ${APPLICATION_TITLE}`}
        />
      </div>
    );
  }
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
