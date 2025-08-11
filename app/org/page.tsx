import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export default async function OrgIndexPage() {
	const units = await prisma.organizationUnit.findMany({
		select: { slug: true, title: true, description: true, image: true },
		orderBy: { title: "asc" },
	});

	return (
		<section className="max-w-6xl mx-auto px-6 py-12">
			<h1 className="text-3xl md:text-4xl font-bold mb-8">Chapters & Affinity</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{units.map((u) => (
					<Link
						key={u.slug}
						href={`/org/${u.slug}`}
						className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
					>
						<div className="relative aspect-[16/9]">
							<Image
								src={/^https?:\/\//.test(u.image) ? u.image : getImageUrl(u.image)}
								alt={u.title}
								fill
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
						</div>
						<div className="p-4">
							<h2 className="text-lg font-semibold group-hover:text-cyan-300 transition-colors">{u.title}</h2>
							<p className="text-sm text-gray-300 line-clamp-2 mt-1">{u.description}</p>
							<span className="inline-flex items-center gap-1 text-cyan-300 mt-3 text-sm">
								View more
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
