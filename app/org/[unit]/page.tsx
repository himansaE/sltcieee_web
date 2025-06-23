import { notFound } from "next/navigation";
import { OrganizationUnitPage } from "@/features/organizationUnits/components/publicUnitPage";
import prisma from "@/lib/prisma";

export default async function OrganizationUnitDetail({
  params,
}: {
  params: { unit: string };
}) {
  try {
    console.log("Fetching organization unit with slug:", params.unit);

    // log all unit slugs
    const allUnits = await prisma.organizationUnit.findMany({
      select: { slug: true },
    });

    console.log(
      "Available organization unit slugs:",
      allUnits.map((u) => u.slug)
    );
    const organizationUnit = await prisma.organizationUnit.findUnique({
      where: { slug: params.unit },
      include: {
        events: {
          where: {
            status: {
              not: "draft",
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!organizationUnit) {
      notFound();
    }

    return <OrganizationUnitPage unit={organizationUnit} />;
  } catch (error) {
    console.error("Error fetching organization unit:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { unit: string };
}) {
  try {
    const unit = await prisma.organizationUnit.findUnique({
      where: { slug: params.unit },
      select: { title: true, description: true },
    });

    if (!unit) {
      return {
        title: "Organization Unit Not Found",
      };
    }

    return {
      title: `${unit.title} | IEEE SLTC`,
      description: unit.description,
      openGraph: {
        title: `${unit.title} | IEEE SLTC`,
        description: unit.description,
      },
    };
  } catch {
    return {
      title: "Organization Unit | IEEE SLTC",
    };
  }
}
