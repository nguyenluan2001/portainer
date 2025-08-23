import { Menu } from "antd"
import Logo from "./logo"
import Section from "./section"
import { House } from "@phosphor-icons/react/dist/icons/House"
import { ImagesIcon, ShippingContainerIcon } from "@phosphor-icons/react"
import { useNavigate } from "@tanstack/react-router"

const Sidebar = () => {
    const navigate = useNavigate()
    const managementItems = [{
        key: '/',
        label: 'Dashboard',
        icon: <House />
    },
    {
        key: '/containers',
        label: 'Containers',
        icon: <ShippingContainerIcon />
    },
    {
        key: '/images',
        label: 'Images',
        icon: <ImagesIcon />
    }
    ]
    const onSelect = ({ key }: { key: string }) => {
        navigate({ to: key })
    }
    return (
        <div className="h-screen w-[255px] bg-sidebar">
            <Logo />
            <div className="px-4 mt-4">
                <Section title="Management">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={managementItems}
                        onSelect={onSelect}
                    />
                </Section>
            </div>
        </div>
    )
}
export default Sidebar