
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { HostelCard, HostelData } from "@/components/HostelCard";
import { NavBar } from "@/components/NavBar";
import { BedManagement, Bed } from "@/components/BedManagement";
import { Plus, BedDouble, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for hostel owner
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
  }
];

// Mock beds for the hostels
const MOCK_BEDS: Record<string, Bed[]> = {
  "1": Array.from({ length: 10 }, (_, i) => ({
    id: `bed-1-${i+1}`,
    number: i+1,
    isOccupied: i < 6,
    tenantName: i < 6 ? `Tenant ${i+1}` : undefined,
    tenantPhone: i < 6 ? `999999999${i}` : undefined
  })),
  "2": Array.from({ length: 15 }, (_, i) => ({
    id: `bed-2-${i+1}`,
    number: i+1,
    isOccupied: i < 13,
    tenantName: i < 13 ? `Tenant ${i+1}` : undefined,
    tenantPhone: i < 13 ? `999999999${i}` : undefined
  }))
};

const HostelOwner = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<HostelData[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<HostelData | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddBedDialog, setShowAddBedDialog] = useState(false);
  const [newHostel, setNewHostel] = useState({
    name: "",
    location: "",
    price: "",
    amenities: "",
    totalBeds: "",
    image: ""
  });
  const [managingBeds, setManagingBeds] = useState(false);

  // Check auth and load data
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.type !== "owner") {
      navigate("/");
      return;
    }

    // Load mock data
    setHostels(MOCK_HOSTELS);
  }, [navigate]);

  const handleManageHostel = (hostel: HostelData) => {
    setSelectedHostel(hostel);
    setBeds(MOCK_BEDS[hostel.id] || []);
    setManagingBeds(true);
  };

  const handleBedsUpdate = (updatedBeds: Bed[]) => {
    if (!selectedHostel) return;
    
    setBeds(updatedBeds);
    MOCK_BEDS[selectedHostel.id] = updatedBeds;
    
    // Update the available beds count in the hostel data
    const availableBeds = updatedBeds.filter(bed => !bed.isOccupied).length;
    const updatedHostels = hostels.map(h => 
      h.id === selectedHostel.id 
        ? { ...h, availableBeds } 
        : h
    );
    
    setHostels(updatedHostels);
    setSelectedHostel(prev => prev ? { ...prev, availableBeds } : null);
  };

  const handleAddHostel = () => {
    // Validate fields
    if (
      !newHostel.name.trim() ||
      !newHostel.location.trim() ||
      !newHostel.price.trim() ||
      !newHostel.totalBeds.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const price = parseInt(newHostel.price);
    const totalBeds = parseInt(newHostel.totalBeds);

    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (isNaN(totalBeds) || totalBeds <= 0) {
      toast.error("Please enter a valid number of beds");
      return;
    }

    // Create new hostel
    const newId = `${hostels.length + 1}`;
    const amenitiesArray = newHostel.amenities
      .split(",")
      .map(a => a.trim())
      .filter(a => a);

    const newHostelData: HostelData = {
      id: newId,
      name: newHostel.name,
      location: newHostel.location,
      price,
      amenities: amenitiesArray.length > 0 ? amenitiesArray : ["Basic"],
      totalBeds,
      availableBeds: totalBeds,
      image: newHostel.image || "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
    };

    // Create beds for the new hostel
    MOCK_BEDS[newId] = Array.from({ length: totalBeds }, (_, i) => ({
      id: `bed-${newId}-${i+1}`,
      number: i+1,
      isOccupied: false
    }));

    setHostels([...hostels, newHostelData]);
    setShowAddDialog(false);
    
    // Reset form
    setNewHostel({
      name: "",
      location: "",
      price: "",
      amenities: "",
      totalBeds: "",
      image: ""
    });
    
    toast.success("New hostel added successfully!");
  };

  const handleAddBed = () => {
    if (!selectedHostel) return;
    
    const newBeds = [
      ...beds,
      {
        id: `bed-${selectedHostel.id}-${beds.length + 1}`,
        number: beds.length + 1,
        isOccupied: false
      }
    ];
    
    setBeds(newBeds);
    MOCK_BEDS[selectedHostel.id] = newBeds;
    
    // Update hostel data
    const updatedHostels = hostels.map(h => 
      h.id === selectedHostel.id 
        ? { 
            ...h, 
            totalBeds: h.totalBeds + 1,
            availableBeds: h.availableBeds + 1
          } 
        : h
    );
    
    setHostels(updatedHostels);
    setSelectedHostel(prev => prev ? {
      ...prev,
      totalBeds: prev.totalBeds + 1,
      availableBeds: prev.availableBeds + 1
    } : null);
    
    setShowAddBedDialog(false);
    toast.success("New bed added successfully!");
  };

  const handleBackToHostels = () => {
    setManagingBeds(false);
    setSelectedHostel(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        {managingBeds && selectedHostel ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-1.5"
                onClick={handleBackToHostels}
              >
                Back to Hostels
              </Button>
              <Button 
                className="flex items-center gap-1.5 btn-velocity"
                onClick={() => setShowAddBedDialog(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Bed
              </Button>
            </div>
            
            <BedManagement 
              hostelId={selectedHostel.id}
              hostelName={selectedHostel.name}
              beds={beds}
              onBedsUpdate={handleBedsUpdate}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-velocity-900">My Hostels</h1>
                <p className="text-muted-foreground">Manage your properties and bed availability</p>
              </div>
              <Button 
                className="flex items-center gap-1.5 btn-velocity"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Hostel
              </Button>
            </div>

            {hostels.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-velocity-100 text-velocity-700 mb-4">
                  <Building className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No hostels added yet</h2>
                <p className="text-muted-foreground mb-6">
                  Add your first hostel to start managing your property
                </p>
                <Button 
                  className="inline-flex items-center gap-1.5 btn-velocity"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add New Hostel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                  <HostelCard 
                    key={hostel.id} 
                    hostel={hostel} 
                    onClick={handleManageHostel}
                    isOwner
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Hostel Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Hostel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Hostel Name</Label>
              <Input
                id="name"
                placeholder="Enter hostel name"
                value={newHostel.name}
                onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Area"
                value={newHostel.location}
                onChange={(e) => setNewHostel({...newHostel, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per Night (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="500"
                  value={newHostel.price}
                  onChange={(e) => setNewHostel({...newHostel, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Total Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  placeholder="10"
                  value={newHostel.totalBeds}
                  onChange={(e) => setNewHostel({...newHostel, totalBeds: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                placeholder="Wi-Fi, AC, Laundry"
                value={newHostel.amenities}
                onChange={(e) => setNewHostel({...newHostel, amenities: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={newHostel.image}
                onChange={(e) => setNewHostel({...newHostel, image: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button className="btn-velocity" onClick={handleAddHostel}>
              Add Hostel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bed Dialog */}
      <Dialog open={showAddBedDialog} onOpenChange={setShowAddBedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex items-center justify-center">
            <div className="text-center">
              <BedDouble className="h-16 w-16 text-velocity-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Add a new bed to {selectedHostel?.name}</p>
              <p className="text-muted-foreground mt-1">
                This will add bed #{beds.length + 1} to your hostel
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBedDialog(false)}>
              Cancel
            </Button>
            <Button className="btn-velocity" onClick={handleAddBed}>
              Add Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelOwner;

// For Lucide icons import
import { Building } from "lucide-react";
