"""
Geo-Spatial Partner Locator & Router Service.
Filters authorized Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs) by:
1. Haversine geographical distance from the applicant
2. Scheme category eligibility
3. Healthy NPA ratio (< 5.0%)
4. Active fund quota availability (utilization < 95%)
"""

import json
import math
import os
from typing import List, Dict, Any, Optional

PARTNERS_FILE = "data/channel_partners.json"

class PartnerLocatorService:
    def __init__(self, partners_path: str = PARTNERS_FILE):
        self.partners_path = partners_path
        self.partners = self._load_partners()
        
    def _load_partners(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.partners_path):
            raise FileNotFoundError(f"Channel partners dataset not found at {self.partners_path}")
        with open(self.partners_path, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates great-circle distance between two points in kilometers."""
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2.0) ** 2 +
            math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(R * c, 2)

    def find_nearest_partners(
        self,
        user_lat: float,
        user_lon: float,
        scheme_category: Optional[str] = None,
        filter_high_npa: bool = True,
        filter_exhausted_funds: bool = True,
        max_results: int = 10,
        state_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Returns ranked list of channel partners with routing links, fund health status, and distance.
        """
        results = []
        excluded_count = 0
        
        for p in self.partners:
            # Scheme category match
            if scheme_category and scheme_category not in p.get("supported_scheme_categories", []):
                continue
                
            # State filter match (if specified)
            if state_filter and state_filter.lower() not in p.get("state", "").lower():
                continue
                
            is_npa_high = p.get("is_npa_high", False) or (p.get("npa_ratio_pct", 0) > 5.0)
            is_exhausted = (not p.get("is_fund_available", True)) or (p.get("fund_utilization_pct", 0) >= 95.0)
            
            # Eligibility flags
            is_partner_eligible = not (is_npa_high or is_exhausted)
            
            if filter_high_npa and is_npa_high:
                excluded_count += 1
                continue
                
            if filter_exhausted_funds and is_exhausted:
                excluded_count += 1
                continue
                
            dist_km = self.haversine_distance(user_lat, user_lon, p["latitude"], p["longitude"])
            
            # Google Maps Directions URL
            maps_url = f"https://www.google.com/maps/dir/?api=1&destination={p['latitude']},{p['longitude']}"
            
            results.append({
                **p,
                "distance_km": dist_km,
                "is_partner_eligible": is_partner_eligible,
                "status_badge": "Available & Active" if is_partner_eligible else ("High NPA Overdue" if is_npa_high else "Fund Quota Exhausted"),
                "status_color": "green" if is_partner_eligible else ("red" if is_npa_high else "amber"),
                "directions_url": maps_url
            })
            
        # Sort by distance
        results.sort(key=lambda x: x["distance_km"])
        
        return {
            "status": "success",
            "user_coordinates": {"latitude": user_lat, "longitude": user_lon},
            "total_found": len(results),
            "excluded_unhealthy_partners": excluded_count,
            "partners": results[:max_results]
        }

# Global singleton
_locator_instance = None

def get_locator() -> PartnerLocatorService:
    global _locator_instance
    if _locator_instance is None:
        _locator_instance = PartnerLocatorService()
    return _locator_instance
