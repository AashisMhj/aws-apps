import ErrorComponent from "@/components/ErrorComponent";
import ProductListings from "@/components/ProductListing";
import StoreHeading from "@/components/StoreHeading";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const data = await getProducts();
  if(!data) return <ErrorComponent />
  return (
    <div className="mx-auto max-w-6xl">
      <StoreHeading />
      <ProductListings products={data.data} />      
    </div>
  );
}
