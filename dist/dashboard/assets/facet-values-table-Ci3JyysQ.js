import{j as t,du as j,r as i,a3 as D,c7 as y,cS as C,ay as P,b2 as k,ao as A,ae as L,a_ as T}from"./index-BvFIWMiL.js";import{D as $}from"./detail-page-button-WzcF0eDg.js";import{D as q}from"./delete-bulk-action-ip7tB18w.js";const v=({selection:a,table:n})=>t.jsx(q,{mutationDocument:j,entityName:"facets",requiredPermissions:["DeleteCatalog","DeleteFacet"],selection:a,table:n}),r="facet-values-table",B=T(`
    query FacetValueList($options: FacetValueListOptions) {
        facetValues(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                code
                customFields
            }
            totalItems
        }
    }
`);function N({facetId:a,registerRefresher:n}){const[m,d]=i.useState([]),[c,g]=i.useState(1),[o,f]=i.useState(10),{setTableSettings:u,settings:p}=D(),b=i.useRef(()=>{}),l=p.tableSettings?.[r],F={name:!0,code:!0},V=l?.columnVisibility??F,h=l?.columnOrder??[],x=l?.columnFilters;return t.jsxs(t.Fragment,{children:[t.jsx(y,{listQuery:C(B),page:c,itemsPerPage:o,sorting:m,columnFilters:x,defaultColumnOrder:h,defaultVisibility:V,onPageChange:(e,s,S)=>{f(S),g(s)},onSortChange:(e,s)=>{d(s)},onFilterChange:(e,s)=>{u(r,"columnFilters",s)},onColumnVisibilityChange:(e,s)=>{u(r,"columnVisibility",s)},registerRefresher:e=>{b.current=e,n?.(e)},transformVariables:e=>({options:{filter:{...e.options?.filter??{},facetId:{eq:a}},sort:e.options?.sort,take:o,skip:(c-1)*o}}),onSearchTermChange:e=>({name:{contains:e}}),customizeColumns:{name:{header:"Name",cell:({row:e})=>t.jsx($,{id:e.original.id,label:e.original.name,href:`/facets/${a}/values/${e.original.id}`})}},bulkActions:[{component:v}]}),t.jsx("div",{className:"mt-4",children:t.jsxs(P,{render:t.jsx(L,{to:`/facets/${a}/values/new`}),variant:"outline",children:[t.jsx(k,{}),t.jsx(A,{id:"GZg2Zw"})]})})]})}export{N as F};
