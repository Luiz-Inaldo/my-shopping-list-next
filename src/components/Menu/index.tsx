import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MenuIcon } from 'lucide-react'
import { User } from '@supabase/supabase-js'

const Menu = ({ user }: { user: User | null }) => {



    return (
        <React.Fragment>
            <Sheet>
                <SheetTrigger>
                    <MenuIcon size={20} />
                </SheetTrigger>
                <SheetContent side={'left'}>
                    <SheetHeader>
                        <SheetTitle className='text-left pb-2 border-b text-subtitle flex items-end gap-2'>
                            <Avatar className='avatar-shadow-minor'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            Olá, {user?.user_metadata.name}
                        </SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </React.Fragment>
    )
}

export default Menu