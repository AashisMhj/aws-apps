import CartTable from "@/components/CartTable";
import ErrorComponent from "@/components/ErrorComponent";
import StoreHeading from "@/components/StoreHeading";
import { getProducts } from "@/lib/api";

export default async function CheckOutPage() {
    const data = await getProducts();
    if (!data) return <ErrorComponent />
    return (
        <div className="mx-auto max-w-6xl">
            <StoreHeading />
            <CartTable products={data.data} />
        </div>
    );
}
