
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HostelData {
  id: string;
  name: string;
  location: string;
  price: number;
  amenities: string[];
  totalBeds: number;
  availableBeds: number;
  image: string;
}

interface HostelCardProps {
  hostel: HostelData;
  onClick?: (hostel: HostelData) => void;
  actionLabel?: string;
  isOwner?: boolean;
}

export function HostelCard({ 
  hostel, 
  onClick, 
  actionLabel = "View Details",
  isOwner = false 
}: HostelCardProps) {
  
  return (
    <Card className="overflow-hidden hover-lift glass-card">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={hostel.image || '/placeholder.svg'} 
          alt={hostel.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge 
            className={cn(
              "text-xs font-medium",
              hostel.availableBeds > 0 
                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                : "bg-red-100 text-red-800 hover:bg-red-200"
            )}
          >
            {hostel.availableBeds} bed{hostel.availableBeds !== 1 && 's'} available
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{hostel.name}</CardTitle>
          <div className="text-lg font-bold text-velocity-700">
            ₹{hostel.price}<span className="text-sm text-muted-foreground">/night</span>
          </div>
        </div>
        <CardDescription className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-velocity-500" />
          {hostel.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <BedDouble className="h-4 w-4 mr-1 text-velocity-500" />
          <span>{hostel.totalBeds} total beds</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="bg-velocity-50 text-velocity-700">
              {amenity}
            </Badge>
          ))}
          {hostel.amenities.length > 3 && (
            <Badge variant="outline" className="bg-velocity-50 text-velocity-700">
              +{hostel.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full btn-velocity" 
          onClick={() => onClick && onClick(hostel)}
        >
          {isOwner ? "Manage Hostel" : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
