import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Sparkles, Code } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-slate-700 mb-4">ThinkChain: AI-Powered App Development</h1>
            <p className="text-lg text-slate-500 mb-8 max-w-3xl mx-auto">
              Harness the power of multiple LLMs to refine your app concept and generate optimized build instructions
              for AI-assisted web builders.
            </p>
            <Link href="/concept">
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6 py-3 text-lg">
                Get Started <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-700 text-center mb-12">Why Use ThinkChain?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-md rounded-lg">
                <CardHeader className="pb-2">
                  <BrainCircuit className="h-12 w-12 text-indigo-500 mb-2" />
                  <CardTitle className="text-xl font-semibold text-slate-700">AI-Powered Concept Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Generate unique, marketable app ideas using advanced language models that understand market trends
                    and user needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md rounded-lg">
                <CardHeader className="pb-2">
                  <Sparkles className="h-12 w-12 text-indigo-500 mb-2" />
                  <CardTitle className="text-xl font-semibold text-slate-700">LLM Chain Refinement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Iteratively enhance your concept through a chain of specialized LLMs that optimize for viability,
                    uniqueness, and usability.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md rounded-lg">
                <CardHeader className="pb-2">
                  <Code className="h-12 w-12 text-indigo-500 mb-2" />
                  <CardTitle className="text-xl font-semibold text-slate-700">Optimized Build Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Receive formatted, ready-to-use instructions for AI web builders like v0.dev or bolt.new with clear
                    UI, functionality, and styling details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-700 text-center mb-12">How ThinkChain Works</h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-500 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Enter Your Concept</h3>
                <p className="text-slate-600">Start with a simple idea or description of the app you want to build.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-500 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">AI Refinement</h3>
                <p className="text-slate-600">
                  Watch as multiple LLMs analyze, refine, and enhance your concept in real-time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-500 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Get Build Instructions</h3>
                <p className="text-slate-600">Receive detailed, structured instructions ready for AI web builders.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} ThinkChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
