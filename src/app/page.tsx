import React from 'react';
import { ArrowRight, Code, Users, Trophy, Star, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  const features = [
    { title: "Modern Curriculum", description: "Learn the latest frameworks and tools used in industry", icon: Code },
    { title: "Live Support", description: "Get help from experienced developers in real-time", icon: Users },
    { title: "Project-Based", description: "Build real-world applications as you learn", icon: Trophy }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Junior Developer",
      content: "This course helped me transition from a complete beginner to landing my first dev role.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Freelancer",
      content: "The project-based approach really helped me understand how to build real applications.",
      rating: 5
    }
  ];

  const curriculum = [
    "HTML5, CSS3, and Modern JavaScript",
    "React.js and Next.js Framework",
    "Backend Development with Node.js",
    "Database Design and Management",
    "API Development and Integration",
    "Deployment and DevOps Basics"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-accent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Web Development
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            From Zero to Full-Stack Developer: A Complete Learning Journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Curriculum
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose This Course?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="w-8 h-8 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Course Curriculum
          </h2>
          <div className="grid gap-4">
            {curriculum.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-card-foreground">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Web Development Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of successful developers who have transformed their careers through our comprehensive curriculum.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Enroll Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;