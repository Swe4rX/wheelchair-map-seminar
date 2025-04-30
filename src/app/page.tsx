import dynamic from 'next/dynamic';

const LocationMapWrapper = dynamic(() => import('@/components/location-map-wrapper'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <LocationMapWrapper />
    </main>
  )
}