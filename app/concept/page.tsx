"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightIcon, Lightbulb } from "lucide-react"

export default function ConceptPage() {
  const [concept, setConcept] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept.trim()) return

    setIsLoading(true)

    // Simulate processing time
    setTimeout(() => {
      // Store the concept in localStorage to access it in the refinement page
      localStorage.setItem("appConcept", concept)
      router.push("/refinement")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 text-center mb-8">What app would you like to build?</h1>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-slate-700">
              <Lightbulb className="h-6 w-6 text-indigo-500 mr-2" />
              Enter Your App Concept
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Describe your app idea in a few sentences. Include the purpose, target audience, and any key features
                you have in mind.
              </p>
              <Textarea
                placeholder="E.g., A fitness tracking app that uses AI to create personalized workout plans based on user goals and progress..."
                className="min-h-[150px] border-gray-300 rounded-lg p-3"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                required
              />

              <div className="mt-6">
                <h3 className="text-lg font-medium text-slate-700 mb-2">Example Prompts:</h3>
                <div className="space-y-2">
                  {[
                    "A social media app for book lovers to share and discuss their reading lists",
                    "A productivity tool that helps remote teams coordinate across time zones",
                    "A marketplace app connecting local farmers with restaurants",
                  ].map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition"
                      onClick={() => setConcept(example)}
                    >
                      <p className="text-slate-700">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={!concept.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Continue <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
