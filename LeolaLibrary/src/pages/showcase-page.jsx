import { Link } from "wouter";
import { Navbar } from "@/components/navigation/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/particles/ParticleBackground";

type WebsiteExample = {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  previewImage?: string;
};

const websiteExamples: WebsiteExample[] = [
  {
    id: "pda",
    name: "Pro Driver Academy",
    description: "Professional CDL training academy website with comprehensive course information and student portal.",
    url: `${window.location.origin}/projects/pro-driver-academy`,
    tags: ["Education", "Professional", "Portal"],
  },
  // More examples can be added here
];

export default function ShowcasePage() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <div className="content-layer">
        <Navbar />
        <main className="container mx-auto p-4 pt-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Rapid Web Developer
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create professional websites instantly with our innovative drag-and-drop platform. 
                Scan QR codes to preview live demos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteExamples.map((website) => (
                <div key={website.id} className="perspective">
                  <motion.div
                    className="relative w-full h-[400px]"
                    animate={{ rotateY: flippedCard === website.id ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front of card (QR Code) */}
                    <Card className="absolute w-full h-full backface-hidden glass">
                      <CardHeader>
                        <CardTitle className="text-primary">{website.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <QRCodeSVG 
                            value={website.url} 
                            size={200}
                            includeMargin={true}
                          />
                        </div>
                        <p className="text-muted-foreground">{website.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {website.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-primary/20 transition-colors"
                          onClick={() => setFlippedCard(website.id)}
                        >
                          Preview Website
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Back of card (Website Preview) */}
                    <Card 
                      className="absolute w-full h-full backface-hidden glass"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <CardHeader>
                        <CardTitle className="text-primary">Website Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video bg-muted rounded-lg">
                          {/* Preview iframe or image would go here */}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-primary/20 transition-colors"
                          onClick={() => setFlippedCard(null)}
                        >
                          Show QR Code
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}