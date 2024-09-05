import H1 from "@/components/H1";
import Container from "@/components/Container";
import Background from "@/components/Background";
import BlurFade from "@/components/magicui/blur-fade";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex h-screen flex-col  items-center p-32 ">
      <BlurFade delay={0.5} className="flex flex-col items-center">
        <H1>kll/chat</H1>
        <Container /> <Footer />
      </BlurFade>
    </main>
  );
}
