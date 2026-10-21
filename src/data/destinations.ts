import { Destination } from '../types/tourism.js';

export const DESTINATIONS: Destination[] = [
  // ==========================================
  // MAHARASHTRA DESTINATIONS
  // ==========================================
  {
    id: 'pune-sinhagad-shaniwarwada',
    name: 'Pune Heritage & Sinhagad Fort',
    localName: 'पुणे – शनिवार वाडा व सिंहगड',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    region: 'West',
    categories: ['fort', 'historical', 'food', 'family'],
    description: 'The cultural capital of Maharashtra, celebrated for the Maratha citadel of Shaniwar Wada, the hilltop fortress of Sinhagad overlooking the Sahyadris, the revered Dagdusheth Ganpati, and the historic Aga Khan Palace where Mahatma Gandhi was interned.',
    significance: 'Seat of the Peshwas of the Maratha Empire. Sinhagad witnessed Tanaji Malusare’s legendary battle in 1670, immortalized in Marathi folklore as "Gad aala pan sinh gela" (We won the fort, but lost the lion).',
    bestTimeToVisit: 'July to February (Pleasant winter breezes and monsoon mist)',
    entryFee: {
      value: '₹25 for Indian nationals, ₹300 for foreign tourists (Shaniwar Wada); Sinhagad toll ₹50 per four-wheeler.',
      isVerified: true,
      note: 'ASI tickets can also be booked online via QR codes at monument entrances.'
    },
    timings: {
      value: 'Shaniwar Wada: 9:30 AM – 5:30 PM; Sinhagad Fort: 6:00 AM – 6:00 PM',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Climb Sinhagad early morning (before 8 AM) to catch rolling fog over Khadakwasla Dam.',
      'Savor authentic rustic food cooked on earthen chulhas inside Sinhagad fort.',
      'Take a stroll down FC Road (Fergusson College Road) in the evening for street shopping and snacks.'
    ],
    localFood: [
      { name: 'Kanda Bhaji & Pithla Bhakri', description: 'Freshly fried hot onion pakodas with piping hot besan pithla and jowar/bajra bhakri at Sinhagad Fort.', isVegetarian: true },
      { name: 'Puneri Misal', description: 'Spicy sprouted lentil curry topped with farsan, chopped onions, and lemon, served with buttered ladi pav (Katakirr or Bedekar Misal).', isVegetarian: true },
      { name: 'Sujata Mastani', description: 'Pune’s trademark thick ice-cream milkshake garnished with dry fruits and tutty-fruity.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Aga Khan Palace', distanceKm: 8.5, category: 'historical' },
      { name: 'Dagdusheth Halwai Ganpati', distanceKm: 2.1, category: 'temple' },
      { name: 'Khadakwasla Dam', distanceKm: 14.0, category: 'nature' }
    ],
    coordinates: { lat: 18.5196, lng: 73.8553 },
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Mumbai', 'Nashik', 'Satara', 'Kolhapur'],
    rating: 4.8,
    reviewsCount: 3420
  },
  {
    id: 'mumbai-gateway-marine-drive',
    name: 'Mumbai Iconic Coast & Elephanta Caves',
    localName: 'मुंबई – गेटवे ऑफ इंडिया व मरीन ड्राईव्ह',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    region: 'West',
    categories: ['historical', 'beach', 'food', 'family'],
    description: 'The bustling City of Dreams featuring Indo-Saracenic Gateway of India, the Arabian Sea curve of Queen’s Necklace (Marine Drive), the UNESCO rock-cut Shiva sculptures on Elephanta Island, and Chhatrapati Shivaji Maharaj Terminus.',
    significance: 'Historic commercial nerve of modern India. The Gateway commemorates the 1911 royal visit, while Elephanta Caves date back to the 5th–7th century AD showcasing sublime Hindu cave iconography.',
    bestTimeToVisit: 'November to February (Mild weather and gentle sea breezes)',
    entryFee: {
      value: 'Gateway of India: Free; Elephanta Caves: ₹40 Indian nationals, ₹600 Foreigners; Return ferry: ~₹260',
      isVerified: true
    },
    timings: {
      value: 'Gateway & Marine Drive: Open 24 Hours; Elephanta Ferry: 9:00 AM – 3:30 PM (Closed Mondays)',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Board the morning ferry from Gateway to Elephanta to avoid noon sea heat.',
      'Spend sunset walking along Marine Drive promenade with roasted bhutta (corn).',
      'Wear comfortable slip-on shoes for temple and ferry boarding.'
    ],
    localFood: [
      { name: 'Mumbai Vada Pav', description: 'Crisp batata vada tucked inside soft pav with spicy garlic thecha and green chutney.', isVegetarian: true },
      { name: 'Juhu Beach Pav Bhaji', description: 'Mashed buttery spiced vegetables sizzled on large iron tawas, served with toasted pav.', isVegetarian: true },
      { name: 'Bombay Duck (Bombil Fry)', description: 'Crispy rava-fried coastal fish with a tender interior, served with tangy solkadhi.', isVegetarian: false }
    ],
    nearbyAttractions: [
      { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', distanceKm: 2.8, category: 'historical' },
      { name: 'Colaba Causeway Flea Market', distanceKm: 1.2, category: 'food' },
      { name: 'Sanjay Gandhi National Park & Kanheri Caves', distanceKm: 34.0, category: 'nature' }
    ],
    coordinates: { lat: 18.9220, lng: 72.8347 },
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Pune', 'Nashik', 'Surat'],
    rating: 4.9,
    reviewsCount: 5120
  },
  {
    id: 'nashik-trimbakeshwar-vineyards',
    name: 'Nashik Spiritual Trail & Sula Vineyards',
    localName: 'नाशिक – त्र्यंबकेश्वर व द्राक्षनगरी',
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    region: 'West',
    categories: ['temple', 'nature', 'food', 'family'],
    description: 'The wine capital of India that blends timeless spirituality along the sacred Godavari River. Visit the Trimbakeshwar Jyotirlinga nestled at the base of Brahmagiri Hill, the sacred Ramkund in Panchavati, ancient Pandavleni Caves, and lush vineyards.',
    significance: 'Trimbakeshwar hosts one of the 12 sacred Jyotirlingas with three faces representing Brahma, Vishnu, and Rudra. Panchavati is where Lord Rama, Sita, and Lakshmana spent years in exile.',
    bestTimeToVisit: 'September to March (Pleasant harvest season and post-monsoon greenery)',
    entryFee: {
      value: 'Trimbakeshwar General Darshan: Free; Sula Vineyards tour & tasting: ₹400 – ₹1000',
      isVerified: true
    },
    timings: {
      value: 'Trimbakeshwar Temple: 5:30 AM – 9:00 PM; Vineyards: 11:30 AM – 7:00 PM',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Book VIP Darshan pass online if visiting Trimbakeshwar on Mondays or festive weekends.',
      'Plan vineyard visits during early afternoon followed by wine tasting at sunset.',
      'Climb the 300 steps of Pandavleni Caves in early morning for panoramic Nashik valley views.'
    ],
    localFood: [
      { name: 'Nashik Chulivarchi Misal', description: 'Slow-cooked misal with black spicy rassa (tarri), served with roasted onions, farsan, and thick curd (Sadhana or Shamsundar).', isVegetarian: true },
      { name: 'Sayantara Sabudana Vada', description: 'Iconic Bhadrakali market golden-crispy sabudana vadas served with peanut curd chutney.', isVegetarian: true },
      { name: 'Poha Jalebi', description: 'Fluffy tempered flattened rice paired with crispy saffron jalebis.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Anjaneri Hill (Hanuman Birthplace)', distanceKm: 18.0, category: 'adventure' },
      { name: 'Harihar Fort', distanceKm: 38.0, category: 'fort' },
      { name: 'Bhandardara Lake & Wilson Dam', distanceKm: 65.0, category: 'waterfall' }
    ],
    coordinates: { lat: 19.9975, lng: 73.7898 },
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Mumbai', 'Pune', 'Dhule', 'Aurangabad'],
    rating: 4.7,
    reviewsCount: 2890
  },
  {
    id: 'nagpur-deekshabhoomi-pench',
    name: 'Nagpur Heritage, Deekshabhoomi & Tiger Trail',
    localName: 'नागपूर – दीक्षाभूमी व व्याघ्र राजधानी',
    city: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    region: 'West',
    categories: ['historical', 'nature', 'food'],
    description: 'The Orange City and the geographical Zero Mile center of India. Famous for the magnificent stupa of Deekshabhoomi, Sitabuldi Fort, peaceful Futala Lake, and serving as the global gateway to India’s premier tiger sanctuaries.',
    significance: 'Deekshabhoomi is the sacred site where Dr. B.R. Ambedkar embraced Buddhism with over 500,000 followers on Ashoka Vijaya Dashami in 1956. The stupa is the largest hollow stupa in Asia.',
    bestTimeToVisit: 'October to March (Cool winters ideal for heritage walks & jungle safaris)',
    entryFee: {
      value: 'Deekshabhoomi: Free; Sitabuldi Fort: Free (Open on select national holidays); Lake: Free',
      isVerified: true
    },
    timings: {
      value: 'Deekshabhoomi: 6:00 AM – 8:00 PM; Futala Lake: Open round the clock',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Taste fresh Nagpur oranges and orange burfi from iconic local sweet shops.',
      'Head to Futala Lake promenade around dusk for illuminated fountains and street eats.',
      'Book your tiger safari in nearby Pench National Park or Tadoba 60 days in advance.'
    ],
    localFood: [
      { name: 'Nagpur Tarri Poha', description: 'Steamed poha drenched in fiery spiced black chana curry (tarri), crowned with sev and sliced raw onions.', isVegetarian: true },
      { name: 'Saoji Mutton / Saoji Paneer', description: 'Legendary fiery Saoji cuisine prepared with hand-pounded 32-spice masala blend unique to Vidarbha.', isVegetarian: false },
      { name: 'Orange Burfi', description: 'Citrus-infused mawa fudge made from sweet seasonal Nagpur oranges.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Pench Tiger Reserve', distanceKm: 85.0, category: 'nature' },
      { name: 'Ramtek Fort Temple', distanceKm: 48.0, category: 'temple' },
      { name: 'Zero Mile Stone Monument', distanceKm: 2.0, category: 'historical' }
    ],
    coordinates: { lat: 21.1458, lng: 79.0882 },
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Amravati', 'Raipur', 'Bhopal', 'Wardha'],
    rating: 4.6,
    reviewsCount: 1780
  },
  {
    id: 'shirpur-khandesh-educational-oasis',
    name: 'Shirpur Model Town & Karwand Dam',
    localName: 'शिरपूर – खान्देशचे सुवर्ण शहर व करवंद धरण',
    city: 'Shirpur',
    district: 'Dhule',
    state: 'Maharashtra',
    region: 'West',
    categories: ['hidden_gem', 'nature', 'food', 'family'],
    description: 'A progressive oasis in northern Maharashtra famous for its innovative water-conservation "Shirpur Pattern", the tranquil Karwand Dam on the Arunavati River, Priyadarshani Sahakari Soot Girni textile co-op, and modern academic campuses set against peaceful Khandesh agricultural beauty.',
    significance: 'Pioneer of the revolutionary Shirpur Water Conservation Pattern created by Shri Suresh Khanapurkar, which raised groundwater tables across arid regions. Also a vital trade center on NH-52 connecting Maharashtra and Madhya Pradesh.',
    bestTimeToVisit: 'July to February (Pleasant weather; dam reservoirs full during monsoon)',
    entryFee: {
      value: 'Karwand Dam: Free; Balaji Temple: Free; Local public visits: Free',
      isVerified: true,
      note: 'Entry to campuses and dam viewpoints is free for visitors.'
    },
    timings: {
      value: 'Karwand Dam Viewpoint: 7:00 AM – 6:30 PM; Shirpur Balaji Temple: 6:00 AM – 8:30 PM',
      isVerified: true
    },
    visitDuration: '1 day trip',
    travelTips: [
      'Take a family drive to Karwand Dam at sunset for cool breezes and lakeside views.',
      'Visit the Sri Balaji Temple inside the city, modeled after Tirupati Balaji.',
      'Try authentic Khandeshi Shev Bhaji with bajra bhakri at local dhabas along the highway.'
    ],
    localFood: [
      { name: 'Khandeshi Shev Bhaji', description: 'Crisp thick gram-flour shev simmered in fiery red coconut-garlic gravy (kala/lal rassa).', isVegetarian: true },
      { name: 'Mande (Puranpoli on Khapra)', description: 'Traditional paper-thin Khandeshi puranpoli hand-stretched and baked on inverted earthen pots (khapra).', isVegetarian: true },
      { name: 'Kala Masala Baingan Bharta', description: 'Roasted local eggplant mashed with fresh green garlic, peanuts, and roasted sesame.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Tapi River Bridge & Ghats', distanceKm: 18.0, category: 'nature' },
      { name: 'Laling Fort & Dhule City', distanceKm: 52.0, category: 'fort' },
      { name: 'Songir Fort & Copper Craft', distanceKm: 34.0, category: 'historical' },
      { name: 'Toranmal Hill Station', distanceKm: 98.0, category: 'hill_station' }
    ],
    coordinates: { lat: 21.3508, lng: 74.8805 },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: false,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Dhule', 'Jalgaon', 'Nashik', 'Indore'],
    rating: 4.6,
    reviewsCount: 840
  },
  {
    id: 'dhule-laling-songir-heritage',
    name: 'Dhule Heritage, Laling Fort & Rajwade Museum',
    localName: 'धुळे – लालिंग किल्ला व राजवाडे संशोधन मंडळ',
    city: 'Dhule',
    district: 'Dhule',
    state: 'Maharashtra',
    region: 'West',
    categories: ['fort', 'historical', 'hidden_gem', 'food'],
    description: 'The historic gateway to Khandesh, famous for the rugged clifftop ruins of Laling Fort, Songir Fort with ancient copper smithing traditions, the treasure trove of historical manuscripts at VK Rajwade Sanshodhan Mandal, and scenic Nakane Lake.',
    significance: 'Laling Fort was an ancient Farooqi Sultanate and Maratha stronghold overlooking the strategic Thalner-Agra pass. The Rajwade Museum preserves over 30,000 priceless ancient manuscripts and Maratha-era historical letters.',
    bestTimeToVisit: 'October to February (Cool winter breezes; great for climbing Laling hill)',
    entryFee: {
      value: 'Laling Fort: Free; Rajwade Research Museum: ₹20 nominal fee',
      isVerified: true
    },
    timings: {
      value: 'Laling Fort: Sunrise to Sunset; Rajwade Museum: 10:30 AM – 5:30 PM (Closed Sundays)',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Begin the trek to Laling Fort before 8:00 AM; carry drinking water as there are no shops atop the hill.',
      'Visit Songir (22 km) to witness artisans hand-beating brass and copper utensils.',
      'Relax at Nakane Lake in the evening for calm sunsets.'
    ],
    localFood: [
      { name: 'Khandeshi Khapri Roti', description: 'Giant jowar/bajra rotis cooked over an inverted earthen dome, served with spiced spicy dal or varan.', isVegetarian: true },
      { name: 'Dhule Chivda & Sev', description: 'Locally made crispy spiced poha chivda and ratlami sev varieties.', isVegetarian: true },
      { name: 'Dal Gandhori / Pitla', description: 'Thick gram flour curry prepared with green chilies and tempered garlic.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Songir Brass & Copper Fort Village', distanceKm: 22.0, category: 'historical' },
      { name: 'Nakane Lake Promenade', distanceKm: 6.0, category: 'nature' },
      { name: 'Shirpur Karwand Dam', distanceKm: 52.0, category: 'nature' },
      { name: 'Patanadevi Temple & Gautala Sanctuary', distanceKm: 78.0, category: 'temple' }
    ],
    coordinates: { lat: 20.9042, lng: 74.7749 },
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    isTrending: false,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Nashik', 'Jalgaon', 'Shirpur', 'Aurangabad'],
    rating: 4.5,
    reviewsCount: 920
  },
  {
    id: 'saputara-hill-station',
    name: 'Saputara Hill Station & Gira Waterfalls',
    localName: 'सापुतारा – शांत थंड हवेचे ठिकाण व गीरा धबधबा',
    city: 'Saputara',
    district: 'Dang (Bordering Nashik/Surat)',
    state: 'Gujarat',
    region: 'West',
    categories: ['hill_station', 'waterfall', 'nature', 'family'],
    description: 'A serene Sahyadri hill retreat right on the Maharashtra-Gujarat border, revered as the "Abode of Serpents". Highlights include boat rides on Saputara Lake, the panoramic Sunset Point cable car, tribal handicrafts at the Artist Village, and the cascading Gira Waterfalls.',
    significance: 'Legend holds that Lord Rama spent 11 years of his exile in the dense forests of Dang. It is the only hill station in Gujarat and a beloved weekend getaway for visitors from Nashik, Pune, and Mumbai.',
    bestTimeToVisit: 'July to February (Monsoon reveals roaring waterfalls; winter is crisp and misty)',
    entryFee: {
      value: 'Hill station entry: Free; Lake Boating: ₹70 – ₹200; Ropeway: ₹100 per person',
      isVerified: true
    },
    timings: {
      value: 'Lake Boating: 8:30 AM – 6:30 PM; Ropeway: 9:00 AM – 6:00 PM; Gira Waterfalls: 8:00 AM – 5:30 PM',
      isVerified: true
    },
    visitDuration: '2 days',
    travelTips: [
      'Take the ropeway cable car from the sunset point across the green valley.',
      'Sample warm sweet corn and freshly fried bhajiya along the lakeside in the cool evening.',
      'Drive 45 km to Gira Waterfalls during August–October to see the Ambika River in full roar.'
    ],
    localFood: [
      { name: 'Dang Tribal Nagli (Ragi) Rotla', description: 'Nutritious finger millet rotlas served with homemade white butter and garlic chutney.', isVegetarian: true },
      { name: 'Lakeside Sweet Corn Chaat', description: 'Steamed spicy buttered sweet corn seasoned with chaat masala and fresh coriander.', isVegetarian: true },
      { name: 'Bamboo Shoot Curry (Seasonal)', description: 'Traditional tribal preparation of wild tender bamboo shoots cooked in earthen spices.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Gira Waterfalls', distanceKm: 46.0, category: 'waterfall' },
      { name: 'Vansda National Park', distanceKm: 40.0, category: 'nature' },
      { name: 'Hathgadh Fort (Maharashtra border)', distanceKm: 5.0, category: 'fort' },
      { name: 'Shabari Dham', distanceKm: 32.0, category: 'temple' }
    ],
    coordinates: { lat: 20.5779, lng: 73.7483 },
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Nashik', 'Surat', 'Dhule', 'Mumbai'],
    rating: 4.7,
    reviewsCount: 3120
  },
  {
    id: 'ajanta-ellora-caves-kailasa',
    name: 'Ajanta & Ellora UNESCO Rock-Cut Caves',
    localName: 'अजिंठा व वेरूळ लेणी – कैलास मंदिर',
    city: 'Chhatrapati Sambhaji Nagar',
    district: 'Chhatrapati Sambhaji Nagar',
    state: 'Maharashtra',
    region: 'West',
    categories: ['historical', 'temple', 'family'],
    description: 'One of humanity’s greatest architectural triumphs. Ellora features the awe-inspiring Cave 16 (Kailasa Temple), carved from top to bottom out of a single monolithic basalt mountain. Ajanta hosts 30 ancient Buddhist rock-cut monasteries with world-famous 2nd-century BC frescoes.',
    significance: 'UNESCO World Heritage Site. Ellora symbolizes religious harmony between Hinduism, Buddhism, and Jainism (6th–10th century CE). The monolithic Kailasa temple required excavating over 200,000 tonnes of solid rock without modern machinery.',
    bestTimeToVisit: 'October to March (Comfortable walking temperatures)',
    entryFee: {
      value: '₹40 for Indian/SAARC visitors, ₹600 for foreigners (per cave complex)',
      isVerified: true,
      note: 'Ellora is closed on Tuesdays; Ajanta is closed on Mondays.'
    },
    timings: {
      value: 'Ellora: 6:00 AM – 6:00 PM (Closed Tuesdays); Ajanta: 9:00 AM – 5:00 PM (Closed Mondays)',
      isVerified: true
    },
    visitDuration: '2 full days',
    travelTips: [
      'Hire an official ASI licensed guide to decode the sculptural narratives of the Mahabharata on Kailasa’s walls.',
      'Wear slip-on shoes since multiple cave shrines require bare feet.',
      'Carry a small pocket torch to inspect dim fresco details inside Ajanta Cave 1 & 2.'
    ],
    localFood: [
      { name: 'Aurangabad Naan Qalia', description: 'Slow-cooked aromatic mutton gravy served with fresh tandoor-baked square naan bread.', isVegetarian: false },
      { name: 'Tahri (Fragrant Rice)', description: 'Spiced aromatic rice simmered with local vegetables and saffron-flavored dry spices.', isVegetarian: true },
      { name: 'Himroo Shawl Market Sweets & Imarti', description: 'Crisp hot imartis soaked in fragrant sugar syrup in Old City lanes.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Bibi Ka Maqbara (Tomb of Rabia-ud-Daurani)', distanceKm: 28.0, category: 'historical' },
      { name: 'Daulatabad Fort', distanceKm: 15.0, category: 'fort' },
      { name: 'Grishneshwar Jyotirlinga Temple', distanceKm: 1.2, category: 'temple' }
    ],
    coordinates: { lat: 20.0269, lng: 75.1793 },
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e50a0?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Pune', 'Nashik', 'Mumbai', 'Dhule', 'Jalgaon'],
    rating: 4.9,
    reviewsCount: 6300
  },
  {
    id: 'mahabaleshwar-pratapgad-strawberry',
    name: 'Mahabaleshwar, Venna Lake & Pratapgad Fort',
    localName: 'महाबळेश्वर – प्रतापगड व स्ट्रॉबेरी बागा',
    city: 'Mahabaleshwar',
    district: 'Satara',
    state: 'Maharashtra',
    region: 'West',
    categories: ['hill_station', 'fort', 'nature', 'food', 'family'],
    description: 'The queen of Maharashtra hill stations perched in the Western Ghats. Known for strawberry cultivation that produces 85% of India’s yield, misty vantage points like Arthur’s Seat, boat rides on Venna Lake, Mapro Garden, and the historical Pratapgad Fort.',
    significance: 'Pratapgad Fort was commissioned by Chhatrapati Shivaji Maharaj in 1656 and was the battlefield where Shivaji defeated Afzal Khan. Mahabaleshwar is also the sacred origin point of five sacred rivers including the Krishna.',
    bestTimeToVisit: 'October to June (Strawberry harvest in winter; cool climate all year)',
    entryFee: {
      value: 'Pollution tax / municipal entry: ~₹20–50; Pratapgad Fort: Free entry',
      isVerified: true
    },
    timings: {
      value: 'Viewpoints & Pratapgad: 6:00 AM – 6:30 PM; Venna Lake Boating: 8:00 AM – 8:00 PM',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Visit local strawberry farms around Panchgani and Mahabaleshwar to pick fresh berries.',
      'Head to Arthur’s Seat early morning before valley clouds obscure the Savitri river canyon.',
      'Carry a warm jacket during winter evenings as temperatures drop below 12°C.'
    ],
    localFood: [
      { name: 'Fresh Strawberries with Whipped Cream', description: 'Freshly plucked ripe strawberries layered with luscious thick fresh cream at Mapro Garden.', isVegetarian: true },
      { name: 'Corn Patties & Wood-Fired Pizza', description: 'Crisp golden sweet-corn patties and garden-fresh pizzas at Mapro.', isVegetarian: true },
      { name: 'Maharashtrian Thali with Solkadhi', description: 'Jowar bhakri, thecha, pitla, and cooling solkadhi at rural dhabas near Pratapgad.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Pratapgad Fort', distanceKm: 21.0, category: 'fort' },
      { name: 'Panchgani Table Land', distanceKm: 19.0, category: 'nature' },
      { name: 'Mapro Garden', distanceKm: 11.0, category: 'food' },
      { name: 'Lingmala Waterfall', distanceKm: 6.0, category: 'waterfall' }
    ],
    coordinates: { lat: 17.9237, lng: 73.6586 },
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Pune', 'Mumbai', 'Satara', 'Kolhapur'],
    rating: 4.8,
    reviewsCount: 4890
  },

  // ==========================================
  // OTHER STATES KEY DESTINATIONS
  // ==========================================
  {
    id: 'jaipur-amber-hawa-mahal',
    name: 'Jaipur Pink City & Amber Fort',
    localName: 'जयपुर – हवा महल व आमेर किला',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    categories: ['fort', 'historical', 'food', 'family'],
    description: 'The UNESCO-listed Pink City of Rajasthan. Famed for the honeycomb facade of Hawa Mahal (Palace of Winds), the hilltop Amber Fort with its mirror-inlaid Sheesh Mahal, astronomical Jantar Mantar, and the vibrant handicraft bazaars of Johari and Bapu.',
    significance: 'Founded in 1727 by Maharaja Sawai Jai Singh II as India’s first planned city based on Vastu Shastra principles. Amber Fort represents the zenith of Rajput-Mughal architectural synthesis.',
    bestTimeToVisit: 'October to March (Pleasant sunny days and cool evenings)',
    entryFee: {
      value: 'Amber Fort: ₹100 Indian, ₹500 Foreigners; Hawa Mahal: ₹50 Indian, ₹200 Foreigners; Composite ticket available',
      isVerified: true
    },
    timings: {
      value: 'Amber Fort: 8:00 AM – 5:30 PM & 6:30 PM – 9:15 PM (Night tourism); Hawa Mahal: 9:00 AM – 5:00 PM',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Take the electric golf carts or walk up to Amber Fort rather than elephant rides.',
      'Sip cardamom tea at Wind View Cafe directly opposite Hawa Mahal for the best photo angle.',
      'Buy authentic blue pottery and Jaipuri block-printed quilts from registered artisan cooperatives.'
    ],
    localFood: [
      { name: 'Dal Baati Churma', description: 'Hard wheat rolls baked over cow-dung embers, crushed with generous ghee, served with panchmel dal and sweet churma.', isVegetarian: true },
      { name: 'Pyaaz Kachori', description: 'Flaky deep-fried pastry stuffed with spiced onion filling at Rawat Mishthan Bhandar.', isVegetarian: true },
      { name: 'Ghevar', description: 'Disc-shaped honeycomb sweet soaked in saffron syrup, topped with rabdi and silver vark.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Nahargarh Fort Sunset Viewpoint', distanceKm: 14.0, category: 'fort' },
      { name: 'Jal Mahal (Water Palace)', distanceKm: 6.0, category: 'historical' },
      { name: 'Chokhi Dhani Cultural Village', distanceKm: 22.0, category: 'food' }
    ],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Delhi', 'Agra', 'Ajmer', 'Udaipur'],
    rating: 4.8,
    reviewsCount: 5800
  },
  {
    id: 'goa-beaches-churches-dudhsagar',
    name: 'Goa Coastal Heritage & Dudhsagar Falls',
    localName: 'गोवा – समुद्र किनारे व दूधसागर धबधबा',
    city: 'Panaji / Calangute',
    district: 'North Goa & South Goa',
    state: 'Goa',
    region: 'West',
    categories: ['beach', 'waterfall', 'historical', 'adventure', 'food'],
    description: 'India’s tropical coastal paradise blending sun-drenched Arabian Sea beaches, UNESCO Latin quarters in Fontainhas, the 400-year-old Basilica of Bom Jesus holding the relics of St. Francis Xavier, Fort Aguada, and the four-tiered Dudhsagar Falls.',
    significance: 'Governed by Portuguese rule for over 450 years, Goa preserves a distinct Indo-Portuguese culture, baroque churches, and susegad lifestyle found nowhere else on the subcontinent.',
    bestTimeToVisit: 'November to February (Sunny beach weather); July to September for roaring Dudhsagar',
    entryFee: {
      value: 'Basilica & Beaches: Free; Fort Aguada: ₹25; Dudhsagar Jeep Safari: ~₹500 per seat',
      isVerified: true
    },
    timings: {
      value: 'Basilica: 9:00 AM – 6:30 PM; Fort Aguada: 9:30 AM – 6:00 PM; Dudhsagar safari: 8:30 AM – 3:30 PM',
      isVerified: true
    },
    visitDuration: '3 to 4 days',
    travelTips: [
      'Rent a scooter or car for convenient navigation through scenic coastal palm roads.',
      'Explore South Goa beaches (Palolem, Agonda) for serene sunset tranquility.',
      'Walk through Fontainhas early morning to admire pastel-hued heritage villas without crowd.'
    ],
    localFood: [
      { name: 'Goan Fish Curry & Rice', description: 'Fresh kingfish or pomfret simmered in coconut milk, kokum, and fiery red Goan spices.', isVegetarian: false },
      { name: 'Bebinca', description: 'Traditional multi-layered Goan festive dessert baked with coconut milk, egg yolks, and nutmeg.', isVegetarian: false },
      { name: 'Poi with Mushroom Xacuti', description: 'Crusty local wheat bread stuffed or dipped into rich roasted poppy seed xacuti curry.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Dudhsagar Waterfalls', distanceKm: 60.0, category: 'waterfall' },
      { name: 'Chapora Fort (Dil Chahta Hai viewpoint)', distanceKm: 18.0, category: 'fort' },
      { name: 'Anjuna Flea Market', distanceKm: 15.0, category: 'food' }
    ],
    coordinates: { lat: 15.4909, lng: 73.8278 },
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Mumbai', 'Pune', 'Bengaluru', 'Belgaum'],
    rating: 4.8,
    reviewsCount: 7100
  },
  {
    id: 'varanasi-ghats-kashi-vishwanath',
    name: 'Varanasi Sacred Ganga Ghats & Kashi Vishwanath',
    localName: 'वाराणसी – काशी विश्वनाथ व गंगा आरती',
    city: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    categories: ['temple', 'historical', 'food'],
    description: 'The spiritual heart of India and one of the world’s oldest continually inhabited cities. Renowned for the golden spires of Kashi Vishwanath Temple, soul-stirring evening Ganga Aarti at Dashashwamedh Ghat, dawn boat rides past historic ghats, and nearby Sarnath.',
    significance: 'City of Lord Shiva and sacred liberation (Moksha). Nearby Sarnath Deer Park is where Gautama Buddha delivered his first sermon setting the Wheel of Dharma in motion (Dhammacakkappavattana Sutta).',
    bestTimeToVisit: 'October to March (Cool river breezes; Dev Deepawali in Nov is magical)',
    entryFee: {
      value: 'Kashi Vishwanath Temple General Darshan: Free; Sarnath: ₹25 Indian, ₹300 Foreigner; Sunrise boat: ₹200–500',
      isVerified: true
    },
    timings: {
      value: 'Temple: 3:00 AM – 11:00 PM; Dashashwamedh Aarti: Starts around 6:30 PM (summer 7:00 PM)',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Take a hand-rowed wooden boat at 5:30 AM from Assi Ghat to Manikarnika Ghat to watch dawn rituals.',
      'Reach Dashashwamedh Ghat by 5:30 PM to secure a front seating spot for the grand evening Aarti.',
      'Dress modestly covering shoulders and knees when entering temple sanctums.'
    ],
    localFood: [
      { name: 'Kashi Tamatar Chaat', description: 'Hot spicy mashed tomato curry seasoned with roasted cumin and ghee, topped with sugar syrup and crispy namkeen.', isVegetarian: true },
      { name: 'Kachori Sabzi & Jalebi', description: 'Lentil-stuffed crisp kachoris paired with spicy potato curry and warm saffron jalebis for breakfast.', isVegetarian: true },
      { name: 'Banarasi Meetha Paan', description: 'Betel leaf stuffed with gulkand, fragrant supari, fennel seeds, and menthol, prepared in the old lanes.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Sarnath Buddhist Ruins & Dhamek Stupa', distanceKm: 10.0, category: 'historical' },
      { name: 'Ramnagar Fort & Museum', distanceKm: 14.0, category: 'fort' },
      { name: 'Assi Ghat Sunrise Yoga', distanceKm: 3.5, category: 'temple' }
    ],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: false,
    suggestedStartingCities: ['Prayagraj', 'Lucknow', 'Patna', 'Delhi'],
    rating: 4.9,
    reviewsCount: 6890
  },
  {
    id: 'agra-taj-mahal-fort',
    name: 'Agra Taj Mahal & Mughal Splendour',
    localName: 'आगरा – ताजमहल व फतेहपुर सीकरी',
    city: 'Agra',
    district: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    categories: ['historical', 'food', 'family'],
    description: 'Home to the immortal monument to love, the Taj Mahal. Built entirely of ivory-white Makrana marble on the banks of the Yamuna, complemented by the red sandstone ramparts of Agra Fort and the ghost city of Fatehpur Sikri.',
    significance: 'One of the Seven Wonders of the World and a UNESCO World Heritage Site. Built by Emperor Shah Jahan between 1631 and 1648 in memory of his beloved wife Mumtaz Mahal.',
    bestTimeToVisit: 'October to March (Clear blue skies and pleasant winter mornings)',
    entryFee: {
      value: '₹50 for Indian nationals (+₹200 for main mausoleum dome), ₹1100 for Foreigners',
      isVerified: true,
      note: 'Taj Mahal is strictly CLOSED on Fridays for prayers.'
    },
    timings: {
      value: 'Sunrise to Sunset (Approx 6:00 AM – 6:30 PM). Closed on Fridays.',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Enter through the East Gate 20 minutes before sunrise to experience the marble shifting from soft blush to blinding white with minimal crowd.',
      'Head to Mehtab Bagh across the river in the late afternoon for a reflection shot without entering the monument.',
      'Tripods, chewing gum, lighters, and large bags are strictly prohibited inside the complex.'
    ],
    localFood: [
      { name: 'Agra Ka Petha', description: 'Translucent ash-gourd sweet candy flavored with saffron, kewra, paan, and chocolate (Panchhi Petha).', isVegetarian: true },
      { name: 'Bedmi Puri & Aloo Sabzi', description: 'Crisp urad-dal stuffed fried bread served with tangy hing-infused potato gravy.', isVegetarian: true },
      { name: 'Mughlai Chicken / Paneer Korma', description: 'Rich creamy cashew and brown onion gravy scented with green cardamom.', isVegetarian: false }
    ],
    nearbyAttractions: [
      { name: 'Agra Fort', distanceKm: 2.5, category: 'fort' },
      { name: 'Fatehpur Sikri & Buland Darwaza', distanceKm: 36.0, category: 'historical' },
      { name: 'Mehtab Bagh Sunset Garden', distanceKm: 7.0, category: 'nature' }
    ],
    coordinates: { lat: 27.1751, lng: 78.0421 },
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Delhi', 'Jaipur', 'Gwalior', 'Lucknow'],
    rating: 4.9,
    reviewsCount: 8900
  },
  {
    id: 'kerala-alleppey-munnar',
    name: 'Kerala Backwaters & Munnar Tea Valleys',
    localName: 'केरळ – मुन्नार व अलप्पुळा बॅकवॉटर',
    city: 'Munnar & Alleppey',
    district: 'Idukki & Alappuzha',
    state: 'Kerala',
    region: 'South',
    categories: ['nature', 'hill_station', 'waterfall', 'food', 'family'],
    description: 'God’s Own Country offering two distinct paradises: cruising through palm-fringed emerald lagoons and paddy fields aboard a traditional kettuvallam (houseboat) in Alleppey, and wandering through misty rolling tea plantations and waterfalls in Munnar.',
    significance: 'An ecologically vital bio-diverse haven in the Western Ghats. Kerala’s traditional spice trade shaped global exploration for thousands of years.',
    bestTimeToVisit: 'September to March (Crisp hill breezes and calm backwaters)',
    entryFee: {
      value: 'Tea Museum Munnar: ₹150; Alleppey day cruise: ₹4,000–₹12,000 per houseboat; Eravikulam National Park: ₹200',
      isVerified: true
    },
    timings: {
      value: 'Eravikulam Park: 7:30 AM – 4:00 PM; Tea Museum: 9:00 AM – 5:00 PM (Closed Mondays)',
      isVerified: true
    },
    visitDuration: '3 to 5 days',
    travelTips: [
      'Book a government-certified houseboat at Alleppey with an overnight stay to witness village life at sunrise.',
      'Check Eravikulam National Park timings beforehand as it closes briefly between Feb and March for Nilgiri Tahr calving.',
      'Savor authentic fresh coconut water directly from roadside vendors.'
    ],
    localFood: [
      { name: 'Kerala Sadya Feast', description: 'Grand vegetarian banquet of 24 dishes served on a fresh plantain leaf with red rice and payasam.', isVegetarian: true },
      { name: 'Appam with Vegetable Stew', description: 'Fluffy fermented rice batter pancakes with lace borders, served with aromatic coconut milk stew.', isVegetarian: true },
      { name: 'Karimeen Pollichathu', description: 'Pearl spot fish marinated in shallots, ginger, and green chilies, wrapped in banana leaf and pan-roasted.', isVegetarian: false }
    ],
    nearbyAttractions: [
      { name: 'Mattupetty Dam & Echo Point', distanceKm: 12.0, category: 'nature' },
      { name: 'Attukad Waterfalls', distanceKm: 9.0, category: 'waterfall' },
      { name: 'Marari Quiet Beach', distanceKm: 15.0, category: 'beach' }
    ],
    coordinates: { lat: 10.0889, lng: 77.0595 },
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: false,
    suggestedStartingCities: ['Kochi', 'Coimbatore', 'Bengaluru', 'Madurai'],
    rating: 4.9,
    reviewsCount: 5400
  },
  {
    id: 'hyderabad-charminar-golconda',
    name: 'Hyderabad Charminar, Golconda & Nizami Grandeur',
    localName: 'हैदराबाद – चारमीनार व गोलकोंडा किल्ला',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    region: 'South',
    categories: ['historical', 'fort', 'food', 'family'],
    description: 'The City of Pearls blending 400-year-old Qutb Shahi and Nizami royalty with a futuristic cyber hub. Marvel at the four grand minarets of Charminar, the acoustic marvel of Golconda Fort, the European splendor of Chowmahalla Palace, and Salar Jung Museum.',
    significance: 'Founded in 1591 by Muhammad Quli Qutb Shah. Golconda Fort was the center of the legendary diamond trade that produced the Koh-i-Noor and Hope Diamond.',
    bestTimeToVisit: 'October to March (Pleasant weather; great for exploring sprawling fort complexes)',
    entryFee: {
      value: 'Charminar: ₹25 Indian, ₹300 Foreigner; Golconda Fort: ₹25 Indian, ₹300 Foreigner; Salar Jung: ₹50',
      isVerified: true
    },
    timings: {
      value: 'Charminar: 9:30 AM – 5:30 PM; Golconda Fort: 9:00 AM – 5:30 PM; Sound & Light Show: 6:30 PM & 7:45 PM',
      isVerified: true
    },
    visitDuration: '2 days',
    travelTips: [
      'Clap your hands under the dome at the entrance of Golconda Fort — the sound resonates at the Bala Hissar pavilion 1 km away.',
      'Shop for lacquer bangles studded with glass mirrors at Laad Bazaar adjacent to Charminar.',
      'Visit Nimrah Cafe right next to Charminar for hot Osmania biscuits and Irani chai.'
    ],
    localFood: [
      { name: 'Hyderabadi Dum Biryani', description: 'Long-grain basmati rice and marinated meat or vegetables layered with fried onions, mint, and saffron, slow-cooked in sealed handis.', isVegetarian: false },
      { name: 'Irani Chai & Osmania Biscuits', description: 'Velvety sweet reduced tea served with crumbly sweet-salty butter biscuits at Nimrah.', isVegetarian: true },
      { name: 'Double Ka Meetha', description: 'Nizami bread pudding soaked in saffron-cardamom milk and crowned with slivered almonds and pistachios.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Ramoji Film City', distanceKm: 32.0, category: 'family' },
      { name: 'Chowmahalla Palace', distanceKm: 1.5, category: 'historical' },
      { name: 'Hussain Sagar Lake & Buddha Statue', distanceKm: 8.0, category: 'nature' }
    ],
    coordinates: { lat: 17.3616, lng: 78.4747 },
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Bengaluru', 'Vijayawada', 'Warangal', 'Pune'],
    rating: 4.8,
    reviewsCount: 4300
  },
  {
    id: 'delhi-qutub-redfort-chandnichowk',
    name: 'Delhi Historic Monuments & Chandni Chowk',
    localName: 'दिल्ली – कुतुब मिनार, लाल किल्ला व चांदनी चौक',
    city: 'Delhi',
    district: 'Central & South Delhi',
    state: 'Delhi',
    region: 'North',
    categories: ['historical', 'food', 'family'],
    description: 'The ancient capital spanning eight historic cities. Highlights include the 73-meter fluted minaret of Qutub Minar, the Mughal citadel of Red Fort, the garden tomb of Humayun, India Gate war memorial, and the sensory spice labyrinth of Chandni Chowk.',
    significance: 'Spanning centuries of Chauhan Rajput, Delhi Sultanate, Mughal, and British imperial rule, Delhi houses three UNESCO World Heritage Sites and the administrative seat of the world’s largest democracy.',
    bestTimeToVisit: 'October to March (Crisp autumn and winter; avoid extreme summer heat)',
    entryFee: {
      value: 'Qutub Minar & Red Fort: ₹50 Indian nationals, ₹600 Foreigners; India Gate: Free',
      isVerified: true
    },
    timings: {
      value: 'Monuments: 7:00 AM – 5:00 PM; Red Fort closed on Mondays; India Gate: Open 24 Hours',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Use the Delhi Metro (Yellow & Violet lines) to bypass city traffic comfortably.',
      'Take a morning rickshaw food tour through the narrow g驾驶 alleys of Chandni Chowk and Paranthe Wali Gali.',
      'Visit Humayun’s Tomb during late afternoon for the warmest light across red sandstone.'
    ],
    localFood: [
      { name: 'Chole Bhature', description: 'Fluffy fried leavened bread served with dark tangy spiced chickpeas, pickled carrots, and green chili (Sita Ram Diwan Chand).', isVegetarian: true },
      { name: 'Paranthe Wali Gali Stuffed Parathas', description: 'Deep-fried parathas stuffed with rabdi, paneer, fenugreek, or spiced potatoes, served with pumpkin sabzi.', isVegetarian: true },
      { name: 'Dilli Ki Chaat & Dahi Bhalla', description: 'Crisp papdis and lentil dumplings bathed in chilled sweet yogurt, roasted cumin, and tamarind chutney (Natraj Dahi Bhalle).', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Humayun’s Tomb', distanceKm: 7.0, category: 'historical' },
      { name: 'Lotus Temple (Baha\'i House of Worship)', distanceKm: 9.5, category: 'temple' },
      { name: 'National Museum & Kartavya Path', distanceKm: 3.0, category: 'historical' }
    ],
    coordinates: { lat: 28.5244, lng: 77.1855 },
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Agra', 'Jaipur', 'Chandigarh', 'Dehradun'],
    rating: 4.8,
    reviewsCount: 7800
  },
  {
    id: 'bengaluru-palace-lalbagh-dosa',
    name: 'Bengaluru Heritage Palace & Garden City',
    localName: 'बंगळुरू – बंगळुरू राजवाडा व लालबाग बाग',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    region: 'South',
    categories: ['historical', 'nature', 'food', 'family'],
    description: 'India’s Silicon Valley that seamlessly preserves grand Tudor-style royal architecture at Bangalore Palace, the Victorian botanical glasshouse at Lalbagh, lush Cubbon Park, and iconic heritage breakfast eateries serving world-famous crispy benne masala dosas.',
    significance: 'Founded by Kempe Gowda I in 1537. Tipu Sultan and Hyder Ali established Lalbagh Botanical Garden in the 18th century, sourcing rare tropical plants from Persia and Mauritius.',
    bestTimeToVisit: 'October to March (Mild, pleasant climate year-round)',
    entryFee: {
      value: 'Bangalore Palace: ₹250 Indian, ₹500 Foreigners; Lalbagh: ₹30; Cubbon Park: Free',
      isVerified: true
    },
    timings: {
      value: 'Bangalore Palace: 10:00 AM – 5:30 PM; Lalbagh: 6:00 AM – 7:00 PM',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Take a morning walk through Lalbagh or Cubbon Park before heading to Gandhi Bazaar for breakfast.',
      'Reach Vidyarthi Bhavan or CTR Malleshwaram early in the morning to beat the breakfast queue.',
      'Check out the flower show at Lalbagh Glasshouse if visiting around Republic Day or Independence Day.'
    ],
    localFood: [
      { name: 'Crispy Benne Masala Dosa', description: 'Golden buttery dosa with a soft cloud interior and crispy crust, filled with spiced potato palya and served with coconut chutney.', isVegetarian: true },
      { name: 'Filter Kaapi (South Indian Coffee)', description: 'Frothy, freshly brewed chicory-infused filter coffee poured in traditional steel dabara and tumbler.', isVegetarian: true },
      { name: 'Bisi Bele Bath', description: 'Traditional spicy Karnataka hot lentil rice stew cooked with vegetables, tamarind, and aromatic spices.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Tipu Sultan’s Summer Palace', distanceKm: 4.5, category: 'historical' },
      { name: 'Bannerghatta National Park & Safari', distanceKm: 22.0, category: 'nature' },
      { name: 'Nandi Hills Sunrise Viewpoint', distanceKm: 60.0, category: 'hill_station' }
    ],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Mysuru', 'Chennai', 'Coimbatore', 'Hyderabad'],
    rating: 4.7,
    reviewsCount: 3900
  },
  {
    id: 'amritsar-golden-temple',
    name: 'Amritsar Sri Harmandir Sahib & Wagah Border',
    localName: 'अमृतसर – श्री हरमंदिर साहिब व सुवर्ण मंदिर',
    city: 'Amritsar',
    district: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    categories: ['temple', 'historical', 'food', 'family'],
    description: 'The supreme spiritual seat of Sikhism. Golden Temple stands serenely in the center of the Amrit Sarovar sacred pool. Witness the world’s largest community kitchen (Langar) feeding over 100,000 pilgrims daily, visit historic Jallianwala Bagh, and the patriotic Wagah Border retreat.',
    significance: 'Founded in 1577 by Guru Ram Das. The holy scripture Guru Granth Sahib was first installed here in 1604 by Guru Arjan Dev.',
    bestTimeToVisit: 'October to March (Cool winters and clear skies)',
    entryFee: {
      value: 'Golden Temple: Free entry for all humanity; Wagah Border: Free entry',
      isVerified: true
    },
    timings: {
      value: 'Golden Temple: Open 24 Hours; Wagah Border Parade: Starts around 4:30 PM (arrive by 3:00 PM)',
      isVerified: true
    },
    visitDuration: '1 to 2 days',
    travelTips: [
      'Cover your head with a scarf and wash your feet at the entrance pool before entering the gurdwara.',
      'Volunteer (Seva) for 30 minutes in the Langar kitchen rolling rotis or washing plates for a humbling experience.',
      'Arrive at Wagah border early with a valid ID proof to get seated close to the border gates.'
    ],
    localFood: [
      { name: 'Amritsari Kulcha with Chole', description: 'Crisp multi-layered tandoori flatbread stuffed with spiced potatoes and onions, topped with melting white butter.', isVegetarian: true },
      { name: 'Guru Ka Langar Dal & Kheer', description: 'Simple, soul-nourishing slow-cooked maa chana dal and hot sweet rice pudding served to all without distinction.', isVegetarian: true },
      { name: 'Creamy Amritsari Lassi', description: 'Thick churned sweet curd served in tall brass glasses topped with a thick dollop of fresh malai.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Jallianwala Bagh Memorial', distanceKm: 0.5, category: 'historical' },
      { name: 'Wagah Border Beating Retreat', distanceKm: 28.0, category: 'historical' },
      { name: 'Partition Museum', distanceKm: 1.0, category: 'historical' }
    ],
    coordinates: { lat: 31.6200, lng: 74.8765 },
    image: 'https://images.unsplash.com/photo-1609948542976-591350a80e4b?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Chandigarh', 'Delhi', 'Ludhiana', 'Jalandhar'],
    rating: 4.9,
    reviewsCount: 7200
  },
  {
    id: 'rishikesh-ganga-yoga-adventure',
    name: 'Rishikesh Yoga Capital & Ganga Rapids',
    localName: 'ऋषिकेश – योग नगरी व गंगा राफ्टिंग',
    city: 'Rishikesh',
    district: 'Dehradun',
    state: 'Uttarakhand',
    region: 'North',
    categories: ['adventure', 'temple', 'nature', 'waterfall'],
    description: 'The Yoga Capital of the World where the turquoise Ganges river bursts out from the Himalayan foothills. Renowned for suspension bridges like Laxman Jhula, white-water river rafting, serene ashrams where the Beatles stayed, and the peaceful evening Ganga Aarti at Triveni Ghat.',
    significance: 'Spiritual gateway to the Char Dham pilgrimage. For millennia, sages, yogis, and seekers have meditated along the pristine banks of the upper Ganges.',
    bestTimeToVisit: 'September to November & March to May (Prime rafting and pleasant climate)',
    entryFee: {
      value: 'Ghats & Ashrams: Free; White Water Rafting: ₹600–₹1500; Beatles Ashram: ₹150 Indian, ₹600 Foreigner',
      isVerified: true
    },
    timings: {
      value: 'Triveni Ghat Evening Aarti: 6:00 PM – 7:00 PM; River rafting: 8:00 AM – 3:30 PM',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Book certified rafting operators with licensed guides and safety kayakers.',
      'Attend the sunset Ganga Aarti at Parmarth Niketan or Triveni Ghat for candle lit leaf-boat offerings.',
      'Rishikesh is an alcohol-free and pure vegetarian holy city.'
    ],
    localFood: [
      { name: 'Garhwali Thali (Chainsoo & Kafuli)', description: 'Traditional mountain spinach gravy (kafuli) and roasted black gram dal served with red rice.', isVegetarian: true },
      { name: 'Ayurvedic Herb Tea & Organic Bowls', description: 'Fresh herbal infusions with ginger, holy basil, and honey served in peaceful riverside cafes.', isVegetarian: true },
      { name: 'Aloo Puri by Triveni Ghat', description: 'Crisp puffed puris with spicy mountain potato curry cooked in mustard oil.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Neer Garh Waterfall Trek', distanceKm: 6.0, category: 'waterfall' },
      { name: 'Beatles Ashram (Chaurasi Kutia)', distanceKm: 4.0, category: 'historical' },
      { name: 'Haridwar Har Ki Pauri', distanceKm: 25.0, category: 'temple' }
    ],
    coordinates: { lat: 30.0869, lng: 78.2676 },
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isTrending: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Delhi', 'Dehradun', 'Chandigarh', 'Nainital'],
    rating: 4.8,
    reviewsCount: 4600
  },
  {
    id: 'udaipur-city-palace-pichola',
    name: 'Udaipur City of Lakes & Royal Havelis',
    localName: 'उदयपुर – तलावांचे शहर व सिटी पॅलेस',
    city: 'Udaipur',
    district: 'Udaipur',
    state: 'Rajasthan',
    region: 'North',
    categories: ['historical', 'nature', 'food', 'family'],
    description: 'The Venice of the East, framed by the Aravalli Hills and shimmering Lake Pichola. Highlights include the magnificent granite and marble City Palace complex, floating Jag Mandir, romantic sunset boat cruises, and the heritage ghats of Gangaur and Ambrai.',
    significance: 'Founded in 1559 by Maharana Udai Singh II as the historic capital of the Mewar Kingdom. City Palace is the largest palace complex in Rajasthan.',
    bestTimeToVisit: 'October to March (Pleasant breeze over the lakes)',
    entryFee: {
      value: 'City Palace Museum: ₹300 Indian; Lake Pichola Boat Cruise: ₹450–₹800',
      isVerified: true
    },
    timings: {
      value: 'City Palace: 9:00 AM – 5:30 PM; Jagdish Temple: 5:00 AM – 2:30 PM, 4:00 PM – 10:00 PM',
      isVerified: true
    },
    visitDuration: '2 days',
    travelTips: [
      'Reserve a lakeside dinner table at Ambrai Ghat at sunset for sweeping illuminated views of City Palace.',
      'Catch the Dharohar cultural dance performance at Bagore Ki Haveli at 7:00 PM.',
      'Take the ropeway up to Karni Mata Temple for panoramic sunset views across all four city lakes.'
    ],
    localFood: [
      { name: 'Mewari Gatte Ki Sabzi', description: 'Gram flour dumplings boiled and cooked in spicy curd gravy, served with bajra rotis.', isVegetarian: true },
      { name: 'Kachori with Sweet Tamarind Chutney', description: 'Crisp morning dal kachori at Jagdish Chowk.', isVegetarian: true },
      { name: 'Udaipuri Jalebi & Rabdi', description: 'Large crisp jalebi curls served over thick slow-reduced sweetened milk.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Monsoon Palace (Sajjangarh)', distanceKm: 9.0, category: 'fort' },
      { name: 'Saheliyon Ki Bari (Garden of the Maidens)', distanceKm: 4.0, category: 'nature' },
      { name: 'Kumbhalgarh Fort (Great Wall of India)', distanceKm: 85.0, category: 'fort' }
    ],
    coordinates: { lat: 24.5764, lng: 73.6835 },
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Ahmedabad', 'Jaipur', 'Jodhpur', 'Surat'],
    rating: 4.8,
    reviewsCount: 5100
  },
  {
    id: 'hampi-vijayanagara-ruins',
    name: 'Hampi Vijayanagara Empire & Boulder Valley',
    localName: 'हम्पी – विजयनगर साम्राज्याचे अवशेष',
    city: 'Hampi',
    district: 'Vijayanagara / Ballari',
    state: 'Karnataka',
    region: 'South',
    categories: ['historical', 'temple', 'adventure', 'hidden_gem'],
    description: 'A mesmerizing UNESCO World Heritage landscape of giant granite boulders, banana plantations, and ruins of the medieval Vijayanagara Empire. Features the iconic Stone Chariot, musical pillars of Vittala Temple, and the still-active Virupaksha Temple.',
    significance: 'In the 15th and 16th centuries, Vijayanagara was the capital of one of the richest and second-largest empires in the world, visited by Portuguese, Persian, and Italian traders.',
    bestTimeToVisit: 'November to February (Mild winter weather; summer temperatures exceed 40°C)',
    entryFee: {
      value: 'Vittala Temple & Zenana Enclosure: ₹40 Indian, ₹600 Foreigners; Virupaksha: Free',
      isVerified: true
    },
    timings: {
      value: 'Vittala Temple & Enclosure: 6:00 AM – 6:00 PM; Virupaksha: 6:00 AM – 1:00 PM, 5:00 PM – 9:00 PM',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Rent a bicycle or moped to explore the vast 26 sq km complex at your own relaxed pace.',
      'Climb Matanga Hill before dawn for a breathtaking sunrise over the temple ruins and boulder landscape.',
      'Take a coracle (circular wicker boat) ride across the Tungabhadra River to the Hippie Island side.'
    ],
    localFood: [
      { name: 'South Karnataka Jolada Rotti Oota', description: 'Jowar flatbread served with brinjal curry (enne gai), spiced lentil powder, and chilled buttermilk.', isVegetarian: true },
      { name: 'Mango Lassi & Wood-Fired Pizza', description: 'Relaxed cafe cuisine served at garden cafes across Hampi’s Tungabhadra riverbanks.', isVegetarian: true },
      { name: 'Maddur Vada', description: 'Crisp onion and semolina fried snack served with spicy peanut coconut chutney.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Anjanadri Hill (Hanuman Janmasthan)', distanceKm: 18.0, category: 'temple' },
      { name: 'Tungabhadra Dam & Gardens', distanceKm: 16.0, category: 'nature' },
      { name: 'Badami Cave Temples', distanceKm: 135.0, category: 'historical' }
    ],
    coordinates: { lat: 15.3350, lng: 76.4600 },
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: true,
    suggestedStartingCities: ['Bengaluru', 'Hubli', 'Goa', 'Hyderabad'],
    rating: 4.9,
    reviewsCount: 4200
  },
  {
    id: 'kutch-white-rann',
    name: 'Rann of Kutch White Salt Desert & Craft Villages',
    localName: 'कच्छ – पांढरे रण व हस्तकला गावे',
    city: 'Bhuj / Dhordo',
    district: 'Kutch',
    state: 'Gujarat',
    region: 'West',
    categories: ['nature', 'adventure', 'historical', 'food'],
    description: 'The world’s largest seasonal salt marsh desert that transforms into an endless surreal white canvas under full moon nights. Home to the vibrant Rann Utsav cultural tent city, traditional Kutchi handicraft villages (Ajrakhpur, Nirona), and flamingos.',
    significance: 'Unique geographic ecosystem inhabited by pastoral Rabari and Meghwal tribal communities renowned worldwide for rogan art, copper bells, and mirror-work embroidery.',
    bestTimeToVisit: 'November to February (Rann Utsav season; cool breezes and dried salt crust)',
    entryFee: {
      value: 'Rann permit: ₹100 per adult, ₹50 per child (Government border permit issued online/at checkpost)',
      isVerified: true
    },
    timings: {
      value: 'White Rann access: 6:00 AM – 8:00 PM; Special full-moon night viewing permitted till midnight',
      isVerified: true
    },
    visitDuration: '2 to 3 days',
    travelTips: [
      'Plan your trip to coincide with the Full Moon (Poornima) night when the salt desert shines like silver.',
      'Carry your government-approved photo ID (Aadhar / Passport) for the Bhirandiyara checkpoint permit.',
      'Wear warm thermal layers as desert temperatures plummet sharply after sunset.'
    ],
    localFood: [
      { name: 'Kutchi Dabeli', description: 'Spiced potato mash stuffed in pav with roasted peanuts, pomegranate seeds, sev, and garlic chutney.', isVegetarian: true },
      { name: 'Kutchi Khichdi Kadhi', description: 'Comforting bajra or rice khichdi served with sweet-tangy Gujarati yogurt kadhi and roasted papad.', isVegetarian: true },
      { name: 'Gulab Pak & Mawa', description: 'Rich milk fudge flavored with rose petals and cardamom, unique to Bhuj sweet shops.', isVegetarian: true }
    ],
    nearbyAttractions: [
      { name: 'Kala Dungar (Black Hill - Highest Point)', distanceKm: 42.0, category: 'adventure' },
      { name: 'Kutch Fossil Park & Dholavira Harappan City', distanceKm: 85.0, category: 'historical' },
      { name: 'Aina Mahal & Prag Mahal (Bhuj)', distanceKm: 78.0, category: 'historical' }
    ],
    coordinates: { lat: 23.8333, lng: 69.8333 },
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    isWeekendGetaway: false,
    suggestedStartingCities: ['Ahmedabad', 'Rajkot', 'Surat', 'Mumbai'],
    rating: 4.8,
    reviewsCount: 3600
  }
];
