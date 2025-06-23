import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationUnitWithEvents } from "@lib/api/organizationUnitFn";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight, Calendar, Users } from "lucide-react";
import EditOrganizationUnit from "./editUnit";
import { DeleteUnitDialog } from "./deleteUnitDialog";

export const OrganizationUnitCard = ({
  unit,
  onRefresh,
}: {
  unit: OrganizationUnitWithEvents;
  onRefresh: () => void;
}) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-slate-50 flex flex-col">
      <CardHeader className="pb-2 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shadow-lg">
            <AvatarImage
              className="object-contain"
              src={getImageUrl(unit.image)}
              alt={unit.title}
            />
            <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary/10 text-primary">
              {unit.title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1 w-full">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 sm:line-clamp-1">
                {unit.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <DeleteUnitDialog unit={unit} onDeleted={onRefresh} />
                <EditOrganizationUnit unit={unit} onRefresh={onRefresh} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-white/50 text-xs sm:text-sm py-1 h-auto"
              >
                <Users className="h-3 w-3 mr-1 hidden sm:inline" />
                Active Chapter
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-0 text-xs sm:text-sm py-1 h-auto"
              >
                <Calendar className="h-3 w-3 mr-1 hidden sm:inline" />
                {unit.events.length} Events
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
          <CardDescription className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3">
            {unit.description}
          </CardDescription>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-6 pt-2 sm:pt-4 mt-auto">
        <Button
          className="w-full text-sm sm:text-base py-2 sm:py-3 "
          variant="default"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
