import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationUnit } from "@prisma/client";
import { ArrowRight, Badge, BarChart2, Calendar, Users } from "lucide-react";

export const OrganizationUnitCard: React.FC<{
  unit: OrganizationUnit;
}> = ({ unit }) => {
  return (
    <Card key={unit.id} className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={unit.image} alt={unit.title} />
          <AvatarFallback>{org.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Badge variant="secondary" className="ml-2">
          {org.eventCount} events
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-2xl font-bold mb-2">{org.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4">
          {org.description}
        </CardDescription>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm font-medium">Events</p>
              <p className="text-lg font-bold">{org.eventCount}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm font-medium">Members</p>
              <p className="text-lg font-bold">{org.memberCount}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Recent Activity</p>
            <p className="text-sm text-muted-foreground">
              {org.recentActivity}
            </p>
          </div>
        </div>
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
