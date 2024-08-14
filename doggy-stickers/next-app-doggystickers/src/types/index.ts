export type ImageFormatType = {
    ext: string,
    url: string,
    hash: string,
    mime: string,
    name: string,
    path: string | null,
    size: number,
    width: number,
    height: number,
    sizeInBytes: number
}
export type VariantType = {
    id: number,
    type: string,
    price: number
}
export type ImageType = {
    id: string,
    attributes: {
        name: string,
        alternativeText: string | null,
        caption: string | null,
        width: number,
        height: number,
        formats: {
            small: ImageFormatType,
            medium: ImageFormatType,
            thumbnail: ImageFormatType
        },
        hash: string,
        ext: string,
        mime: string,
        size: number,
        url: string,
        previewUrl: string | null,
        provider: string,
        provider_metadata: string | null,
        createdAt: string,
        updatedAt: string
    }
}
export type OnlyProductType = {
    id: number,
    attributes: {
        slug: string
    }
}
export type ProductType = {
    id: number,
    attributes: {
        title: string,
        short_description: string,
        description: Array<{
            type: string,
            children: Array<{text: string, type: string}>
        }>,
        createdAt: string,
        updatedAt: string,
        publishedAt: string,
        main_image: { data: ImageType},
        images: {data: Array<ImageType>},
        variant: Array<VariantType>,
        slug: string
    }
}
export type ProductSlugResType = {
    data: OnlyProductType[],
    meta: {
        pagination: {
            page: number,
            pageSize: number,
            pageCount: number,
            total: number
        }
    }
}
export type ProductsResType = {
    data: ProductType[],
    meta: {
        pagination: {
            page: number,
            pageSize: number,
            pageCount: number,
            total: number
        }
    }
}
// export type ProductsType = {
//     id: number,
//     products: {
//         id: string,
//         title: string,
//         description: string,
//         slug: string,
//         images: {
//             id: string,
//             src: string,
//             altText: string
//         }[],
//         price: number,
//         variants: {
//             slug: string,
//             title: string,
//             id: number,
//             price: number,
//             variantQuantity: number,
//             images: {
//                 id: string,
//                 src: string,
//                 altText: string
//             }
//         }[]
//     }[]
// }