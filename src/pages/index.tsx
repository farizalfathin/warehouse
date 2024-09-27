import DashCards from "@/components/DashCards";
import DashTitle from "@/components/DashTitle";

export default function Home() {
  return (
    <div className="max-w-7xl h-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Title */}
      <DashTitle />
      <DashCards />
    </div>
  );
}
