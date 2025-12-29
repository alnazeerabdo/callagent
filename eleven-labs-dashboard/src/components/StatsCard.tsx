import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
    return (
        <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1 opacity-80">{description}</p>
                )}
            </div>
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
                <Icon size={24} />
            </div>
        </div>
    )
}
