import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"

interface PricingCardProps {
  plan: {
    name: string
    price: number
    period: string
    description: string
    features: string[]
    buttonText: string
    buttonVariant: "default" | "outline"
    popular: boolean
  }
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`relative bg-white border rounded-lg p-8 ${
        plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>
        <Button
          className={`w-full ${plan.buttonVariant === "default" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          variant={plan.buttonVariant}
          size="lg"
        >
          {plan.buttonText}
        </Button>
      </div>

      <div className="space-y-4">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
