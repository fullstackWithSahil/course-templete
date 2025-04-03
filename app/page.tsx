import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Code, BookOpen, Users, Trophy } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Web Development",
      description: "Learn the latest technologies including React, Next.js, and modern CSS frameworks"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Project-Based Learning",
      description: "Build real-world projects that you can add to your portfolio"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Support",
      description: "Join our active community of developers and get help when you need it"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Industry-Ready Skills",
      description: "Graduate with the skills employers are actively seeking"
    }
  ];

  const curriculum = [
    "HTML5 & Modern CSS Techniques",
    "JavaScript Fundamentals to Advanced",
    "React & Next.js Development",
    "Backend Integration & APIs",
    "Deployment & DevOps Basics",
    "Portfolio Building"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Master Web Development
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Learn to build modern web applications from scratch. Join thousands of successful graduates
              who have transformed their careers through our comprehensive course.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="px-8">
                Enroll Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose Our Course?
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Course Curriculum
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A comprehensive curriculum designed to take you from beginner to professional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
            Ready to Start Your Journey?
          </h2>
          <Button size="lg" variant="secondary" className="px-8">
            Enroll Now
          </Button>
        </div>
      </section>
    </div>
  );
}