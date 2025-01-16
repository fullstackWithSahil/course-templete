import logo from "@/assets/logo.png";
import Card from "@/components/CourseCard";

export default function Page() {
  return (
    <main className="my-24 px-4">
      <Card 
        title="Web development" 
        description="ffffffffffffffffffffffffffffff" 
        logo={logo} 
        id={30}
        watch={false}
        />
      <Card 
        title="Web development" 
        description="ffffffffffffffffffffffffffffff" 
        logo={logo} 
        id={30}
        watch={false}
        />
      <Card 
        title="Web development" 
        description="ffffffffffffffffffffffffffffff" 
        logo={logo} 
        id={30}
        watch={false}
        />
      <Card 
        title="Web development" 
        description="ffffffffffffffffffffffffffffff" 
        logo={logo} 
        id={30}
        watch={false}
      />
    </main>
  );
}