import type { Metadata } from "next";
import AboutUsBento from "@/components/home/aboutUs";

export const metadata: Metadata = {
  title: "IEEE Student Branch - SLTC",
  description: "IEEE Student Branch Chapter at SLTC - Latest events, blogs, and activities",
};
import ContactUs from "@/components/home/contactUs";
import Footer from "@/components/home/footer";
import JoinUs from "@/components/home/joinUs";
import LandingPage from "@/components/home/landingPage";
import OrganizationUnits from "@/components/home/organizationUnits";
import StatsSection from "@/components/home/statsSection";
import { TopNav } from "@/components/home/topNav";

export default function Home() {
  return (
    <div>
      <TopNav />
      <LandingPage />
      <AboutUsBento />
      <JoinUs />
      <StatsSection />
      <OrganizationUnits />
      <ContactUs />
      <Footer />
    </div>
  );
}
