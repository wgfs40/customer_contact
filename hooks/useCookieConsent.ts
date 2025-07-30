"use client";
import { useState, useEffect } from "react";

type CookieConsentValue = "accepted" | "rejected" | null;

interface UseCookieConsentReturn {
  isVisible: boolean;
  consentValue: CookieConsentValue;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
  isMounted: boolean;
}

export const useCookieConsent = (): UseCookieConsentReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [consentValue, setConsentValue] = useState<CookieConsentValue>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsMounted(true);

    // Check if localStorage is available
    if (typeof window !== "undefined" && window.localStorage) {
      const cookieConsent = localStorage.getItem(
        "cookie_consent"
      ) as CookieConsentValue;

      if (cookieConsent) {
        setConsentValue(cookieConsent);
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  }, []);

  const acceptCookies = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("cookie_consent", "accepted");
    }
    setConsentValue("accepted");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("cookie_consent", "rejected");
    }
    setConsentValue("rejected");
    setIsVisible(false);
  };

  const resetConsent = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("cookie_consent");
    }
    setConsentValue(null);
    setIsVisible(true);
  };

  return {
    isVisible,
    consentValue,
    acceptCookies,
    rejectCookies,
    resetConsent,
    isMounted,
  };
};
