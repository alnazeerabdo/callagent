import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-').replace('/10', '')} style={{ opacity: 1 }} />
            </div>
        </div>
    )
}
