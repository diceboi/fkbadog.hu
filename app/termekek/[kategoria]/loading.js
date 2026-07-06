import ProductsHero from "@/components/products/ProductsHero";

export default function Loading() {
  return (
    <>
      <div className="relative bg-linear-to-b from-black-mid via-black-mid to-cream">
        {/* Render ProductsHero immediately (since bgImage is not provided, it instantly displays the dark shimmer placeholder background) */}
        <ProductsHero
          title="Termékek"
          breadcrumbs={[
            { href: "/termekek", label: "Termékek" },
            { label: "Betöltés..." },
          ]}
        />
      </div>
      <section className="bg-cream py-12 min-h-[60vh]">
        <div className="mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Skeleton */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div 
              className="h-12 w-full shimmer-placeholder rounded-lg" 
              style={{ backgroundColor: "#FFFFFF" }} 
            />
            <div 
              className="h-[320px] w-full shimmer-placeholder rounded-lg" 
              style={{ backgroundColor: "#FFFFFF" }} 
            />
          </div>

          {/* Product Grid Skeleton */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-[340px] w-full bg-white border border-black/10 rounded-lg p-6 flex flex-col justify-between"
              >
                <div 
                  className="h-[140px] w-full shimmer-placeholder rounded" 
                  style={{ backgroundColor: "#f2f2eb" }} 
                />
                <div className="flex flex-col gap-2 mt-4 flex-1">
                  <div 
                    className="h-5 w-3/4 shimmer-placeholder rounded" 
                    style={{ backgroundColor: "#f2f2eb" }} 
                  />
                  <div 
                    className="h-4 w-1/2 shimmer-placeholder rounded" 
                    style={{ backgroundColor: "#f2f2eb" }} 
                  />
                </div>
                <div className="h-10 w-full bg-gray-mid rounded-lg mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
