import { PDANavbar } from "@/components/navigation/PDANavbar";
import ExecutiveSummary from "@/components/portfolio/ExecutiveSummary";
import BusinessPlan from "@/components/portfolio/BusinessPlan";
import MarketingStrategy from "@/components/portfolio/MarketingStrategy";
import TeamStructure from "@/components/portfolio/TeamStructure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PDANavbar />
      <main className="container mx-auto p-4 pt-8">
        <Tabs defaultValue="executive-summary">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="business-plan">Business Plan</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Strategy</TabsTrigger>
            <TabsTrigger value="team">Team Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="executive-summary">
            <ExecutiveSummary />
          </TabsContent>

          <TabsContent value="business-plan">
            <BusinessPlan />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingStrategy />
          </TabsContent>

          <TabsContent value="team">
            <TeamStructure />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}