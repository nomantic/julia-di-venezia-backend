import{r as o,cw as i,aR as l,j as e,a4 as m,a5 as p,ao as x,b2 as h,ay as f,a7 as j,d9 as V,da as N,db as g,dc as y,dY as A,dd as C,eS as b,a_ as P,eV as S,aU as k}from"./index-BvFIWMiL.js";const O=P(`
        query ProductVariantList($options: ProductVariantListOptions) {
            productVariants(options: $options) {
                items {
                    id
                    name
                    sku
                    featuredAsset {
                        ...Asset
                    }
                    price
                    priceWithTax
                    product {
                        featuredAsset {
                            ...Asset
                        }
                    }
                }
                totalItems
            }
        }
    `,[S]);function I({onProductVariantSelect:r}){const[n,d]=o.useState(""),[c,a]=o.useState(!1),t=i(n,500),{data:u}=l({queryKey:["productVariants",t],enabled:t.length>0,queryFn:()=>k.query(O,{options:{take:10,filter:{name:{contains:t},sku:{contains:t}},filterOperator:"OR"}})});return e.jsxs(m,{open:c,onOpenChange:a,children:[e.jsxs(p,{render:e.jsx(f,{variant:"outline",role:"combobox",className:"w-full"}),children:[e.jsx(x,{id:"V1owmO"}),e.jsx(h,{className:"opacity-50"})]}),e.jsx(j,{className:"p-0",children:e.jsxs(V,{shouldFilter:!1,children:[e.jsx(N,{placeholder:"Add item to order...",className:"h-9",onValueChange:s=>d(s)}),e.jsxs(g,{children:[e.jsx(y,{children:"No products found."}),e.jsx(A,{children:u?.productVariants.items.map(s=>e.jsxs(C,{value:s.id,onSelect:()=>{r({productVariantId:s.id,productVariantName:s.name,sku:s.sku,productAsset:s.featuredAsset??s.product.featuredAsset??null,price:s.price,priceWithTax:s.priceWithTax}),a(!1)},className:"flex items-center gap-2 p-2",children:[s.featuredAsset&&e.jsx(b,{asset:s.featuredAsset,preset:"tiny",className:"size-8 rounded-md object-cover"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-sm font-medium",children:s.name}),e.jsx("span",{className:"text-xs text-muted-foreground",children:s.sku})]})]},s.id))})]})]})})]})}export{I as P};
