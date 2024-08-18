
import { getProductDetail, getProductSlugs } from '@/lib/api'
import ProductSection from '@/components/ProductSection';
import ErrorComponent from '@/components/ErrorComponent';

// export const dynamic = 'force-static'

export async function generateStaticParams() {
    try {
        const res = await getProductSlugs();
        return res.data.map(el => ({ slug: el.attributes.slug }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default async function ProductPage({params: {slug}, searchParams: {}}: { params: {slug: string }, searchParams: {}}) {
    const data = await getProductDetail(slug);
    if(!data) return <ErrorComponent />
    return (
        <div className="min-h-screen py-12 sm:pt-20">
            <ProductSection productData={data.data[0]} />
        </div>
    )
}