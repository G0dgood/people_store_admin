"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
	useGetOfficeProductByIdQuery as useGetProductByIdQuery,
	useGetOfficeBySubdomainQuery
} from "@/lib/redux/services/officeLocationApi";
import { OfficeLocationHeader } from "../../components/OfficeLocationHeader";
import OfficeLocationFooter from "../../components/OfficeLocationFooter";
import { SVGLoaderFetch } from "@/app/components/Options";
import { ProductGallery } from "@/app/components/Products/ProductGallery";
import { ProductDetailsInfo } from "@/app/components/Products/ProductDetailsInfo";
import { ProductDescription } from "@/app/components/Products/ProductDescription";
import { RelatedProducts } from "@/app/components/Products/RelatedProducts";
import { OfficeLocationBreadcrumbs } from "../../components/OfficeLocationBreadcrumbs";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function OfficeProductDetailQueryPage() {
	const searchParams = useSearchParams();

	// Extract product ID and subdomain from query params
	const productId = searchParams.get("id");

	const subdomain = useMemo(() => {
		const rawParams = searchParams.toString();
		if (rawParams.includes("subdomain/")) {
			return rawParams.split("subdomain/")[1].split("&")[0];
		}
		return searchParams.get("subdomain");
	}, [searchParams]);

	const { data: productRes, isLoading: isLoadingProduct } = useGetProductByIdQuery({
		productId: productId || "",
	}, {
		skip: !productId
	});

	const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(subdomain || "", {
		skip: !subdomain
	});

	console.log('officeRes----->', officeRes)

	const product = productRes?.data;
	const office = officeRes?.data;

	// Check if product is available at this office
	const isAvailableHere = useMemo(() => {
		if (!product || !office) return false;
		return product.locations?.some((loc: any) =>
			(typeof loc === 'string' && loc === office._id) ||
			(typeof loc === 'object' && loc._id === office._id)
		);
	}, [product, office]);

	if (!productId) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white p-6">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-black text-rose-500">No Product ID Specified</h1>
					<p className="text-gray-500 max-w-md">Please use a valid product link.</p>
				</div>
			</div>
		);
	}

	if (isLoadingProduct || isLoadingOffice) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<SVGLoaderFetch text="Loading luxury details..." />
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen flex flex-col">
				<OfficeLocationHeader />
				<main className="flex-1 flex items-center justify-center p-6">
					<div className="text-center space-y-4">
						<h1 className="text-2xl font-black text-rose-500 uppercase tracking-tighter">Product Not Found</h1>
						<p className="text-gray-500 max-w-md">The requested piece could not be located in our collection.</p>
					</div>
				</main>
				<OfficeLocationFooter />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FDFDFD] flex flex-col">
			<OfficeLocationHeader />

			<div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-6 md:gap-10 w-full">
				<OfficeLocationBreadcrumbs
					items={[
						{ label: product.category?.name || "Products" },
						{ label: product.name }
					]}
					className="pb-2 border-b border-gray-200 w-full"
				/>

				<div className="">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
						<div className="w-full">
							<ProductGallery
								images={product.media?.map((m: any) => m.url) || [product.productImage]}
								title={product.name}
							/>
						</div>

						{/* Right: Info */}
						<div className="w-full">
							<ProductDetailsInfo product={product} />
						</div>
					</div>

					{/* Details Tabs */}
					<div className="mt-24 max-w-4xl">
						<ProductDescription product={product} />
					</div>
				</div>

				{/* Related Products */}
				<section className="bg-white border-t border-gray-100 pb-32 md:pb-16">
					<div className="container mx-auto px-6">
						<RelatedProducts products={[]} /> {/* API would populate this */}
					</div>
				</section>
			</div>

			<OfficeLocationFooter />
		</div>
	);
}
