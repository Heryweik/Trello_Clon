import { OrganizationProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  return (
    <div className='w-full overflow-auto'>
        <OrganizationProfile 
            appearance={{
                elements: {
                    rootBox: {
                        boxShadow: "none",
                    },
                    card: {
                        border: '1px solid #E5E5E5',
                        boxShadow: 'none',
                        width: '100%',
                    }
                }
            }}
        />
    </div>
  )
}
