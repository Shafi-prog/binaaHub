import React, { useState, useEffect } from 'react'

const Map = ({ setAddress }: { setAddress: React.Dispatch<React.SetStateAction<string>> }) => {
  const [map, setMap] = useState<any>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      // التحقق من أن السكربت غير محمل بالفعل
      if (window.google) {
        initMap()
      } else {
        // تحميل سكربت Google Maps API
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => initMap() // بمجرد تحميل السكربت، نبدأ تهيئة الخريطة
        document.head.appendChild(script)
      }
    }

    const initMap = () => {
      // إنشاء خريطة جديدة
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.7136, lng: 46.6753 }, // Riyadh Default
        zoom: 10,
      })

      // إضافة حدث عند النقر على الخريطة لاختيار الموقع
      mapInstance.addListener('click', (e: any) => {
        const latLng = e.latLng
        setAddress(`${latLng.lat()}, ${latLng.lng()}`)
      })

      setMap(mapInstance)
    }

    // تحميل Google Maps عند الحاجة
    loadGoogleMaps()

    return () => {
      // تنظيف أي تغييرات عند فك الارتباط من المكون
      if (map) {
        window.google.maps.event.clearListeners(map, 'click')
      }
    }
  }, [map, setAddress]) // تتبع تغيير الخريطة

  return <div id="map" className="w-full h-64"></div>
}

export default Map
