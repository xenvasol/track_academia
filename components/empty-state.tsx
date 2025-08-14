"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="text-center py-12">
        {icon && <div className="mb-4 flex justify-center text-gray-400">{icon}</div>}
        <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-black text-white hover:bg-gray-800">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
