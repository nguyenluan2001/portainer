import type { FC } from "react"

interface Props {
    title: string,
    children: React.ReactNode
}
const Section: FC<Props> = ({ title, children }) => {
    return <div>
        <h3 className="text-sidebar-foreground/70 text-xs font-medium">{title}</h3>
        <div className="mt-2">
            {children}
        </div>
    </div>
}
export default Section