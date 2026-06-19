/** Indian cities grouped by state/UT — used for autocomplete in address forms */
export const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep",
  "Puducherry",
];

type CityEntry = { city: string; state: string };

export const cities: CityEntry[] = [
  // Andhra Pradesh
  { city: "Visakhapatnam", state: "Andhra Pradesh" },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Guntur", state: "Andhra Pradesh" },
  { city: "Nellore", state: "Andhra Pradesh" },
  { city: "Kurnool", state: "Andhra Pradesh" },
  { city: "Rajahmundry", state: "Andhra Pradesh" },
  { city: "Tirupati", state: "Andhra Pradesh" },
  { city: "Kakinada", state: "Andhra Pradesh" },
  { city: "Kadapa", state: "Andhra Pradesh" },
  { city: "Anantapur", state: "Andhra Pradesh" },
  { city: "Eluru", state: "Andhra Pradesh" },
  { city: "Ongole", state: "Andhra Pradesh" },
  { city: "Machilipatnam", state: "Andhra Pradesh" },
  { city: "Tenali", state: "Andhra Pradesh" },

  // Arunachal Pradesh
  { city: "Itanagar", state: "Arunachal Pradesh" },
  { city: "Naharlagun", state: "Arunachal Pradesh" },
  { city: "Pasighat", state: "Arunachal Pradesh" },

  // Assam
  { city: "Guwahati", state: "Assam" },
  { city: "Silchar", state: "Assam" },
  { city: "Dibrugarh", state: "Assam" },
  { city: "Jorhat", state: "Assam" },
  { city: "Nagaon", state: "Assam" },
  { city: "Tinsukia", state: "Assam" },
  { city: "Tezpur", state: "Assam" },

  // Bihar
  { city: "Patna", state: "Bihar" },
  { city: "Gaya", state: "Bihar" },
  { city: "Bhagalpur", state: "Bihar" },
  { city: "Muzaffarpur", state: "Bihar" },
  { city: "Darbhanga", state: "Bihar" },
  { city: "Purnia", state: "Bihar" },
  { city: "Arrah", state: "Bihar" },
  { city: "Begusarai", state: "Bihar" },
  { city: "Katihar", state: "Bihar" },
  { city: "Munger", state: "Bihar" },
  { city: "Chhapra", state: "Bihar" },
  { city: "Sasaram", state: "Bihar" },
  { city: "Hajipur", state: "Bihar" },
  { city: "Bettiah", state: "Bihar" },
  { city: "Motihari", state: "Bihar" },

  // Chhattisgarh
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Bhilai", state: "Chhattisgarh" },
  { city: "Bilaspur", state: "Chhattisgarh" },
  { city: "Korba", state: "Chhattisgarh" },
  { city: "Durg", state: "Chhattisgarh" },
  { city: "Rajnandgaon", state: "Chhattisgarh" },
  { city: "Raigarh", state: "Chhattisgarh" },

  // Delhi
  { city: "New Delhi", state: "Delhi" },
  { city: "Dwarka", state: "Delhi" },
  { city: "Rohini", state: "Delhi" },
  { city: "Saket", state: "Delhi" },
  { city: "Karol Bagh", state: "Delhi" },
  { city: "Lajpat Nagar", state: "Delhi" },
  { city: "Connaught Place", state: "Delhi" },
  { city: "Hauz Khas", state: "Delhi" },

  // Goa
  { city: "Panaji", state: "Goa" },
  { city: "Margao", state: "Goa" },
  { city: "Vasco da Gama", state: "Goa" },
  { city: "Mapusa", state: "Goa" },
  { city: "Ponda", state: "Goa" },

  // Gujarat
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Surat", state: "Gujarat" },
  { city: "Vadodara", state: "Gujarat" },
  { city: "Rajkot", state: "Gujarat" },
  { city: "Bhavnagar", state: "Gujarat" },
  { city: "Jamnagar", state: "Gujarat" },
  { city: "Junagadh", state: "Gujarat" },
  { city: "Gandhinagar", state: "Gujarat" },
  { city: "Anand", state: "Gujarat" },
  { city: "Nadiad", state: "Gujarat" },
  { city: "Morbi", state: "Gujarat" },
  { city: "Surendranagar", state: "Gujarat" },
  { city: "Bharuch", state: "Gujarat" },
  { city: "Navsari", state: "Gujarat" },
  { city: "Bhuj", state: "Gujarat" },

  // Haryana
  { city: "Chandigarh", state: "Haryana" },
  { city: "Faridabad", state: "Haryana" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Panipat", state: "Haryana" },
  { city: "Ambala", state: "Haryana" },
  { city: "Karnal", state: "Haryana" },
  { city: "Sonipat", state: "Haryana" },
  { city: "Yamunanagar", state: "Haryana" },
  { city: "Panchkula", state: "Haryana" },
  { city: "Rohtak", state: "Haryana" },
  { city: "Hisar", state: "Haryana" },
  { city: "Bhiwani", state: "Haryana" },
  { city: "Rewari", state: "Haryana" },
  { city: "Sirsa", state: "Haryana" },

  // Himachal Pradesh
  { city: "Shimla", state: "Himachal Pradesh" },
  { city: "Dharamshala", state: "Himachal Pradesh" },
  { city: "Mandi", state: "Himachal Pradesh" },
  { city: "Solan", state: "Himachal Pradesh" },
  { city: "Kullu", state: "Himachal Pradesh" },
  { city: "Manali", state: "Himachal Pradesh" },
  { city: "Hamirpur", state: "Himachal Pradesh" },
  { city: "Palampur", state: "Himachal Pradesh" },

  // Jharkhand
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Jamshedpur", state: "Jharkhand" },
  { city: "Dhanbad", state: "Jharkhand" },
  { city: "Bokaro", state: "Jharkhand" },
  { city: "Deoghar", state: "Jharkhand" },
  { city: "Hazaribagh", state: "Jharkhand" },
  { city: "Giridih", state: "Jharkhand" },

  // Karnataka
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Mysuru", state: "Karnataka" },
  { city: "Hubballi", state: "Karnataka" },
  { city: "Mangaluru", state: "Karnataka" },
  { city: "Belagavi", state: "Karnataka" },
  { city: "Davangere", state: "Karnataka" },
  { city: "Ballari", state: "Karnataka" },
  { city: "Tumakuru", state: "Karnataka" },
  { city: "Shivamogga", state: "Karnataka" },
  { city: "Raichur", state: "Karnataka" },
  { city: "Bidar", state: "Karnataka" },
  { city: "Hospet", state: "Karnataka" },
  { city: "Gulbarga (Kalaburagi)", state: "Karnataka" },
  { city: "Udupi", state: "Karnataka" },
  { city: "Chikkamagaluru", state: "Karnataka" },

  // Kerala
  { city: "Thiruvananthapuram", state: "Kerala" },
  { city: "Kochi", state: "Kerala" },
  { city: "Kozhikode", state: "Kerala" },
  { city: "Thrissur", state: "Kerala" },
  { city: "Kollam", state: "Kerala" },
  { city: "Alappuzha", state: "Kerala" },
  { city: "Palakkad", state: "Kerala" },
  { city: "Kannur", state: "Kerala" },
  { city: "Kottayam", state: "Kerala" },
  { city: "Malappuram", state: "Kerala" },
  { city: "Pathanamthitta", state: "Kerala" },

  // Madhya Pradesh
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Jabalpur", state: "Madhya Pradesh" },
  { city: "Gwalior", state: "Madhya Pradesh" },
  { city: "Ujjain", state: "Madhya Pradesh" },
  { city: "Sagar", state: "Madhya Pradesh" },
  { city: "Dewas", state: "Madhya Pradesh" },
  { city: "Satna", state: "Madhya Pradesh" },
  { city: "Ratlam", state: "Madhya Pradesh" },
  { city: "Rewa", state: "Madhya Pradesh" },
  { city: "Murwara (Katni)", state: "Madhya Pradesh" },
  { city: "Singrauli", state: "Madhya Pradesh" },
  { city: "Burhanpur", state: "Madhya Pradesh" },
  { city: "Khandwa", state: "Madhya Pradesh" },
  { city: "Morena", state: "Madhya Pradesh" },

  // Maharashtra
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Thane", state: "Maharashtra" },
  { city: "Nashik", state: "Maharashtra" },
  { city: "Aurangabad", state: "Maharashtra" },
  { city: "Solapur", state: "Maharashtra" },
  { city: "Kolhapur", state: "Maharashtra" },
  { city: "Amravati", state: "Maharashtra" },
  { city: "Navi Mumbai", state: "Maharashtra" },
  { city: "Satara", state: "Maharashtra" },
  { city: "Sangli", state: "Maharashtra" },
  { city: "Malegaon", state: "Maharashtra" },
  { city: "Jalgaon", state: "Maharashtra" },
  { city: "Akola", state: "Maharashtra" },
  { city: "Latur", state: "Maharashtra" },
  { city: "Ahmednagar", state: "Maharashtra" },
  { city: "Dhule", state: "Maharashtra" },
  { city: "Chandrapur", state: "Maharashtra" },
  { city: "Parbhani", state: "Maharashtra" },
  { city: "Ichalkaranji", state: "Maharashtra" },
  { city: "Jalna", state: "Maharashtra" },
  { city: "Nanded", state: "Maharashtra" },
  { city: "Wardha", state: "Maharashtra" },
  { city: "Ratnagiri", state: "Maharashtra" },

  // Manipur
  { city: "Imphal", state: "Manipur" },
  { city: "Thoubal", state: "Manipur" },

  // Meghalaya
  { city: "Shillong", state: "Meghalaya" },
  { city: "Tura", state: "Meghalaya" },

  // Mizoram
  { city: "Aizawl", state: "Mizoram" },
  { city: "Lunglei", state: "Mizoram" },

  // Nagaland
  { city: "Kohima", state: "Nagaland" },
  { city: "Dimapur", state: "Nagaland" },

  // Odisha
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Cuttack", state: "Odisha" },
  { city: "Rourkela", state: "Odisha" },
  { city: "Berhampur", state: "Odisha" },
  { city: "Sambalpur", state: "Odisha" },
  { city: "Puri", state: "Odisha" },
  { city: "Balasore", state: "Odisha" },
  { city: "Bhadrak", state: "Odisha" },
  { city: "Baripada", state: "Odisha" },
  { city: "Jharsuguda", state: "Odisha" },

  // Punjab
  { city: "Ludhiana", state: "Punjab" },
  { city: "Amritsar", state: "Punjab" },
  { city: "Jalandhar", state: "Punjab" },
  { city: "Patiala", state: "Punjab" },
  { city: "Bathinda", state: "Punjab" },
  { city: "Mohali", state: "Punjab" },
  { city: "Pathankot", state: "Punjab" },
  { city: "Hoshiarpur", state: "Punjab" },
  { city: "Moga", state: "Punjab" },
  { city: "Abohar", state: "Punjab" },

  // Rajasthan
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Jodhpur", state: "Rajasthan" },
  { city: "Udaipur", state: "Rajasthan" },
  { city: "Kota", state: "Rajasthan" },
  { city: "Bikaner", state: "Rajasthan" },
  { city: "Ajmer", state: "Rajasthan" },
  { city: "Bhilwara", state: "Rajasthan" },
  { city: "Alwar", state: "Rajasthan" },
  { city: "Sri Ganganagar", state: "Rajasthan" },
  { city: "Bharatpur", state: "Rajasthan" },
  { city: "Pali", state: "Rajasthan" },
  { city: "Sikar", state: "Rajasthan" },
  { city: "Tonk", state: "Rajasthan" },
  { city: "Kishangarh", state: "Rajasthan" },
  { city: "Beawar", state: "Rajasthan" },

  // Sikkim
  { city: "Gangtok", state: "Sikkim" },
  { city: "Namchi", state: "Sikkim" },

  // Tamil Nadu
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Tiruchirappalli", state: "Tamil Nadu" },
  { city: "Salem", state: "Tamil Nadu" },
  { city: "Tirunelveli", state: "Tamil Nadu" },
  { city: "Vellore", state: "Tamil Nadu" },
  { city: "Erode", state: "Tamil Nadu" },
  { city: "Thoothukudi", state: "Tamil Nadu" },
  { city: "Dindigul", state: "Tamil Nadu" },
  { city: "Thanjavur", state: "Tamil Nadu" },
  { city: "Kanchipuram", state: "Tamil Nadu" },
  { city: "Nagercoil", state: "Tamil Nadu" },
  { city: "Karaikudi", state: "Tamil Nadu" },
  { city: "Cuddalore", state: "Tamil Nadu" },

  // Telangana
  { city: "Hyderabad", state: "Telangana" },
  { city: "Warangal", state: "Telangana" },
  { city: "Nizamabad", state: "Telangana" },
  { city: "Karimnagar", state: "Telangana" },
  { city: "Khammam", state: "Telangana" },
  { city: "Ramagundam", state: "Telangana" },
  { city: "Mahbubnagar", state: "Telangana" },
  { city: "Nalgonda", state: "Telangana" },
  { city: "Adilabad", state: "Telangana" },
  { city: "Siddipet", state: "Telangana" },

  // Tripura
  { city: "Agartala", state: "Tripura" },
  { city: "Udaipur (Tripura)", state: "Tripura" },

  // Uttar Pradesh
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Agra", state: "Uttar Pradesh" },
  { city: "Varanasi", state: "Uttar Pradesh" },
  { city: "Meerut", state: "Uttar Pradesh" },
  { city: "Allahabad (Prayagraj)", state: "Uttar Pradesh" },
  { city: "Ghaziabad", state: "Uttar Pradesh" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Bareilly", state: "Uttar Pradesh" },
  { city: "Aligarh", state: "Uttar Pradesh" },
  { city: "Moradabad", state: "Uttar Pradesh" },
  { city: "Gorakhpur", state: "Uttar Pradesh" },
  { city: "Faizabad (Ayodhya)", state: "Uttar Pradesh" },
  { city: "Jhansi", state: "Uttar Pradesh" },
  { city: "Saharanpur", state: "Uttar Pradesh" },
  { city: "Muzaffarnagar", state: "Uttar Pradesh" },
  { city: "Mathura", state: "Uttar Pradesh" },
  { city: "Shahjahanpur", state: "Uttar Pradesh" },
  { city: "Firozabad", state: "Uttar Pradesh" },
  { city: "Loni", state: "Uttar Pradesh" },
  { city: "Rampur", state: "Uttar Pradesh" },

  // Uttarakhand
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Haridwar", state: "Uttarakhand" },
  { city: "Rishikesh", state: "Uttarakhand" },
  { city: "Haldwani", state: "Uttarakhand" },
  { city: "Roorkee", state: "Uttarakhand" },
  { city: "Rudrapur", state: "Uttarakhand" },
  { city: "Kashipur", state: "Uttarakhand" },
  { city: "Nainital", state: "Uttarakhand" },
  { city: "Mussoorie", state: "Uttarakhand" },

  // West Bengal
  { city: "Kolkata", state: "West Bengal" },
  { city: "Howrah", state: "West Bengal" },
  { city: "Durgapur", state: "West Bengal" },
  { city: "Asansol", state: "West Bengal" },
  { city: "Siliguri", state: "West Bengal" },
  { city: "Bardhaman", state: "West Bengal" },
  { city: "Malda", state: "West Bengal" },
  { city: "Kharagpur", state: "West Bengal" },
  { city: "Haldia", state: "West Bengal" },
  { city: "Krishnanagar", state: "West Bengal" },
  { city: "Balurghat", state: "West Bengal" },
  { city: "Jalpaiguri", state: "West Bengal" },

  // Union Territories
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Port Blair", state: "Andaman & Nicobar" },
  { city: "Srinagar", state: "Jammu & Kashmir" },
  { city: "Jammu", state: "Jammu & Kashmir" },
  { city: "Anantnag", state: "Jammu & Kashmir" },
  { city: "Baramulla", state: "Jammu & Kashmir" },
  { city: "Leh", state: "Ladakh" },
  { city: "Kargil", state: "Ladakh" },
  { city: "Kavaratti", state: "Lakshadweep" },
  { city: "Puducherry", state: "Puducherry" },
  { city: "Silvassa", state: "Dadra & Nagar Haveli" },
  { city: "Daman", state: "Daman & Diu" },
  { city: "Diu", state: "Daman & Diu" },
];

/** Search cities by a query string (case-insensitive prefix match) */
export function searchCities(query: string): CityEntry[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return cities.filter(
    (c) => c.city.toLowerCase().startsWith(q) || c.city.toLowerCase().includes(" " + q)
  ).slice(0, 8);
}

/** Search states by a query string */
export function searchStates(query: string): string[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return states.filter((s) => s.toLowerCase().startsWith(q)).slice(0, 6);
}
