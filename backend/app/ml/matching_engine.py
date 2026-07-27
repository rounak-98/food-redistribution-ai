import math
from typing import List, Dict, Any

def compute_haversine_distance(lat1, lon1, lat2, lon2) -> float:
    """
    Computes precise distance between two GPS coordinates in kilometers.
    """
    if not all([lat1, lon1, lat2, lon2]):
        return 5.0
    try:
        lat1, lon1 = math.radians(float(lat1)), math.radians(float(lon1))
        lat2, lon2 = math.radians(float(lat2)), math.radians(float(lon2))
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        return round(6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)
    except (ValueError, TypeError):
        return 5.0


def rank_ngo_matches(donor_lat: float, donor_lng: float, ngo_list: List[Dict[str, Any]], food_category: str = "Meals") -> List[Dict[str, Any]]:
    """
    Ranks nearby registered NGOs using a multi-factor recommendation algorithm:
    Score = (Distance Weight * 0.5) + (Category Affinity * 0.3) + (Capacity Score * 0.2)
    """
    ranked_ngos = []

    for ngo in ngo_list:
        dist = compute_haversine_distance(donor_lat, donor_lng, ngo.get("latitude"), ngo.get("longitude"))
        
        # Proximity score (0 - 100, max 20km)
        proximity_score = max(0, 100 - (dist * 4.5))
        
        # Category affinity boost
        affinity_boost = 90.0 if "Meal" in food_category or "Cooked" in food_category else 80.0
        
        # Final match confidence score
        match_score = round((proximity_score * 0.55) + (affinity_boost * 0.45), 1)

        ranked_ngos.append({
            "ngo_id": ngo.get("id"),
            "ngo_name": ngo.get("ngo_name"),
            "distance_km": dist,
            "match_confidence_pct": min(match_score, 99.0),
            "address": ngo.get("address"),
            "phone": ngo.get("phone")
        })

    # Sort descending by match confidence score
    ranked_ngos.sort(key=lambda x: x["match_confidence_pct"], reverse=True)
    return ranked_ngos


def rank_volunteer_riders(pickup_lat: float, pickup_lng: float, volunteer_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks active volunteer transport riders by proximity and vehicle capacity.
    """
    ranked_riders = []

    for vol in volunteer_list:
        dist = compute_haversine_distance(pickup_lat, pickup_lng, vol.get("latitude"), vol.get("longitude"))
        
        vehicle_boost = 15.0 if vol.get("vehicle_type") in ["Van", "Auto"] else 10.0
        dist_score = max(0, 85 - (dist * 5.0)) + vehicle_boost
        
        ranked_riders.append({
            "volunteer_id": vol.get("id"),
            "full_name": vol.get("full_name"),
            "vehicle_type": vol.get("vehicle_type", "Bike"),
            "distance_km": dist,
            "dispatch_score": round(min(dist_score, 98.0), 1),
            "is_online": bool(vol.get("is_online", True))
        })

    ranked_riders.sort(key=lambda x: x["dispatch_score"], reverse=True)
    return ranked_riders
