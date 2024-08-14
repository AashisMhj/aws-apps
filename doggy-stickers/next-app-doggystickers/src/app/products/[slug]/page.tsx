
import { getProductDetail, getProductSlugs } from '@/lib/api'
import ProductSection from '@/components/ProductSection';

export const dynamic = 'force-static'

// export async function getStaticParams() {
//     const res = await getProductSlugs();
//     return res.data.map(el => ({ slug: el.attributes.slug }));
//     try {
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

export default async function ProductPage({params: {slug}, searchParams: {}}: { params: {slug: string }, searchParams: {}}) {
    const data = await getProductDetail(slug);
    if(!data) return <div className='text-center text-4xl'>Error</div>
    return (
        <div className="min-h-screen py-12 sm:pt-20">
            <ProductSection productData={data.data[0]} />
        </div>
    )
}