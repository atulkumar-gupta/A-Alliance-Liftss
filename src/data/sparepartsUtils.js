import { getAllSpareParts, getSparePartById, saveSparePart, deleteSparePart, uploadSparePartImage, deleteSparePartImage, getSparePartImages } from '../lib/firebaseDB'

const FEATURES_MAP = {
  'bottom-plengths': [
    'Durable construction for long service life',
    'Stable mounting for smooth assembly',
    'Designed for elevator component alignment',
    'Used in assembly applications across models',
    'High tensile strength for durability',
    'Corrosion-resistant coating available'
  ],
  'full-vision-glass-doors': [
    'Clear vision for modern cabin feel',
    'Safety-oriented door design',
    'Reliable opening/closing performance',
    'Compatible with elevator door systems',
    'Tempered glass for safety',
    'Available in various tints and thicknesses'
  ],
  'over-speed-governors': [
    'Safety governor for overspeed protection',
    'Precision control for elevator operation',
    'Designed for dependable emergency action',
    'High-performance safety component',
    'Mechanical speed sensing',
    'Fail-safe design'
  ],
  'combination-brackets': [
    'Strong mounting for key components',
    'Helps maintain component alignment',
    'Suitable for repeated service operations',
    'Built for mechanical stability',
    'Easy to install and replace',
    'Available in various sizes'
  ],
  'car-frames': [
    'Structural frame support for elevator cabins',
    'Stable geometry for consistent installation',
    'Designed for durability and strength',
    'Supports smooth cabin assembly',
    'Precision engineered for alignment',
    'Available in standard and custom sizes'
  ],
  'buffer-springs': [
    'Energy absorption for safety operation',
    'Stable performance under load',
    'Reliable safety component',
    'Designed for elevator buffer system compatibility',
    'Long service life',
    'Consistent performance characteristics'
  ],
  'machine-bases': [
    'Stable support for elevator machinery',
    'Helps reduce vibration for smooth operation',
    'Designed for secure installation',
    'Durable construction for long-term use',
    'Precision machined for alignment',
    'Available in various configurations'
  ],
  'rope-thimbles': [
    'Precision component for hoisting systems',
    'Reliable rope interface performance',
    'Supports smooth lift operation',
    'Built for durability and stability',
    'Corrosion resistant',
    'Easy to install'
  ],
  'swing-doors': [
    'Door system designed for stable operation',
    'Supports smooth cabin entry and exit',
    'Safety-focused door performance',
    'Compatible with common elevator setups',
    'Available in various finishes',
    'Easy maintenance'
  ]
}

const SPECS_MAP = {
  'bottom-plengths': [
    { label: 'Material', value: 'Mild Steel (MS) / Structural Steel' },
    { label: 'Thickness', value: '3 mm – 8 mm' },
    { label: 'Width', value: '600 mm – 2500 mm' },
    { label: 'Length', value: '800 mm – 3000 mm' },
    { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' },
    { label: 'Load Capacity', value: '320 kg – 2000 kg+' },
    { label: 'Frame Type', value: 'Welded Reinforced Structure' }
  ],
  'full-vision-glass-doors': [
    { label: 'Glass Thickness', value: '8 mm – 12 mm Tempered Safety Glass' },
    { label: 'Door Opening Type', value: 'Center Opening / Side Opening' },
    { label: 'Opening Width', value: '700 mm – 1400 mm' },
    { label: 'Door Height', value: '2000 mm – 2400 mm' },
    { label: 'Frame Material', value: 'SS 304 Stainless Steel' },
    { label: 'Finish Options', value: 'Hairline, Mirror, Gold PVD, Black Titanium' },
    { label: 'Application', value: 'Passenger, Home, Commercial & Panoramic Elevators' }
  ],
  'over-speed-governors': [
    { label: 'Governor Speed Range', value: '0.5 m/s – 4.0 m/s' },
    { label: 'Governor Wheel Diameter', value: '200 mm – 600 mm' },
    { label: 'Rope Diameter Compatibility', value: '6 mm – 10 mm Steel Rope' },
    { label: 'Triggering Accuracy', value: '±5% of Rated Speed' },
    { label: 'Material', value: 'High-Strength Cast Iron / Steel Construction' },
    { label: 'Mounting Type', value: 'Machine Room & Machine Room-Less (MRL) Compatible' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
  ],
  'combination-brackets': [
    { label: 'Material', value: 'High-Grade Mild Steel (MS) / Structural Steel' },
    { label: 'Thickness', value: '6 mm – 12 mm' },
    { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Coating' },
    { label: 'Load Capacity', value: 'Suitable for Light to Heavy-Duty Elevator Installations' },
    { label: 'Mounting Type', value: 'Bolted or Welded Installation' },
    { label: 'Compatibility', value: 'T-Guide Rails, Counterweight & Cabin Systems' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
  ],
  'car-frames': [
    { label: 'Material', value: 'High-Strength Mild Steel (MS) / Structural Steel' },
    { label: 'Load Capacity', value: '320 kg – 3000 kg+' },
    { label: 'Frame Thickness', value: '6 mm – 16 mm' },
    { label: 'Construction Type', value: 'Welded Reinforced Frame Structure' },
    { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' },
    { label: 'Compliance', value: 'ISO 9001' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
  ],
  'buffer-springs': [
    { label: 'Material', value: 'High-Grade Spring Steel' },
    { label: 'Load Capacity', value: '320 kg – 3000 kg+' },
    { label: 'Spring Diameter', value: '80 mm – 250 mm' },
    { label: 'Spring Height', value: '100 mm – 500 mm' },
    { label: 'Compression Strength', value: 'Designed for High Impact Energy Absorption' },
    { label: 'Surface Finish', value: 'Anti-Corrosion Coated / Powder Coated' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
  ],
  'machine-bases': [
    { label: 'Material', value: 'Heavy-Duty Mild Steel (MS) / Structural Steel' },
    { label: 'Load Capacity', value: 'Suitable for Machines up to 5000 kg+' },
    { label: 'Thickness', value: '8 mm – 20 mm' },
    { label: 'Construction Type', value: 'Welded Reinforced Steel Structure' },
    { label: 'Vibration Control', value: 'Compatible with Anti-Vibration Pads & Mounts' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' },
    { label: 'Surface Finish', value: 'Powder Coated / Anti-Corrosion Paint' }
  ],
  'rope-thimbles': [
    { label: 'Material', value: 'Forged Steel / Galvanized Steel' },
    { label: 'Rope Compatibility', value: '6 mm – 16 mm Steel Wire Ropes' },
    { label: 'Construction Type', value: 'Heavy-Duty Reinforced Design' },
    { label: 'Surface Finish', value: 'Galvanized / Zinc-Coated for Corrosion Resistance' },
    { label: 'Load Capacity', value: 'Suitable for Elevator Suspension Applications' },
    { label: 'Wear Protection', value: 'Prevents Rope Bending and Abrasion at Loop Ends' },
    { label: 'Application', value: 'Passenger, Hospital, Goods & Home Elevators' }
  ],
  'swing-doors': [
    { label: 'Door Material', value: 'Mild Steel (MS) / Stainless Steel (SS 304)' },
    { label: 'Door Width', value: '700 mm – 1200 mm' },
    { label: 'Door Height', value: '2000 mm – 2400 mm' },
    { label: 'Panel Thickness', value: '1.2 mm – 2.0 mm' },
    { label: 'Finish Options', value: 'Powder Coated, Hairline, Mirror Finish, Gold PVD' },
    { label: 'Opening Type', value: 'Single Leaf / Double Leaf Manual Operation' },
    { label: 'Application', value: 'Home, Passenger, Hospital & Goods Elevators' }
  ]
}


function migratePart(part) {
  return {
    ...part,
    features: FEATURES_MAP[part.id] || part.features || [],
    specs:    SPECS_MAP[part.id]    || part.specs    || []
  }
}

export async function loadSpareParts() {
  const firebaseParts = await getAllSpareParts()
  return firebaseParts.map(migratePart)
}

export async function getSparePart(id) {
  return getSparePartById(id)
}

export async function saveSpareParts(parts) {
  if (Array.isArray(parts)) {
    await Promise.all(parts.map(p => saveSparePart(p)))
    return parts
  }
  return saveSparePart(parts)
}

export async function deleteSparePartData(id) {
  return deleteSparePart(id)
}

export async function uploadImage(file, fileName) {
  return uploadSparePartImage(file, fileName)
}

export async function getSparePartFiles() {
  return getSparePartImages()
}

export async function deleteSparePartFile(path) {
  return deleteSparePartImage(path)
}
