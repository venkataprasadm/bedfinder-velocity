
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { BedDouble, User, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export interface Bed {
  id: string;
  number: number;
  isOccupied: boolean;
  tenantName?: string;
  tenantPhone?: string;
}

interface BedManagementProps {
  hostelId: string;
  hostelName: string;
  beds: Bed[];
  onBedsUpdate: (beds: Bed[]) => void;
}

export function BedManagement({ hostelId, hostelName, beds, onBedsUpdate }: BedManagementProps) {
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);

  const handleOpenDialog = (bed: Bed, removing = false) => {
    setSelectedBed(bed);
    setTenantName(bed.tenantName || "");
    setTenantPhone(bed.tenantPhone || "");
    setIsRemoving(removing);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedBed) return;

    if (!isRemoving && (!tenantName.trim() || !tenantPhone.trim())) {
      toast.error("Please fill all the tenant details");
      return;
    }

    const updatedBeds = beds.map(bed => {
      if (bed.id === selectedBed.id) {
        if (isRemoving) {
          return {
            ...bed,
            isOccupied: false,
            tenantName: undefined,
            tenantPhone: undefined
          };
        } else {
          return {
            ...bed,
            isOccupied: true,
            tenantName,
            tenantPhone
          };
        }
      }
      return bed;
    });

    onBedsUpdate(updatedBeds);
    setDialogOpen(false);
    
    toast.success(
      isRemoving 
        ? `Bed #${selectedBed.number} is now vacant` 
        : `Tenant ${tenantName} assigned to Bed #${selectedBed.number}`
    );
  };

  return (
    <>
      <Card className="glass-card animate-scale-in">
        <CardHeader>
          <CardTitle className="text-xl">Manage Beds</CardTitle>
          <CardDescription>
            Hostel: {hostelName} ({beds.filter(b => !b.isOccupied).length} of {beds.length} beds available)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {beds.map((bed) => (
              <Card 
                key={bed.id} 
                className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden",
                  bed.isOccupied 
                    ? "bg-red-50 border-red-200" 
                    : "bg-green-50 border-green-200"
                )}
                onClick={() => handleOpenDialog(bed, bed.isOccupied)}
              >
                <div className="absolute top-0 right-0 p-1">
                  {bed.isOccupied ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <BedDouble 
                    className={cn(
                      "h-10 w-10 mb-1", 
                      bed.isOccupied ? "text-red-400" : "text-green-400"
                    )} 
                  />
                  <p className="font-semibold text-sm">
                    Bed #{bed.number}
                  </p>
                  {bed.isOccupied && bed.tenantName && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <p className="line-clamp-1">{bed.tenantName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Click on a bed to {beds.some(b => b.isOccupied) ? "assign or remove" : "assign"} a tenant
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRemoving 
                ? `Remove Tenant from Bed #${selectedBed?.number}` 
                : `Assign Tenant to Bed #${selectedBed?.number}`}
            </DialogTitle>
            <DialogDescription>
              {isRemoving 
                ? `This will mark the bed as vacant and remove ${selectedBed?.tenantName} as the tenant.` 
                : "Fill in the tenant details to assign them to this bed."}
            </DialogDescription>
          </DialogHeader>

          {!isRemoving && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tenant Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter tenant name"
                    className="pl-9"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className={isRemoving ? "bg-red-600 hover:bg-red-700" : "btn-velocity"}
            >
              {isRemoving ? "Remove Tenant" : "Assign Bed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
