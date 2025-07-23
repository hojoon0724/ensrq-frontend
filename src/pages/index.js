import About from "@/components/sections/00-about";
import OklchColorTest from "@/components/test-sections/99-oklch-color-test";
import TypographyTestSection from "@/components/test-sections/99-typography-test";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start bg-gray-500">
      <OklchColorTest />
      <TypographyTestSection />
      <About />
      
    </main>
  );
}
