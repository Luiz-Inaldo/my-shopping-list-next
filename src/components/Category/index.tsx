import { ReactNode, useState } from "react";

interface ICategoryWrapperProps {
    children: (handleClick: () => void, open: boolean) => ReactNode;
    activeCondition: boolean;
}

const CategoryWrapper = ({
    children,
    activeCondition,
}: ICategoryWrapperProps) => {

    const [open, setOpen] = useState<boolean>(activeCondition);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            {children(handleClick, open)}
        </>
    )
};

export default CategoryWrapper;