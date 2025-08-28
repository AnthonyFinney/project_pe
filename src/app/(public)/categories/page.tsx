import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await supabaseServer();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, icon, prompt_count")
    .order("name", { ascending: true });

  if (error) {
    // Render a simple error state
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center text-red-600">Failed to load categories.</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover AI prompts organized by category to help you get the most out of your AI tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(categories ?? []).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
