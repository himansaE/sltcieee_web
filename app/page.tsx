import type { Metadata } from "next";
import AboutUsBento from "@/components/home/aboutUs";

export const metadata: Metadata = {
  title: "IEEE Student Branch - SLTC",
  description: "IEEE Student Branch Chapter at SLTC - Latest events, blogs, and activities",
};
import ContactUs from "@/components/home/contactUs";
import Footer from "@/components/home/footer";
import JoinUs from "@/components/home/joinUs";
import OrganizationUnits from "@/components/home/organizationUnits";
import StatsSection from "@/components/home/statsSection";
import { TopNav } from "@/components/home/topNav";
import ActiveHero from "@/components/home/ActiveHero";

export default async function Home() {
  return (
    <div>
      <TopNav />
      <ActiveHero />
      <AboutUsBento />
      <JoinUs />
      <StatsSection />
  <OrganizationUnits />
      <ContactUs />
      <Footer />
    </div>
  );
}
