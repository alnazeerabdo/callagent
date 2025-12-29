import { LayoutDashboard, Calendar, Heart, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation()
    const pathname = location.pathname

    const items = [
        { title: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
        { title: 'طلبات الاجتماع', href: '/meetings', icon: Calendar },
        { title: 'المهتمين', href: '/leads', icon: Heart },
        { title: 'سجل المكالمات', href: '/calls', icon: Phone },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-l bg-card", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        ElevenLabs Agent
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                                    pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
