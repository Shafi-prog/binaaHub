'use client'
import React, { useEffect, useState } from 'react'

const Map = ({ setAddress }: { setAddress: React.Dispatch<React.SetStateAction<string>> }) => {
  const [map, setMap] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ✅ تحقق أن الكود يعمل فقط بالبراوزر
      const loadGoogleMaps = () => {
        if (window.google) {
          initMap()
        } else {
          const script = document.createElement('script')
          script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`
          script.async = true
          script.defer = true
          script.onload = () => initMap()
          document.head.appendChild(script)
        }
      }

      const initMap = () => {
        const mapInstance = new window.google.maps.Map(
          document.getElementById('map') as HTMLElement,
          {
            center: { lat: 24.7136, lng: 46.6753 }, // Riyadh Default
            zoom: 10,
          },
        )

        mapInstance.addListener('click', (e: any) => {
          const latLng = e.latLng
          setAddress(`${latLng.lat()}, ${latLng.lng()}`)
        })

        setMap(mapInstance)
      }

      loadGoogleMaps()
    }

    return () => {
      if (typeof window !== 'undefined' && map) {
        window.google.maps.event.clearListeners(map, 'click')
      }
    }
  }, [map, setAddress])

  return <div id="map" className="w-full h-64"></div>
}

export default Map
