import type { FC } from "react";

interface Props {
    title: string,
    description?: string,
    children: React.ReactNode
}
const Layout: FC<Props> = ({ title, description, children }) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-3xl font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="w-full grow h-[100px]">{children}</div>
        </div>
    )
}
export default Layout;