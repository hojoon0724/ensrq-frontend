import About from "./components/sections/00-about";
import TypographyTestSection from "./components/sections/99-typography-test";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start bg-slate-300">
      <TypographyTestSection />
      <About />
      <section className="bg-slate-500">
        <div>stuff</div>
      </section>
      <section className="bg-slate-100">
        <div>stuff</div>
      </section>
    </main>
  );
}
