
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { HostelCard, HostelData } from "@/components/HostelCard";
import { NavBar } from "@/components/NavBar";
import { SearchBar, SearchFilters } from "@/components/SearchBar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BedDouble, CalendarRange, MapPin, Wifi, Check, AlertCircle } from "lucide-react";

// Mock data for tenant view
const MOCK_HOSTELS: HostelData[] = [
  {
    id: "1",
    name: "Sunrise Hostel",
    location: "Delhi",
    price: 500,
    amenities: ["Wi-Fi", "AC", "Laundry", "Kitchen"],
    totalBeds: 10,
    availableBeds: 4,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: "2",
    name: "City Central Hostel",
    location: "Mumbai",
    price: 700,
    amenities: ["Wi-Fi", "AC", "Study Room", "Common Area"],
    totalBeds: 15,
    availableBeds: 2,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: "3",
    name: "Student Haven",
    location: "Bangalore",
    price: 600,
    amenities: ["Wi-Fi", "Study Room", "Laundry", "Parking"],
    totalBeds: 20,
    availableBeds: 5,
    image: "https://images.unsplash.com/photo-1577896851867-2379275c3d6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "4",
    name: "Budget Stay",
    location: "Delhi",
    price: 400,
    amenities: ["Wi-Fi", "Common Area"],
    totalBeds: 25,
    availableBeds: 8,
    image: "https://images.unsplash.com/photo-1629794226066-349748040fb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "5",
    name: "Comfort Inn",
    location: "Chennai",
    price: 550,
    amenities: ["Wi-Fi", "AC", "Laundry", "Kitchen", "Study Room"],
    totalBeds: 12,
    availableBeds: 3,
    image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
  },
  {
    id: "6",
    name: "Urban Living",
    location: "Hyderabad",
    price: 650,
    amenities: ["Wi-Fi", "AC", "Parking", "Kitchen", "Common Area"],
    totalBeds: 18,
    availableBeds: 0,
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  }
];

const Tenant = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<HostelData[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<HostelData[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<HostelData | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check auth and load data
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.type !== "tenant") {
      navigate("/");
      return;
    }

    // Load mock data
    setHostels(MOCK_HOSTELS);
    setFilteredHostels(MOCK_HOSTELS);
  }, [navigate]);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...hostels];
    
    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(hostel => 
        hostel.name.toLowerCase().includes(query) || 
        hostel.location.toLowerCase().includes(query) || 
        hostel.amenities.some(a => a.toLowerCase().includes(query))
      );
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(hostel => 
        hostel.location === filters.location
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(hostel => 
      hostel.price >= filters.priceRange[0] && 
      hostel.price <= filters.priceRange[1]
    );
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(hostel => 
        filters.amenities.every(amenity => 
          hostel.amenities.includes(amenity)
        )
      );
    }
    
    setFilteredHostels(filtered);
  };

  const handleHostelDetails = (hostel: HostelData) => {
    setSelectedHostel(hostel);
    setDetailsDialogOpen(true);
  };

  const handleBookNow = () => {
    if (!selectedHostel) return;
    
    if (selectedHostel.availableBeds <= 0) {
      toast.error("No beds available at this hostel");
      return;
    }
    
    setDetailsDialogOpen(false);
    setBookingDialogOpen(true);
  };

  const completeBooking = () => {
    if (!selectedHostel) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update available beds count
      const updatedHostels = hostels.map(h => 
        h.id === selectedHostel.id 
          ? { ...h, availableBeds: Math.max(0, h.availableBeds - 1) } 
          : h
      );
      
      setHostels(updatedHostels);
      setFilteredHostels(filteredHostels.map(h => 
        h.id === selectedHostel.id 
          ? { ...h, availableBeds: Math.max(0, h.availableBeds - 1) } 
          : h
      ));
      
      setIsLoading(false);
      setBookingDialogOpen(false);
      
      toast.success("Booking confirmed! Check your email for details.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-velocity-900">Find Your Hostel</h1>
            <p className="text-muted-foreground">Search for hostels and book a bed</p>
          </div>

          <SearchBar onSearch={handleSearch} />

          {filteredHostels.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No hostels found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search filters to find more results
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <HostelCard 
                  key={hostel.id} 
                  hostel={hostel} 
                  onClick={handleHostelDetails}
                  actionLabel={hostel.availableBeds > 0 ? "Book Now" : "View Details"}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Hostel Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {selectedHostel && (
            <>
              <div className="aspect-video relative">
                <img 
                  src={selectedHostel.image || '/placeholder.svg'} 
                  alt={selectedHostel.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-2xl font-bold">{selectedHostel.name}</h2>
                  <div className="flex items-center text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedHostel.location}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <BedDouble className="h-5 w-5 text-velocity-500 mr-2" />
                      <span className="font-medium">
                        {selectedHostel.availableBeds} of {selectedHostel.totalBeds} beds available
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHostel.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-velocity-50 text-velocity-700">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-velocity-700">
                      ₹{selectedHostel.price}
                    </div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {selectedHostel.name} offers comfortable accommodation for students and travelers in {selectedHostel.location}. 
                      With {selectedHostel.totalBeds} beds and modern amenities, it's the perfect place for your stay.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedHostel.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-6 pt-0">
                <Button 
                  onClick={handleBookNow} 
                  className="w-full btn-velocity"
                  disabled={selectedHostel.availableBeds <= 0}
                >
                  {selectedHostel.availableBeds > 0 ? "Book Now" : "No Beds Available"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              You're about to book a bed at {selectedHostel?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostel</span>
                  <span className="font-medium">{selectedHostel?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{selectedHostel?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per night</span>
                  <span>₹{selectedHostel?.price}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold text-velocity-700">₹{selectedHostel?.price}</span>
              </CardFooter>
            </Card>
            
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <CalendarRange className="h-4 w-4 mr-2" />
              <span>Booking for tonight. Check-in available after 2 PM.</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBookingDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={completeBooking} 
              className="btn-velocity"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tenant;
