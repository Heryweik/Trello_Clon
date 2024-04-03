//Ayuda con los metadatos de la pagina
import {startCase} from 'lodash'

import OrgControl from './_components/org-control'
import { auth } from '@clerk/nextjs'
import { title } from 'process'


export async function generateMetadata() {
  const {orgSlug} = auth()

  /* En el favicon genera el nombre de la organizacion mas el nombre de la web */
  return {
    title: startCase(orgSlug || 'Organization'),
  }
}


export default function OrganizacionIdLayout({ children }: { children: React.ReactNode}) {
  return (
    <>
        <OrgControl />
        {children}
    </>
  )
}
