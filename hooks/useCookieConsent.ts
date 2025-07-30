"use client";
import { useState, useEffect } from "react";

type CookieConsentValue = "accepted" | "rejected" | null;

interface UseCookieConsentReturn {
  isVisible: boolean;
  consentValue: CookieConsentValue;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
}

export const useCookieConsent = (): UseCookieConsentReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [consentValue, setConsentValue] = useState<CookieConsentValue>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem(
      "cookie_consent"
    ) as CookieConsentValue;

    if (cookieConsent) {
      setConsentValue(cookieConsent);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setConsentValue("accepted");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setConsentValue("rejected");
    setIsVisible(false);
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie_consent");
    setConsentValue(null);
    setIsVisible(true);
  };

  return {
    isVisible,
    consentValue,
    acceptCookies,
    rejectCookies,
    resetConsent,
  };
};
