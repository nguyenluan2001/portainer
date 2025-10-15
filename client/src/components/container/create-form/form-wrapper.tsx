import classNames from "classnames"
import type { FC, ReactNode } from "react"

interface Props {
    isActive: boolean,
    children: ReactNode
}
const FormWrapper: FC<Props> = ({ isActive, children }) => {
    return <div className={
        classNames({
            'hidden': !isActive
        })
    }>
        {children}
    </div>
}
export default FormWrapper