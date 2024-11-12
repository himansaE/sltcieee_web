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
import { ArrowRight } from "lucide-react";

export const OrganizationUnitCard: React.FC<{
  unit: OrganizationUnitWithEvents;
}> = ({ unit }) => {
  return (
    <Card key={unit.id} className="flex flex-col rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage
            className="object-contain"
            src={getImageUrl(unit.image)}
            alt={unit.title}
          />
          <AvatarFallback>{unit.title.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Badge variant="secondary" className="ml-2">
          {unit.events.length} events
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-2xl font-bold mb-2">{unit.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4">
          {unit.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
