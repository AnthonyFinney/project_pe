import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Pen, ImageIcon, ShoppingCart, Code, Briefcase, Heart, Zap, Globe } from "lucide-react";

type CategoryFromConstants = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  promptCount: number;
};

type CategoryFromDb = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  prompt_count?: number;
};

interface CategoryCardProps {
  category: CategoryFromConstants | CategoryFromDb;
}

const iconMap: Record<string, LucideIcon> = {
  writing: Pen,
  image: ImageIcon,
  ecommerce: ShoppingCart,
  coding: Code,
  business: Briefcase,
  lifestyle: Heart,
  productivity: Zap,
  "social-media": Globe,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const title = (category as any).title ?? (category as any).name ?? "";
  const description = (category as any).description ?? "";
  const slug = (category as any).slug ?? (category as any).id;
  const count = (category as any).promptCount ?? (category as any).prompt_count ?? 0;

  let IconComp: LucideIcon = Pen;
  const rawIcon = (category as any).icon;
  if (typeof rawIcon === "function") {
    IconComp = rawIcon as LucideIcon;
  } else if (typeof rawIcon === "string" && iconMap[rawIcon]) {
    IconComp = iconMap[rawIcon];
  }

  return (
    <Link href={`/prompts?category=${encodeURIComponent(slug)}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <IconComp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{count} prompts</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
