"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

interface SubscriptionStatusProps {
  userId?: string
}

export default function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch user's subscription status
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`/api/user/subscription?userId=${userId}`)
        const data = await response.json()
        setSubscription(data)
      } catch (error) {
        console.error("Error fetching subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchSubscription()
    } else {
      setIsLoading(false)
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    )
  }

  if (!subscription || subscription.status !== "active") {
    return (
      <Link href="/pricing">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
        <Crown className="w-3 h-3" />
        <span>Pro</span>
      </div>
      <Link href="/billing">
        <Button variant="outline" size="sm" className="bg-transparent">
          Manage
        </Button>
      </Link>
    </div>
  )
}
