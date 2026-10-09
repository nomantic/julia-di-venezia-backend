import{r as n,j as a,c7 as p,ay as C,ae as S,cS as h,a_ as x}from"./index-BvFIWMiL.js";const P=x(`
    query CollectionContentsList($collectionId: ID!, $options: ProductVariantListOptions) {
        collection(id: $collectionId) {
            id
            productVariants(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    name
                    sku
                }
                totalItems
            }
        }
    }
`);function $({collectionId:s}){const[o,i]=n.useState([]),[r,c]=n.useState(1),[l,u]=n.useState(10),[d,m]=n.useState([]);return a.jsx(p,{listQuery:h(P),transformVariables:t=>({...t,collectionId:s}),customizeColumns:{name:{header:"Variant name",cell:({row:t})=>a.jsxs(C,{render:a.jsx(S,{to:`../../product-variants/${t.original.id}`}),variant:"ghost",children:[t.original.name," "]})}},page:r,itemsPerPage:l,sorting:o,columnFilters:d,onPageChange:(t,e,g)=>{c(e),u(g)},onSortChange:(t,e)=>{i(e)},onFilterChange:(t,e)=>{m(e)},onSearchTermChange:t=>({name:{contains:t}})})}export{$ as C};
