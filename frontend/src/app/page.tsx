import H1 from "@/components/H1";
import Container from "@/components/Container";
import Background from "@/components/ui/Background";
import BlurFade from "@/components/ui/blur-fade";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center p-20">
      <BlurFade duration={0.7} className="flex flex-col items-center">
        <H1>/kllcht</H1>

        <div>
          <Container />
        </div>
        <Footer />
      </BlurFade>
    </main>
  );
}
