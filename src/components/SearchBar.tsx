
import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  location: string;
  priceRange: [number, number];
  amenities: string[];
}

const LOCATIONS = ["All Locations", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad"];
const AMENITIES = ["Wi-Fi", "AC", "Parking", "Laundry", "Kitchen", "Study Room", "Common Area"];

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [priceRange, setPriceRange] = useState<[number, number]>([300, 2000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      query,
      location: location === "All Locations" ? "" : location,
      priceRange,
      amenities: selectedAmenities,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setLocation("All Locations");
    setPriceRange([300, 2000]);
    setSelectedAmenities([]);
    onSearch({
      query: "",
      location: "",
      priceRange: [300, 2000],
      amenities: [],
    });
  };

  return (
    <div className="w-full space-y-4 glass-card p-4 rounded-lg animate-blur-in">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search hostels..."
            className="pl-9 input-focus-ring"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          className="btn-velocity"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="pt-3 border-t animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <ToggleGroup 
                  type="single" 
                  className="flex flex-wrap mt-1.5"
                  value={location}
                  onValueChange={(value) => setLocation(value || "All Locations")}
                >
                  {LOCATIONS.map((loc) => (
                    <ToggleGroupItem 
                      key={loc} 
                      value={loc}
                      className={cn(
                        "text-sm h-8",
                        location === loc ? "bg-velocity-100 text-velocity-800" : ""
                      )}
                    >
                      {loc === "All Locations" ? loc : (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{loc}</span>
                        </div>
                      )}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div>
                <div className="flex justify-between">
                  <Label className="text-sm font-medium">Price Range</Label>
                  <span className="text-sm text-muted-foreground">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  min={300}
                  max={2000}
                  step={100}
                  className="mt-2"
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Amenities</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {AMENITIES.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className={cn(
                        "cursor-pointer hover:bg-velocity-50",
                        selectedAmenities.includes(amenity) 
                          ? "bg-velocity-100 text-velocity-800 border-velocity-200" 
                          : ""
                      )}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-sm text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
