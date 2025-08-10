import { TopContainer } from "@/components/sections";

export function SectionGrid({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <TopContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-s p-s">{children}</TopContainer>
    </section>
  );
}
