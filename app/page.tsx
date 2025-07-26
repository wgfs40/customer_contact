"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // This effect runs only once when the component mounts
    console.log("Page component mounted");
    router.push("/home");
  }, [router]);
  return <div>page</div>;
};

export default Page;
