
interface ListWrapperProps {
    children: React.ReactNode;
}

import React from 'react'

export default function ListWrapper({children}: ListWrapperProps) {
  return (
    /* shrink-0 ayuda a cuando el elemento se empieza a enconjer */
    <li className='shrink-0 h-full w-[272px] select-none'>
        {children}
    </li>
  )
}
